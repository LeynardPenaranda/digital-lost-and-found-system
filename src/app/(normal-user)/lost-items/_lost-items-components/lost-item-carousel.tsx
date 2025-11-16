"use client";

import React, { useRef } from "react";
import { Carousel } from "antd";
import Image from "next/image";
import { LeftOutlined, RightOutlined } from "@ant-design/icons";

const LostItemCarousel = ({ images = [] }: { images?: string[] }) => {
  const carouselRef = useRef<any>(null);

  if (!images || images.length === 0) return null;

  const showButtons = images.length > 1; // only show buttons if more than 1 image

  return (
    <div className="relative w-full h-40">
      <Carousel
        ref={carouselRef}
        autoplay
        dots
        arrows={false} // hide default arrows
        className="h-full"
      >
        {images.map((src, index) => (
          <div key={index} className="relative w-full h-40">
            <Image
              src={src}
              alt={`Lost item ${index}`}
              fill
              style={{ objectFit: "contain" }}
            />
          </div>
        ))}
      </Carousel>

      {/* Custom Prev/Next buttons only if more than 1 image */}
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
    </div>
  );
};

export default LostItemCarousel;
