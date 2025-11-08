import Footer from "@/components/footer";
import Header from "@/components/header";
import { SignUp } from "@clerk/nextjs";

export default function Page() {
  return (
    <div className="w-full h-screen grid grid-cols-1 grid-rows-[auto_1fr_auto]">
      <Header />
      <div className="flex items-center justify-center border border-green-500 ">
        <SignUp />
      </div>
      <Footer />
    </div>
  );
}
