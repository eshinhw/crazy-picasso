const mongoose = require("mongoose");

const privateRoomSchema = mongoose.Schema(
  {
    roomCode: {
      type: String,
      require: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("PrivateRoom", privateRoomSchema);
