const express = require("express");
const generateNewId = require("../controller/signup");

const router = express.Router();

router.post("/", generateNewId);

module.exports = router;