import { Card, CardHeader, CardBody, CardFooter, Divider, Link as LinkComp } from "@heroui/react";
import { Link } from "@tanstack/react-router";

function TaskCard() {
    return (
        <Card className="max-w-[400px]">
            <CardHeader className="flex gap-3">
                <div className="flex flex-col">
                    <p className="text-small text-default-500">heroui.com</p>
                </div>
            </CardHeader>
            <Divider />
            <CardBody>
                <p className="text-md">HeroUI</p>
                <p>Make beautiful websites regardless of your design experience.</p>
            </CardBody>
            <Divider />
            <CardFooter>
                <LinkComp as={Link} isExternal showAnchorIcon to="https://github.com/heroui-inc/heroui">
                    Visit source code on GitHub.
                </LinkComp>
            </CardFooter>
        </Card>
    )
}

export default TaskCard;