"use client";

import { NotificationState } from "@/redux/notificationSlice";
import {
  BadgeX,
  FileText,
  House,
  MessageCircle,
  SearchCheck,
} from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

const navlinks = [
  { icon: <House size={20} />, name: "Home", href: "/" },
  { icon: <BadgeX size={20} />, name: "Lost items", href: "/lost-items" },
  {
    icon: <SearchCheck size={20} />,
    name: "Found items",
    href: "/found-items",
  },
  {
    icon: <MessageCircle size={20} />,
    name: "Messages",
    href: "/user-messages",
  },
  {
    icon: <FileText size={20} />,
    name: "Reported Items",
    href: "/report-items",
  },
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
    if (href === pathname) return; // ⛔ prevent unnecessary navigation

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
              <li
                key={link.href}
                className="relative flex items-center justify-center gap-1"
              >
                <span>{link.icon}</span>
                <button
                  onClick={() => handleNavigate(link.href)}
                  className="flex items-center justify-center gap-2 relative  py-1"
                >
                  <span>{link.name}</span>

                  {/* Animated underline */}
                  <span
                    className={`
        absolute bottom-0 left-0 h-0.5 bg-blue-900
        transition-all duration-300 ease-in-out
        ${isActive ? "w-full" : "w-0"}
      `}
                  />
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
