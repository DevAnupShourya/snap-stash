import { useState } from 'react';
import { useQueryClient, useMutation } from '@tanstack/react-query';

import {
    Card, CardHeader,
    Input,
    Button,
    Tooltip,
    addToast,
    Popover, PopoverTrigger, PopoverContent,
} from "@heroui/react";
import { CornerRightDown, CornerRightUp } from 'lucide-react';

import { Category, CategoryForm, categoryFormSchema } from '@/validation/category';
import { Colors, Icons } from '@/config/constants';

import { createCategory, updateCategory } from '@/services/category.service';

// ? Helper function to get color value
const getColorValue = (color: string) => {
    const validColors = ['primary', 'secondary', 'success', 'warning', 'danger'];
    return validColors.includes(color) ? color as any : 'default';
};

type CategoryFormComponentProps =
    | {
        method: 'create'
    }
    | {
        method: 'update'
        categoryId: string
    }

export default function CategoryFormComponent(props: CategoryFormComponentProps) {
    const { method } = props;
    const queryClient = useQueryClient();

    // ? Get initial form data based on method
    const getInitialFormData = (): CategoryForm => {
        if (method === 'update') {
            const { categoryId } = props;
            const data: { payload: Category } = queryClient.getQueryData(['category', categoryId])!;

            return {
                icon: data.payload.icon,
                color: data.payload.color,
                name: data.payload.name
            };
        }
        return {
            icon: 'programming',
            color: 'default',
            name: ''
        };
    };

    const [categoryForm, setCategoryForm] = useState<CategoryForm>(getInitialFormData());

    // ? Create mutation
    const createMutation = useMutation({
        mutationFn: createCategory,
        onSuccess: (res) => {
            setCategoryForm({
                icon: 'programming',
                color: 'default',
                name: ''
            });

            addToast({
                variant: 'solid',
                color: 'success',
                title: 'Done',
                description: res.message
            });

            queryClient.invalidateQueries({ queryKey: ['all-categories'] });
        },
        onError: (e) => {
            console.error('Failed to create category:', e);
            addToast({
                variant: 'solid',
                color: 'danger',
                title: 'Error',
                description: e.message
            });
        }
    });

    // ? Update mutation
    const updateMutation = useMutation({
        mutationFn: updateCategory,
        onSuccess: (res) => {
            addToast({
                variant: 'solid',
                color: 'success',
                title: 'Updated',
                description: res.message
            });

            if (method === 'update') {
                const { categoryId } = props;
                queryClient.invalidateQueries({ queryKey: ['category', categoryId] });
            }
        },
        onError: (e) => {
            console.error('Failed to update category:', e);
            addToast({
                variant: 'solid',
                color: 'danger',
                title: 'Error',
                description: e.message
            });
        }
    });

    function formSubmit() {
        const { data, success, error } = categoryFormSchema.safeParse(categoryForm);

        if (!success) {
            addToast({
                variant: 'flat',
                color: 'danger',
                title: 'Invalid input',
                description: `${error.issues[0].path[0]} - ${error.issues[0].message}`
            });
            return;
        }

        if (method === 'create') {
            createMutation.mutate(data);
        } else {
            const { categoryId } = props;
            updateMutation.mutate({ cId: categoryId, data });
        }
    }

    // ? Get current mutation state
    const currentMutation = method === 'create' ? createMutation : updateMutation;
    const submitButtonText = method === 'create' ? 'Create' : 'Update';

    return (
        <Card className="w-full sm:w-11/12 mx-auto bg-content3/20 hover:bg-content3/80">
            <CardHeader className="gap-2 justify-between items-center">
                
                <Input
                    type='text'
                    name='category'
                    variant='flat'
                    size='lg'
                    isClearable
                    fullWidth
                    placeholder={method === 'create' ? 'Enter category name' : 'Update category name'}
                    onClear={() => {
                        setCategoryForm({
                            ...categoryForm,
                            name: ''
                        });
                    }}
                    startContent={
                        <Popover placement="top-start">
                            <PopoverTrigger>
                                <Button
                                    variant="solid"
                                    color={categoryForm.color}
                                    size="md"
                                    isIconOnly
                                >
                                    {Icons.map((i, idx) => {
                                        if (i.name === categoryForm.icon) {
                                            return (
                                                <i.icon key={`${i.name}-${idx}`} className='size-4' />
                                            );
                                        }
                                    })}
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent>
                                <div className="space-y-4 w-64 max-w-screen-sm p-2">
                                    <div className='space-y-2'>
                                        <h3 className="text-small font-bold tracking-wider">Icon</h3>
                                        <div className='flex flex-wrap gap-2'>
                                            {Icons.map((i) => (
                                                <Tooltip
                                                    key={i.name}
                                                    content={i.name}
                                                    color='foreground'
                                                    classNames={{ content: 'capitalize' }}
                                                    delay={2000}
                                                >
                                                    <Button
                                                        variant={categoryForm.icon === i.name ? "solid" : 'light'}
                                                        color='default'
                                                        size="sm"
                                                        isIconOnly
                                                        onPress={() => {
                                                            setCategoryForm({
                                                                ...categoryForm,
                                                                icon: i.name
                                                            });
                                                        }}
                                                    >
                                                        <i.icon className='size-4' />
                                                    </Button>
                                                </Tooltip>
                                            ))}
                                        </div>
                                    </div>
                                    <div className='space-y-2'>
                                        <h3 className="text-small font-bold tracking-wider">Color</h3>
                                        <div className='flex flex-wrap gap-4'>
                                            {Colors.map((c) => (
                                                <Button
                                                    key={c}
                                                    variant={categoryForm.color === c ? 'shadow' : 'ghost'}
                                                    color={getColorValue(c)}
                                                    size="sm"
                                                    radius='full'
                                                    isIconOnly
                                                    onPress={() => {
                                                        setCategoryForm({
                                                            ...categoryForm,
                                                            color: getColorValue(c)
                                                        });
                                                    }}
                                                />
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </PopoverContent>
                        </Popover>
                    }
                    onKeyDown={(e) => {
                        if (e.key === "Enter") {
                            formSubmit();
                        }
                    }}
                    value={categoryForm.name}
                    onChange={(ev) => {
                        setCategoryForm({
                            ...categoryForm,
                            name: ev.target.value
                        });
                    }}
                    classNames={{ innerWrapper: 'gap-2' }}
                />
                <Button
                    variant="solid"
                    color={method === 'create' ? 'primary' : 'secondary'}
                    size="md"
                    isIconOnly
                    isLoading={currentMutation.isPending}
                    onPress={formSubmit}
                    title={submitButtonText}
                >
                    {method === 'create' ? (
                        <CornerRightUp className='size-4' />
                    ) : (
                        <CornerRightDown className='size-4' />
                    )}
                </Button>
            </CardHeader>
        </Card>
    );
}