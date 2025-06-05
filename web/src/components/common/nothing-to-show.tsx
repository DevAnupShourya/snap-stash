import { Card, CardHeader } from "@heroui/react";
import { ListPlus } from "lucide-react";

export default function NothingToShow({ name }: { name: string }) {
    return (
        <div className="grid place-items-center size-full min-h-96">
            <Card className="bg-warning-50 shadow-2xl border border-warning-500 p-4">
                <CardHeader className="flex gap-4">
                    <ListPlus className="size-12 text-warning-500" />
                    <div className="flex flex-col">
                        <p className="text-lg text-warning-700">No {name} to show</p>
                        <p className="text-small text-warning-800">Create {name} to add here.</p>
                    </div>
                </CardHeader>
            </Card>
        </div>
    )
}
