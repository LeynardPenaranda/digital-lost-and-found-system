"use client";

import { useEffect, useState } from "react";
import { FoundItemReportType } from "@/interfaces";
import { getAllFoundItemsAdmin } from "@/server-actions/admin-server-action/admin-report-status";
import FoundItemTable from "@/app/(normal-user)/report-items/_report-items-component/found-items-table";

import { Button } from "@/components/ui/button";
import FoundItemModal from "@/app/(normal-user)/found-items/_found-items-components/found-items-modal";

export default function AdminFoundItemsWrapper() {
  const [items, setItems] = useState<FoundItemReportType[]>([]);
  const [loading, setLoading] = useState(true);
  const [onOpenModal, setOnOpenModal] = useState(false);

  useEffect(() => {
    async function fetchData() {
      const response = await getAllFoundItemsAdmin();

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
        <h1 className="text-2xl font-semibold">Found Items</h1>

        <Button onClick={() => setOnOpenModal(true)}>
          Create Found Item Report
        </Button>
      </div>

      {/* TABLE */}
      <FoundItemTable items={items} loading={loading} />

      {/* MODAL */}
      {onOpenModal && (
        <FoundItemModal
          onOpenModal={onOpenModal}
          setOnOpenModal={setOnOpenModal}
        />
      )}
    </div>
  );
}
