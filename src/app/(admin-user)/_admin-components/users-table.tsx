"use client";

import React, { useEffect, useRef, useState } from "react";
import { SearchOutlined } from "@ant-design/icons";
import {
  Button,
  Drawer,
  Input,
  Space,
  Table,
  message,
  Select,
  Modal,
} from "antd";
import type { InputRef, TableColumnsType, TableColumnType } from "antd";
import type { FilterDropdownProps } from "antd/es/table/interface";

import {
  DeleteUser,
  GetAllUsers,
  UpdateUserRole,
} from "@/server-actions/admin-server-action/user-management";

import { useSelector } from "react-redux"; // to get current user

interface UserType {
  _id: string;
  name: string;
  userName: string;
  email: string;
  role: string;
  profilePicture?: string;
  createdAt?: string;
}

type DataIndex = keyof UserType;

const escapeRegExp = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const Highlight: React.FC<{ text: string; searchWords: string[] }> = ({
  text,
  searchWords,
}) => {
  if (!searchWords || searchWords.length === 0 || !searchWords[0])
    return <>{text}</>;

  const pattern = searchWords
    .filter(Boolean)
    .map((w) => escapeRegExp(w))
    .join("|");
  if (!pattern) return <>{text}</>;

  const parts = text.split(new RegExp(`(${pattern})`, "gi"));

  return (
    <>
      {parts.map((part, i) =>
        part.toLowerCase() === searchWords[0].toLowerCase() ? (
          <mark
            key={i}
            style={{ backgroundColor: "#ffc069", padding: 0, borderRadius: 2 }}
          >
            {part}
          </mark>
        ) : (
          <span key={i}>{part}</span>
        )
      )}
    </>
  );
};

const UsersTable: React.FC = () => {
  const [data, setData] = useState<UserType[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserType | null>(null);
  const [newRole, setNewRole] = useState<"user" | "admin">("user");

  const [searchText, setSearchText] = useState("");
  const [searchedColumn, setSearchedColumn] = useState<keyof UserType | "">("");
  const searchInput = useRef<InputRef>(null);

  const { currentUserData } = useSelector((state: any) => state.user);

  const loadUsers = async () => {
    setLoading(true);
    try {
      let users = await GetAllUsers();
      // Filter out current logged-in user
      users = users.filter(
        (user: UserType) => user._id !== currentUserData?._id
      );
      setData(users);
    } catch (err) {
      console.error(err);
      message.error("Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, [currentUserData]);

  const handleSearch = (
    selectedKeys: string[],
    confirm: FilterDropdownProps["confirm"],
    dataIndex: DataIndex
  ) => {
    confirm();
    setSearchText(selectedKeys[0] ?? "");
    setSearchedColumn(dataIndex);
  };

  const handleReset = (clearFilters: () => void, confirm: () => void) => {
    clearFilters(); // clear internal filter state
    setSearchText(""); // clear your highlight state
    confirm(); // re-render table without filter
  };

  const getColumnSearchProps = (
    dataIndex: DataIndex
  ): TableColumnType<UserType> => ({
    filterDropdown: ({
      setSelectedKeys,
      selectedKeys,
      confirm,
      clearFilters,
      close,
    }) => (
      <div style={{ padding: 8 }} onKeyDown={(e) => e.stopPropagation()}>
        <Input
          ref={searchInput}
          placeholder={`Search ${String(dataIndex)}`}
          value={selectedKeys?.[0] ?? ""}
          onChange={(e) =>
            setSelectedKeys &&
            setSelectedKeys(e.target.value ? [e.target.value] : [])
          }
          onPressEnter={() =>
            handleSearch((selectedKeys as string[]) ?? [], confirm, dataIndex)
          }
          style={{ marginBottom: 8, display: "block" }}
        />
        <Space>
          <Button
            type="primary"
            onClick={() =>
              handleSearch((selectedKeys as string[]) ?? [], confirm, dataIndex)
            }
            icon={<SearchOutlined />}
            size="small"
            style={{ width: 90 }}
          >
            Search
          </Button>

          <Button
            onClick={() => clearFilters && handleReset(clearFilters, confirm)}
            size="small"
            style={{ width: 90 }}
          >
            Clear
          </Button>

          <Button
            type="link"
            size="small"
            onClick={() => {
              confirm({ closeDropdown: false });
              setSearchText((selectedKeys as string[])[0] ?? "");
              setSearchedColumn(dataIndex);
            }}
          >
            Filter
          </Button>

          <Button type="link" size="small" onClick={() => close()}>
            Close
          </Button>
        </Space>
      </div>
    ),

    filterIcon: (filtered) => (
      <SearchOutlined style={{ color: filtered ? "#1677ff" : undefined }} />
    ),

    onFilter: (value, record) => {
      const field = record[dataIndex];
      if (field === null || field === undefined) return false;
      return field
        .toString()
        .toLowerCase()
        .includes(String(value).toLowerCase());
    },

    render: (text) =>
      searchedColumn === dataIndex && typeof text === "string" && searchText ? (
        <Highlight text={text} searchWords={[searchText]} />
      ) : (
        text
      ),
  });

  const columns: TableColumnsType<UserType> = [
    {
      title: "Profile",
      dataIndex: "profilePicture",
      key: "profilePicture",
      render: (src) => (
        <div className="flex justify-center">
          <img
            src={src || "/default-profile.png"}
            alt="Profile"
            className="rounded-full"
            style={{ width: 50, height: 50, objectFit: "cover" }}
          />
        </div>
      ),
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      ...getColumnSearchProps("name"),
    },
    {
      title: "Username",
      dataIndex: "userName",
      key: "userName",
      ...getColumnSearchProps("userName"),
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      ...getColumnSearchProps("email"),
      render: (email) => email || "No email for this user",
    },
    {
      title: "Role",
      dataIndex: "role",
      key: "role",
      ...getColumnSearchProps("role"),
      render: (role) => (
        <span className={role === "admin" ? "text-blue-600" : ""}>{role}</span>
      ),
    },
  ];

  const onRowClick = (record: UserType) => {
    setSelectedUser(record);
    setNewRole(record.role as "user" | "admin");
    setOpen(true);
  };

  const handleRoleChange = async () => {
    if (!selectedUser) return;
    try {
      await UpdateUserRole(selectedUser._id, newRole);
      message.success("User role updated!");
      loadUsers();
    } catch (err) {
      console.error(err);
      message.error("Failed to update role");
    }
  };

  const handleDelete = () => {
    if (!selectedUser) return;

    Modal.confirm({
      title: "Delete User",
      content: `Are you sure you want to delete ${selectedUser.name}?`,
      okText: "Delete",
      okType: "danger",
      cancelText: "Cancel",

      onOk: async () => {
        try {
          await DeleteUser(selectedUser._id);
          message.success("User deleted successfully");
          setOpen(false);
          loadUsers();
        } catch (err) {
          console.error(err);
          message.error("Failed to delete user");
        }
      },
    });
  };

  return (
    <>
      <div className="w-[90%] overflow-auto">
        <Table
          columns={columns}
          dataSource={data}
          loading={loading}
          rowKey="_id"
          rowClassName="!h-10 [&>td]:!py-1 [&>td]:!px-2" // set row height and cell padding
          onRow={(record) => ({
            onClick: () => onRowClick(record),
            style: { cursor: "pointer" },
          })}
        />
      </div>

      <Drawer
        open={open}
        onClose={() => setOpen(false)}
        width={400}
        title="User Details"
      >
        {selectedUser && (
          <>
            <div className="flex justify-center mb-4">
              <img
                src={selectedUser.profilePicture || "/default-profile.png"}
                alt="Profile"
                className="rounded-full"
                style={{ width: 80, height: 80, objectFit: "cover" }}
              />
            </div>

            <p>
              <strong>Name:</strong> {selectedUser.name}
            </p>
            <p>
              <strong>Username:</strong> {selectedUser.userName}
            </p>
            <p>
              <strong>Email:</strong> {selectedUser.email}
            </p>

            <p className="mt-4 mb-1 font-medium">Role:</p>
            <Select
              value={newRole}
              onChange={(value) => setNewRole(value as "user" | "admin")}
              style={{ width: "100%" }}
              options={[
                { label: "User", value: "user" },
                { label: "Admin", value: "admin" },
              ]}
            />

            <Button
              type="primary"
              style={{ marginTop: 12, width: "100%" }}
              onClick={handleRoleChange}
            >
              Update Role
            </Button>

            <Button
              danger
              style={{ marginTop: 12, width: "100%" }}
              onClick={handleDelete}
            >
              Delete User
            </Button>
          </>
        )}
      </Drawer>
    </>
  );
};

export default UsersTable;
