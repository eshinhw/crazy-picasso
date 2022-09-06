import { useEffect, useState, useRef } from "react";
import "./App.css";
import BaseLayout from "./layouts/BaseLayout";
import GamePage from "./pages/GamePage/GamePage";
import HomePage from "./pages/HomePage/HomePage";
import SelectRoomPage from "./pages/SelectRoomPage/SelectRoomPage";
import AuthService from "./services/AuthService";
import io from "socket.io-client";

function App() {
  const socketRef = useRef(null);
  const [user, setUser] = useState(null);
  const [socketActivated, setSocketActivated] = useState(false);
  const [roomDetails, setRoomDetails] = useState({ type: null });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await AuthService.getPlayer();
        if (response.body.username) {
          setUser(response.body.username);
        }
      } catch (error) {
        setUser(null);
      }
    }

    fetchData();
  }, []);

  useEffect(() => {
    if (user != null) {
      socketRef.current = io(process.env.REACT_APP_SERVER_URL);
      socketRef.current.auth = { username: user };
      socketRef.current.connect();
      setSocketActivated(true);
    }
  }, [user]);

  const renderComponent = () => {
    if (!user) {
      return <HomePage />;
    }

    if (roomDetails.type == null) {
      return (
        <SelectRoomPage
          user={user}
          setRoomDetails={setRoomDetails}
          socketRef={socketRef}
          socketActivated={socketActivated}
        />
      );
    }

    return <GamePage user={user} roomDetails={roomDetails} socketRef={socketRef} />;
  };

  return <BaseLayout>{renderComponent()}</BaseLayout>;
}

export default App;
