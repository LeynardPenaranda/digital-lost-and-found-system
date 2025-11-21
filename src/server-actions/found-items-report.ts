"use server";

import { connectMongoDB } from "@/config/mongodb-config";
import FoundItemModel from "@/models/found-item-model";

connectMongoDB();

export const createFoundItemReport = async (payload: {
  reportedBy: string;
  item: string;
  location: string;
  itemDescription: string;
  foundItemsImages: string[];
}) => {
  try {
    const newReport = await FoundItemModel.create({
      reportedBy: payload.reportedBy,
      item: payload.item,
      location: payload.location,
      itemDescription: payload.itemDescription,
      foundItemsImages: payload.foundItemsImages,
    });

    return {
      message: "Found Item report uploaded successfully",
      success: true,
      report: JSON.parse(JSON.stringify(newReport)), // IMPORTANT
    };
  } catch (error: any) {
    return { message: error.message, success: false };
  }
};

export const getAllFoundItems = async (searchQuery = "", status?: string) => {
  try {
    let filter: any = {};

    if (searchQuery) {
      filter.item = { $regex: searchQuery, $options: "i" };
    }

    if (status) {
      filter.foundItemStatus = status;
    }

    const foundItems = await FoundItemModel.find(filter)
      .populate("reportedBy")
      .sort({ createdAt: -1 });

    return JSON.parse(JSON.stringify(foundItems));
  } catch (error: any) {
    return {
      error: error.message,
    };
  }
};

export const getFoundItemsByUser = async (userId: string) => {
  try {
    const foundItems = await FoundItemModel.find({ reportedBy: userId })
      .populate("reportedBy")
      .sort({ createdAt: -1 });

    // Make sure it's always an array
    return Array.isArray(foundItems)
      ? JSON.parse(JSON.stringify(foundItems))
      : [];
  } catch (error) {
    console.error(error);
    return []; // must return an array
  }
};

export const updateFoundItemStatus = async (
  id: string,
  status: "pending" | "claimed"
) => {
  try {
    const updatedItem = await FoundItemModel.findByIdAndUpdate(
      id,
      { foundItemStatus: status },
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

export const deleteFoundItems = async (ids: string[]) => {
  try {
    const result = await FoundItemModel.deleteMany({ _id: { $in: ids } });
    return {
      success: true,
      message: `${result.deletedCount} item(s) deleted successfully`,
    };
  } catch (error: any) {
    console.error(error);
    return { success: false, message: error.message };
  }
};
