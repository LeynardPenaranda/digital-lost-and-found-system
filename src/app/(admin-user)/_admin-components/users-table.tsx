"use client";

import React, { useEffect, useRef, useState } from "react";
import { SearchOutlined, EditOutlined } from "@ant-design/icons";
import {
  Table,
  Input,
  Space,
  Button,
  Modal,
  Select,
  message,
  Drawer,
  Avatar,
} from "antd";
import type { ColumnsType, ColumnType } from "antd/es/table";
import type { InputRef } from "antd";
import { useSelector } from "react-redux";

import {
  GetAllUsers,
  BanUser,
  UnbanUser,
  UpdateUserRole,
} from "@/server-actions/admin-server-action/user-management";

interface UserType {
  _id: string;
  name: string;
  email: string;
  userName: string;
  role: string;
  profilePicture?: string;
  isBanned?: boolean;
  banReason?: string;
}

type DataIndex = keyof UserType;

interface CustomFilterDropdownProps {
  setSelectedKeys: (keys: React.Key[]) => void;
  selectedKeys: React.Key[];
  confirm: () => void;
  clearFilters?: () => void;
}

const UsersTable: React.FC = () => {
  const [data, setData] = useState<UserType[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState("");
  const [searchedColumn, setSearchedColumn] = useState<DataIndex | "">("");
  const searchInput = useRef<InputRef>(null);
  const { currentUserData } = useSelector((state: any) => state.user);

  // Ban modal
  const [banModalOpen, setBanModalOpen] = useState(false);
  const [banReason, setBanReason] = useState("");
  const [selectedUser, setSelectedUser] = useState<UserType | null>(null);

  // Drawer for user details
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [drawerRole, setDrawerRole] = useState<"admin" | "user">("user");

  const loadUsers = async () => {
    setLoading(true);
    const res = await GetAllUsers();
    if (!res.success) {
      message.error(res.message || "Failed to fetch users");
      setLoading(false);
      return;
    }
    const users = res.data.filter(
      (u: UserType) => u._id !== currentUserData?._id
    );
    setData(users);
    setLoading(false);
  };

  useEffect(() => {
    loadUsers();
  }, [currentUserData]);

  // Search filter props
  const getColumnSearchProps = (
    dataIndex: DataIndex
  ): ColumnType<UserType> => ({
    filterDropdown: ({
      setSelectedKeys,
      selectedKeys,
      confirm,
      clearFilters,
    }: CustomFilterDropdownProps) => (
      <div style={{ padding: 8 }}>
        <Input
          ref={searchInput}
          placeholder={`Search ${String(dataIndex)}`}
          value={(selectedKeys as string[])?.[0] || ""}
          onChange={(e) =>
            setSelectedKeys?.(e.target.value ? [e.target.value] : [])
          }
          onPressEnter={() => {
            confirm();
            setSearchText((selectedKeys as string[])[0]);
            setSearchedColumn(dataIndex);
          }}
        />
        <Space style={{ marginTop: 8 }}>
          <Button
            type="primary"
            icon={<SearchOutlined />}
            onClick={() => {
              confirm();
              setSearchText((selectedKeys as string[])[0]);
              setSearchedColumn(dataIndex);
            }}
            size="small"
          >
            Search
          </Button>
          <Button
            onClick={() => {
              clearFilters?.();
              setSelectedKeys([]);
              setSearchText("");
              confirm(); // 🔹 refresh the table after clearing
            }}
            size="small"
          >
            Clear
          </Button>
        </Space>
      </div>
    ),
    onFilter: (value, record) => {
      if (typeof value !== "string") return false;
      const field = record[dataIndex];
      if (!field) return false;
      return field.toString().toLowerCase().includes(value.toLowerCase());
    },
    filterIcon: (filtered: boolean) => (
      <SearchOutlined style={{ color: filtered ? "#1677ff" : undefined }} />
    ),
  });

  // Ban/unban functions
  const confirmBanUser = async () => {
    if (!selectedUser) return;
    const res = await BanUser(selectedUser._id, banReason);
    if (!res.success) message.error(res.message || "Failed to ban user");
    else message.success("User banned");
    setBanModalOpen(false);
    setBanReason("");
    loadUsers();
  };

  const handleUnban = async (record: UserType) => {
    const res = await UnbanUser(record._id);
    if (!res.success) message.error(res.message || "Failed to unban user");
    else message.success("User unbanned");
    loadUsers();
  };

  const handleRoleUpdate = async (userId: string, role: "admin" | "user") => {
    const res = await UpdateUserRole(userId, role);
    if (!res.success) message.error(res.message || "Failed to update role");
    else message.success("Role updated");
    loadUsers();
  };

  const columns: ColumnsType<UserType> = [
    {
      title: "Profile",
      dataIndex: "profilePicture",
      render: (url) => <Avatar size="large" src={url} />,
    },
    { title: "Name", dataIndex: "name", ...getColumnSearchProps("name") },
    {
      title: "Username",
      dataIndex: "userName",
      ...getColumnSearchProps("userName"),
    },
    {
      title: "Email",
      dataIndex: "email",
      ...getColumnSearchProps("email"),
      render: (email: string | undefined) =>
        email && email.trim() !== "" ? email : "No email for this user",
    },
    {
      title: "Role",
      dataIndex: "role",
      render: (role, record) => (
        <span
          className={
            role === "admin"
              ? "text-red-500 font-semibold"
              : "text-green-600 font-semibold"
          }
        >
          {role}
        </span>
      ),
    },
    {
      title: "Ban Status",
      dataIndex: "isBanned",
      render: (isBanned, record) =>
        isBanned ? (
          <span className="text-red-500 font-semibold">
            BANNED ({record.banReason})
          </span>
        ) : (
          <span className="text-green-600 font-semibold">Active</span>
        ),
    },
    {
      title: "Actions",
      render: (_: unknown, record: UserType) => (
        <Space>
          <Button
            icon={<EditOutlined />}
            onClick={() => {
              setSelectedUser(record);
              setDrawerRole(record.role as "admin" | "user"); // set current role
              setDrawerOpen(true);
            }}
          >
            Details
          </Button>

          {record.role === "user" ? (
            record.isBanned ? (
              <Button type="primary" danger onClick={() => handleUnban(record)}>
                Unban
              </Button>
            ) : (
              <Button
                type="primary"
                onClick={() => {
                  setSelectedUser(record);
                  setBanModalOpen(true);
                }}
              >
                Ban
              </Button>
            )
          ) : (
            <Button type="default" disabled>
              Admin
            </Button>
          )}
        </Space>
      ),
    },
  ];

  return (
    <>
      {/* Table here */}
      <Table
        columns={columns}
        dataSource={data}
        rowKey="_id"
        loading={loading}
        pagination={{ pageSize: 10 }} // 🔹 show 10 rows per page
        style={{ width: "80%", margin: "0 auto" }} // 80% width and centered
      />

      {/* Ban Modal */}
      <Modal
        title="Ban User"
        open={banModalOpen}
        onOk={confirmBanUser}
        onCancel={() => setBanModalOpen(false)}
        okText="Confirm Ban"
        cancelText="Cancel"
      >
        <p>Select ban reason:</p>
        <Select
          placeholder="Select a reason"
          className="w-full mt-2"
          onChange={(v: string) => setBanReason(v)}
          options={[
            { label: "Violation of rules", value: "Violation of rules" },
            { label: "Harassment", value: "Harassment" },
            { label: "Spam activities", value: "Spam activities" },
            {
              label: "Inappropriate behavior",
              value: "Inappropriate behavior",
            },
          ]}
        />
      </Modal>

      {/* Drawer for user details */}
      <Drawer
        title="User Details"
        width={360}
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
      >
        {selectedUser && (
          <Space direction="vertical" size="middle" className="w-full">
            <Avatar size={80} src={selectedUser.profilePicture} />
            <p>
              <strong>Name:</strong> {selectedUser.name}
            </p>
            <p>
              <strong>Username:</strong> {selectedUser.userName}
            </p>
            <p>
              <strong>Email:</strong> {selectedUser.email}
            </p>
            <p>
              <strong>Status:</strong>{" "}
              {selectedUser.isBanned
                ? `BANNED (${selectedUser.banReason})`
                : "Active"}
            </p>

            {/* Role selector */}
            <p>
              <strong>Role:</strong>
            </p>
            <Select
              value={drawerRole}
              onChange={(role: "admin" | "user") => setDrawerRole(role)}
              options={[
                { label: "User", value: "user" },
                { label: "Admin", value: "admin" },
              ]}
              className="w-full"
            />
            <Button
              type="primary"
              className="mt-2"
              onClick={() =>
                selectedUser && handleRoleUpdate(selectedUser._id, drawerRole)
              }
            >
              Update Role
            </Button>
          </Space>
        )}
      </Drawer>
    </>
  );
};

export default UsersTable;
