import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/dashboard')({
  component: RouteComponent,
})

import {
  Input,
  Popover, PopoverTrigger, PopoverContent,
  Button,
  Tabs, Tab,
  Card, CardBody
} from "@heroui/react";
import { SearchIcon, FilterIcon, AddIcon, TickIcon, KanbanIcon, ListIcon, TableIcon } from '@/components/icons';
import { useState } from 'react';
import { Tags } from '@/config/constants';
import { TaskLayoutView } from '@/types/data';
import TaskCard from '@/components/task-card';

function RouteComponent() {
  const [selectedTag, setSelectedTag] = useState('');
  const [selectedView, setSelectedView] = useState<TaskLayoutView>("card");


  return (
    <section className='size-full space-y-8 py-2 md:py-4'>
      <div data-id='header' className="flex justify-between items-center flex-wrap gap-4 flex-col-reverse md:flex-row">
        <div className='grid place-items-center w-full md:w-fit'>
          <Tabs
            aria-label="Layout View"
            color="secondary"
            variant="solid"
            selectedKey={selectedView}
            onSelectionChange={setSelectedView}
          >
            <Tab
              key="card"
              title={
                <div className="flex items-center space-x-2">
                  <KanbanIcon className='size-4' />
                  <span>Card</span>
                </div>
              }
            />
            <Tab
              key="table"
              title={
                <div className="flex items-center space-x-2">
                  <ListIcon className='size-4' />
                  <span>Table</span>
                </div>
              }
            />
            <Tab
              key="list"
              title={
                <div className="flex items-center space-x-2">
                  <TableIcon className='size-4' />
                  <span>List</span>
                </div>
              }
            />
          </Tabs>
        </div>
        <div className='w-fit flex gap-2 items-center'>
          <Input
            placeholder="Search here"
            type="text"
            variant='faded'
            size='md'
            isClearable
            startContent={<SearchIcon className='size-5' />}
          />

          <Popover placement="bottom-end">
            <PopoverTrigger>
              <Button
                variant="faded"
                size='md'
                startContent={<FilterIcon className='size-5' />}
              >
                Filter
              </Button>
            </PopoverTrigger>
            <PopoverContent>
              <div className='space-y-2'>
                <p className='text-tiny text-foreground-500'>By Tag</p>
                <div className="grid grid-cols-3 gap-2 items-center">
                  {Tags.map((tag) => {
                    return (
                      <Button
                        key={tag.name}
                        size="sm"
                        variant={selectedTag === tag.name ? 'solid' : 'faded'}
                        color={selectedTag === tag.name ? 'secondary' : 'default'}
                        startContent={<tag.icon className='size-4' />}
                        name={tag.name}
                        onPress={() => { selectedTag === tag.name ? setSelectedTag('') : setSelectedTag(tag.name) }}
                        endContent={selectedTag === tag.name ? (<TickIcon className='size-6' />) : null}
                        className='capitalize'
                      >
                        {tag.name}
                      </Button>
                    )
                  })}
                </div>
              </div>
            </PopoverContent>
          </Popover>

          <Button
            variant="shadow"
            size='md'
            color='primary'
            startContent={<AddIcon className='size-5' />}
          >
            Add
          </Button>
        </div>

      </div>
      <main data-id='list' className='grid grid-cols-3 md:grid-cols-2 lg:grid-cols-3 gap-4'>
        {selectedView}
        <TaskCard />
      </main>
    </section >
  )
}
