import { Spinner } from "@heroui/react";

export default function LoadingContent() {
    return (
        <div className="grid place-items-center size-full min-h-96">
            <Spinner label="Loading" variant="simple" />
        </div>
    )
}
