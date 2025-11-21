"use client";

import { useEffect, useState } from "react";
import { FoundItemReportType } from "@/interfaces";
import FoundItemTable from "./found-items-table";
import { getFoundItemsByUser } from "@/server-actions/found-items-report";

export default function FoundItemWrapper({ userId }: { userId: string }) {
  const [items, setItems] = useState<FoundItemReportType[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchItems = async () => {
      setLoading(true);
      try {
        const result = await getFoundItemsByUser(userId);
        setItems(result);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchItems();
  }, [userId]);

  if (!items) return <div>Loading Found Table...</div>;

  return <FoundItemTable items={items} loading={loading} />;
}
