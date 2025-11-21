import Footer from "@/components/footer";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Home() {
  return (
    <>
      <div className="lg:grid lg:grid-rows-[minmax(700px,1fr)_auto] h-full">
        <div className="flex flex-col lg:grid lg:grid-cols-2">
          <div className="flex flex-col items-center lg:items-end justify-center">
            <div className="lg:w-[50%]">
              <h1 className="text-[4rem] lg:text-[6rem] text-center lg:text-start">
                Find & Recover With Ease
              </h1>
            </div>
            <p className="px-2 text-center">
              Experience effortless recovery with our dedicated lost and found
              service.
            </p>
          </div>

          <div className="flex items-center justify-center h-[25rem]">
            <div className="flex flex-col gap-2 w-[30%] border">
              <Button asChild>
                <Link href="/lost-items">Lost</Link>
              </Button>
              <Button asChild>
                <Link href="/found-items">Found</Link>
              </Button>
            </div>
            <div></div>
          </div>
        </div>
        <div>
          <Footer />
        </div>
      </div>
    </>
  );
}
