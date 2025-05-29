import { Types } from 'mongoose';
import { z } from 'zod';

export const createTaskSchema = z.object({
    content: z.string().min(1, 'Content is required').max(1000, 'Content must be less than 1000 characters'),
    done: z.boolean().default(false),
    categoryId: z.string().refine((id) => Types.ObjectId.isValid(id), { message: 'Invalid category ID format' }),
});

export const updateTaskSchema = z.object({
    content: z.string().min(1, 'Content is required').max(1000, 'Content must be less than 1000 characters').optional(),
    done: z.boolean().optional(),
    categoryId: z.string().refine((id) => Types.ObjectId.isValid(id), { message: 'Invalid category ID format' }).optional(),
});

export const taskParamsSchema = z.object({
    'task-id': z.string().refine((id) => Types.ObjectId.isValid(id), {
        message: 'Invalid task ID format',
    }),
});

// Query schema for filtering and pagination
export const getTasksQuerySchema = z.object({
    page: z.string().optional().default('1').transform((val) => Math.max(1, parseInt(val, 10))),
    limit: z.string().optional().default('10').transform((val) => Math.min(100, Math.max(1, parseInt(val, 10)))),
    search: z.string().optional(),
    done: z.enum(['true', 'false']).optional().transform((val) => val === 'true'),
    category: z.string().refine((id) => Types.ObjectId.isValid(id), {
        message: 'Invalid category ID format',
    }).optional(),
    sortBy: z.enum(['content', 'done', 'createdAt', 'updatedAt']).optional().default('createdAt'),
    sortOrder: z.enum(['asc', 'desc']).optional().default('desc'),
});

export const bulkUpdateSchema = z.object({
    taskIds: z.array(z.string().refine((id) => Types.ObjectId.isValid(id), {
        message: 'Invalid task ID format',
    })).min(1, 'At least one task ID is required'),
    updates: z.object({
        done: z.boolean().optional(),
        categoryId: z.string().refine((id) => Types.ObjectId.isValid(id), { message: 'Invalid category ID format', }).optional(),
    }).refine((data) => Object.keys(data).length > 0, {
        message: 'At least one field to update is required',
    }),
});

export type CreateTaskBody = z.infer<typeof createTaskSchema>;
export type UpdateTaskBody = z.infer<typeof updateTaskSchema>;
export type TaskParams = z.infer<typeof taskParamsSchema>;
export type GetTasksQuery = z.infer<typeof getTasksQuerySchema>;
export type BulkUpdateBody = z.infer<typeof bulkUpdateSchema>;
