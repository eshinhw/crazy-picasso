import Box from "@mui/material/Box";
import Container from "@mui/material/Container";

const PrivateLobby = ({ privateLobby, setRoomDetails, startPrivateGame }) => {
  const renderHostButton = () => {
    if (privateLobby.users.length - 1 !== 0) {
      return (
        <button
          className="button animate__fadeInUp"
          id="start-game"
          onClick={startPrivateGame}
        >
          Start Game
        </button>
      );
    }

    return (
      <Box
        component="span"
        sx={{
          backgroundColor: "white",
          borderRadius: "20px",
          padding: "1px 6px",
        }}
      >
        Waiting for more players to join.
      </Box>
    );
  };

  const renderWaitingForHost = () => {
    return (
      <Box
        component="span"
        sx={{
          backgroundColor: "white",
          borderRadius: "20px",
          padding: "1px 6px",
        }}
      >
        Waiting for host to start the game
      </Box>
    );
  };

  return (
    <Container>
      <h1>PRIVATE ROOM</h1>

      <Box sx={{ display: "flex", justifyContent: "space-between" }}>
        <Box sx={{ flex: 1 }}>
          <h2>Game Settings</h2>

          {privateLobby.isHost ? renderHostButton() : renderWaitingForHost()}
        </Box>

        <Box sx={{ flex: 1, height: "100px" }}>
          <h2>Players</h2>

          {privateLobby.users.map((user, index) => {
            return <h3 key={index}>{user.username}</h3>;
          })}
        </Box>
      </Box>

      <Box sx={{ mt: 20 }}>
        <h2>Invite your Friends!</h2>
        <h3 style={{ backgroundColor: "white" }}>{privateLobby.roomCode}</h3>
      </Box>
    </Container>
  );
};

export default PrivateLobby;
