import Image from "next/image";
import { Button } from "./ui/button";
import Link from "next/link";
import { UserState } from "@/redux/userSlice";
import { useSelector } from "react-redux";
import { useRouter } from "next/navigation";

const TempHeader = ({ currentUserData }: { currentUserData?: any }) => {
  const router = useRouter();

  const handleGoBack = () => {
    if (!currentUserData) return;
    if (currentUserData.role === "admin") router.push("/admin");
    else router.push("/home");
  };

  return (
    <header className="border h-[5rem] flex items-center justify-between bg-gray-100 sticky top-0 z-50">
      <div className="flex items-center justify-center">
        <div className="px-5">
          <Image src="/DLFS-logos.png" alt="Logo" width={70} height={70} />
        </div>
        <span className="uppercase font-bold">
          Digital lost and found system
        </span>
      </div>

      {currentUserData ? (
        <Button onClick={handleGoBack} className="lg:mr-20">
          You are logged in. Click here to go back
        </Button>
      ) : (
        <Button asChild>
          <Link href="/sign-in" className="lg:mr-20">
            Sign In
          </Link>
        </Button>
      )}
    </header>
  );
};

export default TempHeader;
