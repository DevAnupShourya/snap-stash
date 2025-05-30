import http from '@/lib/http';
import { PaginationParams } from '@/types/category';
import { GeneralResponseStructure, GetTasksResponse, GetTaskStatsResponseSchema, GetCategoryByIdSchema } from '@/types/response';
import { HTTPError } from 'ky';

export async function getCategoryByCategoryId(cId: string): Promise<GetCategoryByIdSchema> {
    try {
        const res = await http.get(`category/${cId}`).json<GetCategoryByIdSchema>();
        return res;
    } catch (error) {
        if (error instanceof HTTPError) {
            const errorBody = await error.response.json<GeneralResponseStructure>();
            throw new Error(`${errorBody.message} - ${errorBody.data}`);
        } else {
            console.error('[getCategoryByCategoryId] Unexpected Error:', error);
            throw new Error('Unexpected error occurred');
        }
    }
}

export async function getAllTasksByCategoryId(params: PaginationParams & { cId: string }): Promise<GetTasksResponse> {
    try {
        const res = await http.get(`task?category=${params.cId}`).json<{ data: GetTasksResponse }>();
        return res.data;
    } catch (error) {
        if (error instanceof HTTPError) {
            const errorBody = await error.response.json<GeneralResponseStructure>();
            throw new Error(`${errorBody.message} - ${errorBody.data}`);
        } else {
            console.error('[getAllTasksByCategoryId] Unexpected Error:', error);
            throw new Error('Unexpected error occurred');
        }
    }
}

export async function getStatsByCategoryId(cId: string): Promise<GetTaskStatsResponseSchema> {
    try {
        const res = await http.get(`task/stats/overview?category-id=${cId}`).json<{ data: GetTaskStatsResponseSchema }>();
        return res.data;
    } catch (error) {
        if (error instanceof HTTPError) {
            const errorBody = await error.response.json<GeneralResponseStructure>();
            throw new Error(`${errorBody.message} - ${errorBody.data}`);
        } else {
            console.error('[getStatsByCategoryId] Unexpected Error:', error);
            throw new Error('Unexpected error occurred');
        }
    }
}
