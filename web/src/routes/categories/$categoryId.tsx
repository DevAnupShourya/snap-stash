import { createFileRoute, useParams, useRouter } from '@tanstack/react-router'

export const Route = createFileRoute('/categories/$categoryId')({
  component: RouteComponent,
})


import {
  Card, CardHeader, CardBody, CardFooter,
  Divider,
  Input,
  Button,
  Tooltip,
  Kbd,
  ScrollShadow,
  CircularProgress,
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@heroui/react";
import { ArrowUpToLine, ChevronLeft, Search, Plus, Bolt } from 'lucide-react';
import { useState } from 'react';
import { cn } from '@/utils/helper-functions';
import Task from '@/components/sections/task';

function RouteComponent() {
  const router = useRouter();
  const { categoryId } = useParams({ from: '/categories/$categoryId' })
  const [isSearchInputShowing, setIsSearchInputShowing] = useState(false);

  return (
    <section className='grid place-items-center'>
      <Card className="w-screen sm:w-[70vw] md:w-[60vw] lg:w-[50vw] min-h-full">
        <CardHeader className="flex gap-2 justify-between">
          <div className='flex flex-nowrap gap-4 items-center w-full'>
            <Tooltip size='sm' content='Back'>
              <Button
                variant='faded'
                color='default'
                isIconOnly
                onPress={() => { router.history.back() }}
              >
                <ChevronLeft className='size-5 text-default-400 pointer-events-none flex-shrink-0 transition-transform' />
              </Button>
            </Tooltip>

            {isSearchInputShowing ? (
              <Input
                placeholder="Search Tasks"
                startContent={
                  <Search className="size-5 text-default-400 pointer-events-none flex-shrink-0" />
                }
                type="text"
                fullWidth
              />
            ) : (
              <h1 className='capitalize text-lg font-semibold tracking-wide'>{categoryId}</h1>
            )}
          </div>

          <div className='flex flex-nowrap gap-4 items-center'>
            <Tooltip size='sm' content='Search'>
              <Button
                variant='faded'
                color='default'
                isIconOnly
                onPress={() => { setIsSearchInputShowing(!isSearchInputShowing) }}
              >
                <Search className='size-5 text-default-400 pointer-events-none flex-shrink-0 transition-transform' />
              </Button>
            </Tooltip>

            <Tooltip size='sm' content={<p>Add new Task <Kbd keys={['alt']}>+ /</Kbd></p>}>
              <Button
                variant='faded'
                color='default'
                isIconOnly
              >
                <Plus className='size-5 text-default-400 pointer-events-none flex-shrink-0 transition-transform' />
              </Button>
            </Tooltip>
          </div>

        </CardHeader>
        <Divider />

        <Tooltip size='sm' content='Back to top'>
          <Button variant='light' isIconOnly onPress={() => { }} className='z-20 absolute bottom-20 right-6 backdrop-blur-sm opacity-50 hover:opacity-100'>
            <ArrowUpToLine className="size-5" />
          </Button>
        </Tooltip>

        <CardBody className='h-[60vh]'>
          <ScrollShadow hideScrollBar className='space-y-2'>
            {[...Array(50)].map((i, idx) => {
              return (
                <Task key={idx} id={`${idx}`} content='task' />
              )
            })}
          </ScrollShadow>
        </CardBody>
        <section
          className='absolute w-full bottom-0 left-0 bg-content2/20 backdrop-blur-sm transition-opacity duration-200'>
          <Divider />
          <CardFooter className='flex flex-nowrap justify-between items-center'>
            <div className='flex flex-nowrap justify-between items-center gap-4'>
              <CircularProgress
                aria-label="Completed Tasks"
                color="warning"
                showValueLabel={true}
                size="md"
                value={40}
              />
              <h1 className="uppercase text-sm font-semibold tracking-wide">Completed 3/14</h1>

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
        </section>

      </Card>
    </section >
  )
}
