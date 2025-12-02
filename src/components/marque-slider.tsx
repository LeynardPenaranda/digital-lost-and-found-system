import Image from "next/image";
import { motion } from "framer-motion";

const logosImages = [
  "/logos/SSU.svg",
  "/logos/CAS.svg",
  "/logos/CIT.svg",
  "/logos/COENG.svg",
  "/logos/CONHS.svg",
  "/logos/COED.svg",
];

const MarqueSlider = () => {
  return (
    <div className="w-full mx-auto overflow-hidden">
      <div className="flex gap-10">
        {[1, 2].map((loop) => (
          <motion.div
            key={loop}
            initial={{ x: 0 }}
            animate={{ x: "-100%" }}
            transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
            className="flex flex-shrink-0 gap-10"
          >
            {logosImages.map((logos, index) => {
              return (
                <div key={index} className="w-20 h-20 sm:w-28 sm:h-28 relative">
                  <Image
                    src={logos}
                    alt="logo"
                    fill
                    className="object-contain rounded-full"
                  />
                </div>
              );
            })}
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default MarqueSlider;
