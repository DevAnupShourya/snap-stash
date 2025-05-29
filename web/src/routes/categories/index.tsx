import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/categories/')({
  component: RouteComponent,
})

import { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  Card, CardHeader, CardBody, CardFooter,
  Divider,
  Input,
  Button,
  Tooltip,
  Kbd,
  ScrollShadow,
  addToast,
} from "@heroui/react";
import { cn } from '@/utils/helper-functions';

import Category from '@/components/sections/category';
import { ArrowUpToLine, Plus, Search } from 'lucide-react';
import { getCategories } from '@/services/category.service';
import SomethingWentWrong from '@/components/sections/error';
import LoadingContent from '@/components/sections/loader';
import CategoryForm from '@/components/sections/category-form';
import NothingToShow from '@/components/sections/nothing-to-show';

function RouteComponent() {
  const [isCreatingNewCategory, setIsCreatingNewCategory] = useState(false);

  const query = useQuery({
    queryKey: ['all-categories'],
    queryFn: getCategories,
  });

  useEffect(() => {
    if (query.status === 'error') {
      console.error(query.error);
      if (query.error) {
        addToast({
          color: 'danger',
          title: 'Error',
          description: query.error.message,
        });
      }
    }
  }, [query.error]);

  return (
    <section className='grid place-items-center'>
      <Card className="w-screen sm:w-[70vw] md:w-[60vw] lg:w-[50vw] min-h-full">

        <CardHeader className="flex gap-2">
          <Input
            placeholder="Search Category"
            startContent={
              <Search className="size-5 pointer-events-none flex-shrink-0" />
            }
            type="text"
          />
          <Tooltip size='sm' content={<p>Add new Category <Kbd keys={['alt']}>+ /</Kbd></p>}>
            <Button
              variant={isCreatingNewCategory ? 'solid' : 'faded'}
              color='danger'
              isIconOnly
              onPress={() => { setIsCreatingNewCategory(!isCreatingNewCategory) }}
            >
              <Plus className={cn(
                'size-5 pointer-events-none flex-shrink-0 transition-transform',
                isCreatingNewCategory ? 'rotate-45' : 'rotate-0'
              )} />
            </Button>
          </Tooltip>
        </CardHeader>

        <Divider />

        <Tooltip size='sm' content='Back to top'>
          <Button variant='light' isIconOnly onPress={() => { }} className={cn(
            'z-20 absolute right-6 backdrop-blur-sm opacity-50 hover:opacity-100',
            isCreatingNewCategory ? 'bottom-28' : 'bottom-4'
          )}>
            <ArrowUpToLine className="size-5" />
          </Button>
        </Tooltip>

        <CardBody className='h-[60vh]'>
          <ScrollShadow hideScrollBar className='space-y-2'>
            {query.isPending && <LoadingContent />}
            {!query.isLoading && query.isError && <SomethingWentWrong />}
            {query.isSuccess && (
              query.data.categories.length < 1 ? (
                <NothingToShow name='task' />
              ) : (
                query.data.categories.map((c) => {
                  return (
                    <Category key={c._id} {...c} />
                  )
                })
              )
            )}
          </ScrollShadow>
        </CardBody>

        <section
          className={cn(
            'absolute w-full bottom-0 left-0 bg-content2/20 backdrop-blur-sm transition-opacity',
            isCreatingNewCategory ? 'animate-fadeIn' : 'animate-fadeOut pointer-events-none'
          )}
        >
          <Divider />
          <CardFooter className='z-10'>
            <CategoryForm />
          </CardFooter>
        </section>

      </Card>
    </section >
  )
}
