import { Hono } from 'hono';
import { validator } from 'hono/validator';
import { HTTPException } from 'hono/http-exception';

import { CategoryModel } from '@/models/category.models.js';
import { getCategoriesQuerySchema, updateCategorySchema, categoryParamsSchema, createCategorySchema } from '@/validators/category.validator.js';
import { Types } from 'mongoose';

const categoryServer = new Hono()
    // ? Get all categories with pagination, search, and sorting
    .get(
        '/',
        validator('query', (value, _) => {
            const result = getCategoriesQuerySchema.safeParse(value);
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
                const { page, limit, search, sortBy, sortOrder } = c.req.valid('query');

                // * Build query
                const query: any = {};
                if (search) {
                    query.$or = [
                        { name: { $regex: search, $options: 'i' } },
                        { description: { $regex: search, $options: 'i' } },
                    ];
                }

                // * Calculate pagination
                const skip = (page - 1) * limit;

                // * Build sort object
                const sort: any = {};
                sort[sortBy] = sortOrder === 'asc' ? 1 : -1;

                // * Execute queries
                const [categories, totalCount] = await Promise.all([
                    CategoryModel
                        .find(query)
                        // .populate('tasks', 'content done') // Only include the title and status fields from each task 
                        .populate('tasks')
                        .sort(sort)
                        .skip(skip)
                        .limit(limit)
                        .lean(),
                    CategoryModel.countDocuments(query),
                ]);

                const totalPages = Math.ceil(totalCount / limit);
                const hasNextPage = page < totalPages;
                const hasPrevPage = page > 1;

                return c.json({
                    success: true,
                    data: {
                        categories,
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
                console.error('Error fetching categories:', error);
                throw new HTTPException(500, { message: 'Failed to fetch categories' });
            }
        }
    )

    // ? Create a new category
    .post(
        '/',
        validator('json', (value, _) => {
            const result = createCategorySchema.safeParse(value);
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

                // * Check if category with same name already exists
                const existingCategory = await CategoryModel.findOne({
                    name: { $regex: `^${body.name}$`, $options: 'i' }
                });

                if (existingCategory) {
                    throw new HTTPException(409, {
                        message: 'Category with this name already exists',
                    });
                }

                const newCategory = new CategoryModel(body);
                const savedCategory = await newCategory.save();

                return c.json({
                    success: true,
                    message: 'Category created successfully',
                    data: savedCategory,
                }, 201);
            } catch (error: any) {
                if (error instanceof HTTPException) {
                    throw error;
                }

                console.error('Error creating category:', error);

                // * Handle MongoDB validation errors
                if (error.name === 'ValidationError') {
                    throw new HTTPException(400, {
                        message: 'Validation failed',
                        cause: error.errors,
                    });
                }

                throw new HTTPException(500, {
                    message: 'Failed to create category',
                });
            }
        }
    )

    // ? Get category by ID
    .get(
        '/:category-id',
        validator('param', (value, _) => {
            const result = categoryParamsSchema.safeParse(value);
            if (!result.success) {
                throw new HTTPException(400, {
                    message: 'Invalid category ID',
                    cause: result.error.flatten(),
                });
            }
            return result.data;
        }),
        async (c) => {
            try {
                const { 'category-id': categoryId } = c.req.valid('param');

                const category = await CategoryModel
                    .findById(categoryId)
                    .populate('tasks')
                    .lean();

                if (!category) {
                    throw new HTTPException(404, {
                        message: 'Category not found',
                    });
                }

                return c.json({ success: true, data: category }, 200);
            } catch (error) {
                if (error instanceof HTTPException) {
                    throw error;
                }

                console.error('Error fetching category:', error);
                throw new HTTPException(500, { message: 'Failed to fetch category' });
            }
        }
    )

    // ? Update category by ID
    .put(
        '/:category-id',
        // * Params Validator
        validator('param', (value, c) => {
            const result = categoryParamsSchema.safeParse(value);
            if (!result.success) {
                throw new HTTPException(400, {
                    message: 'Invalid category ID',
                    cause: result.error.flatten(),
                });
            }
            return result.data;
        }),
        // * Update data Validator
        validator('json', (value, c) => {
            const result = updateCategorySchema.safeParse(value);
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
                const { 'category-id': categoryId } = c.req.valid('param');
                const body = c.req.valid('json');

                // * Check if category exists
                const existingCategory = await CategoryModel.findById(categoryId);
                if (!existingCategory) {
                    throw new HTTPException(404, {
                        message: 'Category not found',
                    });
                }

                // * Check for name conflicts if name is being updated
                if (body.name && body.name !== existingCategory.name) {
                    const duplicateCategory = await CategoryModel.findOne({
                        name: { $regex: `^${body.name}$`, $options: 'i' },
                        _id: { $ne: categoryId },
                    });

                    if (duplicateCategory) {
                        throw new HTTPException(409, {
                            message: 'Category with this name already exists',
                        });
                    }
                }

                const updatedCategory = await CategoryModel
                    .findByIdAndUpdate(
                        categoryId,
                        { $set: body },
                        { new: true, runValidators: true }
                    )
                    .populate('tasks')
                    .lean();

                return c.json({
                    success: true,
                    message: 'Category updated successfully',
                    data: updatedCategory,
                }, 200);
            } catch (error: any) {
                if (error instanceof HTTPException) {
                    throw error;
                }

                console.error('Error updating category:', error);

                // * Handle MongoDB validation errors
                if (error.name === 'ValidationError') {
                    throw new HTTPException(400, {
                        message: 'Validation failed',
                        cause: error.errors,
                    });
                }

                throw new HTTPException(500, {
                    message: 'Failed to update category',
                });
            }
        }
    )

    // ? Delete category by ID
    .delete(
        '/:category-id',
        validator('param', (value, c) => {
            const result = categoryParamsSchema.safeParse(value);
            if (!result.success) {
                throw new HTTPException(400, {
                    message: 'Invalid category ID',
                    cause: result.error.flatten(),
                });
            }
            return result.data;
        }),
        async (c) => {
            try {
                const { 'category-id': categoryId } = c.req.valid('param');

                const deletedCategory = await CategoryModel.findByIdAndDelete(categoryId).lean<{ _id: string, name: string }>();

                if (!deletedCategory) {
                    throw new HTTPException(404, {
                        message: 'Category not found',
                    });
                };

                return c.json({
                    success: true,
                    message: 'Category deleted successfully',
                    data: {
                        deletedCategory: {
                            id: deletedCategory._id,
                            name: deletedCategory.name,
                        },
                    },
                }, 200);
            } catch (error) {
                if (error instanceof HTTPException) {
                    throw error;
                }

                console.error('Error deleting category:', error);
                throw new HTTPException(500, {
                    message: 'Failed to delete category',
                });
            }
        }
    )

    // ? Get category statistics
    .get(
        '/:category-id/stats',
        validator('param', (value, _) => {
            const result = categoryParamsSchema.safeParse(value);
            if (!result.success) {
                throw new HTTPException(400, {
                    message: 'Invalid category ID',
                    cause: result.error.flatten(),
                });
            }
            return result.data;
        }),
        async (c) => {
            try {
                const { 'category-id': categoryId } = c.req.valid('param');

                const category = await CategoryModel.findById(categoryId).lean<{ name: string }>();
                if (!category) {
                    throw new HTTPException(404, {
                        message: 'Category not found',
                    });
                }

                const stats = await CategoryModel.aggregate([
                    { $match: { _id: new Types.ObjectId(categoryId) } },
                    {
                        $lookup: {
                            from: 'tasks',
                            localField: 'tasks',
                            foreignField: '_id',
                            as: 'taskDetails',
                        },
                    },
                    {
                        $project: {
                            name: 1,
                            totalTasks: { $size: '$taskDetails' },
                            completedTasks: {
                                $size: {
                                    $filter: {
                                        input: '$taskDetails',
                                        cond: { $eq: ['$$this.done', true] },
                                    },
                                },
                            },
                            pendingTasks: {
                                $size: {
                                    $filter: {
                                        input: '$taskDetails',
                                        cond: { $ne: ['$$this.done', false] },
                                    },
                                },
                            },
                        },
                    },
                ]);

                return c.json({
                    success: true,
                    data: stats[0] || { name: category.name, totalTasks: 0, completedTasks: 0, pendingTasks: 0 },
                }, 200);
            } catch (error) {
                if (error instanceof HTTPException) {
                    throw error;
                }

                console.error('Error fetching category stats:', error);
                throw new HTTPException(500, {
                    message: 'Failed to fetch category statistics',
                });
            }
        }
    );

export default categoryServer;