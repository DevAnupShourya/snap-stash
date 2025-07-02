import { useEffect, useState } from 'react';
import { createFileRoute, useNavigate, useParams, useSearch } from '@tanstack/react-router'
import { useQuery } from '@tanstack/react-query';

import {
  Card, CardHeader,
  Divider,
  Input,
  Button,
  Tooltip,
  Kbd,
  addToast,
  Popover, PopoverTrigger, PopoverContent,
  CheckboxGroup, Checkbox,
  Link,
} from "@heroui/react";
import { ArrowUpToLine, ChevronLeft, Search, Plus, X, ListFilterPlus, ArrowDown01, ArrowDown10 } from 'lucide-react';

import CategoryFooter from '@/components/category/category-footer';
import CategoryBody from '@/components/category/category-body';
import LoadingContent from '@/components/common/loader';
import { cn } from '@/utils/helper-functions';

import { getCategoryByCategoryId } from '@/services/category.service';
import { tasksPaginationParamsSchema } from '@/validation/category';

import { OrderByTask } from '@/config/constants';
import { useBackToTop } from '@/utils/hooks';
import { useDebouncedCallback } from 'use-debounce';

export const Route = createFileRoute('/categories/$categoryId')({
  component: RouteComponent,
  validateSearch: (search) => tasksPaginationParamsSchema.parse(search),
})

function RouteComponent() {
  const [isSearchInputShowing, setIsSearchInputShowing] = useState(false);
  const [isNewTaskCreating, setIsNewTaskCreating] = useState(false)

  const navigate = useNavigate();
  const { isVisible, scrollableRef, scrollToTop } = useBackToTop();

  const { sortBy, sortOrder } = useSearch({ from: '/categories/$categoryId' });
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

  const handleSortBy = (name: string) => {
    navigate({
      search: (prev) => ({ ...prev, sortBy: name as "" | "content" | "done" | "createdAt" | "updatedAt", page: 1 }),
      from: '/categories/$categoryId'
    });
  };

  const handleSearch = useDebouncedCallback((searchValue: string) => {
    navigate({
      search: (prev) => ({ ...prev, search: searchValue, page: 1 }),
      from: '/categories/$categoryId'
    });
  }, 1000);

  const handleSortOrder = () => {
    navigate({
      search: (prev) => ({ ...prev, sortOrder: sortOrder === 'desc' ? 'asc' : 'desc', page: 1 }),
      from: '/categories/$categoryId'
    });
  };

  return (
    <section className='grid place-items-center'>
      {(categoryQuery.isLoading || categoryQuery.isPending) && <LoadingContent />}

      {!(categoryQuery.isLoading || categoryQuery.isPending) && categoryQuery.isSuccess && (
        <Card className="w-screen sm:w-[70vw] md:w-[60vw] lg:w-[50vw] min-h-full">

          <CardHeader className="flex gap-2 justify-between">
            <div className='flex flex-nowrap gap-2 items-center w-full'>
              <Tooltip size='sm' content='Back'>
                <Button
                  as={Link}
                  variant='faded'
                  color='warning'
                  isIconOnly
                  size='sm'
                  // onPress={() => { router.history.back() }}
                  href='/categories'
                >
                  <ChevronLeft className='size-4 pointer-events-none flex-shrink-0 transition-transform' />
                </Button>
              </Tooltip>

              {isSearchInputShowing ? (
                <Input
                  placeholder="Search Task"
                  startContent={
                    <Search className="size-5 pointer-events-none flex-shrink-0" />
                  }
                  type="text"
                  onValueChange={handleSearch}
                  fullWidth
                />
              ) : (
                <h1 className='capitalize text-lg font-semibold tracking-wide'>
                  {categoryQuery.data.payload.name}
                </h1>
              )}
            </div>

            <div className='flex flex-nowrap gap-2 items-center'>
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


              <Popover>
                <PopoverTrigger>
                  <Button
                    variant='solid'
                    color='default'
                    isIconOnly
                  >
                    <ListFilterPlus className='size-5 pointer-events-none flex-shrink-0 transition-transform' />
                  </Button>
                </PopoverTrigger>
                <PopoverContent aria-label="Filter Actions">
                  <CheckboxGroup
                    label="SortBy"
                    value={[sortBy]}
                    onValueChange={(v) => handleSortBy(v[1])}
                  >
                    {OrderByTask.map((item) => {
                      return (
                        <Checkbox key={item.key} value={item.key} classNames={{
                          label: 'flex flex-nowrap gap-2 items-center'
                        }}>
                          <item.icon className='size-4' /> {item.value}
                        </Checkbox>
                      )
                    })}
                  </CheckboxGroup>
                </PopoverContent>
              </Popover>

              <Tooltip size='sm' content={<p>Sort order <Kbd keys={['alt']}>+ o</Kbd></p>}>
                <Button
                  variant='solid'
                  color='default'
                  isIconOnly
                  onPress={handleSortOrder}
                >
                  {sortOrder === 'asc' ? (
                    <ArrowDown01 className='size-5 pointer-events-none flex-shrink-0 transition-transform' />
                  ) : (
                    <ArrowDown10 className='size-5 pointer-events-none flex-shrink-0 transition-transform' />
                  )}
                </Button>
              </Tooltip>

              <Tooltip size='sm' content={<p>Add new Task <Kbd keys={['alt']}>+ /</Kbd></p>}>
                <Button
                  variant={isNewTaskCreating ? 'faded' : 'solid'}
                  color='primary'
                  isIconOnly
                  onPress={() => setIsNewTaskCreating(!isNewTaskCreating)}
                >
                  <Plus className={cn(
                    'size-5 pointer-events-none flex-shrink-0 transition-transform',
                    isNewTaskCreating ? 'rotate-45' : 'rotate-0'
                  )} />
                </Button>
              </Tooltip>
            </div>

          </CardHeader>

          <Divider />

          {isVisible && (
            <Tooltip size='sm' content='Back to top'>
              <Button variant='light' isIconOnly onPress={scrollToTop} className='z-20 absolute bottom-20 right-6 backdrop-blur-sm opacity-50 hover:opacity-100'>
                <ArrowUpToLine className="size-5" />
              </Button>
            </Tooltip>
          )}

          <CategoryBody
            cId={categoryQuery.data.payload._id}
            formVisible={isNewTaskCreating}
            setFormVisible={setIsNewTaskCreating}
            scrollableRef={scrollableRef}
          />
          <CategoryFooter
            cId={categoryQuery.data.payload._id}
          />
        </Card>
      )}

      {!(categoryQuery.isLoading || categoryQuery.isPending) && categoryQuery.isError && (
        <p>Unable to find this page.</p>
      )}
    </section >
  )
}