import http from '@/lib/http';
import { CategoryForm, CategoryPaginationParams } from '@/validation/category';
import {
    GeneralErrorResponseType,
    GetCategoriesType,
    CreateCategoryType,
    GetCategoryByIdType,
    DeleteCategoryType,
    UpdateCategoryType
} from '@/validation/response';
import { HTTPError } from 'ky';

export async function getCategoryByCategoryId(cId: string): Promise<GetCategoryByIdType> {
    try {
        const res = await http.get(`category/${cId}`).json<GetCategoryByIdType>();
        return res;
    } catch (error) {
        if (error instanceof HTTPError) {
            const errorBody = await error.response.json<GeneralErrorResponseType>();
            throw new Error(`${errorBody.message} - ${errorBody.payload}`);
        } else {
            console.error('[getCategoryByCategoryId] Unexpected Error:', error);
            throw new Error('Unexpected error occurred');
        }
    }
}

export async function getCategories(params: CategoryPaginationParams): Promise<GetCategoriesType> {
    try {
        const res = await http.get('category', {
            searchParams: {
                page: params.page,
                limit: params.limit,
                ...(params.search && { search: params.search }),
                ...(params.sortBy && { sortBy: params.sortBy }),
                ...(params.sortOrder && { sortOrder: params.sortOrder }),
            }
        }).json<GetCategoriesType>();
        return res;
    } catch (error) {
        if (error instanceof HTTPError) {
            const errorBody = await error.response.json<GeneralErrorResponseType>();
            throw new Error(`${errorBody.message} - ${errorBody.payload}`);
        } else {
            console.error('[getCategories] Unexpected Error:', error);
            throw new Error('Unexpected error occurred');
        }
    }
}

export async function createCategory(formData: CategoryForm): Promise<CreateCategoryType> {
    try {
        const res = await http.post('category', { json: formData }).json<CreateCategoryType>();
        return res;
    } catch (error) {
        if (error instanceof HTTPError) {
            const errorBody = await error.response.json<GeneralErrorResponseType>();
            throw new Error(`${errorBody.message} - ${errorBody.payload}`);
        } else {
            console.error('[createCategory] Unexpected Error:', error);
            throw new Error('Unexpected error occurred');
        }
    }
}

export async function deleteCategory(cId: string): Promise<DeleteCategoryType> {
    try {
        const res = await http.delete(`category/${cId}`).json<DeleteCategoryType>();
        return res;
    } catch (error) {
        if (error instanceof HTTPError) {
            const errorBody = await error.response.json<GeneralErrorResponseType>();
            throw new Error(`${errorBody.message} - ${errorBody.payload}`);
        } else {
            console.error('[deleteCategory] Unexpected Error:', error);
            throw new Error('Unexpected error occurred');
        }
    }
}

export async function updateCategory({ cId, data }: { cId: string, data: any }): Promise<UpdateCategoryType> {
    try {
        const res = await http.put(`category/${cId}`, { json: data }).json<UpdateCategoryType>();
        return res;
    } catch (error) {
        if (error instanceof HTTPError) {
            const errorBody = await error.response.json<GeneralErrorResponseType>();
            throw new Error(`${errorBody.message} - ${errorBody.payload}`);
        } else {
            console.error('[updateCategory] Unexpected Error:', error);
            throw new Error('Unexpected error occurred');
        }
    }
}