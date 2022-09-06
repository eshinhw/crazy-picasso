const Player = require("../models/schemas/playerModel");
const bcrypt = require("bcrypt");
const { sendEmail } = require("../email/sendgridEmail");
const TIMEOUT_PERIOD = 5000;

const signupPlayer = async (req, res) => {
  let firstName = req.body.firstName;
  let lastName = req.body.lastName;
  let username = req.body.username;
  let email = req.body.email;
  let password = req.body.password;

  if (!firstName || !lastName || !email || !password) {
    return res.status(400).json({ error: "missing inputs" });
  }

  const playerExist = await Player.findOne({ email });

  if (playerExist) return res.status(400).json({ error: "an account already exists" });

  const salt = await bcrypt.genSalt(10);
  const saltedhash = await bcrypt.hash(password, salt);

  const newPlayer = await Player.create({
    firstName,
    lastName,
    username,
    email,
    password: saltedhash,
  });

  if (newPlayer) {
    req.session.username = newPlayer.username;
    req.session.email = newPlayer.email;
    setTimeout(() => sendEmail(firstName, email), TIMEOUT_PERIOD);
    res.status(200).json({
      _id: newPlayer.id,
      firstName: newPlayer.firstName,
      lastName: newPlayer.lastName,
      username: newPlayer.username,
      email: newPlayer.email,
    });
  } else {
    res.status(400).json({ error: "problem with creating customer (invalid customer data)" });
  }
};

const signinPlayer = async (req, res) => {
  let username = req.body.username;
  let password = req.body.password;
  let googleId = req.body.googleId;
  let fbLogin = req.body.facebookLogin;

  if (googleId && username) {
    // user logged in with google account
    req.session.username = username;
    res.status(200).json({
      username: username,
    });
    return;
  }

  if (fbLogin && username) {
    req.session.username = username;
    res.status(200).json({
      username: username,
    });
    return;
  }

  if (!username || !password) {
    res.status(400).json({ error: "missing inputs" });
  }

  const player = await Player.findOne({ username });

  if (player && (await bcrypt.compare(password, player.password))) {
    req.session.username = player.username;

    res.status(200).json({
      _id: player.id,
      firstName: player.firstName,
      lastName: player.lastName,
      username: player.username,
    });
  } else {
    res.status(400).json({ error: "login failed, invalid username or password" });
  }
};

const logoutPlayer = (req, res) => {
  req.session.destroy();
  res.redirect("/");
};

const currentPlayer = (req, res) => {
  if (!req.session.username) {
    return res.status(401).json({ error: "user not logged in" });
  }

  return res.status(200).json({ username: req.session.username });
};

module.exports = {
  signupPlayer,
  signinPlayer,
  logoutPlayer,
  currentPlayer,
};
