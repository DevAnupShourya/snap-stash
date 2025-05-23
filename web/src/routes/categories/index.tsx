import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/categories/')({
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
} from "@heroui/react";
import { ArrowUpToLine, Plus, Search } from 'lucide-react';
import { useState } from 'react';
import { cn } from '@/utils/helper-functions';
import Category from '@/components/sections/category';

function RouteComponent() {
  const [isCreatingNewCategory, setIsCreatingNewCategory] = useState(false);


  return (
    <section className='grid place-items-center'>
      <Card className="w-screen sm:w-[70vw] md:w-[60vw] lg:w-[50vw] min-h-full">
        <CardHeader className="flex gap-2">
          <Input
            placeholder="Search Category"
            startContent={
              <Search className="size-5 text-default-400 pointer-events-none flex-shrink-0" />
            }
            type="text"
          />
          <Tooltip size='sm' content={<p>Add new Category <Kbd keys={['alt']}>+ /</Kbd></p>}>
            <Button
              variant={isCreatingNewCategory ? 'solid' : 'faded'}
              color='default'
              isIconOnly
              onPress={() => { setIsCreatingNewCategory(!isCreatingNewCategory) }}
            >
              <Plus className={cn(
                'size-5 text-default-400 pointer-events-none flex-shrink-0 transition-transform',
                isCreatingNewCategory ? 'rotate-45' : 'rotate-0'
              )} />
            </Button>
          </Tooltip>
        </CardHeader>
        <Divider />
        <Tooltip size='sm' content='Back to top'>
          <Button variant='light' isIconOnly onPress={() => { }} className={cn(
            'z-20 absolute right-6 backdrop-blur-sm opacity-50 hover:opacity-100',
            isCreatingNewCategory ? 'bottom-14' : 'bottom-4'
          )}>
            <ArrowUpToLine className="size-5" />
          </Button>
        </Tooltip>
        <CardBody className='h-[60vh]'>
          <ScrollShadow hideScrollBar className='space-y-2'>
            {[...Array(50)].map((i, idx) => {
              return (
                <Category key={idx} id={`${idx}`} />
              )
            })}
          </ScrollShadow>
        </CardBody>
        <section
          className={cn(
            'absolute w-full bottom-0 left-0 bg-content2/20 backdrop-blur-sm transition-opacity duration-200',
            isCreatingNewCategory ? 'animate-fadeIn' : 'animate-fadeOut pointer-events-none'
          )}
        >
          <Divider />
          <CardFooter className='z-10'>
            <p>CardFooter</p>
          </CardFooter>
        </section>

      </Card>
    </section >
  )
}
