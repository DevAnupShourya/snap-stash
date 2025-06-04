import { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';

import { getAllTasksByCategoryId } from '@/services/task.service';

import {
    CardBody,
    Pagination,
    ScrollShadow,
    Select,
    SelectItem,
    addToast,
} from "@heroui/react";
import Task from '@/components/sections/task';
import SomethingWentWrong from '@/components/sections/error';
import LoadingContent from '@/components/sections/loader';
import NothingToShow from '@/components/sections/nothing-to-show';
import TaskForm from '@/components/sections/task/task-form';
import { useNavigate, useSearch } from '@tanstack/react-router';

type CategoryBodyProps = {
    cId: string;
    formVisible: boolean;
    setFormVisible: React.Dispatch<React.SetStateAction<boolean>>;
    scrollableRef: React.MutableRefObject<HTMLDivElement | null>;
}

export default function CategoryBody({ cId, formVisible, setFormVisible, scrollableRef }: CategoryBodyProps) {
    const navigate = useNavigate();
    const { page, search, sortBy, sortOrder, limit } = useSearch({ from: '/categories/$categoryId' });

    const taskQuery = useQuery({
        queryKey: ['all-tasks', cId, page, search, sortBy, sortOrder, limit],
        queryFn: () => getAllTasksByCategoryId({ cId, page, search, sortBy, sortOrder, limit }),
    });

    useEffect(() => {
        if (taskQuery.status === 'error') {
            console.error(taskQuery.error);
            if (taskQuery.error) {
                addToast({
                    color: 'danger',
                    title: 'Error',
                    description: taskQuery.error.message,
                });
            }
        }
    }, [taskQuery.error]);

    const handlePageChange = (newPage: number) => {
        navigate({
            search: (prev) => ({ ...prev, page: newPage }),
            from: '/categories/$categoryId'
        });
    };

    const handleLimitChange = (limit: number) => {
        navigate({
            search: () => ({ page: 1, search, sortBy, sortOrder, limit }),
            from: '/categories/$categoryId'
        });
    };

    return (
        <CardBody className='h-[60vh]'>
            <ScrollShadow hideScrollBar className='space-y-2' ref={scrollableRef}>
                {formVisible && <TaskForm setFormVisible={setFormVisible} />}
                {!taskQuery.isLoading && !taskQuery.isPending && taskQuery.isSuccess && (
                    taskQuery.data.payload.tasks.length < 1 ? (
                        <NothingToShow name='task' />
                    ) : (
                        <>
                            {taskQuery.data.payload.tasks.map((t) => (
                                <Task key={t._id} {...t} />
                            ))}
                        </>
                    )
                )}
                {(taskQuery.isLoading || taskQuery.isPending) && <LoadingContent />}
                {!taskQuery.isLoading && taskQuery.isError && <SomethingWentWrong />}
                {!taskQuery.isLoading && taskQuery.isSuccess && (
                    <div className='grid place-items-center pt-8 pb-20 gap-4'>
                        <div className='flex flex-nowrap gap-2 justify-between items-center w-11/12'>
                            <Pagination
                                loop showControls showShadow
                                variant='bordered'
                                color="default"
                                page={taskQuery.data.payload.pagination.currentPage}
                                total={taskQuery.data.payload.pagination.totalPages}
                                onChange={handlePageChange}
                            />
                            <Select
                                className="max-w-20"
                                label='Limit'
                                selectedKeys={[String(limit)]}
                                variant="bordered"
                                onSelectionChange={(l) => handleLimitChange(Number(l.anchorKey))}
                            >
                                {[5, 10, 20, 40, 50].map((item) => {
                                    return (
                                        <SelectItem textValue={String(item)} key={item}>{item}</SelectItem>
                                    )
                                })}
                            </Select>
                        </div>
                    </div>
                )}
            </ScrollShadow>
        </CardBody>
    )
}
