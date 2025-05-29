import type { NavigateOptions, ToOptions } from '@tanstack/react-router';

import { useRouter } from '@tanstack/react-router';
import { HeroUIProvider } from "@heroui/react";

declare module "@react-types/shared" {
  interface RouterConfig {
    href: ToOptions['to'];
    routerOptions: Omit<NavigateOptions, keyof ToOptions>;
  }
}


export function Provider({ children }: { children: React.ReactNode }) {
  let router = useRouter();

  return (
    <HeroUIProvider
      navigate={(to, options) => router.navigate({ to, ...options })}
      useHref={(to) => router.buildLocation({ to }).href}
    >
      {children}
    </HeroUIProvider>
  );
}
