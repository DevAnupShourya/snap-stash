import { Form, InputOtp } from "@heroui/react";

import { createFileRoute } from '@tanstack/react-router'
import { Button } from "@heroui/button";

export const Route = createFileRoute('/')({
  component: IndexPage,
});

export default function IndexPage() {

  return (
      <Form className="w-max space-y-2">
        <InputOtp
          length={6}
          variant="bordered"
          size="lg"
          color="primary"
          placeholder="Enter pin"
        />
        <Button type="submit" variant="solid" color="primary" fullWidth>
          Enter
        </Button>
      </Form>
  );
}
