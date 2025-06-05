import {
  Link as LinkComp,
  Navbar as HeroUINavbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem
} from "@heroui/react";

import { Link } from "@tanstack/react-router";
import { ThemeSwitch } from "@/components/theme-switch";

import { Logo } from "@/components/icons";

export default function Navbar() {
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
      </NavbarContent>
    </HeroUINavbar>
  )
}
