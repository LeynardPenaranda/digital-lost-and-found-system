"use server";

import { connectMongoDB } from "@/config/mongodb-config";
import FoundItemModel from "@/models/found-item-model";
import LostItemModel from "@/models/lost-item-model";

connectMongoDB();

export async function GetLostTotals() {
  try {
    await connectMongoDB();

    const totalLost = await LostItemModel.countDocuments();
    const totalPending = await LostItemModel.countDocuments({
      lostItemStatus: "pending",
    });
    const totalFound = await LostItemModel.countDocuments({
      lostItemStatus: "found",
    });

    return {
      success: true,
      totalLost,
      totalPending,
      totalFound,
    };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function GetFoundTotals() {
  try {
    const totalFoundItems = await FoundItemModel.countDocuments();
    const totalPending = await FoundItemModel.countDocuments({
      foundItemStatus: "pending",
    });
    const totalClaimed = await FoundItemModel.countDocuments({
      foundItemStatus: "claimed",
    });

    return {
      success: true,
      totalFoundItems,
      totalPending,
      totalClaimed,
    };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

// Types
interface MonthlyAggResult {
  month: string;
  lost: number;
  found: number;
}

interface MonthlyAggregation {
  _id: number;
  count: number;
}

// MONTHLY REPORT
export const getMonthlyReport = async (
  year?: number
): Promise<MonthlyAggResult[]> => {
  const currentYear = year || new Date().getFullYear();

  // Helper to aggregate by month
  const aggregateMonthly = async (Model: any): Promise<MonthlyAggregation[]> =>
    Model.aggregate([
      {
        $match: {
          createdAt: {
            $gte: new Date(currentYear, 0, 1),
            $lt: new Date(currentYear + 1, 0, 1),
          },
        },
      },
      {
        $group: { _id: { $month: "$createdAt" }, count: { $sum: 1 } },
      },
      { $sort: { _id: 1 } },
    ]);

  const [lostMonthly, foundMonthly] = await Promise.all([
    aggregateMonthly(LostItemModel),
    aggregateMonthly(FoundItemModel),
  ]);

  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const allMonths = Array.from(
    new Set([
      ...lostMonthly.map((m: MonthlyAggregation) => m._id),
      ...foundMonthly.map((m: MonthlyAggregation) => m._id),
    ])
  ).sort((a, b) => a - b);

  return allMonths.map((monthNumber: number) => ({
    month: monthNames[monthNumber - 1],
    lost:
      lostMonthly.find((m: MonthlyAggregation) => m._id === monthNumber)
        ?.count || 0,
    found:
      foundMonthly.find((m: MonthlyAggregation) => m._id === monthNumber)
        ?.count || 0,
  }));
};

export interface PieChartTotals {
  name: string;
  value: number;
  fill: string;
}

export const getTotalsForPie = async (): Promise<PieChartTotals[]> => {
  try {
    await connectMongoDB();

    // Lost totals
    const totalLost = await LostItemModel.countDocuments();
    const totalLostPending = await LostItemModel.countDocuments({
      lostItemStatus: "pending",
    });
    const totalLostFound = await LostItemModel.countDocuments({
      lostItemStatus: "found",
    });

    // Found totals
    const totalFound = await FoundItemModel.countDocuments();
    const totalFoundPending = await FoundItemModel.countDocuments({
      foundItemStatus: "pending",
    });
    const totalFoundClaimed = await FoundItemModel.countDocuments({
      foundItemStatus: "claimed",
    });

    const data: PieChartTotals[] = [
      { name: "Lost Items", value: totalLost, fill: "#ff4d4f" },
      { name: "Lost Pending", value: totalLostPending, fill: "#ff7875" },
      { name: "Lost Found", value: totalLostFound, fill: "#a8071a" },
      { name: "Found Items", value: totalFound, fill: "#52c41a" },
      { name: "Found Pending", value: totalFoundPending, fill: "#95de64" },
      { name: "Found Claimed", value: totalFoundClaimed, fill: "#237804" },
    ];

    return data;
  } catch (error: any) {
    console.error("Error fetching pie chart totals:", error);
    return [];
  }
};
