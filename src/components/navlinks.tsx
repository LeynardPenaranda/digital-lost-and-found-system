"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navlinks = [
  { name: "Home", href: "/" },
  { name: "Lost items", href: "/lost-items" },
  { name: "Found items", href: "/found-items" },
  { name: "Messages", href: "/user-messages" },
  { name: "Reported Items", href: "/report-items" },
];

const NavLinks = ({ className }: { className?: string }) => {
  const pathname = usePathname();

  return (
    <nav>
      <ul className={`flex gap-5 ${className}`}>
        {navlinks.map((link) => {
          const isActive = pathname === link.href;
          return (
            <li key={link.name}>
              <Link
                href={link.href}
                className={`${isActive ? "border-b-2 border-blue-900" : ""}`}
              >
                {link.name}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
};

export default NavLinks;
