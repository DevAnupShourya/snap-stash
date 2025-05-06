import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/register')({
  component: RouteComponent,
})

import { useState } from 'react';
import { Form, Input, Button, Chip } from "@heroui/react";
import { UserRegisterInputType } from '@/types/form-types';

function RouteComponent() {
  const [formSubmitted, setFormSubmitted] = useState<UserRegisterInputType | null>(null);
  const [emailSendProcessing, setEmailSendProcessing] = useState<boolean>(false);

  const onSubmit = (e: { preventDefault: () => void; currentTarget: HTMLFormElement | undefined; }) => {
    e.preventDefault();
    const formData = Object.fromEntries(new FormData(e.currentTarget));
    setEmailSendProcessing(true);
    // hit api with form data (use react query)
    setFormSubmitted(formData);
    setEmailSendProcessing(false);
  };

  return (
    <Form className="w-full max-w-md space-y-8" onSubmit={onSubmit}>
      <Input
        isRequired
        errorMessage="Please enter a valid name"
        label="Name"
        labelPlacement="outside"
        name="full_name"
        placeholder="Name"
        type="text"
        isClearable
      />
      <Input
        isRequired
        errorMessage="Please enter a valid email"
        label="Email"
        labelPlacement="outside"
        name="email"
        placeholder="Email"
        type="email"
        isClearable
      />
      <div className='space-y-4'>
        <Button type="submit" variant="bordered" isLoading={emailSendProcessing}>
          Get Magic Link
        </Button>
        <br />
        {formSubmitted && (
          <Chip color="success" size='sm' variant='flat'>Link sent to `{formSubmitted.email.toLowerCase()}`. CLick to verify.</Chip>
        )}
      </div>
    </Form>
  )
}
