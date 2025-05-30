import { createFileRoute, useNavigate, useSearch } from '@tanstack/react-router'

export const Route = createFileRoute('/categories/')({
  component: RouteComponent,
  validateSearch: (search) => paginationParamsSchema.parse(search),
})

import { useEffect, useRef, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  Card, CardHeader, CardBody, CardFooter,
  Divider,
  Input,
  Button,
  Tooltip,
  Kbd,
  ScrollShadow,
  Pagination,
  addToast,
  Checkbox,
  CheckboxGroup,
  Popover,
  PopoverTrigger,
  PopoverContent,
  Select,
  SelectItem,
} from "@heroui/react";
import { cn } from '@/utils/helper-functions';

import { paginationParamsSchema } from '@/types/category';

import Category from '@/components/sections/category';
import { getCategories } from '@/services/category.service';
import SomethingWentWrong from '@/components/sections/error';
import LoadingContent from '@/components/sections/loader';
import CategoryForm from '@/components/sections/category-form';
import NothingToShow from '@/components/sections/nothing-to-show';

import { ArrowDown01, ArrowDown10, ArrowUpToLine, ListFilterPlus, Plus, Search } from 'lucide-react';
import { OrderBy } from '@/config/constants';
import { useBackToTop } from '@/utils/hooks';

function RouteComponent() {
  const [isCreatingNewCategory, setIsCreatingNewCategory] = useState(false);
  const { isVisible, scrollableRef, scrollToTop } = useBackToTop();

  const navigate = useNavigate();
  const { page, search, sortBy, sortOrder, limit } = useSearch({ from: '/categories/' });

  const allCategoriesQuery = useQuery({
    queryKey: ['all-categories', page, search, sortBy, sortOrder],
    queryFn: () => getCategories({ page, search, sortBy, sortOrder, limit }),
  });

  const handlePageChange = (newPage: number) => {
    navigate({
      search: (prev) => ({ ...prev, page: newPage }),
      from: '/categories'
    });
  };

  const handleSearch = (searchValue: string) => {
    navigate({
      search: (prev) => ({ ...prev, search: searchValue, page: 1 }),
      from: '/categories'
    });
  };

  const handleSortBy = (name: string) => {
    navigate({
      search: (prev) => ({ ...prev, sortBy: name as "" | "name" | "createdAt" | "updatedAt", page: 1 }),
      from: '/categories'
    });
  };

  const handleSortOrder = () => {
    navigate({
      search: (prev) => ({ ...prev, sortOrder: sortOrder === 'desc' ? 'asc' : 'desc', page: 1 }),
      from: '/categories'
    });
  };

  const handleLimitChange = (limit: number) => {
    navigate({
      search: () => ({ page: 1, search, sortBy, sortOrder, limit }),
      from: '/categories'
    });
  };


  useEffect(() => {
    if (allCategoriesQuery.status === 'error') {
      console.error(allCategoriesQuery.error);
      if (allCategoriesQuery.error) {
        addToast({
          color: 'danger',
          title: 'Error',
          description: allCategoriesQuery.error.message,
        });
      }
    }
  }, [allCategoriesQuery.error]);

  useEffect(() => {
    allCategoriesQuery.refetch();
  }, [limit])

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
            onValueChange={handleSearch}
            isClearable
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
                {OrderBy.map((item) => {
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

        </CardHeader>

        <Divider />

        {isVisible && (
          <Tooltip size='sm' content='Back to top'>
            <Button variant='faded' color='warning' isIconOnly onPress={scrollToTop} className={cn(
              'z-20 absolute right-6 backdrop-blur-sm opacity-50 hover:opacity-100',
              isCreatingNewCategory ? 'bottom-28' : 'bottom-4'
            )}>
              <ArrowUpToLine className="size-5" />
            </Button>
          </Tooltip>
        )}

        <CardBody className='h-[60vh]'>
          <ScrollShadow hideScrollBar className='space-y-2' ref={scrollableRef}>
            {(allCategoriesQuery.isPending || allCategoriesQuery.isLoading) && <LoadingContent />}
            {!allCategoriesQuery.isLoading && allCategoriesQuery.isError && <SomethingWentWrong />}
            {!allCategoriesQuery.isLoading && allCategoriesQuery.isSuccess && (
              allCategoriesQuery.data.categories.length < 1 ? (
                <NothingToShow name='task' />
              ) : (
                allCategoriesQuery.data.categories.map((c) => {
                  return (
                    <Category key={c._id} {...c} />
                  )
                })
              )
            )}
            {!allCategoriesQuery.isLoading && allCategoriesQuery.isSuccess && (
              <div className='grid place-items-center py-6 gap-4'>
                <div className='flex flex-nowrap gap-2 justify-between items-center w-11/12'>
                  <Pagination
                    loop showControls showShadow
                    variant='bordered'
                    color="default"
                    page={allCategoriesQuery.data.pagination.currentPage}
                    total={allCategoriesQuery.data.pagination.totalPages}
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
