const express = require("express");
const { loginUser } = require("../controller/login");

const router = express.Router();

router.post("/", loginUser);

module.exports = router;