import {
  Container,
  FormControl,
  Grid,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Paper,
  TextField,
} from "@mui/material";
import { Box } from "@mui/system";
import { Fragment, useEffect, useRef, useState } from "react";
import SendIcon from "@mui/icons-material/Send";
import "./Chat.css"

export default function Chat({ username, socketRef, guesses, setGuesses }) {
  const ENTER_KEY_CODE = 13;
  const scrollBottomRef = useRef(null);
  const [prevMessages, setPrevMessages] = useState([]);
  const [message, setMessage] = useState("");
  const [guess, setGuess] = useState("");

  useEffect(() => {
    if (scrollBottomRef.current) {
      scrollBottomRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [guesses]);

  const handleGuessChange = (event) => {
    setGuess(event.target.value);
  };

  // Allow enter key to send guess directly
  const handleEnterKey = (event) => {
    if (event.keyCode === ENTER_KEY_CODE) {
      sendGuess();
    }
  };

  const sendGuess = () => {
    if (guess) {
      // send current guess with author info using socket io
      // the guess data will be broadcasted to other players
      socketRef.current.emit("send_guess", { author: username, guess: guess });
      // update previous guess list
      setGuesses(prevGuesses => [
        ...prevGuesses,
        { author: username, guess: guess },
      ]);
      // set current guess back to empty string
      setGuess("");
    }
  };

  const listPrevGuesses = guesses.map((guessObj, index) => {
    let guessDisplay = `${guessObj.author} ${guessObj.guess}`;
    let textColor;

    if (guessObj.type === "SELECTING_WORD") {
      textColor = "DodgerBlue"
    }
    
    else if (guessObj.type === "DRAWING_NOW") {
      textColor = "blue"
    }

    else if (guessObj.type === "JOINED_GAME") {
      textColor = "green"
    }

    else if (guessObj.type === "LEFT_GAME") {
      textColor = "red"
    } 

    else if (guessObj.type === "PREV_WORD") {
      textColor = "red"
      guessDisplay = `${guessObj.guess}`;
    } 

    else if (guessObj.type === "ALREADY_GUESSED") {
      textColor = "orange"
    } 
    
    else if (guessObj.type === "CORRECT_GUESS") {
      textColor = "green"
    } 

    else if (guessObj.type === "ALL_CORRECT") {
      textColor = "purple"
    } 
    
    else {
      guessDisplay = `${guessObj.author}: ${guessObj.guess}`;
    }


    return (
      (
        <ListItem key={index}>
          <ListItemText primaryTypographyProps={{fontSize: '20px', fontFamily: 'Indie Flower'}}  primary={guessDisplay} sx={{color: textColor}} />
        </ListItem>
      )
    )
  });


  return (
    <Fragment>
      <Container>
        <Paper elevation={10}>
          <Box p={3}>
            <Grid>
              <Grid container spacing={4} alignItems="center">
                {/* Chat Window */}
                <Grid id="chat-window" xs={12} item>
                  <List id="chat-window-guesses">
                    {listPrevGuesses}
                    <ListItem ref={scrollBottomRef}></ListItem>
                  </List>
                </Grid>
                {/* Guess Input */}
                <Grid xs={10} item>
                  <FormControl fullWidth>
                    <TextField
                      onChange={handleGuessChange}
                      onKeyDown={handleEnterKey}
                      value={guess}
                      InputProps={{ style: { fontSize: '20px', fontFamily: "Indie Flower" } }}
                      InputLabelProps={{ style: { fontSize: '20px', fontFamily: "Indie Flower" } }}
                      label="Type your guess..."
                      variant="outlined"
                    />
                  </FormControl>
                </Grid>
                {/* Send Guess */}
                <Grid xs={1} item>
                  <IconButton onClick={sendGuess} aria-label="send" color="primary">
                    <SendIcon />
                  </IconButton>
                </Grid>
              </Grid>
            </Grid>
          </Box>
        </Paper>
      </Container>
    </Fragment>
  );
}
