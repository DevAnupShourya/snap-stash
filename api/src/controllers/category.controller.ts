import { Hono } from 'hono';
import { validator } from 'hono/validator';
import { HTTPException } from 'hono/http-exception';

import { Types } from 'mongoose';
import { CategoryModel } from '@/models/category.models.js';
import { getCategoriesQuerySchema, updateCategorySchema, categoryParamsSchema, createCategorySchema } from '@/validators/category.validator.js';
import { genApiResponse } from '@/utils/helper.js';

const categoryServer = new Hono()
    // ? Get all categories with pagination, search, and sorting
    .get(
        '/',
        validator('query', (value, c) => {
            const result = getCategoriesQuerySchema.safeParse(value);
            if (!result.success) {
                return c.json(genApiResponse('Invalid query parameters', `-- ${result.error.issues[0].path[0]} -- ${result.error.issues[0].message}`), 400);
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
                        .sort(sort)
                        .skip(skip)
                        .limit(limit)
                        .lean(),
                    CategoryModel.countDocuments(query),
                ]);

                const totalPages = Math.ceil(totalCount / limit);
                const hasNextPage = page < totalPages;
                const hasPrevPage = page > 1;

                return c.json(genApiResponse('Done', {
                    categories,
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
                console.error('Error fetching categories:', error);
                return c.json(genApiResponse('Failed to fetch categories'), 500);
            }
        }
    )

    // ? Create a new category
    .post(
        '/',
        validator('json', (value, c) => {
            console.log('value')
            console.log(value)
            console.log('value')
            const result = createCategorySchema.safeParse(value);
            if (!result.success) {
                return c.json(genApiResponse('Invalid request body', `-- ${result.error.issues[0].path[0]} -- ${result.error.issues[0].message}`), 400);
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
                    return c.json(genApiResponse('Category with this name already exists'), 409);
                }

                const newCategory = new CategoryModel(body);
                const savedCategory = await newCategory.save();

                return c.json(genApiResponse('Category created successfully', savedCategory, true), 201);
            } catch (error: any) {
                if (error instanceof HTTPException) {
                    throw error;
                }

                console.error('Error creating category:', error);

                // * Handle MongoDB validation errors
                if (error.name === 'ValidationError') {
                    return c.json(genApiResponse('Validation failed', error.errors), 400);
                }

                return c.json(genApiResponse('Failed to create category'), 500);
            }
        }
    )

    // ? Get category by ID
    .get(
        '/:category-id',
        validator('param', (value, c) => {
            const result = categoryParamsSchema.safeParse(value);
            if (!result.success) {
                return c.json(genApiResponse('Invalid category ID', `-- ${result.error.issues[0].path[0]} -- ${result.error.issues[0].message}`), 400);
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
                    return c.json(genApiResponse('Invalid query parameters'), 400);
                }

                return c.json(genApiResponse('Category details', category, true), 200);
            } catch (error) {
                if (error instanceof HTTPException) {
                    throw error;
                }

                console.error('Error fetching category:', error);
                return c.json(genApiResponse('Failed to fetch category'), 500);
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
                return c.json(genApiResponse(`-- ${result.error.issues[0].path[0]} -- ${result.error.issues[0].message}`), 400);
            }
            return result.data;
        }),
        // * Update data Validator
        validator('json', (value, c) => {
            const result = updateCategorySchema.safeParse(value);
            if (!result.success) {
                return c.json(genApiResponse('Invalid request body', `-- ${result.error.issues[0].path[0]} -- ${result.error.issues[0].message}`), 409);
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
                    return c.json(genApiResponse('Category not found'), 404);
                }

                // * Check for name conflicts if name is being updated
                if (body.name && body.name !== existingCategory.name) {
                    const duplicateCategory = await CategoryModel.findOne({
                        name: { $regex: `^${body.name}$`, $options: 'i' },
                        _id: { $ne: categoryId },
                    });

                    if (duplicateCategory) {
                        return c.json(genApiResponse('Category with this name already exists'), 409);
                    }
                }

                const updatedCategory = await CategoryModel
                    .findByIdAndUpdate(
                        categoryId,
                        { $set: body },
                        { new: true, runValidators: true }
                    )
                    // .populate('tasks')
                    .lean();

                return c.json(genApiResponse('Category updated successfully', updatedCategory, true), 200);
            } catch (error: any) {
                if (error instanceof HTTPException) {
                    throw error;
                }

                console.error('Error updating category:', error);

                // * Handle MongoDB validation errors
                if (error.name === 'ValidationError') {
                    return c.json(genApiResponse('Validation failed', error.errors), 400);
                }

                return c.json(genApiResponse('Failed to update category'), 500);
            }
        }
    )

    // ? Delete category by ID
    .delete(
        '/:category-id',
        validator('param', (value, c) => {
            const result = categoryParamsSchema.safeParse(value);
            if (!result.success) {
                return c.json(genApiResponse('Invalid category ID', `-- ${result.error.issues[0].path[0]} -- ${result.error.issues[0].message}`), 400);
            }
            return result.data;
        }),
        async (c) => {
            try {
                const { 'category-id': categoryId } = c.req.valid('param');

                const deletedCategory = await CategoryModel.findByIdAndDelete(categoryId).lean<{ _id: string, name: string }>();

                if (!deletedCategory) {
                    return c.json(genApiResponse('Category not found'), 404);
                };

                return c.json(genApiResponse('Category deleted successfully', {
                    deletedCategory: {
                        id: deletedCategory._id,
                        name: deletedCategory.name,
                    },
                }, true), 200);
            } catch (error) {
                if (error instanceof HTTPException) {
                    throw error;
                }
                console.error('Error deleting category:', error);
                return c.json(genApiResponse('Failed to delete category'), 500);
            }
        }
    )

    // ? Get category statistics
    .get(
        '/:category-id/stats',
        validator('param', (value, c) => {
            const result = categoryParamsSchema.safeParse(value);
            if (!result.success) {
                return c.json(genApiResponse('Invalid category ID', `-- ${result.error.issues[0].path[0]} -- ${result.error.issues[0].message}`), 400);
            }
            return result.data;
        }),
        async (c) => {
            try {
                const { 'category-id': categoryId } = c.req.valid('param');

                const category = await CategoryModel.findById(categoryId).lean<{ name: string }>();
                if (!category) {
                    return c.json(genApiResponse('Category not found'), 404);
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

                return c.json(genApiResponse(
                    'Category Stats',
                    stats[0] || { name: category.name, totalTasks: 0, completedTasks: 0, pendingTasks: 0 },
                    true), 200);
            } catch (error) {
                if (error instanceof HTTPException) {
                    throw error;
                }

                console.error('Error fetching category stats:', error);
                return c.json(genApiResponse('Failed to fetch category statistics'), 500);
            }
        }
    );

export default categoryServer;