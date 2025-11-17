"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState, ChangeEvent, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import LostItemModal from "./lost-items-modal";

const LostItemsHeader = () => {
  const [onOpenModal, setOnOpenModal] = useState(false);
  const searchParams = useSearchParams();
  const router = useRouter();
  const q = searchParams.get("q") || "";

  const [query, setQuery] = useState(q);

  // Update the URL whenever the query changes
  useEffect(() => {
    const timer = setTimeout(() => {
      const trimmedQuery = query.trim();
      if (trimmedQuery === "") {
        router.push("/lost-items"); // fetch all if empty
      } else {
        router.push(`/lost-items?q=${encodeURIComponent(trimmedQuery)}`);
      }
    }, 500); // delay to avoid too many router pushes while typing

    return () => clearTimeout(timer);
  }, [query, router]);

  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
  };

  return (
    <div className="h-[30rem] flex flex-col gap-20">
      <div className="flex flex-col gap-20 items-center justify-center ">
        <h1 className="text-[4rem] font-semibold uppercase">Lost Items</h1>
        <div className="w-[60%] flex justify-center">
          <p className="text-center font-semibold text-xl">
            If you lost something valuable, don't worry you can report it here!
            Our system helps you submit details about your missing item so
            others can help you find it. Whether it's a charger, wallet, or
            keys, we’re here to assist in reuniting you with your belongings.
          </p>
        </div>
      </div>
      <div className="flex gap-2 items-center justify-center ">
        <div className="w-[20%]">
          <Input
            type="text"
            placeholder="Item Name"
            className="rounded-full border border-black"
            value={query}
            onChange={handleSearchChange}
          />
        </div>
        <Button onClick={() => setOnOpenModal(!onOpenModal)}>
          Report Lost Item
        </Button>
      </div>
      {onOpenModal && (
        <LostItemModal
          onOpenModal={onOpenModal}
          setOnOpenModal={setOnOpenModal}
        />
      )}
    </div>
  );
};

export default LostItemsHeader;
