import { Button, Card, CardHeader } from "@heroui/react";
import { EllipsisVertical, Image } from "lucide-react";

type TaskProps = {
    id: string;
    content: string;
};

export default function Task({ id, content }: TaskProps) {
    return (
        <Card
            key={`${id}`}
            className="w-full sm:w-11/12 mx-auto bg-content2 hover:bg-content2/80 selection:bg-content2/90 group"
        >
            <CardHeader className="gap-4 justify-between">
                <main className="flex flex-nowrap gap-4 items-center justify-between">
                    <Button
                        variant="flat"
                        color="default"
                        radius="full"
                        size="lg"
                        isIconOnly
                    >
                        <Image className="size-4" />
                    </Button>
                    <h1 className="capitalize text-lg font-semibold tracking-wide">task {id}</h1>
                </main>
                <h1 className="text-sm mr-4 opacity-0 hidden group-hover:block group-hover:opacity-100 transition-opacity">{content}</h1>
                <Button
                    variant="light"
                    color="default"
                    radius="sm"
                    size="md"
                    isIconOnly
                    className="opacity-100 group-hover:opacity-0 group-hover:hidden transition-opacity"
                >
                    <EllipsisVertical className="size-4" />
                </Button>
            </CardHeader>
        </Card>
    )
}
