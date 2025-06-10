import { Hono } from 'hono';
import { validator } from 'hono/validator';
import { HTTPException } from 'hono/http-exception';
import { setCookie, getCookie, deleteCookie } from 'hono/cookie';

import { genApiResponse, generateSessionId } from '@/utils/helper.js';
import { authenticationSchema, type Session } from '@/validators/auth.validator.js';
import { ENV } from '@/utils/env.js'

// ? In-memory session storage
const sessions = new Map<string, Session>();

// ? Configuration
const SESSION_DURATION = 24 * 60 * 60 * 1000; // 24 hours

function cleanExpiredSessions() {
    const now = new Date();
    for (const [sessionId, session] of sessions.entries()) {
        if (session.expiresAt < now) {
            sessions.delete(sessionId);
        }
    }
}

// ? Authentication middleware
export function requireAuth(c: any, next: any) {
    const sessionId = getCookie(c, 'auth_session');

    if (!sessionId) {
        return c.json(genApiResponse('Authentication required'), 401);
    }

    const session = sessions.get(sessionId);

    if (!session || session.expiresAt < new Date()) {
        if (session) sessions.delete(sessionId);
        deleteCookie(c, 'auth_session');
        return c.json(genApiResponse('Session expired'), 401);
    }

    // ? Extend session on activity
    session.expiresAt = new Date(Date.now() + SESSION_DURATION);
    sessions.set(sessionId, session);

    return next();
}

export const authServer = new Hono()
    // ? Register
    .post(
        '/',
        validator('json', (value, c) => {
            const result = authenticationSchema.safeParse(value);
            if (!result.success) {
                return c.json(genApiResponse('Invalid input', `-- ${result.error.issues[0].path[0]} -- ${result.error.issues[0].message}`), 400);
            }
            return result.data;
        }),
        async (c) => {
            try {
                const body = c.req.valid('json');
                const { pin } = body;

                // * Clean expired sessions
                cleanExpiredSessions();

                // * Validate PIN against environment variable
                if (pin !== ENV.PIN) {
                    return c.json(genApiResponse('Invalid PIN'), 401);
                }

                // * Create new session
                const sessionId = generateSessionId();
                const session: Session = {
                    id: sessionId,
                    createdAt: new Date(),
                    expiresAt: new Date(Date.now() + SESSION_DURATION)
                };

                sessions.set(sessionId, session);

                // * Set session cookie
                setCookie(c, 'auth_session', sessionId, {
                    httpOnly: true,
                    secure: process.env.NODE_ENV === 'production',
                    sameSite: 'none',
                    maxAge: SESSION_DURATION / 1000,
                    path: '/'
                });

                console.log(sessions.size, ' user(s) authorized with id : ', sessionId)

                return c.json(genApiResponse('Successfully authorized you', {
                    sessionId,
                    expiresAt: session.expiresAt.toISOString()
                }), 200);

            } catch (error: any) {
                if (error instanceof HTTPException) {
                    throw error;
                }

                console.error('Error creating category:', error);

                // * Handle MongoDB validation errors
                if (error.name === 'ValidationError') {
                    return c.json(genApiResponse('Validation failed', error.errors), 400);
                }

                return c.json(genApiResponse('Failed to authorize you'), 402);
            }
        }
    )
    // ? Logout
    .post('/logout', (c) => {
        const sessionId = getCookie(c, 'auth_session');

        if (sessionId && sessions.has(sessionId)) {
            sessions.delete(sessionId);
        }

        deleteCookie(c, 'auth_session');

        return c.json(genApiResponse('Successfully logged out'), 200);
    });