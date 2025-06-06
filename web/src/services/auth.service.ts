import { GeneralErrorResponseType, RegisterResType, GeneralResType } from '@/validation/response';
import http from '@/lib/http';
import { HTTPError } from 'ky';

export async function register(pin: number): Promise<RegisterResType> {
    try {
        const res = await http.post('auth', { json: { pin }, credentials: 'include' }).json<RegisterResType>();
        return res;
    } catch (error) {
        if (error instanceof HTTPError) {
            const errorBody = await error.response.json<GeneralErrorResponseType>();
            throw new Error(`${errorBody.message} - ${errorBody.payload}`);
        } else {
            console.error('[authentication] Unexpected Error:', error);
            throw new Error('Unexpected error occurred');
        }
    }
}

export async function logoutAuth(): Promise<GeneralResType> {
    try {
        const res = await http.post('auth/logout', { credentials: 'include' }).json<GeneralResType>();
        return res;
    } catch (error) {
        if (error instanceof HTTPError) {
            const errorBody = await error.response.json<GeneralErrorResponseType>();
            throw new Error(`${errorBody.message} - ${errorBody.payload}`);
        } else {
            console.error('[logout] Unexpected Error:', error);
            throw new Error('Unexpected error occurred');
        }
    }
}
