import mongoose, { Schema } from "mongoose";

const memberSchema = new mongoose.Schema({
    description: {
        type: String,
        required: true
    },
    isAdmin: {
        type: Boolean,
        required: true
    }
});
const projectSchema = new Schema(
    {
        title: {
            type: String,
            required: true,
        },
        description: {
            type: String,
            required: true,
        },
        members: {
            type: [memberSchema],
            required: true,
        },
        dueDate: String,
    },
    { timestamps: true }
);



export const Project = mongoose.model("Project", projectSchema);