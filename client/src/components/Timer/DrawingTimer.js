import React from 'react';
import { useTimer } from 'react-timer-hook';
import "./DrawingTimer.css" 

export default function DrawingTimer({ isCurrentDrawer, socketRef, expiryTimestamp }) {
  
  const {
    seconds,
    minutes,
  } = useTimer({ expiryTimestamp, onExpire: () => {
    if (isCurrentDrawer()) {
      socketRef.current.emit("timer_is_up");
    }
  }});

  const twoDigitFormat = (time) => {
    return String(time).padStart(2, '0');
  }

  return (
    <div className="timer-container d-inline-block">
      Time Remaining
      <h3 className="timer d-inline-block">
        {twoDigitFormat(minutes)}:{twoDigitFormat(seconds)}
      </h3>
    </div>
  );
}