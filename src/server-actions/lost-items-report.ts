"use server";

import { connectMongoDB } from "@/config/mongodb-config";

import LostItemModel from "@/models/lost-item-model";

connectMongoDB();

// export const createLostItemReport = async (payload: {
//   reportedBy: string;
//   item: string;
//   location: string;
//   itemDescription: string;
//   lostItemsImages: string[];
// }) => {
//   try {
//     const newReport = await LostItemModel.create({
//       reportedBy: payload.reportedBy,
//       item: payload.item,
//       location: payload.location,
//       itemDescription: payload.itemDescription,
//       lostItemsImages: payload.lostItemsImages,
//     });

//     return {
//       message: "Lost Item report uploaded successfully",
//       success: true,
//     };
//   } catch (error: any) {
//     return { message: error.message, success: false };
//   }
// };

// export const getAllLostItems = async (searchQuery?: string) => {
//   try {
//     const filter = searchQuery
//       ? { item: { $regex: searchQuery, $options: "i" } } // case-insensitive search
//       : {};

//     const lostItems = await LostItemModel.find(filter)
//       .populate("reportedBy")
//       .sort({ createdAt: -1 });

//     return JSON.parse(JSON.stringify(lostItems));
//   } catch (error: any) {
//     return { message: error.message, error: true };
//   }
// };

export const createLostItemReport = async (payload: {
  reportedBy: string;
  item: string;
  location: string;
  itemDescription: string;
  lostItemsImages: string[];
}) => {
  try {
    const newReport = await LostItemModel.create({
      reportedBy: payload.reportedBy,
      item: payload.item,
      location: payload.location,
      itemDescription: payload.itemDescription,
      lostItemsImages: payload.lostItemsImages,
    });

    return {
      message: "Lost Item report uploaded successfully",
      success: true,
      report: JSON.parse(JSON.stringify(newReport)), // IMPORTANT
    };
  } catch (error: any) {
    return { message: error.message, success: false };
  }
};

export const getAllLostItems = async (searchQuery = "", status?: string) => {
  try {
    let filter: any = {};

    if (searchQuery) {
      filter.item = { $regex: searchQuery, $options: "i" };
    }

    if (status) {
      filter.lostItemStatus = status;
    }

    const lostItems = await LostItemModel.find(filter)
      .populate("reportedBy")
      .sort({ createdAt: -1 });

    return JSON.parse(JSON.stringify(lostItems));
  } catch (error: any) {
    return {
      error: error.message,
    };
  }
};

export const getLostItemsByUser = async (userId: string) => {
  try {
    const lostItems = await LostItemModel.find({ reportedBy: userId })
      .populate("reportedBy")
      .sort({ createdAt: -1 });

    // Make sure it's always an array
    return Array.isArray(lostItems)
      ? JSON.parse(JSON.stringify(lostItems))
      : [];
  } catch (error) {
    console.error(error);
    return []; // must return an array
  }
};

export const updateLostItemStatus = async (
  id: string,
  status: "pending" | "found"
) => {
  try {
    const updatedItem = await LostItemModel.findByIdAndUpdate(
      id,
      { lostItemStatus: status },
      { new: true }
    ).populate("reportedBy");

    if (!updatedItem) {
      return { success: false, message: "Item not found" };
    }

    return {
      success: true,
      message: "Status updated successfully",
      item: JSON.parse(JSON.stringify(updatedItem)),
    };
  } catch (error: any) {
    console.error(error);
    return { success: false, message: error.message };
  }
};

export const deleteLostItems = async (ids: string[]) => {
  try {
    const result = await LostItemModel.deleteMany({ _id: { $in: ids } });
    return {
      success: true,
      message: `${result.deletedCount} item(s) deleted successfully`,
    };
  } catch (error: any) {
    console.error(error);
    return { success: false, message: error.message };
  }
};
