const express = require("express");
const app = express();
const http = require("http");
const server = http.createServer(app);
require("dotenv").config();
const session = require("express-session");
const passport = require("passport");
const MongoDBStore = require("connect-mongodb-session")(session);

/* ------------------------------CONNECT DATABASE------------------------------*/
const mongoose = require("mongoose");

mongoose
  .connect(
    process.env.DB_CONNECTION,
    { useNewUrlParser: true }
  )
  .then(() => {
    console.log('MongoDB Connected')
  })
  .catch(err => {
    console.log(err)
  });

let sessionStore = new MongoDBStore({
  uri: process.env.DB_CONNECTION,
  collection: "sessions",
});

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: sessionStore,
    cookie: {
      maxAge: 1000 * 60 * 60 * 24, // equals 1 day
    },
  })
);

app.use(passport.initialize());
app.use(passport.session());

/* ------------------------------MIDDLEWARES------------------------------*/
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const cors = require("cors");
app.use(cors());

app.use(function (req, res, next) {
  console.log("HTTP request", req.method, req.url, req.body);
  next();
});

/* ------------------------------ROUTES------------------------------*/
// local signup/login routes
const authRoutes = require("./routes/authRoutes");
app.use("/auth", authRoutes);

/* ------------------------------SOCKET.IO------------------------------*/

const { Server } = require("socket.io");
const gameSocketConnection = require("./game/gameSocketConnection");

const io = new Server(server, {
  cors: {
    origin: process.env.CORS_ORIGIN,
    method: ["GET", "POST"],
  },
});

gameSocketConnection.listen(io);
/* ------------------------------INITIALIZE SERVER------------------------------*/
const PORT = 3001;

server.listen(PORT, () => {
  console.log(`listening on PORT: ${PORT}`);
});
