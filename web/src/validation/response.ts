import { z } from 'zod';
import { categorySchema } from '@/validation/category';
import { taskSchema } from '@/validation/task';

const paginationSchema = z.object({
    currentPage: z.number(),
    limit: z.number(),
    totalCount: z.number(),
    totalPages: z.number(),
    hasNextPage: z.boolean(),
    hasPrevPage: z.boolean(),
});

// ? This section always in api response
const generalResStruct = z.object({
    success: z.boolean(),
    message: z.string(),
})

// ? This section always in api response error
const generalErrorResStruct = z.object({
    success: z.boolean(),
    message: z.string(),
    payload: z.any().default(null)
})

// ? Helper to add it in every response schema
function createApiResponseSchema<T extends z.ZodTypeAny>(dataSchema: T) {
    return generalResStruct.extend({
        payload: dataSchema
    });
}

// * `/category`
const getCategories = createApiResponseSchema(
    z.object({
        categories: z.array(categorySchema),
        pagination: paginationSchema,
    })
);

// * `/category:category-id`
const getCategoryById = createApiResponseSchema(
    categorySchema
);

// * `POST /category`
const createCategory = createApiResponseSchema(
    categorySchema
);

// * `PUT /category:category-id`
const updateCategory = createApiResponseSchema(
    categorySchema
);

// * `Delete /category:category-id`
const deleteCategory = createApiResponseSchema(
    z.object({
        deletedCategory: z.object({
            id: z.string(),
            name: z.string(),
        }),
    })
);

// * `/category/:category-id/stats`
const getCategoryStats = createApiResponseSchema(
    z.object({
        totalTasks: z.number(),
        completedTasks: z.number(),
        pendingTasks: z.number(),
        completionRate: z.number(),
    })
);


// * `/task`
const getTasks = createApiResponseSchema(
    z.object({
        tasks: z.array(taskSchema),
        pagination: paginationSchema,
    })
);

// * `/task:task-id`
const getTaskById = createApiResponseSchema(taskSchema);

// * `POST /task`
const createTask = createApiResponseSchema(taskSchema);

// * `PUT /task:task-id`
const updateTask = createApiResponseSchema(taskSchema);

// * `Delete /task:task-id`
const deleteTask = createApiResponseSchema(taskSchema);

// * `/task/:task-id/toggle`
const toggleTaskStatus = createApiResponseSchema(taskSchema);

// ? Category route
export type GetCategoriesType = z.infer<typeof getCategories>;
export type GetCategoryByIdType = z.infer<typeof getCategoryById>;
export type CreateCategoryType = z.infer<typeof createCategory>;
export type UpdateCategoryType = z.infer<typeof updateCategory>;
export type DeleteCategoryType = z.infer<typeof deleteCategory>;
export type GetCategoryStatsType = z.infer<typeof getCategoryStats>;

// ? Task route
export type GetTasksType = z.infer<typeof getTasks>;
export type GetTaskByIdType = z.infer<typeof getTaskById>;
export type CreateTaskType = z.infer<typeof createTask>;
export type UpdateTaskType = z.infer<typeof updateTask>;
export type DeleteTaskType = z.infer<typeof deleteTask>;
export type ToggleTaskStatusType = z.infer<typeof toggleTaskStatus>;

export type GeneralErrorResponseType = z.infer<typeof generalErrorResStruct>;