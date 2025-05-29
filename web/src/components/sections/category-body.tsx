import { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';

import { getAllTasksByCategoryId } from '@/services/task.service';

import {
    CardBody,
    ScrollShadow,
    addToast,
} from "@heroui/react";
import Task from '@/components/sections/task';
import SomethingWentWrong from '@/components/sections/error';
import LoadingContent from '@/components/sections/loader';
import NothingToShow from '@/components/sections/nothing-to-show';

export default function CategoryBody({ cId }: { cId: string }) {
    const taskQuery = useQuery({
        queryKey: ['tasks', cId],
        queryFn: () => getAllTasksByCategoryId(cId),
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

    return (
        <CardBody className='h-[60vh]'>
            <ScrollShadow hideScrollBar className='space-y-2'>
                {!taskQuery.isLoading && taskQuery.isSuccess && (
                    taskQuery.data.tasks.length < 1 ? (
                        <NothingToShow name='task' />
                    ) : (
                        taskQuery.data.tasks.map((t) => {
                            return (
                                <Task key={t._id} {...t} />
                            )
                        })
                    )
                )}
                {!taskQuery.isLoading && taskQuery.isPending && <LoadingContent />}
                {taskQuery.isError && <SomethingWentWrong />}
            </ScrollShadow>
        </CardBody>
    )
}
