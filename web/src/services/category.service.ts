import http from '@/lib/http';
import { CategoryForm } from '@/types/category';
import { GetCategoriesResponse, GeneralResponseStructure } from '@/types/response';
import { HTTPError } from 'ky';

export async function getCategories(): Promise<GetCategoriesResponse> {
    try {
        const res = await http.get('category').json<{ data: GetCategoriesResponse }>();
        return res.data;
    } catch (error) {
        if (error instanceof HTTPError) {
            const errorBody = await error.response.json<GeneralResponseStructure>();
            throw new Error(`${errorBody.message} - ${errorBody.data}`);
        } else {
            console.error('[getCategories] Unexpected Error:', error);
            throw new Error('Unexpected error occurred');
        } 
    }
}

export async function createCategory(formData: CategoryForm): Promise<GeneralResponseStructure> {
    try {
        const res = await http.post('category', { json: formData }).json<GeneralResponseStructure>();
        return res;
    } catch (error) {
        if (error instanceof HTTPError) {
            const errorBody = await error.response.json<GeneralResponseStructure>();
            throw new Error(`${errorBody.message} - ${errorBody.data}`);
        } else {
            console.error('[createCategory] Unexpected Error:', error);
            throw new Error('Unexpected error occurred');
        }
    }
}
