
import { z } from 'zod';

export const authenticationSchema = z.object({
    pin: z.number().min(100000).max(999999)
});

export const logoutSchema = z.object({
    sessionId: z.string().optional()
});

export const sessionSchema = z.object({
    id: z.string(),
    createdAt: z.date(),
    expiresAt: z.date(),
});

export type Session = z.infer<typeof sessionSchema>;
