import { Link, useNavigate } from "@tanstack/react-router";
import { createRootRoute, Outlet } from '@tanstack/react-router'

import { addToast, Link as LinkComp } from "@heroui/react";
import Navbar from "@/components/navbar";
import { useAuthContext } from "@/context/auth";
import { useEffect } from "react";

export const Route = createRootRoute({
  component: RootLayout
});

export default function RootLayout() {
  const { isAuthenticated } = useAuthContext();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate({ to: '/' });
      addToast({
        variant: 'solid',
        color: 'danger',
        title: 'Unauthorized Access',
        description: 'Kindly Login with correct credentials!!'
      });
    }
  }, [isAuthenticated, navigate]);

  return (
    <div className="relative flex flex-col h-screen container mx-auto max-w-7xl custom-font">
      <Navbar />
      <main className="flex-grow grid place-items-center">
        <Outlet />
      </main>
      <footer className="w-full py-4">
        <p className="flex items-center justify-center gap-2">
          <span className="text-default-600">Powered by</span>
          <LinkComp
            as={Link}
            isExternal
            className="flex items-center gap-1 text-current"
            to="https://cloudflare.com"
            title="cloudflare.com homepage"
          >
            <span className="text-primary">Cloudflare Pages</span>
          </LinkComp>
        </p>
      </footer>
    </div>
  )
}