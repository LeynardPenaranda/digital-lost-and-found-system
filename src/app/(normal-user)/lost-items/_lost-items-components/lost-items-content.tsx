"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { message, Spin } from "antd"; // using Ant Design's Spin component for loading
import { LostItemReportType } from "@/interfaces";
import { getAllLostItems } from "@/server-actions/lost-items-report";
import LostItemCard from "./lost-item-card";

const LostItemsContent = () => {
  const searchParams = useSearchParams();
  const searchQuery = searchParams.get("q") || ""; // ?q=charger
  const [lostItems, setLostItems] = useState<LostItemReportType[]>([]);
  const [loading, setLoading] = useState<boolean>(false); // loading state

  const fetchLostItems = async () => {
    try {
      setLoading(true); // start loading
      const response = await getAllLostItems(searchQuery);
      if ("error" in response) throw new Error(response.error);
      setLostItems(response);
    } catch (error: any) {
      message.error("Failed to get the lost items report");
    } finally {
      setLoading(false); // stop loading
    }
  };

  useEffect(() => {
    fetchLostItems();
  }, [searchQuery]); // refetch whenever searchQuery changes

  return (
    <div className="flex flex-col items-center justify-center">
      {loading ? (
        <Spin size="large" className="my-10" />
      ) : lostItems.length === 0 ? (
        <span className="text-[2rem] text-gray-400 font-semibold my-10">
          No Lost reports yet..
        </span>
      ) : (
        <div className="flex gap-10 flex-wrap justify-center">
          {lostItems.map((items) => (
            <LostItemCard key={items._id} items={items} />
          ))}
        </div>
      )}
    </div>
  );
};

export default LostItemsContent;
