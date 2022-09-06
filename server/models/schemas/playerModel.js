const mongoose = require("mongoose");

const playerSchema = mongoose.Schema(
  {
    firstName: {
      type: String,
      require: false,
    },

    lastName: {
      type: String,
      require: false,
    },

    username: {
      type: String,
      require: false,
      unique: true
    },

    email: {
      type: String,
      require: false,
    },

    password: {
      type: String,
      require: false,
    },

    googleId: {
      type: String,
      require: false
    }
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Player", playerSchema);
