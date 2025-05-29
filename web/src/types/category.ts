import { z } from 'zod';


export const colorNamesSchema = z.enum(["default", "secondary", "primary", "success", "warning", "danger"]).default('default').optional();

export const categorySchema = z.object({
    _id: z.string().regex(/^[0-9a-fA-F]{24}$/),
    name: z.string(),
    color: colorNamesSchema, // todo check it should not cause any problem
    icon: z.string(),
    createdAt: z.date(),
    updatedAt: z.date(),
    tasks: z.array(z.string())
});

export const paginationSchema = z.object({
    currentPage: z.number(),
    limit: z.number(),
    totalCount: z.number(),
    totalPages: z.number(),
    hasNextPage: z.boolean(),
    hasPrevPage: z.boolean(),
});


export const categoryFormSchema = z.object({
    name: z.string().min(3, 'Name is required').max(64, 'Name must be less than 64 characters'),
    description: z.string().min(5, 'Name is required').max(64, 'Name must be less than 64 characters').optional(),
    icon: z.string().min(1, 'Icon is required'),
    color: colorNamesSchema, // todo check it should not cause any problem
});


export type Category = z.infer<typeof categorySchema>;
export type CategoryForm = z.infer<typeof categoryFormSchema>;
export type Color = z.infer<typeof colorNamesSchema>;