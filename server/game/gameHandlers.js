const roomObj = require("../models/RoomActions");
const wordGenerator = require("./wordGenerator")
const msgFormatter = require("./messageFormatter");

function createGameHandlers(io) {
  let module = {};

  const socketCreateOrJoinPublicRoom = async (socket, roomCode) => {
    socket.roomCode = roomCode;
    await roomObj.addUserToPublicRoom(socket.id, socket.username, roomCode);
  
    socket.join(roomCode);
  }

  const handleNextPlayerToDraw = async (roomCode) => {
    const roundDetails = await roomObj.handleRoundIncrement(roomCode);

    if (roundDetails.type === "NEXT_ROUND") {
      io.to(roomCode).emit("round_updated", roundDetails.round);
    } 

    else if (roundDetails.type === "END_OF_GAME") {
      io.to(roomCode).emit("game_ended");
    }

    const currentDrawer = await roomObj.getTurnUser(roomCode);
    const choiceOfWords = wordGenerator.getXWords(3);

    io.to(roomCode).emit("clear_canvas");
    io.to(currentDrawer.socketId).emit("select_word_to_draw", {currentDrawerUsername: currentDrawer.username, choiceOfWords});
    io.to(roomCode).except(currentDrawer.socketId).emit("receive_guess", msgFormatter.createSelectingWordMessage(currentDrawer.username));
  }

  const sendCurrentTurnData = async (roomCode, socket) => {
    const room = await roomObj.getRoom(roomCode);
    const wordToDraw = room.game.currentWord;
    const currentDrawer = room.game.currentDrawer;

    if (wordToDraw) {
      socket.emit("word_selected", {currentDrawerUsername: currentDrawer.username, wordToDraw});
      socket.emit("receive_guess", msgFormatter.createDrawingNowMessage(socket.username));
    } else {
      socket.emit("receive_guess", msgFormatter.createSelectingWordMessage(currentDrawer.username)); 
    }
  }

  const handleUserJoinedGameEvent = async (socket, usersInRoom) => {
    const roomCode = socket.roomCode;
  
    if (usersInRoom.length >= 2) {
      io.to(roomCode).emit("set_wait_status", false);
      
      socket.to(roomCode).emit("user_joined", usersInRoom);
      socket.to(roomCode).emit("receive_guess", msgFormatter.createJoinedGameMessage(socket.username));

      const gameHasStarted = await roomObj.getGameStartedStatus(socket.roomCode);

      if (!gameHasStarted) {
        await roomObj.setGameStarted(socket.roomCode, true);
        await handleNextPlayerToDraw(roomCode);
      } else {
        await sendCurrentTurnData(roomCode, socket);
      }
    } else {
      io.to(roomCode).emit("set_wait_status", true);
    }
  }

  module.timerIsUpNextTurn = async function () {
    const socket = this;

    await handleNextPlayerToDraw(socket.roomCode);
  }

  module.createPrivateRoom = async function (callback) {
    const socket = this;

    let roomCode = await roomObj.createPrivateRoom(socket.id, socket.username);  
    socket.roomCode = roomCode;
    socket.join(roomCode);

    let usersInRoom = await roomObj.getUsersInRoom(roomCode);

    callback({ users: usersInRoom, roomCode });
  }

  module.joinPrivateRoom = async function (data, callback) {
    const socket = this;

    let roomCode = data.privateRoomCode;
    let success = await roomObj.joinPrivateRoom(socket.id, socket.username, roomCode);

    if (!success) {
      socket.emit("no_private_room");
      return;
    }
    
    socket.roomCode = roomCode;
    socket.join(roomCode);

    let room = await roomObj.getRoom(roomCode);
    let usersInRoom = room.users;

    if (!room.game.hasStarted) {
      socket.to(roomCode).emit("user_joined_private_room", usersInRoom);

      callback({ users: usersInRoom, roomCode });
    } else {
      callback({ users: usersInRoom, roomCode, gameStarted: true });
    }


  }

  module.joinPrivateGame = async function (callback) {
    const socket = this;

    let usersInRoom = await roomObj.getUsersInRoom(socket.roomCode);
    
    handleUserJoinedGameEvent(socket, usersInRoom);
    
    callback({ users: usersInRoom });
  }

  module.startPrivateGame = async function () {
    const socket = this;

    socket.to(socket.roomCode).emit("private_game_started");
  }

  module.joinPublicGame = async function (callback) {
    const socket = this;

    let roomCode = "public";
    await socketCreateOrJoinPublicRoom(socket, roomCode);

    let usersInRoom = await roomObj.getUsersInRoom(roomCode);
    
    handleUserJoinedGameEvent(socket, usersInRoom);

    callback({ users: usersInRoom });
  }

  module.drawerSelectedWord = async function (wordToDraw) {
    const socket = this;

    await roomObj.setGameCurrentWordToDraw(socket.roomCode, wordToDraw);

    io.to(socket.roomCode).emit("word_selected", {currentDrawerUsername: socket.username, wordToDraw});
    socket.to(socket.roomCode).emit("receive_guess", msgFormatter.createDrawingNowMessage(socket.username));
  }

  module.sendGuess = async function (data) {
    const socket = this;

    const guessStatus = await roomObj.handleUserGuess(socket.roomCode, data);

    if (guessStatus === "IS_DRAWER") {
      return;
    } 
    
    else if (guessStatus === "ALREADY_GUESSED_CORRECTLY") {
      let socketsToNotify = await roomObj.getSocketsAlreadyGuessed(socket.roomCode);

      if (socketsToNotify.length) {
        io.to(socketsToNotify).except(socket.id).emit("receive_guess", msgFormatter.createMessageOnlyGuessedUsers(data));
      }
    } 
    
    else if (guessStatus === "CORRECT_GUESS") {
      io.to(socket.roomCode).emit("receive_guess", msgFormatter.createCorrectMessage(data.author));

      const alreadyGuessedSockets = await roomObj.getSocketsAlreadyGuessed(socket.roomCode);
      const numPlayers = io.sockets.adapter.rooms.get(socket.roomCode).size;

      if (alreadyGuessedSockets.length === numPlayers - 1) {
        io.to(socket.roomCode).emit("receive_guess", msgFormatter.createAllCorrectGuessMessage()); 

        await handleNextPlayerToDraw(socket.roomCode)
      }
    } 
    
    else {
      socket.to(socket.roomCode).emit("receive_guess", data);
    }

  }

  module.drawing = function (data) {
    const socket = this;

    socket.to(socket.roomCode).emit("live_drawing", data.socketData);
  }

  module.sendVideoSignal = function (data) {
    const socket = this;
    socket.to(data.existingUserID).emit('user_joined_video', { signal: data.signal, newUserID: data.newUserID });
  }

  module.returnVideoSignal = function (data) {
    const socket = this;
    socket.to(data.newUserID).emit("receiving_returned_signal", { signal: data.signal, id: socket.id });
  }

  module.disconnect = async function () {
    const socket = this;
    if (!socket.roomCode) {
      return;
    }

    const room = await roomObj.getRoom(socket.roomCode);

    if (room.roomCode !== "public" && !room.game.hasStarted) {
      let usersInRoom = await roomObj.removeUserFromRoom(socket.roomCode, socket.username);
      let isRoomDeleted = await roomObj.deleteRoomIfEmpty(socket.roomCode);

      if (!isRoomDeleted) {
        socket.to(socket.roomCode).emit("left_private_wait", usersInRoom);
      }
    }

    else {
      const room = await roomObj.getRoom(socket.roomCode);
      const currentDrawer = room.game.currentDrawer;

      let usersInRoom = await roomObj.removeUserFromRoom(socket.roomCode, socket.username);
      await roomObj.deleteRoomIfEmpty(socket.roomCode);

      socket.to(socket.roomCode).emit("user_disconnected", usersInRoom);
      socket.to(socket.roomCode).emit("receive_guess", msgFormatter.createLeftGameMessage(socket.username));
      
      const prevWord = room.game.currentWord;

      if (prevWord) {
        socket.to(socket.roomCode).emit("receive_guess", msgFormatter.createWordWasMessage(socket.username, prevWord));
      }

      if (currentDrawer.username == socket.username && usersInRoom.length) {
        await handleNextPlayerToDraw(socket.roomCode);
      }

      if (usersInRoom.length === 1) {
        socket.to(socket.roomCode).emit("set_wait_status", true);
      }
    }
  }

  return module;
}

module.exports = createGameHandlers;