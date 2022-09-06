import * as React from "react";
import { useEffect } from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import BaseLayout from "../../layouts/BaseLayout";
import AuthService from "../../services/AuthService";
import API_URL from "../../config/url";

import "./SignUpPage.css";
import ErrorAlert from "../../components/ErrorAlert/ErrorAlert";

export default function SignUp() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await AuthService.getPlayer();
        if (response.body.username) {
          navigate("/");
        }
      } catch (error) {}
    };

    fetchData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!firstName || !lastName || !username || !email || !password) {
      alert("Missing Inputs");
      return;
    }

    const player = { firstName, lastName, username, email, password };

    await fetch(`${API_URL}/auth/signup`, {
      method: "POST",
      body: JSON.stringify(player),
      headers: {
        "Content-Type": "application/json",
      },
    }).then((res) => {
      setFirstName("");
      setLastName("");
      setEmail("");
      setPassword("");
      if (!res.ok) {
        setError("User already exists.");
        setTimeout(() => {
          setError("");
        }, 1500);
        setUsername("");
        navigate("/signup");
      } else {
        navigate("/", { state: { username: username } });
      }
    });
  };

  return (
    <BaseLayout>
      {/* animations disabled by removing animate__animated from className */}
      <h1 className="animate__rotateIn">Sign up to become crazy picasso!</h1>
      <form className="sign-up-form">
        <input
          className="animate__lightSpeedInRight animate__delay-1s"
          type="text"
          id="first-name"
          onChange={(e) => setFirstName(e.target.value)}
          value={firstName}
          placeholder="What's your first name...?"
          required
        />
        <input
          className="animate__lightSpeedInRight animate__delay-1s"
          type="text"
          id="last-name"
          onChange={(e) => setLastName(e.target.value)}
          value={lastName}
          placeholder="What's your last name...?"
          required
        />
        <input
          className="animate__lightSpeedInRight animate__delay-1s"
          type="text"
          id="username"
          onChange={(e) => setUsername(e.target.value)}
          value={username}
          placeholder="Create your username..."
          required
        />
        <input
          className="animate__lightSpeedInRight animate__delay-1s"
          type="text"
          id="email"
          onChange={(e) => setEmail(e.target.value)}
          value={email}
          placeholder="Type your email..."
          required
        />
        <input
          className="animate__lightSpeedInRight animate__delay-1s"
          type="password"
          id="password"
          onChange={(e) => setPassword(e.target.value)}
          value={password}
          placeholder="Type your password..."
          required
        />

        {error && <ErrorAlert message={error} />}
        <div className="auth-buttons">
          <button
            className="button animate__zoomIn animate__delay-2s"
            onClick={handleSubmit}
          >
            Sign Up with Username
          </button>
        </div>
      </form>
    </BaseLayout>
  );
}
