import { Types } from 'mongoose';
import { z } from 'zod';

export const createCategorySchema = z.object({
    name: z.string().min(1, 'Name is required').max(64, 'Name must be less than 64 characters'),
    description: z.string().optional(),
    icon: z.string().min(1, 'Icon is required'),
    color: z.enum(['default', 'primary', 'secondary', 'warning', 'danger'],).default('default')
});

export const updateCategorySchema = z.object({
    name: z.string().min(1, 'Name is required').max(64, 'Name must be less than 64 characters').optional(),
    description: z.string().optional(),
    icon: z.string().min(1, 'Icon is required').optional(),
    color: z.enum(['default', 'primary', 'secondary', 'warning', 'danger'],).default('default')
});

export const categoryParamsSchema = z.object({
    'category-id': z.string().refine((id) => Types.ObjectId.isValid(id), {
        message: 'Invalid category ID format',
    }),
});

// Query schema for filtering and pagination
export const getCategoriesQuerySchema = z.object({
    page: z.string().optional().default('1').transform((val) => Math.max(1, parseInt(val, 10))),
    limit: z.string().optional().default('10').transform((val) => Math.min(100, Math.max(1, parseInt(val, 10)))),
    search: z.string().optional(),
    sortBy: z.enum(['name', 'createdAt', 'updatedAt']).optional().default('createdAt'),
    sortOrder: z.enum(['asc', 'desc']).optional().default('desc'),
});

export type CreateCategoryBody = z.infer<typeof createCategorySchema>;
export type UpdateCategoryBody = z.infer<typeof updateCategorySchema>;
export type CategoryParams = z.infer<typeof categoryParamsSchema>;
export type GetCategoriesQuery = z.infer<typeof getCategoriesQuerySchema>;
