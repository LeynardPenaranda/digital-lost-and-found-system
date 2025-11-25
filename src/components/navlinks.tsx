"use client";

import { NotificationState } from "@/redux/notificationSlice";
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

  const { chatUnread }: NotificationState = useSelector(
    (state: any) => state.notifications
  );

  // Sum all unread counts
  const totalUnread = Object.values(chatUnread).reduce(
    (acc, curr) => acc + (curr.count || 0),
    0
  );

  const handleNavigate = (href: string) => {
    setLoading(true);
    router.push(href);
  };

  useEffect(() => {
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
              <li key={link.name} className="relative">
                <button
                  onClick={() => handleNavigate(link.href)}
                  className={`${isActive ? "border-b-2 border-blue-900" : ""}`}
                >
                  {link.name}
                </button>

                {/* Show unread badge only for Messages link */}
                {link.name === "Messages" && totalUnread > 0 && (
                  <span className="absolute -top-2 -right-3 bg-red-600 text-white text-xs font-bold rounded-full px-1.5 py-0.5">
                    {totalUnread}
                  </span>
                )}
              </li>
            );
          })}
        </ul>
      </nav>
    </>
  );
};

export default NavLinks;
