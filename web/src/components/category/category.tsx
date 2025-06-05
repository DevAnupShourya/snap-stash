import { Link } from "@tanstack/react-router";

import { Button, Card, CardHeader } from "@heroui/react";
import { GripVertical } from "lucide-react";

import { Category } from '@/validation/category';
import { Icons } from "@/config/constants";

export default function CategoryComponent({ _id, color, icon, name, tasks }: Category) {
    return (
        <Card
            as={Link}
            to={`${_id}`}
            className="w-full sm:w-11/12 mx-auto bg-content2 hover:bg-content2/80 selection:bg-content2/90 group"
        >
            <CardHeader className="gap-4 justify-between">
                <main className="flex flex-nowrap gap-4 items-center justify-between">
                    <Button
                        variant="flat"
                        color={color}
                        radius="full"
                        size="lg"
                        isIconOnly
                        className="pointer-events-none"
                    >
                        {Icons.map((i) => {
                            if (i.name === icon) {
                                return (
                                    <i.icon key={`${i.name} icon`} aria-label={`${i.name} icon`} className='size-4' />
                                )
                            }
                        })}
                    </Button>
                    <h1 className="capitalize text-lg font-semibold tracking-wide">{name}</h1>
                </main>
                <h1 className="text-sm mr-4 opacity-0 hidden group-hover:block group-hover:opacity-100 transition-opacity">{tasks.length}</h1>
                <Button
                    variant="light"
                    color="default"
                    radius="sm"
                    size="md"
                    isIconOnly
                    className="opacity-100 group-hover:opacity-0 group-hover:hidden transition-opacity pointer-events-none"
                >
                    <GripVertical className="size-4" />
                </Button>
            </CardHeader>
        </Card>
    )
}
