import {
  Button,
  Link as LinkComp,
  Navbar as HeroUINavbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  User
} from "@heroui/react";
import { Link } from "@tanstack/react-router";
import { ThemeSwitch } from "@/components/theme-switch";
import { RegisterIcon } from "@/components/icons";
import { Logo } from "@/components/icons";
import { selectIsAuthenticated, selectUser } from '@/store/userSlice'
import { useAppSelector } from '@/store/hooks'

export const Navbar = () => {
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const user = useAppSelector(selectUser);

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
          {isAuthenticated ? (
            <User
              avatarProps={{
                src: user.profile_image || '',
                isBordered: true,
              }}
              description={user.email}
              name={user.name}
              classNames={{
                wrapper:'max-sm:hidden'
              }}
            />
          ) : (
            <Button
              as={Link}
              to="/register"
              className="text-sm font-normal text-default-600 bg-default-100"
              startContent={<RegisterIcon />}
              variant="flat"
              color="primary"
            >
              Register
            </Button>
          )}
        </NavbarItem>
      </NavbarContent>
    </HeroUINavbar>
  );
};
