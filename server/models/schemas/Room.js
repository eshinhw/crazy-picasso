const mongoose = require("mongoose");

const playerSchema = mongoose.Schema(
    {
        socketId: {
            type: String,
            required: true
        },
        username: {
            type: String,
            required: true
        },
        score: {
            type: Number,
            required: false,
            default: 0
        },
        madeCorrectGuess: {
            type: Boolean,
            required: false,
            default: false
        },
        alreadyDrawnInRound: {
            type: Boolean,
            required: false,
            default: false
        },
        
    },
    {
        _id: false
    }
);

const gameSchema = mongoose.Schema(
    {
        hasStarted: {
            type: Boolean,
            required: true,
            default: false
        },
        currentRound: {
            type: Number,
            required: false,
            default: 1
        },
        numberOfRounds: {
            type: Number,
            required: false,
            default: 3
        },
        currentWord: {
            type: String,
            required: false,
            default: ""
        },
        currentDrawerIndex: {
            type: Number,
            required: false,
            default: -1
        },
        currentDrawer: {
            socketId: {type: String, require: true, default: "" },
            username: {type: String, require: true, default: "" },
        },
    },
    {
        _id: false
    }
);

const roomSchema = mongoose.Schema(
    {
        roomCode: {
            type: String,
            require: true,
        },
        users: [playerSchema],
        game: { type: gameSchema, default: () => ({}) }
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model("Room", roomSchema);
