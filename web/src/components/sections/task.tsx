import { Button, Card, CardHeader, Divider } from "@heroui/react";
import { Circle, CircleCheck, Pencil, X } from "lucide-react";
import { Task } from '@/types/task';

export default function TaskComponent({ _id, categoryId, content, createdAt, done, updatedAt }: Task) {
    return (
        <Card
            key={_id}
            className="w-full sm:w-11/12 mx-auto bg-content2 hover:bg-content2/80 selection:bg-content2/90 group"
        >
            <CardHeader className="gap-4 justify-between">
                <main className="flex flex-nowrap gap-4 items-center justify-between">
                    <Button
                        variant={done ? 'solid' : 'flat'}
                        color={done ? 'primary' : 'default'}
                        radius="full"
                        size="lg"
                        isIconOnly
                    >
                        {done ? (<CircleCheck className="size-6" />) : (<Circle className="size-6" />)}
                    </Button>
                    <h1 className="capitalize text-lg font-semibold tracking-wide">{content}</h1>
                </main>
                <aside className="flex flex-nowrap gap-2 items-center justify-between opacity-0 group-hover:opacity-100 transition-opacity">
                    <Divider orientation="vertical" className="h-10 mr-2" />
                    <Button
                        variant="light"
                        color="warning"
                        radius="sm"
                        size="md"
                        isIconOnly
                    >
                        <Pencil className="size-4" />
                    </Button>
                    <Button
                        variant="light"
                        color="danger"
                        radius="sm"
                        size="md"
                        isIconOnly
                    >
                        <X className="size-4" />
                    </Button>
                </aside>
            </CardHeader>
        </Card>
    )
}
