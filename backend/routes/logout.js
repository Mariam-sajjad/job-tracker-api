const express = require("express");
const { logoutUser } = require("../controller/logout");

const router = express.Router();

router.post("/", logoutUser);

module.exports = router;