import { List, ListItem, ListItemText, Paper, Typography } from "@mui/material";

const PlayersList = ({ users, username }) => {
  const renderPlayers = () => {
    return (
      <List>
        {users.map((user, index) => {
          let displayName = user.username === username ? `${username} (You)` : user.username;

          return (
            <ListItem key={index}>
              <ListItemText
                primaryTypographyProps={{ fontSize: "20px", fontFamily: "Indie Flower" }}
                primary={displayName}
              />
            </ListItem>
          );
        })}
      </List>
    );
  };

  return (
    <>
      <Paper elevation={10} sx={{ width: "500px" }}>
        <div style={{ fontFamily: "Indie Flower", fontSize: "20px", textAlign: "center" }}>
          Players' List
        </div>
        {renderPlayers()}
      </Paper>
    </>
  );
};

export default PlayersList;
