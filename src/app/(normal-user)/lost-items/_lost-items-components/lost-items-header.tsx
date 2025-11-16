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
    <div className="h-[20rem] grid grid-rows-2">
      <div className="flex items-center justify-center">
        <h1 className="text-[4rem] font-semibold uppercase">Lost Items</h1>
      </div>
      <div className="flex gap-2 items-center justify-center">
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
