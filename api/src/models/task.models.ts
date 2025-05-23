import mongoose, { Schema, model, Types } from "mongoose";

const taskSchema = new Schema(
    {
        content: { type: String, required: true },
        done: { type: Boolean, required: true },
        category: [{ type: Types.ObjectId, ref: "Category" }],
    },
    { timestamps: true }
);

export const TaskModel = mongoose.models.Task || model("Task", taskSchema);