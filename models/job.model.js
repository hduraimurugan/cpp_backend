import mongoose from "mongoose";

const jobSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true,
    },
    description: {
        type: String,
        required: true,
        trim: true,
    },
    requirements:[{
        type: String,
    }],
    salary: {
        type: String,
        required: true,
        trim: true,
    },
    location: {
        type: String,
        required: true,
        trim: true,
    },
    jobType:{
        type: String,
        required: true,
    },
    position:{
        type: String,
        required: true,
    },
    company: {
        type: mongoose.Schema.Types.ObjectId,
        ref:"Company",
        required: true,
    },
    created_by: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    applications:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Application",
    }]
}, {
    timestamps: true
});

export const Job = mongoose.model("Job", jobSchema);