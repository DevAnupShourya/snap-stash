import { useEffect, useState } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';
import {
    CardFooter,
    Divider,
    Button,
    CircularProgress,
    addToast,
    Modal,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
    useDisclosure,
} from "@heroui/react";
import { Bolt, Trash2, X } from 'lucide-react';

import { getStatsByCategoryId } from '@/services/task.service';
import { deleteCategory } from '@/services/category.service';
import { useRouter } from '@tanstack/react-router';
import CategoryFormComponent from './category-form';

export default function CategoryFooter({ cId }: { cId: string }) {
    const [isEditFormShowing, setIsEditFormShowing] = useState(false);

    const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
    const router = useRouter();

    const statsQuery = useQuery({
        queryKey: ['stats', cId],
        queryFn: () => getStatsByCategoryId(cId),
    });

    useEffect(() => {
        if (statsQuery.status === 'error') {
            console.error(statsQuery.error);
            if (statsQuery.error) {
                addToast({
                    color: 'danger',
                    title: 'Error',
                    description: statsQuery.error.message,
                });
            }
        }
    }, [statsQuery.error]);

    const deleteCategoryMutation = useMutation({
        mutationFn: () => deleteCategory(cId),
        onSuccess: (res) => {
            // ? Close modal 
            onClose();

            // ? Tell user
            addToast({
                variant: 'solid',
                color: 'success',
                title: 'Done',
                description: `${res.message}`
            })

            // ? redirecting user here
            router.navigate({
                to: '/categories',
                search: { page: 1, search: '', sortBy: 'createdAt', sortOrder: 'asc', limit: 10 }
            });
        },
        onError: (e) => {
            console.error('Failed to delete category!!!')
            console.error(e);

            addToast({
                variant: 'solid',
                color: 'danger',
                title: 'Error',
                description: `${e.message}`
            })
        }
    })

    return (
        <section className='absolute w-full bottom-0 left-0 bg-content2/20 backdrop-blur-sm transition-opacity duration-200'>
            <Divider />
            {statsQuery.isSuccess && (
                <CardFooter className='flex flex-nowrap justify-between items-center gap-2'>
                    {isEditFormShowing ? (
                        <CategoryFormComponent
                            key='update'
                            method='update'
                            categoryId={cId}
                        />
                    ) : (
                        <div className='flex flex-nowrap justify-between items-center gap-4'>
                            <CircularProgress
                                aria-label="Completed Tasks"
                                color="warning"
                                showValueLabel={true}
                                size="md"
                                value={statsQuery.data.payload.completionRate}
                            />
                            <h1 className="uppercase text-sm font-semibold tracking-wide">Completed {statsQuery.data.payload.completedTasks}/{statsQuery.data.payload.totalTasks}</h1>
                        </div>
                    )}

                    <div className='flex flex-nowrap gap-2 items-center'>
                        {isEditFormShowing ? (
                            <Button
                                variant='faded'
                                color='warning'
                                isIconOnly
                                onPress={() => { setIsEditFormShowing(!isEditFormShowing) }}
                            >
                                <X className='size-4 pointer-events-none flex-shrink-0 transition-transform' />
                            </Button>
                        ) : (
                            <Button
                                variant='faded'
                                color='warning'
                                isIconOnly
                                onPress={() => { setIsEditFormShowing(!isEditFormShowing) }}
                            >
                                <Bolt className='size-4 pointer-events-none flex-shrink-0 transition-transform' />
                            </Button>
                        )}

                        <Button
                            variant='faded'
                            color='danger'
                            isIconOnly
                            onPress={onOpen}
                            isLoading={deleteCategoryMutation.isPending}
                        >
                            <Trash2 className='size-4 pointer-events-none flex-shrink-0 transition-transform' />
                        </Button>
                    </div>

                    <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
                        <ModalContent>
                            {(onClose) => (
                                <>
                                    <ModalHeader className="flex flex-col gap-1">Delete Category</ModalHeader>
                                    <ModalBody>
                                        <p>Do you really want to delete this category? With this action all tasks it has will also delete. You want to proceed!</p>
                                    </ModalBody>
                                    <ModalFooter>
                                        <Button color="warning" variant="light" onPress={onClose}>
                                            No
                                        </Button>
                                        <Button color="danger" onPress={() => { deleteCategoryMutation.mutate() }}>
                                            Yes, Delete
                                        </Button>
                                    </ModalFooter>
                                </>
                            )}
                        </ModalContent>
                    </Modal>

                </CardFooter>
            )
            }
        </section >

    )
}
