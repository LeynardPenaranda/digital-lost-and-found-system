"use client";

import { Table, Button, Select, message } from "antd";
import { useState, useEffect } from "react";
import { FoundItemReportType, LostItemReportType } from "@/interfaces";
import {
  deleteFoundItems,
  updateFoundItemStatus,
} from "@/server-actions/found-items-report";

interface FoundItemTableProps {
  items: FoundItemReportType[];
  loading?: boolean;
}

export default function FoundItemTable({
  items,
  loading = false,
}: FoundItemTableProps) {
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [tableData, setTableData] = useState<FoundItemReportType[]>(
    items || []
  );

  useEffect(() => {
    setTableData(items || []);
  }, [items]);

  const onSelectChange = (newSelectedRowKeys: React.Key[]) => {
    setSelectedRowKeys(newSelectedRowKeys);
  };

  const handleDelete = async () => {
    if (selectedRowKeys.length === 0) {
      message.warning("Please select at least one item to delete.");
      return;
    }
    try {
      await deleteFoundItems(selectedRowKeys as string[]);
      setTableData(
        tableData.filter((item) => !selectedRowKeys.includes(item._id))
      );
      setSelectedRowKeys([]);
      message.success("Selected items deleted successfully!");
    } catch (err) {
      console.error(err);
      message.error("Failed to delete items.");
    }
  };

  const handleStatusChange = async (
    value: "pending" | "claimed",
    record: FoundItemReportType
  ) => {
    try {
      await updateFoundItemStatus(record._id, value);
      setTableData((prev) =>
        prev.map((item) =>
          item._id === record._id ? { ...item, lostItemStatus: value } : item
        )
      );
      message.success("Status updated!");
    } catch (err) {
      console.error(err);
      message.error("Failed to update status.");
    }
  };

  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
    selections: [Table.SELECTION_ALL],
  };

  const columns = [
    {
      title: "Image",
      dataIndex: "foundItemsImages",
      render: (images: string[]) => (
        <img
          src={images?.[0] || "/placeholder.png"}
          alt="lost item"
          style={{ width: 60, height: 60, objectFit: "cover", borderRadius: 4 }}
        />
      ),
    },
    { title: "Item", dataIndex: "item" },
    { title: "Location", dataIndex: "location" },
    { title: "Description", dataIndex: "itemDescription" },
    {
      title: "Status",
      dataIndex: "foundItemStatus",
      render: (_: any, record: FoundItemReportType) => (
        <Select
          value={record.foundItemStatus}
          onChange={(value) => handleStatusChange(value, record)}
          style={{ width: 100 }}
        >
          <Select.Option value="pending">Pending</Select.Option>
          <Select.Option value="claimed">claimed</Select.Option>
        </Select>
      ),
    },
    {
      title: "Created At",
      dataIndex: "createdAt",
      render: (date: string) =>
        new Date(date).toLocaleString("en-US", {
          dateStyle: "medium",
          timeStyle: "short",
        }),
    },
  ];

  return (
    <div className="grid grid-rows-[auto_1fr] gap-2 h-full">
      {/* Row 1: Delete button placeholder */}
      <div style={{ minHeight: 50 }} className="">
        {selectedRowKeys.length > 0 && (
          <Button type="primary" danger onClick={handleDelete}>
            Delete Selected
          </Button>
        )}
      </div>

      {/* Row 2: Table */}
      <div className="overflow-x-auto">
        <Table
          rowSelection={rowSelection}
          columns={columns}
          rowKey="_id"
          dataSource={tableData}
          loading={loading}
          scroll={{ x: "max-content" }} // <-- makes it responsive
          onRow={(record) => ({
            onClick: () => setSelectedRowKeys([record._id]),
          })}
          pagination={{
            pageSize: 5,
            showSizeChanger: true,
          }}
        />
      </div>
    </div>
  );
}
