
import { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import {
    CardFooter,
    Divider,
    Button,
    CircularProgress,
    Popover,
    PopoverTrigger,
    PopoverContent,
    addToast,
} from "@heroui/react";
import { Bolt } from 'lucide-react';

import { getStatsByCategoryId } from '@/services/task.service';

export default function CategoryFooter({ cId }: { cId: string }) {
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

    return (
        <section className='absolute w-full bottom-0 left-0 bg-content2/20 backdrop-blur-sm transition-opacity duration-200'>
            <Divider />
            {statsQuery.isSuccess && (
                <CardFooter className='flex flex-nowrap justify-between items-center'>
                    <div className='flex flex-nowrap justify-between items-center gap-4'>
                        <CircularProgress
                            aria-label="Completed Tasks"
                            color="warning"
                            showValueLabel={true}
                            size="md"
                            value={statsQuery.data.completionRate}
                        />
                        <h1 className="uppercase text-sm font-semibold tracking-wide">Completed {statsQuery.data.completedTasks}/{statsQuery.data.totalTasks}</h1>

                    </div>

                    <Popover
                        color='warning'
                        placement="top-end"
                    >
                        <PopoverTrigger>
                            <Button
                                variant='faded'
                                color='warning'
                                isIconOnly
                            >
                                <Bolt className='size-5 pointer-events-none flex-shrink-0 transition-transform' />
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent>
                            PopoverContent
                        </PopoverContent>
                    </Popover>
                </CardFooter>
            )}
        </section>

    )
}
