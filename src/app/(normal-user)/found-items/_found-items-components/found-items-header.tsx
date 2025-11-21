"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState, ChangeEvent, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import FoundItemModal from "./found-items-modal";

const FoundItemsHeader = () => {
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
        router.push("/found-items", {
          scroll: false,
        }); // fetch all if empty
      } else {
        router.push(`/found-items?q=${encodeURIComponent(trimmedQuery)}`, {
          scroll: false,
        });
      }
    }, 500); // delay to avoid too many router pushes while typing

    return () => clearTimeout(timer);
  }, [query, router]);

  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
  };

  return (
    <div className="flex flex-col gap-20">
      <div className="flex flex-col gap-20 items-center justify-center ">
        <h1 className="text-[4rem] font-semibold text-center uppercase">
          Found Items
        </h1>
        <div className="w-[80%] lg:w-[60%] flex justify-center">
          <p className="text-center font-semibold text-xl">
            If you found something or came across an item that may belong to
            someone else, this page allows you to report it quickly and
            responsibly. The Found Item page provides a structured way to upload
            photos, describe the item, and indicate where and when it was
            discovered. By submitting found items here, you help ensure that
            lost belongings can be identified and returned to their rightful
            owners, supporting a safer and more organized community.
          </p>
        </div>
      </div>
      <div className="flex flex-col lg:flex-row gap-2 items-center justify-center ">
        <div className="w-[80%] lg:w-[20%]">
          <Input
            type="text"
            placeholder="Item Name"
            className="rounded-full border border-black"
            value={query}
            onChange={handleSearchChange}
          />
        </div>
        <Button onClick={() => setOnOpenModal(!onOpenModal)}>
          Report Found Item
        </Button>
      </div>
      {onOpenModal && (
        <FoundItemModal
          onOpenModal={onOpenModal}
          setOnOpenModal={setOnOpenModal}
        />
      )}
    </div>
  );
};

export default FoundItemsHeader;
