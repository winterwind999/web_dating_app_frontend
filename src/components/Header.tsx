"use client";

import {
  Button,
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
} from "@heroui/react";
import Image from "next/image";
import Link from "next/link";

export default function Header() {
  return (
    <Navbar
      isBlurred={false}
      classNames={{
        base: "bg-transparent z-50 fixed",
      }}
    >
      <NavbarContent>
        {/* <NavbarMenuToggle
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          className="sm:hidden"
        /> */}
        <NavbarBrand>
          <Image
            src="/assets/Matchy_Icon_Logo.png"
            alt="matchy-logo"
            width={150}
            height={50}
          />
        </NavbarBrand>
      </NavbarContent>

      {/* <NavbarContent className="hidden gap-4 sm:flex" justify="center">
        {navbarItems.map((navbarItem) => (
          <NavbarItem key={navbarItem.link}>
            <Link aria-label={navbarItem.label} href={navbarItem.link}>
              {navbarItem.label}
            </Link>
          </NavbarItem>
        ))}
      </NavbarContent> */}

      <NavbarContent justify="end">
        <NavbarItem>
          <Button
            color="primary"
            variant="solid"
            as={Link}
            aria-label="login"
            href="#"
          >
            Login
          </Button>
        </NavbarItem>
      </NavbarContent>

      {/* <NavbarMenu>
        {navbarItems.map((navbarItem) => (
          <NavbarMenuItem key={navbarItem.link}>
            <Link
              className="w-full"
              size="lg"
              aria-label={navbarItem.label}
              href={navbarItem.link}
            >
              {navbarItem.label}
            </Link>
          </NavbarMenuItem>
        ))}
      </NavbarMenu> */}
    </Navbar>
  );
}
