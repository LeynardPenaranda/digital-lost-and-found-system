import Link from "next/link";

const navlinks = [
  {
    name: "Home",
    href: "/",
  },
  {
    name: "Lost items",
    href: "/lost-items",
  },
  {
    name: "Found items",
    href: "/found-items",
  },
  {
    name: "Messages",
    href: "/user-messages",
  },
  {
    name: "Reported Items",
    href: "/report-items",
  },
];

const NavLinks = () => {
  return (
    <nav>
      <ul className="flex gap-5 space-x-4">
        {navlinks.map((link) => (
          <li key={link.name}>
            <Link href={link.href}>{link.name}</Link>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default NavLinks;
