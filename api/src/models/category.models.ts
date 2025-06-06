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

// TODO : test both 
// ? When category is deleted, also delete its tasks
categorySchema.pre('findOneAndDelete', async function () {
    try {
        const categoryId = this.getQuery()._id;

        // * Delete all tasks that belong to this category
        await this.model.db.model('Task').deleteMany({ category: categoryId });

        console.log(`Deleted tasks for category: ${categoryId}`);
    } catch (error) {
        console.error('Error deleting associated tasks:', error);
        throw error;
    }
});

// ? Also handle deleteOne method
categorySchema.pre('deleteOne', async function () {
    try {
        const categoryId = this.getQuery()._id;

        // * Delete all tasks that belong to this category
        await this.model.db.model('Task').deleteMany({ category: categoryId });

        console.log(`Deleted tasks for category: ${categoryId}`);
    } catch (error) {
        console.error('Error deleting associated tasks:', error);
        throw error;
    }
});

export const CategoryModel = mongoose.models.Category || model("Category", categorySchema);
