const mongoose = require("mongoose");

const saveJobSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
        index: true
    },
    jobAddUrl: {
        type: String,
        required: true,
        trim: true,
    },
    jobTitle: {
        type: String,
        required: true,
        trim: true,
    },
    companyName: {
        type: String,
        required: true,
        trim: true,
    },
    city: {
        type: String,
        required: true,
        trim: true,
    },
    minWorkLoad: {
        type: Number,
        required:true,
        min: [0],
        max: [100],
    },
    maxWorkLoad: {
        type: Number,
        required:true,
        min: [0],
        max: [100],
    },
    published: {
        type: Date,
    },
    jobDescription: {
        type: String,
        maxlength: [5000],
    },
    status: {
        type: String,
        enum: ['Whislist','Applied', 'Interviewing', 'Offered', 'Accepted', 'Rejected'],
        default:"Whislist"
    },
    yourNote: {
        type: String,
        maxlength: [5000]
    }
},
    { timestamps: true }
);

const SaveJob = mongoose.model("SaveJob", saveJobSchema);
module.exports = SaveJob;