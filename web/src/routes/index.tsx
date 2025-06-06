import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { useMutation } from "@tanstack/react-query";

import {
  Form,
  InputOtp,
  Button, ButtonGroup,
  addToast
} from "@heroui/react";
import { Eraser, Key } from "lucide-react";

import { register } from "@/services/auth.service";
import { useAuthContext } from "@/context/auth";

export const Route = createFileRoute('/')({
  component: IndexPage,
});

export default function IndexPage() {
  const navigate = useNavigate();
  const { login } = useAuthContext();

  const authMutation = useMutation({
    mutationFn: register, 
    onSuccess: (res) => {
      login({
        sessionId: res.payload.sessionId,
        expiresAt: res.payload.expiresAt
      });

      // ? Navigate user after success authentication
      navigate({
        to: '/categories',
        search: { page: 1, search: '', sortBy: 'createdAt', sortOrder: 'asc', limit: 10 }
      });

      // ? Tell user
      addToast({
        variant: 'solid',
        color: 'success',
        title: 'Done',
        description: `${res.message}`
      })
    },
    onError: (e) => {
      console.error('Failed to authorize you!!!')
      console.error(e);

      addToast({
        variant: 'solid',
        color: 'danger',
        title: 'Error',
        description: `${e.message}`
      })
    }
  })


  function authSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    let authData = Object.fromEntries(new FormData(e.currentTarget));

    // * Convert pin to number since FormData gives strings
    const pin = parseInt(authData.pin as string, 10);

    // * Validate pin is 6 digits
    if (isNaN(pin) || pin < 100000 || pin > 999999) {
      addToast({
        variant: 'solid',
        color: 'danger',
        title: 'Invalid PIN',
        description: 'Please enter a valid 6-digit PIN'
      });
      return;
    }

    authMutation.mutate(pin);
  }

  return (
    <main className="space-y-8">
      <h1 className="text-5xl font-semibold tracking-wider">Your tasks, simplified</h1>
      <p className="text-xl">Create, manage, and conquer your to-do lists with ease</p>
      <Form onSubmit={(e) => authSubmit(e)} className="space-y-2">
        <InputOtp
          length={6}
          minLength={6}
          variant="bordered"
          size="lg"
          placeholder="Enter pin"
          name="pin"
          isRequired
        />
        <ButtonGroup>
          <Button type="submit"
            variant="faded"
            color="primary"
            size="lg"
            startContent={<Key className="size-5" />}
            isLoading={authMutation.isPending}
          >
            Enter
          </Button>
          <Button type="reset" variant="faded" color="warning" size="lg" startContent={<Eraser className="size-5" />}>
            Clear
          </Button>
        </ButtonGroup>
      </Form>
    </main>
  );
}
