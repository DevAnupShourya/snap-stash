import { Hono } from 'hono';
import { HTTPException } from 'hono/http-exception';
import { validator } from 'hono/validator';
import { Types } from 'mongoose';

import { TaskModel } from '@/models/task.models.js';
import { bulkUpdateSchema, createTaskSchema, getTasksQuerySchema, taskParamsSchema, updateTaskSchema } from '@/validators/task.validator.js';
import { CategoryModel } from '@/models/category.models.js';
import { genApiResponse } from '@/utils/helper.js';
import { categoryParamsSchema } from '@/validators/category.validator.js';

const taskServer = new Hono()
    // ? Get all tasks with pagination, search, and filtering
    .get(
        '/',
        validator('query', (value, c) => {
            const result = getTasksQuerySchema.safeParse(value);
            if (!result.success) {
                return c.json(genApiResponse('Invalid query parameters', `-- ${result.error.issues[0].path[0]} -- ${result.error.issues[0].message}`), 400);
            }
            return result.data;
        }),
        async (c) => {
            try {
                const { page, limit, search, done, category, sortBy, sortOrder } = c.req.valid('query');

                // * Build query
                const query: any = {};

                if (search) {
                    query.content = { $regex: search, $options: 'i' };
                }

                if (category) {
                    query.categoryId = new Types.ObjectId(category);
                }

                // * Calculate pagination
                const skip = (page - 1) * limit;

                // * Build sort object
                const sort: any = {};
                sort[sortBy] = sortOrder === 'asc' ? 1 : -1;

                // * Execute queries
                const [tasks, totalCount] = await Promise.all([
                    TaskModel
                        .find(query)
                        // .populate('categoryId', 'name')
                        .sort(sort)
                        .skip(skip)
                        .limit(limit)
                        .lean(),
                    TaskModel.countDocuments(query),
                ]);

                const totalPages = Math.ceil(totalCount / limit);
                const hasNextPage = page < totalPages;
                const hasPrevPage = page > 1;

                return c.json(genApiResponse('Tasks', {
                    tasks,
                    pagination: {
                        currentPage: page,
                        totalPages,
                        totalCount,
                        hasNextPage,
                        hasPrevPage,
                        limit,
                    },
                }, true), 200);
            } catch (error) {
                console.error('Error fetching tasks:', error);
                return c.json(genApiResponse('Failed to fetch tasks'), 500);
            }
        }
    )

    // ? Create a new task
    .post(
        '/',
        validator('json', (value, c) => {
            const result = createTaskSchema.safeParse(value);
            if (!result.success) {
                return c.json(genApiResponse('Invalid request body', `-- ${result.error.issues[0].path[0]} -- ${result.error.issues[0].message}`), 400);
            }
            return result.data;
        }),
        async (c) => {
            try {
                const body = c.req.valid('json');

                // * Validate category ID exists (required field)
                const categoryId = new Types.ObjectId(body.categoryId);
                const existingCategory = await CategoryModel.findById(categoryId).select('_id');

                if (!existingCategory) {
                    return c.json(genApiResponse('Category ID is invalid'), 400);
                }

                const newTask = new TaskModel({
                    ...body,
                    categoryId: categoryId,
                });

                const savedTask = await newTask.save();

                // * Update category tasks array
                await CategoryModel.findByIdAndUpdate(
                    categoryId,
                    { $addToSet: { tasks: savedTask._id } }
                );

                const populatedTask = await TaskModel
                    .findById(savedTask._id)
                    .lean();

                return c.json(genApiResponse('Task created successfully', populatedTask, true), 200);
            } catch (error: any) {
                if (error instanceof HTTPException) {
                    throw error;
                }

                console.error('Error creating task:', error);

                // * Handle MongoDB validation errors
                if (error.name === 'ValidationError') {
                    return c.json(genApiResponse('Validation failed', error.errors), 400);
                }

                return c.json(genApiResponse('Failed to create task'), 500);
            }
        }
    )

    // ? Get task by ID
    .get(
        '/:task-id',
        validator('param', (value, c) => {
            const result = taskParamsSchema.safeParse(value);
            if (!result.success) {
                return c.json(genApiResponse('Invalid task ID', `-- ${result.error.issues[0].path[0]} -- ${result.error.issues[0].message}`), 400);
            }
            return result.data;
        }),
        async (c) => {
            try {
                const { 'task-id': taskId } = c.req.valid('param');

                const task = await TaskModel
                    .findById(taskId)
                    // .populate('categoryId', 'name description color icon')
                    .lean();

                if (!task) {
                    return c.json(genApiResponse('Task not found'), 404);
                }

                return c.json(genApiResponse('Task', task, true), 200);
            } catch (error) {
                if (error instanceof HTTPException) {
                    throw error;
                }

                console.error('Error fetching task:', error);
                return c.json(genApiResponse('Failed to fetch task'), 500);
            }
        }
    )

    // ? Update task by ID
    .put(
        '/:task-id',
        validator('param', (value, c) => {
            const result = taskParamsSchema.safeParse(value);
            if (!result.success) {
                return c.json(genApiResponse('Invalid task ID', `-- ${result.error.issues[0].path[0]} -- ${result.error.issues[0].message}`), 400);
            }
            return result.data;
        }),
        validator('json', (value, c) => {
            const result = updateTaskSchema.safeParse(value);
            if (!result.success) {
                return c.json(genApiResponse('Invalid request body', `-- ${result.error.issues[0].path[0]} -- ${result.error.issues[0].message}`), 400);
            }
            return result.data;
        }),
        async (c) => {
            try {
                const { 'task-id': taskId } = c.req.valid('param');
                const body = c.req.valid('json');

                // * Check if task exists
                const existingTask = await TaskModel.findById(taskId);
                if (!existingTask) {
                    return c.json(genApiResponse('Task not found'), 404);
                }

                // * Validate category ID if provided
                if (body.categoryId !== undefined) {
                    const categoryId = new Types.ObjectId(body.categoryId);
                    const existingCategory = await CategoryModel.findById(categoryId).select('_id');

                    if (!existingCategory) {
                        return c.json(genApiResponse('Category ID is invalid'), 400);
                    }
                }

                // * Update category references if categoryId changed
                if (body.categoryId !== undefined) {
                    const oldCategoryId = existingTask.categoryId;
                    const newCategoryId = new Types.ObjectId(body.categoryId);

                    // * Remove task from old category
                    if (oldCategoryId) {
                        await CategoryModel.findByIdAndUpdate(
                            oldCategoryId,
                            { $pull: { tasks: taskId } }
                        );
                    }

                    // * Add task to new category
                    await CategoryModel.findByIdAndUpdate(
                        newCategoryId,
                        { $addToSet: { tasks: taskId } }
                    );
                }

                const updateData = {
                    ...body,
                    ...(body.categoryId !== undefined && { categoryId: new Types.ObjectId(body.categoryId) }),
                };

                const updatedTask = await TaskModel
                    .findByIdAndUpdate(
                        taskId,
                        { $set: updateData },
                        { new: true, runValidators: true }
                    )
                    // .populate('categoryId')
                    .lean();

                return c.json(genApiResponse('Task updated successfully', updatedTask, true), 200);
            } catch (error: any) {
                if (error instanceof HTTPException) {
                    throw error;
                }

                console.error('Error updating task:', error);

                // * Handle MongoDB validation errors
                if (error.name === 'ValidationError') {
                    return c.json(genApiResponse('Validation failed', error.errors), 400);
                }

                return c.json(genApiResponse('Failed to update task'), 500);
            }
        }
    )

    // ? Delete task by ID
    .delete(
        '/:task-id',
        validator('param', (value, c) => {
            const result = taskParamsSchema.safeParse(value);
            if (!result.success) {
                return c.json(genApiResponse('Invalid task ID', `-- ${result.error.issues[0].path[0]} -- ${result.error.issues[0].message}`), 400);
            }
            return result.data;
        }),
        async (c) => {
            try {
                const { 'task-id': taskId } = c.req.valid('param');

                const deletedTask = await TaskModel.findByIdAndDelete(taskId).lean<{ categoryId: string, _id: string, content: string }>();

                if (!deletedTask) {
                    return c.json(genApiResponse('Task not found'), 404);
                }

                // * Remove task from category
                if (deletedTask.categoryId) {
                    await CategoryModel.findByIdAndUpdate(
                        deletedTask.categoryId,
                        { $pull: { tasks: taskId } }
                    );
                }

                return c.json(genApiResponse('Task deleted successfully', {
                    deletedTask: {
                        id: deletedTask._id,
                        content: deletedTask.content,
                    }
                }, true), 200);
            } catch (error) {
                if (error instanceof HTTPException) {
                    throw error;
                }

                console.error('Error deleting task:', error);
                return c.json(genApiResponse('Failed to delete task'), 500);
            }
        }
    )

    // ? Toggle task completion status
    .patch(
        '/:task-id/toggle',
        validator('param', (value, c) => {
            const result = taskParamsSchema.safeParse(value);
            if (!result.success) {
                return c.json(genApiResponse('Invalid task ID', `-- ${result.error.issues[0].path[0]} -- ${result.error.issues[0].message}`), 400);
            }
            return result.data;
        }),
        async (c) => {
            try {
                const { 'task-id': taskId } = c.req.valid('param');

                const task = await TaskModel.findById(taskId);
                if (!task) {
                    return c.json(genApiResponse('Task not found'), 404);
                }

                const updatedTask = await TaskModel
                    .findByIdAndUpdate(
                        taskId,
                        { $set: { done: !task.done } },
                        { new: true, runValidators: true }
                    )
                    // .populate('categoryId')
                    .lean<{ done: boolean }>();

                return c.json(genApiResponse(
                    `Task marked as ${updatedTask?.done ? 'completed' : 'pending'}`,
                    updatedTask,
                    true), 200);
            } catch (error) {
                if (error instanceof HTTPException) {
                    throw error;
                }

                console.error('Error toggling task:', error);
                return c.json(genApiResponse('Failed to toggle task status'), 500);
            }
        }
    )

    // ? Bulk update tasks
    // TODO : not tested  no use yet
    .patch(
        '/bulk',
        validator('json', (value, c) => {
            const result = bulkUpdateSchema.safeParse(value);
            if (!result.success) {
                return c.json(genApiResponse('Invalid request body', `-- ${result.error.issues[0].path[0]} -- ${result.error.issues[0].message}`), 400);
            }
            return result.data;
        }),
        async (c) => {
            try {
                const { taskIds, updates } = c.req.valid('json');

                // * Check if all tasks exist
                const existingTasks = await TaskModel.find({
                    _id: { $in: taskIds.map(id => new Types.ObjectId(id)) }
                }).select('_id categoryId');

                if (existingTasks.length !== taskIds.length) {
                    return c.json(genApiResponse('One or more task IDs are invalid'), 400);
                }

                // * Validate category ID if provided
                if (updates.categoryId !== undefined) {
                    const categoryId = new Types.ObjectId(updates.categoryId);
                    const existingCategory = await CategoryModel.findById(categoryId).select('_id');

                    if (!existingCategory) {
                        return c.json(genApiResponse('Category ID is invalid'), 400);
                    }
                }

                // * Handle category updates
                if (updates.categoryId !== undefined) {
                    const newCategoryId = new Types.ObjectId(updates.categoryId);

                    // * Remove tasks from old categories
                    const oldCategoryIds = existingTasks.map(task => task.categoryId).filter(Boolean);
                    if (oldCategoryIds.length > 0) {
                        await CategoryModel.updateMany(
                            { _id: { $in: oldCategoryIds } },
                            { $pullAll: { tasks: taskIds.map(id => new Types.ObjectId(id)) } }
                        );
                    }

                    // * Add tasks to new category
                    await CategoryModel.findByIdAndUpdate(
                        newCategoryId,
                        { $addToSet: { tasks: { $each: taskIds.map(id => new Types.ObjectId(id)) } } }
                    );
                }

                const updateData = {
                    ...updates,
                    ...(updates.categoryId !== undefined && { categoryId: new Types.ObjectId(updates.categoryId) }),
                };

                // * Perform bulk update
                const result = await TaskModel.updateMany(
                    { _id: { $in: taskIds.map(id => new Types.ObjectId(id)) } },
                    { $set: updateData },
                    { runValidators: true }
                );

                // Fetch updated tasks
                const updatedTasks = await TaskModel
                    .find({ _id: { $in: taskIds.map(id => new Types.ObjectId(id)) } })
                    .populate('categoryId', 'name color icon')
                    .lean();

                return c.json(genApiResponse(
                    `${result.modifiedCount} tasks updated successfully`,
                    {
                        modifiedCount: result.modifiedCount,
                        tasks: updatedTasks,
                    }, true), 200);
            } catch (error) {
                if (error instanceof HTTPException) {
                    throw error;
                }

                console.error('Error bulk updating tasks:', error);
                return c.json(genApiResponse('Failed to bulk update tasks'), 500);
            }
        }
    )

    // // ? Get task statistics
    // .get(
    //     '/stats/overview',
    //     async (c) => {
    //         try {
    //             const stats = await TaskModel.aggregate([
    //                 {
    //                     $group: {
    //                         _id: null,
    //                         totalTasks: { $sum: 1 },
    //                         completedTasks: {
    //                             $sum: { $cond: [{ $eq: ['$done', true] }, 1, 0] }
    //                         },
    //                         pendingTasks: {
    //                             $sum: { $cond: [{ $eq: ['$done', false] }, 1, 0] }
    //                         },
    //                     }
    //                 },
    //                 {
    //                     $project: {
    //                         _id: 0,
    //                         totalTasks: 1,
    //                         completedTasks: 1,
    //                         pendingTasks: 1,
    //                         completionRate: {
    //                             $cond: [
    //                                 { $eq: ['$totalTasks', 0] },
    //                                 0,
    //                                 { $multiply: [{ $divide: ['$completedTasks', '$totalTasks'] }, 100] }
    //                             ]
    //                         }
    //                     }
    //                 }
    //             ]);

    //             return c.json(genApiResponse('Task Stats',
    //                 stats[0] || { totalTasks: 0, completedTasks: 0, pendingTasks: 0, completionRate: 0 }, true), 200);
    //         } catch (error) {
    //             console.error('Error fetching task statistics:', error);
    //             return c.json(genApiResponse('Failed to fetch task statistics'), 500);
    //         }
    //     }
    // );


    // ? Get task statistics
    .get(
        '/stats/overview',
        validator('query', (value, c) => {
            const result = categoryParamsSchema.safeParse(value);
            if (!result.success) {
                return c.json(genApiResponse('Invalid query parameters', `-- ${result.error.issues[0].path[0]} -- ${result.error.issues[0].message}`), 400);
            }
            return result.data;
        }),
        async (c) => {
            try {
                const { 'category-id': categoryId } = c.req.valid('query');

                // * Build match stage for category filtering
                const matchStage: any = {};
                if (categoryId) {
                    matchStage.categoryId = new Types.ObjectId(categoryId);
                }

                // * Build aggregation pipeline
                const pipeline = [];

                // Add match stage if category filter is provided
                if (Object.keys(matchStage).length > 0) {
                    pipeline.push({ $match: matchStage });
                }

                pipeline.push(
                    {
                        $group: {
                            _id: null,
                            totalTasks: { $sum: 1 },
                            completedTasks: {
                                $sum: { $cond: [{ $eq: ['$done', true] }, 1, 0] }
                            },
                            pendingTasks: {
                                $sum: { $cond: [{ $eq: ['$done', false] }, 1, 0] }
                            },
                        }
                    },
                    {
                        $project: {
                            _id: 0,
                            totalTasks: 1,
                            completedTasks: 1,
                            pendingTasks: 1,
                            completionRate: {
                                $cond: [
                                    { $eq: ['$totalTasks', 0] },
                                    0,
                                    { $multiply: [{ $divide: ['$completedTasks', '$totalTasks'] }, 100] }
                                ]
                            }
                        }
                    }
                );

                const stats = await TaskModel.aggregate(pipeline);

                // * Get category info if filtering by category
                let categoryInfo = null;
                if (categoryId) {
                    categoryInfo = await CategoryModel.findById(categoryId).select('name color icon').lean();
                }

                const result = {
                    ...(stats[0] || { totalTasks: 0, completedTasks: 0, pendingTasks: 0, completionRate: 0 }),
                    ...(categoryInfo && { category: categoryInfo })
                };

                return c.json(genApiResponse(
                    categoryId ? 'Category Task Stats' : 'Task Stats',
                    result,
                    true
                ), 200);
            } catch (error) {
                console.error('Error fetching task statistics:', error);
                return c.json(genApiResponse('Failed to fetch task statistics'), 500);
            }
        }
    );


export default taskServer;