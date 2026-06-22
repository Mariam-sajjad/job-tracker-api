const express = require("express");

const {
  createSaveJob,
  getMyJobs,
  updateJob,
  deleteJob
} = require("../controller/savejob");

const authMiddleware = require("../middleware/auth");

const router = express.Router();

router.post("/", authMiddleware, createSaveJob);

router.get("/", authMiddleware, getMyJobs);

router.patch("/:id", authMiddleware, updateJob);

router.delete("/:id", authMiddleware, deleteJob);

module.exports = router;