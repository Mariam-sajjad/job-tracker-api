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
      status, // if not sent, schema default will use "Wishlist"
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

    console.log("Saved jobs data:", jobs);

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

async function updateJob(req, res) {
  try {
    const userId = req.user.id;
    const { id } = req.params;

    if (
      req.body.minWorkLoad !== undefined &&
      req.body.maxWorkLoad !== undefined &&
      req.body.minWorkLoad > req.body.maxWorkLoad
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
  updateJob,
  deleteJob
};