import mongoose, { Schema, model, Types } from "mongoose";

const taskSchema = new Schema(
    {
        content: { type: String, required: true },
        done: { type: Boolean, required: true },
        categoryId: { type: Types.ObjectId, ref: 'Category', required: true }
    },
    { timestamps: true }
);

export const TaskModel = mongoose.models.Task || model("Task", taskSchema);