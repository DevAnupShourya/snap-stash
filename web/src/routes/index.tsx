import { useState } from "react";
import { createFileRoute, useNavigate } from '@tanstack/react-router';

import {
  Form,
  InputOtp,
  Button, ButtonGroup
} from "@heroui/react";
import { Eraser, Key } from "lucide-react";

export const Route = createFileRoute('/')({
  component: IndexPage,
});

export default function IndexPage() {
  const navigate = useNavigate();

  const [isMakingAPICall, setIsMakingAPICall] = useState(false)
  const [inputStatus, setInputStatus] = useState<boolean | null>(null);

  function callApiForAuth(e: React.FormEvent<HTMLFormElement>) {
    setIsMakingAPICall(true)
    e.preventDefault();
    let authData = Object.fromEntries(new FormData(e.currentTarget));

    // TODO add basic jwt auth 
    if (authData.pin === import.meta.env.VITE_PIN) {
      setIsMakingAPICall(false);
      setInputStatus(true);
      console.log('Success');

      // ? Navigate user after success authentication
      navigate({
        to: '/categories',
        search: { page: 1, search: '', sortBy: 'createdAt', sortOrder: 'asc', limit: 10 }
      });
    } else {
      setIsMakingAPICall(false);
      setInputStatus(false);
    }
  };

  return (
    <main className="space-y-8">
      <h1 className="text-5xl font-semibold tracking-wider">Your tasks, simplified</h1>
      <p className="text-xl">Create, manage, and conquer your to-do lists with ease</p>
      <Form onSubmit={(e) => callApiForAuth(e)} className="space-y-2">
        <InputOtp
          length={6}
          minLength={6}
          variant="bordered"
          size="lg"
          color={inputStatus === null ? 'primary' : inputStatus === true ? 'success' : 'danger'}
          placeholder="Enter pin"
          name="pin"
        />
        <ButtonGroup>
          <Button type="submit" variant="faded" color="primary" size="lg" startContent={<Key className="size-5" />} isLoading={isMakingAPICall}>
            Enter
          </Button>
          <Button type="reset" variant="faded" color="warning" size="lg" startContent={<Eraser className="size-5" />} isLoading={isMakingAPICall}>
            Clear
          </Button>
        </ButtonGroup>
      </Form>
    </main>
  );
}
