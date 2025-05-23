import mongoose, { Schema, model, Types } from "mongoose";

const categorySchema = new Schema(
    {
        name: { type: String, required: true },
        description: { type: String },
        icon: { type: String, required: true },
        color: { type: String, required: true },
        tasks: [{ type: Types.ObjectId, ref: "Task" }],
    },
    { timestamps: true }
);

export const CategoryModel = mongoose.models.Category || model("Category", categorySchema);
