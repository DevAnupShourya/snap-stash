import http from '@/lib/http';
import { TasksPaginationParams } from '@/validation/category';
import { GeneralErrorResponseType, GetTasksType, GetCategoryStatsType, CreateTaskType, ToggleTaskStatusType, DeleteTaskType } from '@/validation/response';
import { HTTPError } from 'ky';


export async function getAllTasksByCategoryId(params: TasksPaginationParams & { cId: string }): Promise<GetTasksType> {
    try {
        const res = await http.get(`task`, {
            searchParams: {
                category: params.cId,
                page: params.page,
                limit: params.limit,
                ...(params.search && { search: params.search }),
                ...(params.sortBy && { sortBy: params.sortBy }),
                ...(params.sortOrder && { sortOrder: params.sortOrder }),
            }
        }).json<GetTasksType>();
        return res;
    } catch (error) {
        if (error instanceof HTTPError) {
            const errorBody = await error.response.json<GeneralErrorResponseType>();
            throw new Error(`${errorBody.message} - ${errorBody.payload}`);
        } else {
            console.error('[getAllTasksByCategoryId] Unexpected Error:', error);
            throw new Error('Unexpected error occurred');
        }
    }
}

export async function getStatsByCategoryId(cId: string): Promise<GetCategoryStatsType> {
    try {
        const res = await http.get(`task/stats/overview`, {
            searchParams: {
                "category-id": cId,
            }
        }).json<GetCategoryStatsType>();
        return res;
    } catch (error) {
        if (error instanceof HTTPError) {
            const errorBody = await error.response.json<GeneralErrorResponseType>();
            throw new Error(`${errorBody.message} - ${errorBody.payload}`);
        } else {
            console.error('[getStatsByCategoryId] Unexpected Error:', error);
            throw new Error('Unexpected error occurred');
        }
    }
}

import { TaskForm } from '@/validation/task';
export async function createTask(formData: TaskForm): Promise<CreateTaskType> {
    try {
        const res = await http.post('task', { json: formData }).json<CreateTaskType>();
        return res;
    } catch (error) {
        if (error instanceof HTTPError) {
            const errorBody = await error.response.json<GeneralErrorResponseType>();
            throw new Error(`${errorBody.message} - ${errorBody.payload}`);
        } else {
            console.error('[createTask] Unexpected Error:', error);
            throw new Error('Unexpected error occurred');
        }
    }
}

export async function toggleTaskStatus(tId: string): Promise<ToggleTaskStatusType> {
    try {
        const res = await http.patch(`task/${tId}/toggle`).json<ToggleTaskStatusType>();
        return res;
    } catch (error) {
        if (error instanceof HTTPError) {
            const errorBody = await error.response.json<GeneralErrorResponseType>();
            throw new Error(`${errorBody.message} - ${errorBody.payload}`);
        } else {
            console.error('[toggleTaskStatus] Unexpected Error:', error);
            throw new Error('Unexpected error occurred');
        }
    }
}

export async function editTask(content: string, tId: string): Promise<CreateTaskType> {
    try {
        const res = await http.put(`task/${tId}`, { json: { content } }).json<CreateTaskType>();
        return res;
    } catch (error) {
        if (error instanceof HTTPError) {
            const errorBody = await error.response.json<GeneralErrorResponseType>();
            throw new Error(`${errorBody.message} - ${errorBody.payload}`);
        } else {
            console.error('[createTask] Unexpected Error:', error);
            throw new Error('Unexpected error occurred');
        }
    }
}

export async function deleteTask(tId: string): Promise<DeleteTaskType> {
    try {
        const res = await http.delete(`task/${tId}`).json<DeleteTaskType>();
        return res;
    } catch (error) {
        if (error instanceof HTTPError) {
            const errorBody = await error.response.json<GeneralErrorResponseType>();
            throw new Error(`${errorBody.message} - ${errorBody.payload}`);
        } else {
            console.error('[deleteTask] Unexpected Error:', error);
            throw new Error('Unexpected error occurred');
        }
    }
}
