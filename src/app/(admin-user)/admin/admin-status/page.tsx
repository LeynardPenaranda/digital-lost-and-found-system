"use client";

import { useState } from "react";
import AdminLostItemsWrapper from "../../_admin-components/admin-lost-items-wrapper";
import AdminFoundItemsWrapper from "../../_admin-components/admin-found-items-wrapper";

const AdminStatus = () => {
  const [isLostItems, setIsLostItems] = useState(true);

  return (
    <>
      <div className="text-xl font-semibold">Status of Items</div>

      {/* tabs */}
      <div className="flex gap-4 justify-center items-center p-4">
        <span
          onClick={() => setIsLostItems(true)}
          className={`px-4 py-2 cursor-pointer font-medium ${
            isLostItems
              ? "border-b-2 border-blue-900 text-black"
              : "hover:bg-gray-200"
          }`}
        >
          Lost Items
        </span>

        <span
          onClick={() => setIsLostItems(false)}
          className={`px-4 py-2 cursor-pointer font-medium ${
            !isLostItems
              ? "border-b-2 border-blue-900 text-black"
              : "hover:bg-gray-200"
          }`}
        >
          Found Items
        </span>
      </div>

      {/* dynamic table */}
      <div className="flex justify-center mt-4">
        <div className="w-[90%] lg:w-[70%]">
          {isLostItems ? <AdminLostItemsWrapper /> : <AdminFoundItemsWrapper />}
        </div>
      </div>
    </>
  );
};

export default AdminStatus;
