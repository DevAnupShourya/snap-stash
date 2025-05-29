import { z } from 'zod';
import { categorySchema, paginationSchema } from '@/types/category';
import { taskSchema } from '@/types/task';

export const getCategoriesResponseSchema = z.object({
    categories: z.array(categorySchema),
    pagination: paginationSchema,
});

export const getTasksResponseSchema = z.object({
    tasks: z.array(taskSchema),
    pagination: paginationSchema,
});

export const getTaskStatsResponseSchema = z.object({
    totalTasks: z.number(),
    completedTasks: z.number(),
    pendingTasks: z.number(),
    completionRate: z.number(),
    category: categorySchema,
});

export const generalResStruct = z.object({
    success: z.boolean(),
    message: z.string(),
    data: z.any().optional()
})

export const getCategoryByIdSchema = z.object({
    data: categorySchema,
})

export type GeneralResponseStructure = z.infer<typeof generalResStruct>;

export type GetTasksResponse = z.infer<typeof getTasksResponseSchema>;
export type GetCategoriesResponse = z.infer<typeof getCategoriesResponseSchema>;
export type GetTaskStatsResponseSchema = z.infer<typeof getTaskStatsResponseSchema>;
export type GetCategoryByIdSchema = z.infer<typeof getCategoryByIdSchema>;
