import { Button } from "antd";
import { Facebook, Github, Instagram, Linkedin } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const arrayLinkPage = [
  {
    name: "Lost Items",
    href: "/lost-items",
  },
  {
    name: "Found Items",
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
const arrayLinkHelp = [
  {
    name: "Customer Support",
    href: "#",
  },
  {
    name: "Terms & Conditions",
    href: "#",
  },
  {
    name: "Privacy Policy",
    href: "#",
  },
];
const arrayLinkSocial = [
  {
    name: "LinkedIn",
    href: "#",
  },
  {
    name: "Facebook",
    href: "#",
  },
  {
    name: "GitHub",
    href: "#",
  },
  {
    name: "Instagram",
    href: "#",
  },
];
const arrayLinkSocialIcon = [
  {
    icon: <Linkedin size={14} />,
    href: "#",
  },
  {
    icon: <Facebook size={14} />,
    href: "#",
  },
  {
    icon: <Github size={14} />,
    href: "#",
  },
  {
    icon: <Instagram size={14} />,
    href: "#",
  },
];

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="h-auto py-10 lg:h-[15rem] border-t ">
      <div className="flex flex-col lg:flex-row gap-10 w-full h-full">
        <div className="flex items-center justify-center">
          <Image src="/DLFS-logos.png" alt="Logo" width={150} height={150} />
        </div>

        <div className="flex flex-col items-start justify-center gap-2 px-5">
          <span className="text-lg font-semibold">Site</span>
          {arrayLinkPage.map((link, index) => {
            return <Link href={link.href} key={index}>{link.name}</Link>;
          })}
        </div>

        <div className="flex flex-col items-start justify-center gap-2 px-5">
          <span className="text-lg font-semibold">Help</span>
          {arrayLinkHelp.map((link, index) => {
            return <Link href={link.href} key={index}>{link.name}</Link>;
          })}
        </div>

        <div className="text-center flex justify-center items-center px-5">
          <span>
            © Copyright {currentYear} Digital Lost and Found System All Right
            Reserved
          </span>
        </div>

        <div className="flex flex-col items-start justify-center gap-2 px-5">
          <span className="text-lg font-semibold">Social Links</span>
          {arrayLinkSocial.map((link, index) => {
            return <Link href={link.href} key={index}>{link.name}</Link>;
          })}
        </div>

        <div className="flex flex-col items-start justify-center gap-2 px-5 overflow-auto">
          <span className="text-lg font-semibold">Contact</span>
          <span>Tel: +63932112450</span>
          <span>Email: DigitalLostandFoundSSU@gmail.com</span>

          <div className="flex gap-2 ">
            {arrayLinkSocialIcon.map((link, index) => {
              return (
                <Link href={link.href} key={index}>
                  <Button>{link.icon}</Button>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
