import * as React from "react";
import CircularProgress from "@mui/material/CircularProgress";
import "./WaitingSpinner.css";
import { Typography } from "@mui/material";

export default function WaitingSpinner() {
  return (
    <div id="waiting-spineer">
      <div className="waiting-message">Waiting for players to join...</div>
      <div className="spinner"><CircularProgress color="inherit" size="10rem" sx={{color:"purple"}}/></div>
    </div>
  );
}
