"use server";

import { connectMongoDB } from "@/config/mongodb-config";
import { LostItemReportType } from "@/interfaces";
import FoundItemModel from "@/models/found-item-model";
import LostItemModel from "@/models/lost-item-model";
import { FoundItemReportType } from "@/interfaces";
// -------------------- LOST ITEMS --------------------

connectMongoDB();

export async function getAllLostItemsAdmin(): Promise<{
  success: boolean;
  data: LostItemReportType[];
  message?: string;
}> {
  try {
    const data = await LostItemModel.find()
      .sort({ createdAt: -1 })
      .populate("reportedBy", "name profilePicture role") // if needed
      .lean();

    const serialized: LostItemReportType[] = data.map((item: any) => ({
      ...item,
      _id: item._id?.toString(),
      reportedBy: item.reportedBy
        ? {
            ...item.reportedBy,
            _id: item.reportedBy._id?.toString(),
          }
        : null,
      createdAt: item.createdAt?.toISOString(),
      updatedAt: item.updatedAt?.toISOString(),
      lostItemsImages: Array.isArray(item.lostItemsImages)
        ? item.lostItemsImages.map(String)
        : [],
      item: String(item.item),
      location: String(item.location),
      itemDescription: String(item.itemDescription),
      lostItemStatus: String(item.lostItemStatus),
    }));

    return { success: true, data: serialized };
  } catch (err) {
    console.error("ERROR getAllLostItems:", err);
    return { success: false, data: [], message: "Failed to fetch lost items." };
  }
}

export async function adminDeleteLostItems(ids: string[]) {
  try {
    await LostItemModel.deleteMany({ _id: { $in: ids } });
    return { success: true };
  } catch (err) {
    console.error("ERROR adminDeleteLostItems:", err);
    return { success: false, message: "Failed to delete lost items." };
  }
}

export async function adminUpdateLostItemStatus(
  id: string,
  status: "pending" | "found"
) {
  try {
    await LostItemModel.findByIdAndUpdate(id, { lostItemStatus: status });
    return { success: true };
  } catch (err) {
    console.error("ERROR adminUpdateLostItemStatus:", err);
    return { success: false, message: "Failed to update lost item status." };
  }
}

// -------------------- FOUND ITEMS --------------------

export async function getAllFoundItemsAdmin(): Promise<{
  success: boolean;
  data: FoundItemReportType[];
  message?: string;
}> {
  try {
    const data = await FoundItemModel.find()
      .sort({ createdAt: -1 })
      .populate("reportedBy", "name profilePicture role")
      .lean();

    const serialized: FoundItemReportType[] = data.map((item: any) => ({
      ...item,
      _id: item._id?.toString(),
      reportedBy: item.reportedBy
        ? {
            ...item.reportedBy,
            _id: item.reportedBy._id?.toString(),
          }
        : null,
      createdAt: item.createdAt?.toISOString(),
      updatedAt: item.updatedAt?.toISOString(),
      // Ensure arrays or buffers are safe
      foundItemsImages: Array.isArray(item.foundItemsImages)
        ? item.foundItemsImages.map(String)
        : [],
      item: String(item.item),
      location: String(item.location),
      itemDescription: String(item.itemDescription),
      foundItemStatus: String(item.foundItemStatus),
    }));

    return { success: true, data: serialized };
  } catch (err) {
    console.error("ERROR getAllFoundItems:", err);
    return {
      success: false,
      data: [],
      message: "Failed to fetch found items.",
    };
  }
}

export async function adminDeleteFoundItems(ids: string[]) {
  try {
    await FoundItemModel.deleteMany({ _id: { $in: ids } });
    return { success: true };
  } catch (err) {
    console.error("ERROR adminDeleteFoundItems:", err);
    return { success: false, message: "Failed to delete found items." };
  }
}

export async function adminUpdateFoundItemStatus(
  id: string,
  status: "pending" | "claimed"
) {
  try {
    await FoundItemModel.findByIdAndUpdate(id, { foundItemStatus: status });
    return { success: true };
  } catch (err) {
    console.error("ERROR adminUpdateFoundItemStatus:", err);
    return { success: false, message: "Failed to update found item status." };
  }
}
