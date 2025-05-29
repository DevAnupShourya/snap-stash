import { useQueryClient, useMutation } from '@tanstack/react-query';
import { useState } from 'react';
import {
    Card, CardHeader,
    Input,
    Button,
    Tooltip,
    addToast,
    Popover,
    PopoverTrigger,
    PopoverContent,
} from "@heroui/react";

import { CategoryForm, categoryFormSchema } from '@/types/category';
import { Colors, Icons } from '@/config/constants';

import { CornerRightUp } from 'lucide-react';
import { createCategory } from '@/services/category.service';


// Helper function to get color value
const getColorValue = (color: string) => {
    const validColors = ['primary', 'secondary', 'success', 'warning', 'danger'];
    return validColors.includes(color) ? color as any : 'default';
};

export default function CategoryFormComponent() {
    const queryClient = useQueryClient();

    const [categoryForm, setCategoryForm] = useState<CategoryForm>({
        icon: 'programming',
        color: 'default',
        name: ''
    });

    const createFormMutation = useMutation({
        mutationFn: createCategory,
        onSuccess: (res) => {
            // ? Reset form after successful creation
            setCategoryForm({
                icon: 'youtube',
                color: 'default',
                name: ''
            });

            // ? Tell user
            addToast({
                variant: 'solid',
                color: 'success',
                title: 'Done',
                description: `${res.message}`
            })

            // ? Invalidate and refetch categories list
            queryClient.invalidateQueries({ queryKey: ['all-categories'] });
        },
        onError: (e) => {
            console.error('Failed to create category!!!')
            console.error(e);

            addToast({
                variant: 'solid',
                color: 'danger',
                title: 'Error',
                description: `${e.message}`
            })
        }
    })

    function formSubmit() {
        const { data, success, error } = categoryFormSchema.safeParse(categoryForm);
        if (!success) {
            addToast({
                variant: 'flat',
                color: 'danger',
                title: 'Invalid input',
                description: `-- ${error.issues[0].path[0]} -- ${error.issues[0].message}`
            })
        } else {
            createFormMutation.mutate(data);
        }
    }

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
                    onClear={() => {
                        setCategoryForm({
                            ...categoryForm,
                            name: ''
                        })
                    }}
                    startContent={
                        <Popover placement="top-start">
                            <PopoverTrigger>
                                <Button
                                    variant="solid"
                                    color={categoryForm.color}
                                    size="md"
                                    isIconOnly
                                    onPress={() => { formSubmit() }}
                                >
                                    {Icons.map((i, idx) => {
                                        if (i.name === categoryForm.icon) {
                                            return (
                                                <i.icon key={`${i}-${idx}`} className='size-4' />
                                            )
                                        }
                                    })}
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent>
                                <div className="space-y-4 w-64 max-w-screen-sm p-2">
                                    <div className='space-y-2'>
                                        <h3 className="text-small font-bold tracking-wider">Icon</h3>
                                        <div className='flex flex-wrap gap-2'>
                                            {Icons.map((i) => {
                                                return (
                                                    <Tooltip key={i.name} content={i.name} color='foreground' classNames={{ content: 'capitalize' }} delay={2000}>
                                                        <Button
                                                            key={i.name}
                                                            variant={categoryForm.icon === i.name ? "solid" : 'light'}
                                                            color='default'
                                                            size="sm"
                                                            isIconOnly
                                                            onPress={() => {
                                                                setCategoryForm({
                                                                    ...categoryForm,
                                                                    icon: i.name
                                                                })
                                                            }}
                                                        >
                                                            <i.icon className='size-4' />
                                                        </Button>
                                                    </Tooltip>
                                                )
                                            })}
                                        </div>
                                    </div>
                                    <div className='space-y-2'>
                                        <h3 className="text-small font-bold tracking-wider">Color</h3>
                                        <div className='flex flex-wrap gap-4'>
                                            {Colors.map((c) => {
                                                return (
                                                    <Button
                                                        key={c}
                                                        variant={categoryForm.color === c ? 'shadow' : 'ghost'}
                                                        // color={
                                                        //     c === 'primary' ? 'primary' :
                                                        //         c === 'secondary' ? 'secondary' :
                                                        //             c === 'success' ? 'success' :
                                                        //                 c === 'warning' ? 'warning' :
                                                        //                     c === 'danger' ? 'danger' : 'default'

                                                        // }
                                                        color={getColorValue(c)}
                                                        size="sm"
                                                        radius='full'
                                                        isIconOnly
                                                        onPress={() => {
                                                            // setCategoryForm({
                                                            //     ...categoryForm,
                                                            //     color: c === 'primary' ? 'primary' :
                                                            //         c === 'secondary' ? 'secondary' :
                                                            //             c === 'success' ? 'success' :
                                                            //                 c === 'warning' ? 'warning' :
                                                            //                     c === 'danger' ? 'danger' : 'default'
                                                            // })
                                                            setCategoryForm({
                                                                ...categoryForm,
                                                                color: getColorValue(c)
                                                            })
                                                        }}
                                                    />
                                                )
                                            })}

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
                        })
                    }}
                    classNames={{ innerWrapper: 'gap-2' }}
                />
                <Button
                    variant="solid"
                    color="secondary"
                    size="md"
                    isIconOnly
                    isLoading={createFormMutation.isPending}
                    onPress={() => { formSubmit() }}
                >
                    <CornerRightUp className='size-4' />
                </Button>
            </CardHeader>
        </Card>

    )
}
