import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useParams, useSearch } from "@tanstack/react-router";

import { addToast, Button, Card, CardHeader, Input } from "@heroui/react";
import { Circle, CircleCheck, ListPlus } from "lucide-react";

import { createTask } from "@/services/task.service";

import { TaskForm, createTaskSchema } from "@/validation/task";

export default function TaskFormComponent({ setFormVisible }: { setFormVisible: React.Dispatch<React.SetStateAction<boolean>> }) {
    const queryClient = useQueryClient();
    const { categoryId } = useParams({ from: '/categories/$categoryId' })
    const { page, search, sortBy, sortOrder, limit } = useSearch({ from: '/categories/$categoryId' });

    const [taskForm, setTaskForm] = useState<TaskForm>({
        content: '',
        done: false,
        categoryId
    })

    const taskFormMutation = useMutation({
        mutationFn: createTask,
        onSuccess: (res) => {
            // ? Hide form 
            setFormVisible(false);

            // ? Reset form after successful creation
            setTaskForm({
                content: '',
                done: false,
                categoryId
            });

            // ? Tell user
            addToast({
                variant: 'solid',
                color: 'success',
                title: 'Done',
                description: `${res.message}`
            })

            // ? Invalidate and refetch this category list
            queryClient.invalidateQueries({ queryKey: ['all-tasks', categoryId, page, search, sortBy, sortOrder, limit] });
        },
        onError: (e) => {
            console.error('Failed to create task!!!')
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
        const { data, success, error } = createTaskSchema.safeParse(taskForm);
        if (!success) {
            addToast({
                variant: 'flat',
                color: 'danger',
                title: 'Invalid input',
                description: `-- ${error.issues[0].path[0]} -- ${error.issues[0].message}`
            })
        } else {
            taskFormMutation.mutate(data);
        }
    }

    return (
        <Card className="w-full sm:w-11/12 mx-auto bg-content2 hover:bg-content2/80 selection:bg-content2/90 group">
            <CardHeader className="gap-4 justify-between">
                <Input
                    type='text'
                    name='task'
                    variant='flat'
                    size='lg'
                    isClearable
                    fullWidth
                    placeholder="Write here"
                    onClear={() => {
                        setTaskForm({
                            ...taskForm,
                            content: ''
                        })
                    }}
                    startContent={
                        <Button
                            variant='flat'
                            color={taskForm.done ? 'primary' : 'default'}
                            radius="full"
                            size="sm"
                            isIconOnly
                            onPress={() => {
                                setTaskForm({
                                    ...taskForm,
                                    done: !taskForm.done
                                });
                            }}
                        >
                            {taskForm.done ? (
                                <CircleCheck className="size-4" />
                            ) : (
                                <Circle className="size-4" />
                            )}
                        </Button>
                    }
                    onKeyDown={(e) => {
                        if (e.key === "Enter") {
                            formSubmit();
                        }
                    }}
                    value={taskForm.content}
                    onChange={(ev) => {
                        setTaskForm({
                            ...taskForm,
                            content: ev.target.value
                        })
                    }}
                    classNames={{ innerWrapper: 'gap-2' }}
                />
                <Button
                    variant="shadow"
                    color="primary"
                    radius="sm"
                    size="md"
                    isIconOnly
                    isLoading={taskFormMutation.isPending}
                    onPress={() => { formSubmit() }}
                >
                    <ListPlus className="size-4" />
                </Button>
            </CardHeader>
        </Card>
    )
}
