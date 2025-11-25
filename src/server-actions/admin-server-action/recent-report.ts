"use server";

import { connectMongoDB } from "@/config/mongodb-config";
import FoundItemModel from "@/models/found-item-model";
import LostItemModel from "@/models/lost-item-model";

connectMongoDB();
// Get latest lost items (limit = 10)
export const GetRecentLostReports = async () => {
  try {
    const reports = await LostItemModel.find()
      .sort({ createdAt: -1 })
      .limit(10)
      .populate("reportedBy", "name");

    return JSON.parse(JSON.stringify(reports));
  } catch (error: any) {
    return { error: error.message };
  }
};

// Get latest found items (limit = 10)
export const GetRecentFoundReports = async () => {
  try {
    const reports = await FoundItemModel.find()
      .sort({ createdAt: -1 })
      .limit(10)
      .populate("reportedBy", "name");

    return JSON.parse(JSON.stringify(reports));
  } catch (error: any) {
    return { error: error.message };
  }
};
