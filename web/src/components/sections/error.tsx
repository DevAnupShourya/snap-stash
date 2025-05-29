import { Card, CardHeader } from "@heroui/react";
import { AlertTriangle } from "lucide-react";

export default function SomethingWentWrong() {
    return (
        <div className="grid place-items-center size-full min-h-96">
            <Card className="bg-danger-50 shadow-2xl border border-danger-500">
                <CardHeader className="flex gap-4">
                    <AlertTriangle className="size-12 text-danger-500" />
                    <div className="flex flex-col">
                        <p className="text-lg text-danger-700">Something went wrong</p>
                        <p className="text-small text-danger-800">Please try again later or refresh the page.</p>
                    </div>
                </CardHeader>
            </Card>
        </div>
    )
}
