const RoomModel = require("./schemas/Room");
const uuidGenerator = require('short-uuid');

const getRoom = async (roomCode) => {
  let room = await RoomModel.findOne({ roomCode }).lean();

  return room;
}

const setGameStarted = async (roomCode, hasStarted) => {
  await RoomModel.findOneAndUpdate(
    { roomCode },
    { $set: { 'game.hasStarted': hasStarted } },
    { safe: true, multi: false, new: true }
  ).lean();
}

const addUserToPublicRoom = async (socketId, username, roomCode) => {
  let room = await RoomModel.findOne({ roomCode });
  let user = {socketId, username};
  
  if (room === null ) {
    await RoomModel.create({ roomCode, users: [user] });
  } else {
    room.users.push(user);

    await room.save();
  }
}

const createPrivateRoom = async (socketId, username) => {
  let roomCode = uuidGenerator.generate();
  let room = await RoomModel.findOne({ roomCode });
  let user = {socketId, username};

  if (room === null ) {
    await RoomModel.create({ roomCode, users: [user] });

    return roomCode;
  } 

  return null;
}

const joinPrivateRoom = async (socketId, username, roomCode) => {
  let room = await RoomModel.findOne({ roomCode });
  let user = {socketId, username};
  
  if (room === null ) {
    return false;
  } else {
    room.users.push(user);

    await room.save();
  }

  return true;
}

const getUsersInRoom = async (roomCode) => {
  let room = await RoomModel.findOne({ roomCode }).lean();
  let usersInRoom = room.users;

  return usersInRoom;
}

const removeUserFromRoom = async (roomCode, username) => {
  let room = await RoomModel.findOneAndUpdate(
    { roomCode },
    { $pull: { users: { username } } },
    { safe: true, multi: false, new: true }
  ).lean();

  let usersInRoom = room.users;

  return usersInRoom;
}

const deleteRoomIfEmpty = async (roomCode) => {
  let usersInRoom = await getUsersInRoom(roomCode);
  let isDeleted = false;;

  if (usersInRoom.length === 0) {
    await RoomModel.deleteOne({ roomCode });
    isDeleted = true;
  }

  return isDeleted;
}




const generalUpdateHelper = async (query, updateVal, options = null) => {
  if (options === null) {
    options = { safe: true, multi: false, new: true }
  }

  await RoomModel.findOneAndUpdate(
    query,
    { $set: updateVal },
    options
  );
}

const getGameStartedStatus = async (roomCode) => {
  let room = await RoomModel.findOne({ roomCode }).lean();
  let hasStarted = room.game.hasStarted;

  return hasStarted;
}

const getTurnUser = async (roomCode) => {
  const room = await getRoom(roomCode);
  const users = room.users;
  let currentDrawerIndex = room.game.currentDrawerIndex;

  if (currentDrawerIndex === users.length - 1 || users.length == 1) {
    currentDrawerIndex = 0;
  } else {
    currentDrawerIndex ++;
  }

  const user = users[currentDrawerIndex];
  await resetUsersMadeCorrectGuess(roomCode);

  const query = { roomCode, "users.username": user.username };
  const updateValues = { 
    'game.currentWord': "",
    'game.currentDrawerIndex': currentDrawerIndex, 
    "game.currentDrawer": {socketId: user.socketId, username: user.username},
    "users.$.alreadyDrawnInRound": true
  };

  await generalUpdateHelper(query, updateValues)

  return user;
}

const setGameCurrentWordToDraw = async (roomCode, wordToDraw) => {
  await generalUpdateHelper({roomCode}, { 'game.currentWord': wordToDraw })
}

const getUserByUsername = async (roomCode, username) => {
  const userInListFormat = await RoomModel.findOne({ roomCode, "users.username": username }, "-_id users.$").lean();
  const user = userInListFormat.users[0];

  return user;
}

const handleUserGuess = async (roomCode, currentGuessData) => {
  const room = await getRoom(roomCode);
  const currentDrawerIndex = room.game.currentDrawerIndex;
  const drawer = room.users[currentDrawerIndex];
  const currentWord = room.game.currentWord.toLowerCase();

  if (currentGuessData.author === drawer.username) {
    return "IS_DRAWER";
  }

  const user = await getUserByUsername(roomCode, currentGuessData.author);
  
  if (user.madeCorrectGuess) {
    return "ALREADY_GUESSED_CORRECTLY";
  }

  if (currentGuessData.guess.toLowerCase() === currentWord) {
    let updatedScore = user.score + 50; // set score based on time later
    const query = {roomCode, "users.username": user.username};
    const updateValues = { "users.$.madeCorrectGuess": true, "users.$.score": updatedScore };
    await generalUpdateHelper(query, updateValues);

    return "CORRECT_GUESS";
  }  
}

const getSocketsAlreadyGuessed = async (roomCode) => {
  let usersInRoom = await getUsersInRoom(roomCode);

  let filteredUsers = usersInRoom.filter((user) => {
      return user.madeCorrectGuess;
  })

  let socketIds = filteredUsers.map((user) => {
      return user.socketId;
  })

  return socketIds;

}

const resetUsersMadeCorrectGuess = async (roomCode) => {
  const updateValues = {"users.$[].madeCorrectGuess": false}
  await generalUpdateHelper({roomCode}, updateValues, { "multi": true });
}

const resetUsersAlreadyDrawnInRound = async (roomCode) => {
  const updateValues = {"users.$[].alreadyDrawnInRound": false}
  await generalUpdateHelper({roomCode}, updateValues, { "multi": true });
}

const allUsersDrawed = async (roomCode) => {
  const usersThatDrawed = await RoomModel.aggregate([
    {
      "$match": {"roomCode": roomCode }
    },
    {
      "$unwind": "$users"
    },
    {
      "$match": {"users.alreadyDrawnInRound": true}
    },
    {
      "$group": {
        "_id": "$id",
        "users": {"$push": "$users"}
      }
    }
  ]);

  if (usersThatDrawed.length) {
    return usersThatDrawed[0].users;
  }

  return usersThatDrawed;
}

const handleRoundIncrement = async (roomCode) => {
  const room = await getRoom(roomCode);
  const numUsersInRoom = room.users.length
  const round = room.game.currentRound;
  const usersThatDrawed = await allUsersDrawed(roomCode);
  const everyUserDrawed = usersThatDrawed.length === numUsersInRoom;

  let roundDetails = {type: "NEXT_ROUND", round};

  if (room.game.numberOfRounds < round + 1 && everyUserDrawed) {
    roundDetails = {...roundDetails, type: "END_OF_GAME"};
  }
  
  else if (everyUserDrawed) {
    await resetUsersAlreadyDrawnInRound (roomCode);
    let updatedRound = round + 1;

    await generalUpdateHelper({roomCode}, { 'game.currentRound': updatedRound })

    roundDetails = {...roundDetails, round: updatedRound};
  } 
  
  else {
    roundDetails = {...roundDetails, type: "SAME_ROUND"};
  }

  return roundDetails;
}

module.exports = {
  getRoom,
  setGameStarted,
  addUserToPublicRoom,
  createPrivateRoom,
  joinPrivateRoom,
  getUsersInRoom,
  removeUserFromRoom,
  deleteRoomIfEmpty,

  getGameStartedStatus,
  getTurnUser,
  setGameCurrentWordToDraw,

  handleUserGuess,
  getSocketsAlreadyGuessed,
  handleRoundIncrement
}