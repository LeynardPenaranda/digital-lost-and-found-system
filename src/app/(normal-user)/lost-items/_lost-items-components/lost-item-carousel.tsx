"use client";

import React, { useRef } from "react";
import { Carousel } from "antd";
import Image from "next/image";
import { LeftOutlined, RightOutlined } from "@ant-design/icons";
import { LostItemReportType } from "@/interfaces";
import { CircleCheck } from "lucide-react";

const LostItemCarousel = ({ item }: { item: LostItemReportType }) => {
  const carouselRef = useRef<any>(null);

  const images = item?.lostItemsImages || [];

  if (images.length === 0) return null;

  const showButtons = images.length > 1;

  return (
    <div className="lost-item-carousel relative w-full h-40">
      <Carousel
        ref={carouselRef}
        autoplay
        dots
        arrows={false}
        className="h-full"
      >
        {images.map((src) => (
          <div key={src} className="relative w-full h-40">
            {/* Found Overlay */}
            {item.lostItemStatus === "found" && (
              <div className="absolute inset-0 z-20 flex items-center justify-center">
                <span className="text-green-400 text-3xl font-bold px-5 py-2 rounded-md bg-green-200/40 border-2 border-green-500 flex items-center justify-center">
                  Item Found
                  <CircleCheck className="text-green-500" />
                </span>
              </div>
            )}

            <Image
              src={src}
              alt={`Lost item ${src}`}
              fill
              style={{ objectFit: "contain" }}
            />
          </div>
        ))}
      </Carousel>

      {showButtons && (
        <>
          <button
            onClick={() => carouselRef.current.prev()}
            className="absolute left-2 top-1/2 transform -translate-y-1/2 z-10 bg-white/40 hover:bg-white/70 p-2 rounded-full"
          >
            <LeftOutlined />
          </button>
          <button
            onClick={() => carouselRef.current.next()}
            className="absolute right-2 top-1/2 transform -translate-y-1/2 z-10 bg-white/40 hover:bg-white/70 p-2 rounded-full"
          >
            <RightOutlined />
          </button>
        </>
      )}

      {/* Dot Styling */}
      <style jsx global>{`
        .lost-item-carousel .slick-dots {
          background: rgba(0, 0, 0, 0.35);
          padding: 4px 12px;
          border-radius: 9999px;
          width: fit-content !important;
          left: 50% !important;
          transform: translateX(-50%);
          bottom: 6px !important;
        }

        .lost-item-carousel .slick-dots li button {
          background: white !important;
        }

        .lost-item-carousel .slick-dots li.slick-active button {
          background: white !important;
          width: 18px !important;
        }
      `}</style>
    </div>
  );
};

export default LostItemCarousel;
