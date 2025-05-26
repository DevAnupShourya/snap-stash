import { Hono } from 'hono';
import { HTTPException } from 'hono/http-exception';
import { validator } from 'hono/validator';
import { Types } from 'mongoose';
import { z } from 'zod';

import { TaskModel } from '@/models/task.models.js';
import { bulkUpdateSchema, createTaskSchema, getTasksQuerySchema, taskParamsSchema, updateTaskSchema } from '@/validators/task.validator.js';
import { CategoryModel } from '@/models/category.models.js';

const taskServer = new Hono()
    // ? Get all tasks with pagination, search, and filtering
    .get(
        '/',
        validator('query', (value, _) => {
            const result = getTasksQuerySchema.safeParse(value);
            if (!result.success) {
                throw new HTTPException(400, {
                    message: 'Invalid query parameters',
                    cause: result.error.flatten(),
                });
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

                if (done !== undefined) {
                    query.done = done;
                }

                if (category) {
                    query.category = { $in: [new Types.ObjectId(category)] };
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
                        .populate('category', 'name color icon')
                        .sort(sort)
                        .skip(skip)
                        .limit(limit)
                        .lean(),
                    TaskModel.countDocuments(query),
                ]);

                const totalPages = Math.ceil(totalCount / limit);
                const hasNextPage = page < totalPages;
                const hasPrevPage = page > 1;

                return c.json({
                    success: true,
                    data: {
                        tasks,
                        pagination: {
                            currentPage: page,
                            totalPages,
                            totalCount,
                            hasNextPage,
                            hasPrevPage,
                            limit,
                        },
                    },
                }, 200);
            } catch (error) {
                console.error('Error fetching tasks:', error);
                throw new HTTPException(500, {
                    message: 'Failed to fetch tasks',
                });
            }
        }
    )

    // ? Create a new task
    .post(
        '/',
        validator('json', (value, _) => {
            const result = createTaskSchema.safeParse(value);
            if (!result.success) {
                throw new HTTPException(400, {
                    message: 'Invalid request body',
                    cause: result.error.flatten(),
                });
            }
            return result.data;
        }),
        async (c) => {
            try {
                const body = c.req.valid('json');

                // * Validate category IDs exist
                if (body.category && body.category.length > 0) {
                    const categoryIds = body.category.map(id => new Types.ObjectId(id));
                    const existingCategories = await CategoryModel.find({
                        _id: { $in: categoryIds }
                    }).select('_id');

                    if (existingCategories.length !== body.category.length) {
                        throw new HTTPException(400, {
                            message: 'One or more category IDs are invalid',
                        });
                    }
                }

                const newTask = new TaskModel({
                    ...body,
                    category: body.category?.map(id => new Types.ObjectId(id)) || [],
                });

                const savedTask = await newTask.save();

                // * Update category tasks arrays
                if (body.category && body.category.length > 0) {
                    await CategoryModel.updateMany(
                        { _id: { $in: body.category.map(id => new Types.ObjectId(id)) } },
                        { $addToSet: { tasks: savedTask._id } }
                    );
                }

                const populatedTask = await TaskModel
                    .findById(savedTask._id)
                    .populate('category', 'name color icon')
                    .lean();

                return c.json({
                    success: true,
                    message: 'Task created successfully',
                    data: populatedTask,
                }, 201);
            } catch (error: any) {
                if (error instanceof HTTPException) {
                    throw error;
                }

                console.error('Error creating task:', error);

                // * Handle MongoDB validation errors
                if (error.name === 'ValidationError') {
                    throw new HTTPException(400, {
                        message: 'Validation failed',
                        cause: error.errors,
                    });
                }

                throw new HTTPException(500, {
                    message: 'Failed to create task',
                });
            }
        }
    )

    // ? Get task by ID
    .get(
        '/:task-id',
        validator('param', (value, _) => {
            const result = taskParamsSchema.safeParse(value);
            if (!result.success) {
                throw new HTTPException(400, {
                    message: 'Invalid task ID',
                    cause: result.error.flatten(),
                });
            }
            return result.data;
        }),
        async (c) => {
            try {
                const { 'task-id': taskId } = c.req.valid('param');

                const task = await TaskModel
                    .findById(taskId)
                    .populate('category', 'name description color icon')
                    .lean();

                if (!task) {
                    throw new HTTPException(404, {
                        message: 'Task not found',
                    });
                }

                return c.json({ success: true, data: task }, 200);
            } catch (error) {
                if (error instanceof HTTPException) {
                    throw error;
                }

                console.error('Error fetching task:', error);
                throw new HTTPException(500, { message: 'Failed to fetch task' });
            }
        }
    )

    // Update task by ID
    .put(
        '/:task-id',
        validator('param', (value, _) => {
            const result = taskParamsSchema.safeParse(value);
            if (!result.success) {
                throw new HTTPException(400, {
                    message: 'Invalid task ID',
                    cause: result.error.flatten(),
                });
            }
            return result.data;
        }),
        validator('json', (value, _) => {
            const result = updateTaskSchema.safeParse(value);
            if (!result.success) {
                throw new HTTPException(400, {
                    message: 'Invalid request body',
                    cause: result.error.flatten(),
                });
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
                    throw new HTTPException(404, {
                        message: 'Task not found',
                    });
                }

                // * Validate category IDs if provided
                if (body.category && body.category.length > 0) {
                    const categoryIds = body.category.map(id => new Types.ObjectId(id));
                    const existingCategories = await CategoryModel.find({
                        _id: { $in: categoryIds }
                    }).select('_id');

                    if (existingCategories.length !== body.category.length) {
                        throw new HTTPException(400, {
                            message: 'One or more category IDs are invalid',
                        });
                    }
                }

                // * Update category references if category changed
                if (body.category !== undefined) {
                    const oldCategories = existingTask.category || [];
                    const newCategories = body.category.map(id => new Types.ObjectId(id));

                    // * Remove task from old categories
                    if (oldCategories.length > 0) {
                        await CategoryModel.updateMany(
                            { _id: { $in: oldCategories } },
                            { $pull: { tasks: taskId } }
                        );
                    }

                    // * Add task to new categories
                    if (newCategories.length > 0) {
                        await CategoryModel.updateMany(
                            { _id: { $in: newCategories } },
                            { $addToSet: { tasks: taskId } }
                        );
                    }
                }

                const updateData = {
                    ...body,
                    ...(body.category !== undefined && { category: body.category.map(id => new Types.ObjectId(id)) }),
                };

                const updatedTask = await TaskModel
                    .findByIdAndUpdate(
                        taskId,
                        { $set: updateData },
                        { new: true, runValidators: true }
                    )
                    .populate('category')
                    .lean();

                return c.json({
                    success: true,
                    message: 'Task updated successfully',
                    data: updatedTask,
                }, 200);
            } catch (error: any) {
                if (error instanceof HTTPException) {
                    throw error;
                }

                console.error('Error updating task:', error);

                // * Handle MongoDB validation errors
                if (error.name === 'ValidationError') {
                    throw new HTTPException(400, {
                        message: 'Validation failed',
                        cause: error.errors,
                    });
                }

                throw new HTTPException(500, {
                    message: 'Failed to update task',
                });
            }
        }
    )

    // ? Delete task by ID
    .delete(
        '/:task-id',
        validator('param', (value, _) => {
            const result = taskParamsSchema.safeParse(value);
            if (!result.success) {
                throw new HTTPException(400, {
                    message: 'Invalid task ID',
                    cause: result.error.flatten(),
                });
            }
            return result.data;
        }),
        async (c) => {
            try {
                const { 'task-id': taskId } = c.req.valid('param');

                const deletedTask = await TaskModel.findByIdAndDelete(taskId).lean<{ category: string, _id: string, content: string }>();

                if (!deletedTask) {
                    throw new HTTPException(404, {
                        message: 'Task not found',
                    });
                }

                // * Remove task from all categories
                if (deletedTask.category && deletedTask.category.length > 0) {
                    await CategoryModel.updateMany(
                        { _id: { $in: deletedTask.category } },
                        { $pull: { tasks: taskId } }
                    );
                }

                return c.json({
                    success: true,
                    message: 'Task deleted successfully',
                    data: {
                        deletedTask: {
                            id: deletedTask._id,
                            content: deletedTask.content,
                        },
                    },
                }, 200);
            } catch (error) {
                if (error instanceof HTTPException) {
                    throw error;
                }

                console.error('Error deleting task:', error);
                throw new HTTPException(500, {
                    message: 'Failed to delete task',
                });
            }
        }
    )

    // ? Toggle task completion status
    .patch(
        '/:task-id/toggle',
        validator('param', (value, _) => {
            const result = taskParamsSchema.safeParse(value);
            if (!result.success) {
                throw new HTTPException(400, {
                    message: 'Invalid task ID',
                    cause: result.error.flatten(),
                });
            }
            return result.data;
        }),
        async (c) => {
            try {
                const { 'task-id': taskId } = c.req.valid('param');

                const task = await TaskModel.findById(taskId);
                if (!task) {
                    throw new HTTPException(404, {
                        message: 'Task not found',
                    });
                }

                const updatedTask = await TaskModel
                    .findByIdAndUpdate(
                        taskId,
                        { $set: { done: !task.done } },
                        { new: true, runValidators: true }
                    )
                    .populate('category', 'name color icon')
                    .lean<{ done: boolean }>();

                return c.json({
                    success: true,
                    message: `Task marked as ${updatedTask?.done ? 'completed' : 'pending'}`,
                    data: updatedTask,
                }, 200);
            } catch (error) {
                if (error instanceof HTTPException) {
                    throw error;
                }

                console.error('Error toggling task:', error);
                throw new HTTPException(500, {
                    message: 'Failed to toggle task status',
                });
            }
        }
    )

    // ? Bulk update tasks
    .patch(
        '/bulk',
        validator('json', (value, _) => {
            const result = bulkUpdateSchema.safeParse(value);
            if (!result.success) {
                throw new HTTPException(400, {
                    message: 'Invalid request body',
                    cause: result.error.flatten(),
                });
            }
            return result.data;
        }),
        async (c) => {
            try {
                const { taskIds, updates } = c.req.valid('json');

                // * Check if all tasks exist
                const existingTasks = await TaskModel.find({
                    _id: { $in: taskIds.map(id => new Types.ObjectId(id)) }
                }).select('_id category');

                if (existingTasks.length !== taskIds.length) {
                    throw new HTTPException(400, {
                        message: 'One or more task IDs are invalid',
                    });
                }

                // * Validate category IDs if provided
                if (updates.category && updates.category.length > 0) {
                    const categoryIds = updates.category.map(id => new Types.ObjectId(id));
                    const existingCategories = await CategoryModel.find({
                        _id: { $in: categoryIds }
                    }).select('_id');

                    if (existingCategories.length !== updates.category.length) {
                        throw new HTTPException(400, {
                            message: 'One or more category IDs are invalid',
                        });
                    }
                }

                // * Handle category updates
                if (updates.category !== undefined) {
                    const newCategories = updates.category.map(id => new Types.ObjectId(id));

                    // * Remove tasks from old categories
                    const oldCategories = existingTasks.flatMap(task => task.category || []);
                    if (oldCategories.length > 0) {
                        await CategoryModel.updateMany(
                            { _id: { $in: oldCategories } },
                            { $pullAll: { tasks: taskIds.map(id => new Types.ObjectId(id)) } }
                        );
                    }

                    // * Add tasks to new categories
                    if (newCategories.length > 0) {
                        await CategoryModel.updateMany(
                            { _id: { $in: newCategories } },
                            { $addToSet: { tasks: { $each: taskIds.map(id => new Types.ObjectId(id)) } } }
                        );
                    }
                }

                const updateData = {
                    ...updates,
                    ...(updates.category !== undefined && { category: updates.category.map(id => new Types.ObjectId(id)) }),
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
                    .populate('category', 'name color icon')
                    .lean();

                return c.json({
                    success: true,
                    message: `${result.modifiedCount} tasks updated successfully`,
                    data: {
                        modifiedCount: result.modifiedCount,
                        tasks: updatedTasks,
                    },
                }, 200);
            } catch (error) {
                if (error instanceof HTTPException) {
                    throw error;
                }

                console.error('Error bulk updating tasks:', error);
                throw new HTTPException(500, {
                    message: 'Failed to bulk update tasks',
                });
            }
        }
    )

    // ? Get task statistics
    .get(
        '/stats/overview',
        async (c) => {
            try {
                const stats = await TaskModel.aggregate([
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
                ]);

                return c.json({
                    success: true,
                    data: stats[0] || { totalTasks: 0, completedTasks: 0, pendingTasks: 0, completionRate: 0 },
                }, 200);
            } catch (error) {
                console.error('Error fetching task statistics:', error);
                throw new HTTPException(500, {
                    message: 'Failed to fetch task statistics',
                });
            }
        }
    );

export default taskServer;