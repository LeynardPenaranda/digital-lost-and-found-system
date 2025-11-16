"use server";

import { connectMongoDB } from "@/config/mongodb-config";
import LostItemModel from "@/models/lost-item-model";

connectMongoDB();

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
    };
  } catch (error: any) {
    return { message: error.message, success: false };
  }
};

export const getAllLostItems = async (searchQuery?: string) => {
  try {
    const filter = searchQuery
      ? { item: { $regex: searchQuery, $options: "i" } } // case-insensitive search
      : {};

    const lostItems = await LostItemModel.find(filter)
      .populate("reportedBy")
      .sort({ createdAt: -1 });

    return JSON.parse(JSON.stringify(lostItems));
  } catch (error: any) {
    return { message: error.message, error: true };
  }
};
