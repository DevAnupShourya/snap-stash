import type { genApiResParams } from "@/utils/types.js";

/**
 * Generates a standardized API response.
 *
 * @param {string} message - A human-readable message describing the result or error.
 * @param {any | null} payload - The payload to be returned in the response; can be null if not applicable.
 * @param {boolean} success - Indicates whether the operation was successful.
 * @returns {genApiResParams} The formatted API response object.
 */
export function genApiResponse(
    message: string = 'Something went wrong',
    payload: any | null = null,
    success: boolean = false
): genApiResParams {
    return {
        success,
        message,
        payload
    };
}

export function generateSessionId(): string {
    return Math.random().toString(36).substring(2) + Date.now().toString(36);
}