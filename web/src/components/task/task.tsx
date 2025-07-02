import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useSearch } from "@tanstack/react-router";

import {
    addToast,
    Button,
    Card, CardHeader,
    Dropdown, DropdownItem, DropdownMenu, DropdownTrigger,
    Link,
    Modal, ModalBody, ModalContent, ModalFooter, ModalHeader,
    Textarea, useDisclosure
} from "@heroui/react";
import { BookCopy, Circle, CircleCheck, Copy, CopyCheck, GripVertical, ListEnd, SquarePen, ToggleLeft, ToggleRight, Trash, X } from "lucide-react";
import { cn } from "@/utils/helper-functions";

import { editTaskSchema, Task } from '@/validation/task';
import { deleteTask, editTask, toggleTaskStatus } from "@/services/task.service";
import { useCopyToClipboard } from "@/utils/hooks";

const iconClasses = "size-4 text-default-500 pointer-events-none flex-shrink-0";

export default function TaskComponent({ _id, categoryId, content, done, updatedAt }: Task) {
    const [isEditing, setIsEditing] = useState(false);
    const [editedContent, setEditedContent] = useState(content);
    const {
        isOpen: isDeleteConfirmModalOpen,
        onOpen: onDeleteConfirmModalOpen,
        onClose: onDeleteConfirmModalClose,
        onOpenChange: onDeleteConfirmModalOpenChange
    } = useDisclosure();

    const queryClient = useQueryClient();
    const { isCopied, copy } = useCopyToClipboard(content);
    const { page, search, sortBy, sortOrder, limit } = useSearch({ from: '/categories/$categoryId' });

    const toggleMutation = useMutation({
        mutationFn: () => toggleTaskStatus(_id),
        onSuccess: (res) => {
            // ? Tell user
            addToast({
                variant: 'solid',
                color: 'success',
                title: 'Done',
                description: `${res.message}`
            })

            // ? Invalidate and refetch tasks list
            queryClient.invalidateQueries({ queryKey: ['all-tasks', categoryId, page, search, sortBy, sortOrder, limit] });
            queryClient.invalidateQueries({ queryKey: ['stats', categoryId] });
        },
        onError: (e) => {
            console.error('Failed to toggle task!!!')
            console.error(e);

            addToast({
                variant: 'solid',
                color: 'danger',
                title: 'Error',
                description: `${e.message}`
            })
        },
    });

    const taskEditMutation = useMutation({
        mutationFn: () => editTask(editedContent, _id),
        onSuccess: (res) => {
            // ? Off editing 
            setIsEditing(!isEditing)

            // ? Fill form after successful updation
            setEditedContent(res.payload.content)

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
            console.error('Failed to update task!!!')
            console.error(e);

            addToast({
                variant: 'solid',
                color: 'danger',
                title: 'Error',
                description: `${e.message}`
            })
        }
    })

    const taskDeleteMutation = useMutation({
        mutationFn: () => deleteTask(_id),
        onSuccess: (res) => {
            // ? Close modal 
            onDeleteConfirmModalClose()

            // ? Tell user
            addToast({
                variant: 'solid',
                color: 'success',
                title: 'Done',
                description: `${res.message}`
            })

            // ? Invalidate and refetch this category list
            queryClient.invalidateQueries({ queryKey: ['all-tasks', categoryId, page, search, sortBy, sortOrder, limit] });
            queryClient.invalidateQueries({ queryKey: ['stats', categoryId] });
        },
        onError: (e) => {
            console.error('Failed to delete task!!!')
            console.error(e);

            addToast({
                variant: 'solid',
                color: 'danger',
                title: 'Error',
                description: `${e.message}`
            })
        }
    })

    function editSubmit() {
        const { success, error } = editTaskSchema.safeParse(editedContent);
        if (!success) {
            addToast({
                variant: 'flat',
                color: 'danger',
                title: 'Invalid input',
                description: `-- ${error.issues[0].path[0]} -- ${error.issues[0].message}`
            })
        } else {
            taskEditMutation.mutate();
        }
    }

    return (
        <>
            <Card
                key={_id}
                className="w-full sm:w-11/12 mx-auto bg-content2 hover:bg-content2/80 selection:bg-content2/90 group"
            >
                <CardHeader className="gap-4 justify-between">
                    <Button
                        variant={done ? 'solid' : 'flat'}
                        color={done ? 'primary' : 'default'}
                        size="lg"
                        isIconOnly
                        onPress={() => toggleMutation.mutate()}
                        isLoading={toggleMutation.isPending}
                    >
                        {done ? (<CircleCheck className="size-6" />) : (<Circle className="size-6" />)}
                    </Button>

                    {isEditing ? (
                        <>
                            <Textarea
                                type='text'
                                name='task'
                                variant='flat'
                                size='lg'
                                isClearable
                                fullWidth
                                placeholder="Write here"
                                onClear={() => {
                                    setEditedContent('')
                                }}
                                onKeyDown={(e) => {
                                    if (e.key === "Enter") {
                                        if (e.key === "Enter") {
                                            editSubmit();
                                        }
                                    }
                                }}
                                defaultValue={content}
                                onChange={(ev) => {
                                    setEditedContent(ev.target.value)
                                }}
                            />
                            <div className="flex flex-col justify-between gap-2">
                                <Button
                                    variant="flat"
                                    color="warning"
                                    radius="sm"
                                    size="md"
                                    isIconOnly
                                    isLoading={taskEditMutation.isPending}
                                    onPress={editSubmit}
                                >
                                    <ListEnd className="size-4" />
                                </Button>
                                <Button
                                    variant="flat"
                                    color="danger"
                                    radius="sm"
                                    size="md"
                                    isIconOnly
                                    onPress={() => { setIsEditing(!isEditing) }}
                                >
                                    <X className="size-4" />
                                </Button>
                            </div>

                        </>
                    ) : (
                        <main className="grid grid-cols-9 gap-2">
                            <div className="space-y-1 col-span-8">

                                <h1 className="text-lg font-semibold tracking-wide">
                                    {content.trim().split(' ').map((part, index) => {
                                        if (part.includes('http')) {
                                            return (
                                                <span key={index}>
                                                    <Link
                                                        href={part}
                                                        isExternal
                                                        rel="noopener noreferrer"
                                                        color="warning"
                                                        showAnchorIcon
                                                    >
                                                        {part.split('/').slice(1, 3)[1]}
                                                    </Link>
                                                    {index < content.trim().split(' ').length - 1 && ' '}
                                                </span>
                                            );
                                        } else {
                                            return (
                                                <span key={index}>
                                                    {part}
                                                    {index < content.trim().split(' ').length - 1 && ' '}
                                                </span>
                                            );
                                        }
                                    })}
                                </h1>
                                <p className="text-xs tracking-tighter">Last edit on {new Date(updatedAt).toLocaleDateString()} | {new Date(updatedAt).toLocaleTimeString()}</p>
                            </div>

                            <Dropdown>
                                <DropdownTrigger>
                                    <Button
                                        variant="faded"
                                        radius="sm"
                                        size="md"
                                        isIconOnly
                                        className="opacity-0 group-hover:opacity-100 transition-opacity"
                                    >
                                        <GripVertical className="size-4" />
                                    </Button>
                                </DropdownTrigger>
                                <DropdownMenu aria-label="Config Menu" variant="bordered">
                                    <DropdownItem
                                        key="toggle"
                                        textValue="toggle"
                                        aria-label="toggle menu"
                                        className="text-primary"
                                        color="primary"
                                        startContent={done ? <ToggleLeft className={cn(iconClasses, "text-primary")} /> : <ToggleRight className={cn(iconClasses, "text-primary")} />}
                                        onPress={() => toggleMutation.mutate()}
                                    >
                                        Toggle {done ? 'Pending' : 'Done'}
                                    </DropdownItem>
                                    <DropdownItem
                                        key="duplicate"
                                        textValue="duplicate"
                                        aria-label="duplicate menu"
                                        className="text-secondary"
                                        color="secondary"
                                        startContent={<BookCopy className={cn(iconClasses, "text-secondary")} />}
                                    >
                                        Duplicate
                                    </DropdownItem>
                                    <DropdownItem
                                        key="copy"
                                        textValue="copy"
                                        aria-label="copy menu"
                                        className="text-primary"
                                        color="primary"
                                        startContent={isCopied ? <CopyCheck className={cn(iconClasses, "text-success")} /> : <Copy className={cn(iconClasses, "text-primary")} />}
                                        onPress={copy}
                                    >
                                        {!isCopied ? 'Copy' : 'Copied'}
                                    </DropdownItem>
                                    <DropdownItem
                                        key="edit"
                                        textValue="edit"
                                        aria-label="edit menu"
                                        className="text-warning"
                                        color="warning"
                                        startContent={<SquarePen className={cn(iconClasses, "text-warning")} />}
                                        onPress={() => { setIsEditing(!isEditing) }}
                                    >
                                        Edit
                                    </DropdownItem>
                                    <DropdownItem
                                        key="delete"
                                        textValue="delete"
                                        aria-label="delete menu"
                                        className="text-danger"
                                        color="danger"
                                        startContent={<Trash className={cn(iconClasses, "text-danger")} />}
                                        onPress={onDeleteConfirmModalOpen}
                                    >
                                        Delete
                                    </DropdownItem>
                                </DropdownMenu>
                            </Dropdown>
                        </main>
                    )}

                </CardHeader>
            </Card >

            {/* Delete Confirm Modal */}
            <Modal isOpen={isDeleteConfirmModalOpen} onOpenChange={onDeleteConfirmModalOpenChange}>
                <ModalContent>
                    {(onClose) => (
                        <>
                            <ModalHeader className="flex flex-col gap-1">Delete Task</ModalHeader>
                            <ModalBody>
                                <p>
                                    Delete : `{content}`
                                </p>
                            </ModalBody>
                            <ModalFooter>
                                <Button color="danger" variant="light" onPress={onClose}>
                                    No
                                </Button>
                                <Button
                                    color="warning"
                                    isLoading={taskDeleteMutation.isPending}
                                    onPress={() => {
                                        taskDeleteMutation.mutate();
                                    }}>
                                    Delete
                                </Button>
                            </ModalFooter>
                        </>
                    )}
                </ModalContent>
            </Modal>
        </>
    )
}
