import { z } from 'zod';

export const taskSchema = z.object({
    _id: z.string().regex(/^[0-9a-fA-F]{24}$/),
    categoryId: z.string().regex(/^[0-9a-fA-F]{24}$/),
    content: z.string(),
    done: z.boolean(),
    createdAt: z.date(),
    updatedAt: z.date(),
});

export const createTaskSchema = z.object({
    content: z.string().min(3).max(128).default(''),
    done: z.boolean().default(false),
    categoryId: z.string().regex(/^[0-9a-fA-F]{24}$/).nonempty(),
});

export const editTaskSchema = z.string().min(3).max(128).default('');

export type Task = z.infer<typeof taskSchema>;
export type TaskForm = z.infer<typeof createTaskSchema>;
