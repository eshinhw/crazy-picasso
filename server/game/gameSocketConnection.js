const createGameHandlers = require("./gameHandlers");

const listen = (io) => {
  const gameHandlers = createGameHandlers(io,);

  // Socket middleware to check the username and allow the connection
  io.use((socket, next) => {
    const username = socket.handshake.auth.username;
    // username is added as an attribute of socket object which can be reused later
    socket.username = username;
    next();
  });

  io.on("connection", (socket) => {
    socket.on("create_private_room", gameHandlers.createPrivateRoom);
    socket.on("join_private_room", gameHandlers.joinPrivateRoom);
    socket.on("join_private_game", gameHandlers.joinPrivateGame);
    socket.on("start_private_game", gameHandlers.startPrivateGame);
    socket.on("join_public_game", gameHandlers.joinPublicGame);
    socket.on("drawer_selected_word", gameHandlers.drawerSelectedWord);
    socket.on("send_guess", gameHandlers.sendGuess);
    socket.on("drawing", gameHandlers.drawing);
    socket.on("send_video_signal", gameHandlers.sendVideoSignal);
    socket.on("return_video_signal", gameHandlers.returnVideoSignal);
    socket.on("disconnect", gameHandlers.disconnect);
    socket.on("timer_is_up", gameHandlers.timerIsUpNextTurn);
  });
}

module.exports = {
  listen
}