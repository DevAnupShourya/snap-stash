import { z } from 'zod';

export const taskSchema = z.object({
    _id: z.string().regex(/^[0-9a-fA-F]{24}$/),
    categoryId: z.object({ _id: z.string().regex(/^[0-9a-fA-F]{24}$/), name: z.string() }),
    content: z.string(),
    done: z.boolean(),
    createdAt: z.date(),
    updatedAt: z.date(),
});

export type Task = z.infer<typeof taskSchema>;
