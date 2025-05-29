import { createFileRoute, notFound, useParams, useRouter } from '@tanstack/react-router'

import { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  Card, CardHeader,
  Divider,
  Input,
  Button,
  Tooltip,
  Kbd,
  addToast,
} from "@heroui/react";
import { ArrowUpToLine, ChevronLeft, Search, Plus, Bolt, X } from 'lucide-react';
import CategoryFooter from '@/components/sections/category-footer';
import CategoryBody from '@/components/sections/category-body';
import { getCategoryByCategoryId } from '@/services/task.service';
import LoadingContent from '@/components/sections/loader';

export const Route = createFileRoute('/categories/$categoryId')({
  component: RouteComponent
})

function RouteComponent() {
  const [isSearchInputShowing, setIsSearchInputShowing] = useState(false);

  const router = useRouter();
  const { categoryId } = useParams({ from: '/categories/$categoryId' })

  const categoryQuery = useQuery({
    queryKey: ['category', categoryId],
    queryFn: () => getCategoryByCategoryId(categoryId),
  });

  useEffect(() => {
    if (categoryQuery.status === 'error' && categoryQuery.error) {
      addToast({
        color: 'danger',
        title: 'Error',
        description: categoryQuery.error.message,
      });
    }
  }, [categoryQuery.status]);


  return (
    <section className='grid place-items-center'>
      {categoryQuery.isLoading && <LoadingContent />}
      {!categoryQuery.isLoading && categoryQuery.isSuccess && (
        <Card className="w-screen sm:w-[70vw] md:w-[60vw] lg:w-[50vw] min-h-full">

          <CardHeader className="flex gap-2 justify-between">
            <div className='flex flex-nowrap gap-4 items-center w-full'>
              <Tooltip size='sm' content='Back'>
                <Button
                  variant='faded'
                  color='warning'
                  isIconOnly
                  onPress={() => { router.history.back() }}
                >
                  <ChevronLeft className='size-5 pointer-events-none flex-shrink-0 transition-transform' />
                </Button>
              </Tooltip>

              {isSearchInputShowing ? (
                <Input
                  placeholder="Search Tasks"
                  startContent={
                    <Search className="size-5 pointer-events-none flex-shrink-0" />
                  }
                  type="text"
                  fullWidth
                />
              ) : (
                <h1 className='capitalize text-lg font-semibold tracking-wide'>
                  {categoryQuery.data?.data.name}
                </h1>
              )}
            </div>

            <div className='flex flex-nowrap gap-4 items-center'>
              {isSearchInputShowing ? (
                <Tooltip size='sm' content='Close'>
                  <Button
                    variant='faded'
                    color='warning'
                    isIconOnly
                    onPress={() => { setIsSearchInputShowing(!isSearchInputShowing) }}
                  >
                    <X className='size-5 pointer-events-none flex-shrink-0 transition-transform' />
                  </Button>
                </Tooltip>
              ) : (
                <Tooltip size='sm' content='Search'>
                  <Button
                    variant='faded'
                    color='default'
                    isIconOnly
                    onPress={() => { setIsSearchInputShowing(!isSearchInputShowing) }}
                  >
                    <Search className='size-5 pointer-events-none flex-shrink-0 transition-transform' />
                  </Button>
                </Tooltip>
              )}



              <Tooltip size='sm' content={<p>Add new Task <Kbd keys={['alt']}>+ /</Kbd></p>}>
                <Button
                  variant='solid'
                  color='primary'
                  isIconOnly
                >
                  <Plus className='size-5 pointer-events-none flex-shrink-0 transition-transform' />
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

          <CategoryBody cId={categoryQuery.data.data._id} />
          <CategoryFooter cId={categoryQuery.data.data._id} />
        </Card>
      )}
      {!categoryQuery.isLoading && categoryQuery.isError && (
        <p>Unable to find this page.</p>
      )}
    </section >
  )
}