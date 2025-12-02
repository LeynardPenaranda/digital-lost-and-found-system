"use client";

import MarqueSlider from "@/components/marque-slider";
import { SignUp } from "@clerk/nextjs";
import Image from "next/image";

export default function Page() {
  return (
    <div className="grid grid-rows-2 lg:grid-rows-none lg:grid-cols-2 h-screen">
      {/* FIRST ROW — image with hidden overflow */}
      <div className="bg-blue-950 flex items-center justify-center overflow-hidden relative">
        <div className="relative w-[80%] sm:w-[60%] lg:w-[70%] xl:w-[60%] max-w-[550px] mx-auto">
          {/* Main Image */}
          <div className="relative w-full aspect-square">
            <Image
              src="/us.svg"
              alt="Us"
              fill
              className="object-contain filter drop-shadow-[0_0_5px_white]"
              priority
            />
          </div>

          {/* Slider on large screens */}
          <div className="hidden lg:block lg:absolute bottom-[-4rem] left-0 w-full">
            <div className="relative overflow-hidden">
              {/* LEFT blur */}
              <div className="absolute inset-y-0 left-0 w-20 bg-gradient-to-r from-blue-950 to-transparent pointer-events-none z-50"></div>
              {/* RIGHT blur */}
              <div className="absolute inset-y-0 right-0 w-20 bg-gradient-to-l from-blue-950 to-transparent pointer-events-none z-50"></div>

              <MarqueSlider />
            </div>
          </div>
        </div>
      </div>

      {/* SECOND ROW — SignIn + slider on mobile */}
      <div className="flex items-center justify-center relative overflow-visible -mt-16 z-50">
        <div className="relative w-full flex flex-col items-center">
          {/* Slider above SignIn on small screens only */}
          <div className="lg:hidden absolute top-[-4rem] left-0 w-full">
            <div className="relative overflow-hidden">
              {/* LEFT blur */}
              <div className="absolute inset-y-0 left-0 w-20 bg-gradient-to-r from-blue-950 to-transparent pointer-events-none z-40"></div>
              {/* RIGHT blur */}
              <div className="absolute inset-y-0 right-0 w-20 bg-gradient-to-l from-blue-950 to-transparent pointer-events-none z-40"></div>

              <MarqueSlider />
            </div>
          </div>

          {/* SignIn card */}
          <div className="relative z-50">
            <SignUp />
          </div>

          {/* Optional blur below SignIn (only needed on mobile) */}
          <div className="lg:hidden absolute bottom-[-3rem] left-0 w-full h-10 z-30 bg-gradient-to-t from-blue-950 to-transparent pointer-events-none"></div>
        </div>
      </div>
    </div>
  );
}
