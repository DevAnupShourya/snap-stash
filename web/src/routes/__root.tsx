import { Link as LinkComp } from "@heroui/react";
import { Link } from "@tanstack/react-router";
import { createRootRoute, Outlet } from '@tanstack/react-router'
import { Navbar } from "@/components/navbar";


export const Route = createRootRoute({
  component: () => (
    <div className="relative flex flex-col h-screen">
      <Navbar />
      <main className="container mx-auto max-w-7xl px-6 flex-grow pt-16">
        <Outlet />
      </main>
      <footer className="w-full flex items-center justify-center py-3">
        <LinkComp
          as={Link}
          isExternal
          className="flex items-center gap-1 text-current"
          to={"https://heroui.com" as any}
          title="heroui.com homepage"
        >
          <span className="text-default-600">Powered by</span>
          <p className="text-primary">HeroUI</p>
        </LinkComp>
      </footer>
    </div>
  ),
})