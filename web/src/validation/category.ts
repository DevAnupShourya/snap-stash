import { z } from 'zod';

const colorNamesSchema = z.enum(["default", "secondary", "primary", "success", "warning", "danger"]).default('default').optional();

export const categorySchema = z.object({
    _id: z.string().regex(/^[0-9a-fA-F]{24}$/),
    name: z.string(),
    color: colorNamesSchema,
    icon: z.string(),
    createdAt: z.date(),
    updatedAt: z.date(),
    tasks: z.array(z.string())
});

export const categoryFormSchema = z.object({
    name: z.string().min(3, 'Name is required').max(64, 'Name must be less than 64 characters'),
    description: z.string().min(5, 'Name is required').max(64, 'Name must be less than 64 characters').optional(),
    icon: z.string().min(1, 'Icon is required'),
    color: colorNamesSchema,
});

export const categoryPaginationParamsSchema = z.object({
    page: z.number().optional().default(1),
    limit: z.number().optional().default(10),
    search: z.string().optional().default(''),
    sortBy: z.enum(['name', 'createdAt', 'updatedAt', '']).optional().default(''),
    sortOrder: z.enum(['asc', 'desc']).optional().default('asc'),
});

export const tasksPaginationParamsSchema = z.object({
    page: z.number().optional().default(1),
    limit: z.number().optional().default(10),
    search: z.string().optional().default(''),
    sortBy: z.enum(['content', 'done', 'createdAt', 'updatedAt', '']).optional().default(''),
    sortOrder: z.enum(['asc', 'desc']).optional().default('asc'),
});

export type Category = z.infer<typeof categorySchema>;
export type CategoryForm = z.infer<typeof categoryFormSchema>;
export type Color = z.infer<typeof colorNamesSchema>;
export type CategoryPaginationParams = z.infer<typeof categoryPaginationParamsSchema>;
export type TasksPaginationParams = z.infer<typeof tasksPaginationParamsSchema>;