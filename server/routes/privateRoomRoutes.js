const router = require("express").Router();
const { createPrivateRoom, joinPrivateRoom } = require("../controllers/privateRoomController");

router.post("/create", createPrivateRoom);
router.post("/join", joinPrivateRoom);

module.exports = router;