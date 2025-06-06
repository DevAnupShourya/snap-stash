import {
  Link as LinkComp,
  Navbar as HeroUINavbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  Button,
  Tooltip
} from "@heroui/react";
import { useAuthContext } from "@/context/auth";

import { Link, useNavigate } from "@tanstack/react-router";
import { ThemeSwitch } from "@/components/theme-switch";

import { Logo } from "@/components/icons";
import { LogOut } from "lucide-react";
import { useMutation } from '@tanstack/react-query';

import { logoutAuth } from "@/services/auth.service";
import { addToast } from '@heroui/react';

export default function Navbar() {
  const { isAuthenticated, logout } = useAuthContext();

  const navigate = useNavigate();
  const logoutMutation = useMutation({
    mutationFn: logoutAuth,
    onSuccess: (res) => {
      // ? reset localstorage
      logout();

      // ? Navigate user after success authentication
      navigate({
        to: '/',
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
      console.error('Failed to logout!!!')
      console.error(e);

      addToast({
        variant: 'solid',
        color: 'danger',
        title: 'Error',
        description: `${e.message}`
      })
    }
  })


  return (
    <HeroUINavbar maxWidth="xl" position="sticky">
      <NavbarContent className="basis-1/5 sm:basis-full" justify="start">
        <NavbarBrand className="gap-3 max-w-fit">
          <LinkComp
            as={Link}
            className="flex justify-start items-center gap-2"
            color="foreground"
            to="/"
          >
            <Logo />
            <p className="font-bold text-inherit text-xl">SnapStash</p>
          </LinkComp>
        </NavbarBrand>
      </NavbarContent>

      <NavbarContent
        className="flex basis-1/5 sm:basis-full"
        justify="end"
      >
        <NavbarItem className="flex gap-4 sm:gap-8">
          <ThemeSwitch />
        </NavbarItem>

        {isAuthenticated && (
          <NavbarItem className="flex gap-4 sm:gap-8">
            <Tooltip content='Logout'>
              <Button
                variant="faded"
                color="warning"
                isIconOnly
                isLoading={logoutMutation.isPending}
                onPress={() => { logoutMutation.mutate() }}
              >
                <LogOut className="size-4" />
              </Button>
            </Tooltip>
          </NavbarItem>
        )}
      </NavbarContent>
    </HeroUINavbar>
  )
}
