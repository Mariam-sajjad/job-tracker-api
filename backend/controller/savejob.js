const SaveJob = require("../model/savejob");

async function createSaveJob(req, res) {
  try {
    const userId = req.user.id;

    const {
      jobAddUrl,
      jobTitle,
      companyName,
      city,
      minWorkLoad,
      maxWorkLoad,
      published,
      jobDescription,
      status,
      yourNote
    } = req.body;

    if (
      !jobAddUrl ||
      !jobTitle ||
      !companyName ||
      !city ||
      minWorkLoad === undefined ||
      maxWorkLoad === undefined
    ) {
      return res.status(400).json({
        success: false,
        message: "Required fields are missing"
      });
    }

    if (Number(minWorkLoad) > Number(maxWorkLoad)) {
      return res.status(400).json({
        success: false,
        message: "Minimum workload cannot be greater than maximum workload"
      });
    }

    const newJob = await SaveJob.create({
      userId,
      jobAddUrl,
      jobTitle,
      companyName,
      city,
      minWorkLoad,
      maxWorkLoad,
      published,
      jobDescription,
      status,
      yourNote
    });

    return res.status(201).json({
      success: true,
      message: "Job saved successfully",
      data: newJob
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message
    });
  }
}

async function getMyJobs(req, res) {
  try {
    const userId = req.user.id;

    const jobs = await SaveJob.find({ userId }).sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      totalJobs: jobs.length,
      data: jobs
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message
    });
  }
}

/* NEW: Get single saved job by id */
async function getJobById(req, res) {
  try {
    const userId = req.user.id;
    const { id } = req.params;

    const job = await SaveJob.findOne({
      _id: id,
      userId: userId
    });

    if (!job) {
      return res.status(404).json({
        success: false,
        message: "Job not found or you are not allowed to view it"
      });
    }

    return res.status(200).json({
      success: true,
      data: job
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message
    });
  }
}

async function updateJob(req, res) {
  try {
    const userId = req.user.id;
    const { id } = req.params;

    if (
      req.body.minWorkLoad !== undefined &&
      req.body.maxWorkLoad !== undefined &&
      Number(req.body.minWorkLoad) > Number(req.body.maxWorkLoad)
    ) {
      return res.status(400).json({
        success: false,
        message: "Minimum workload cannot be greater than maximum workload"
      });
    }

    const updatedJob = await SaveJob.findOneAndUpdate(
      {
        _id: id,
        userId
      },
      req.body,
      {
        new: true,
        runValidators: true
      }
    );

    if (!updatedJob) {
      return res.status(404).json({
        success: false,
        message: "Job not found or you are not allowed to update it"
      });
    }

    return res.status(200).json({
      success: true,
      message: "Job updated successfully",
      data: updatedJob
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message
    });
  }
}

async function deleteJob(req, res) {
  try {
    const userId = req.user.id;
    const { id } = req.params;

    const deletedJob = await SaveJob.findOneAndDelete({
      _id: id,
      userId
    });

    if (!deletedJob) {
      return res.status(404).json({
        success: false,
        message: "Job not found or you are not allowed to delete it"
      });
    }

    return res.status(200).json({
      success: true,
      message: "Job deleted successfully"
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message
    });
  }
}

module.exports = {
  createSaveJob,
  getMyJobs,
  getJobById,
  updateJob,
  deleteJob
};