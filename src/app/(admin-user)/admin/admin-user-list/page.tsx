import UsersTable from "../../_admin-components/users-table";

const AdminUserList = () => {
  return (
    <>
      <div className="w-full h-[10rem] flex items-center">
        <span className="ml-10 text-[2.5rem]">User List</span>
      </div>
      <div className="w-full overflow-auto">
        <UsersTable />
      </div>
    </>
  );
};

export default AdminUserList;
