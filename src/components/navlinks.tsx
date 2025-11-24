"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

const navlinks = [
  { name: "Home", href: "/" },
  { name: "Lost items", href: "/lost-items" },
  { name: "Found items", href: "/found-items" },
  { name: "Messages", href: "/user-messages" },
  { name: "Reported Items", href: "/report-items" },
];

const NavLinks = ({ className }: { className?: string }) => {
  const pathname = usePathname();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const { chatUnread } = useSelector((state: any) => state.notifications);

  const handleNavigate = (href: string) => {
    setLoading(true);
    router.push(href);
  };

  // 👇 This fixes your problem
  useEffect(() => {
    // When the pathname changes → stop loading
    setLoading(false);
  }, [pathname]);

  return (
    <>
      {loading && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex flex-col items-center justify-center z-50 animate-fadeIn">
          <div className="h-12 w-12 border-4 border-white/30 border-t-white rounded-full animate-spin mb-4"></div>
          <span className="text-white text-sm font-medium tracking-wide animate-pulse">
            Navigating...
          </span>
        </div>
      )}

      <nav>
        <ul className={`flex gap-5 ${className}`}>
          {navlinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <li key={link.name}>
                <button
                  onClick={() => handleNavigate(link.href)}
                  className={`${isActive ? "border-b-2 border-blue-900" : ""}`}
                >
                  {link.name}
                </button>
              </li>
            );
          })}
        </ul>
      </nav>
    </>
  );
};

export default NavLinks;
