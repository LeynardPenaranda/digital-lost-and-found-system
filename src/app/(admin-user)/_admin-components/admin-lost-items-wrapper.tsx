"use client";

import { useEffect, useState } from "react";
import { LostItemReportType } from "@/interfaces";
import { getAllLostItemsAdmin } from "@/server-actions/admin-server-action/admin-report-status";
import LostItemTable from "@/app/(normal-user)/report-items/_report-items-component/lost-items-table";

import { Button } from "@/components/ui/button";
import LostItemModal from "@/app/(normal-user)/lost-items/_lost-items-components/lost-items-modal";

export default function AdminLostItemsWrapper() {
  const [items, setItems] = useState<LostItemReportType[]>([]);
  const [loading, setLoading] = useState(true);
  const [onOpenModal, setOnOpenModal] = useState(false);

  useEffect(() => {
    async function fetchData() {
      const response = await getAllLostItemsAdmin();

      if (response.success) {
        setItems(response.data ?? []);
      }

      setLoading(false);
    }

    fetchData();
  }, []);

  return (
    <div className="flex flex-col gap-6">
      {/* HEADER WITH BUTTON */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold">Lost Items</h1>

        <Button onClick={() => setOnOpenModal(true)}>
          Create Lost Item Report
        </Button>
      </div>

      {/* TABLE */}
      <LostItemTable items={items} loading={loading} />

      {/* MODAL */}
      {onOpenModal && (
        <LostItemModal
          onOpenModal={onOpenModal}
          setOnOpenModal={setOnOpenModal}
        />
      )}
    </div>
  );
}
