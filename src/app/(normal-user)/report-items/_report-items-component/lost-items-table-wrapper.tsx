"use client";

import { getLostItemsByUser } from "@/server-actions/lost-items-report";
import LostItemTable from "./lost-items-table";
import { useEffect, useState } from "react";
import { LostItemReportType } from "@/interfaces";

export default function LostItemTableWrapper({ userId }: { userId: string }) {
  const [items, setItems] = useState<LostItemReportType[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchItems = async () => {
      setLoading(true);
      try {
        const result = await getLostItemsByUser(userId);
        setItems(result);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchItems();
  }, [userId]);

  if (!items) return <div>Loading Lost Table...</div>;

  return <LostItemTable items={items} loading={loading} />;
}
