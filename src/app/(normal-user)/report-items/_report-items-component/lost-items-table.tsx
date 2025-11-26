"use client";

import { Table, Button, Select, message } from "antd";
import { useState, useEffect } from "react";
import { LostItemReportType } from "@/interfaces";
import {
  updateLostItemStatus,
  deleteLostItems,
} from "@/server-actions/lost-items-report";
import { useSelector } from "react-redux";
import { UserState } from "@/redux/userSlice";

interface LostItemTableProps {
  items: LostItemReportType[];
  loading?: boolean;
}

export default function LostItemTable({
  items,
  loading = false,
}: LostItemTableProps) {
  const { currentUserData }: UserState = useSelector(
    (state: any) => state.user
  );
  const isAdmin = currentUserData?.role === "admin";

  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [tableData, setTableData] = useState<LostItemReportType[]>(items || []);

  useEffect(() => setTableData(items || []), [items]);

  const onSelectChange = (newSelectedRowKeys: React.Key[]) =>
    setSelectedRowKeys(newSelectedRowKeys);

  const handleDelete = async () => {
    if (!selectedRowKeys.length)
      return message.warning("Please select at least one item to delete.");
    try {
      await deleteLostItems(selectedRowKeys as string[]);
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
    value: "pending" | "found",
    record: LostItemReportType
  ) => {
    try {
      await updateLostItemStatus(record._id, value);
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
    ...(isAdmin
      ? [
          {
            title: "Reporter",
            dataIndex: "reportedBy",
            render: (reportedBy: any) => (
              <div className="flex items-center gap-2">
                <img
                  src={reportedBy?.profilePicture || "/default-profile.png"}
                  alt="profile"
                  className="w-10 h-10 rounded-full object-cover"
                />
              </div>
            ),
          },
          {
            title: "Name",
            dataIndex: "reportedBy",
            render: (reportedBy: any) =>
              reportedBy?._id === currentUserData?._id
                ? "You"
                : reportedBy?.name || "Unknown",
          },
        ]
      : []),
    {
      title: "Image",
      dataIndex: "lostItemsImages",
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
      dataIndex: "lostItemStatus",
      render: (_: any, record: LostItemReportType) => (
        <Select
          value={record.lostItemStatus}
          onChange={(value) => handleStatusChange(value, record)}
          style={{ width: 100 }}
        >
          <Select.Option value="pending">Pending</Select.Option>
          <Select.Option value="found">Found</Select.Option>
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
      <div style={{ minHeight: 50 }}>
        {selectedRowKeys.length > 0 && (
          <Button type="primary" danger onClick={handleDelete}>
            Delete Selected
          </Button>
        )}
      </div>
      <div className="overflow-x-auto">
        <Table
          rowSelection={rowSelection}
          columns={columns}
          rowKey="_id"
          dataSource={tableData}
          loading={loading}
          scroll={{ x: "max-content" }}
          onRow={(record) => ({
            onClick: () => setSelectedRowKeys([record._id]),
          })}
          pagination={{ pageSize: 5, showSizeChanger: true }}
        />
      </div>
    </div>
  );
}
