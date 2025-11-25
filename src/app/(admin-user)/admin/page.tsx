"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import {
  GetFoundTotals,
  GetLostTotals,
} from "@/server-actions/admin-server-action/overview";
import Image from "next/image";
import WeeklyReportChart from "../_admin-components/weekly-report-chart";
import PieChartOverview from "../_admin-components/pie-chart";
import RecentLostTable from "../_admin-components/recent-lost-table";
import RecentFoundTable from "../_admin-components/recent-found-table";
import {
  GetRecentFoundReports,
  GetRecentLostReports,
} from "@/server-actions/admin-server-action/recent-report";

// Spinner loader
function Spinner() {
  return (
    <div className="w-6 h-6 border-4 border-gray-300 border-t-transparent rounded-full animate-spin"></div>
  );
}

export default function AdminPage() {
  const [lostData, setLostData] = useState<any>(null);
  const [foundData, setFoundData] = useState<any>(null);
  const [recentLost, setRecentLost] = useState<any[] | null>(null);
  const [recentFound, setRecentFound] = useState<any[] | null>(null);

  useEffect(() => {
    (async () => {
      const lost = await GetLostTotals();
      const found = await GetFoundTotals();
      setLostData(lost);
      setFoundData(found);
    })();
  }, []);

  useEffect(() => {
    (async () => {
      const lost = await GetLostTotals();
      const found = await GetFoundTotals();

      const recentLostReports = await GetRecentLostReports();
      const recentFoundReports = await GetRecentFoundReports();

      setLostData(lost);
      setFoundData(found);

      setRecentLost(recentLostReports);
      setRecentFound(recentFoundReports);
    })();
  }, []);

  return (
    <div className="flex-1 p-4 bg-gray-50 overflow-auto min-h-screen">
      <div className="flex flex-col gap-6 min-w-0">
        {/* Header */}
        <div className="text-2xl font-bold">Admin Dashboard Overview</div>

        {/* Cards Row */}
        <div className="flex flex-wrap justify-center gap-10">
          {/* TOTAL LOST ITEMS */}
          <Card className="flex flex-1 max-w-xs gap-4 p-4 items-center min-w-[250px]">
            <Image
              src="/missing-items.png"
              alt="missing"
              width={90}
              height={90}
              quality={100}
            />
            <div className="flex flex-col items-center justify-center flex-1">
              <span className="text-2xl font-semibold">
                {lostData ? lostData.totalLost : <Spinner />}
              </span>
              <span className="text-center text-sm text-gray-500">
                Total Lost Items Report
              </span>
            </div>
          </Card>

          {/* TOTAL LOST ITEMS FOUND */}
          <Card className="flex flex-1 max-w-xs gap-4 p-4 items-center min-w-[250px]">
            <Image
              src="/found-lost-items.png"
              alt="found"
              width={90}
              height={90}
              quality={100}
            />
            <div className="flex flex-col items-center justify-center flex-1">
              <span className="text-2xl font-semibold">
                {lostData ? lostData.totalFound : <Spinner />}
              </span>
              <span className="text-center text-sm text-gray-500">
                Total Lost Items Found
              </span>
            </div>
          </Card>

          {/* TOTAL FOUND ITEMS */}
          <Card className="flex flex-1 max-w-xs gap-4 p-4 items-center min-w-[250px]">
            <Image
              src="/found-items.png"
              alt="found"
              width={90}
              height={90}
              quality={100}
            />
            <div className="flex flex-col items-center justify-center flex-1">
              <span className="text-2xl font-semibold">
                {foundData ? foundData.totalFoundItems : <Spinner />}
              </span>
              <span className="text-center text-sm text-gray-500">
                Total Found Items Report
              </span>
            </div>
          </Card>

          {/* TOTAL FOUND ITEMS CLAIMED */}
          <Card className="flex flex-1 max-w-xs gap-4 p-4 items-center min-w-[250px]">
            <Image
              src="/found-claimed-items.png"
              alt="claimed"
              width={90}
              height={90}
              quality={100}
            />
            <div className="flex flex-col items-center justify-center flex-1">
              <span className="text-2xl font-semibold">
                {foundData ? foundData.totalClaimed : <Spinner />}
              </span>
              <span className="text-center text-sm text-gray-500">
                Total Found Items Claimed
              </span>
            </div>
          </Card>
        </div>

        {/* Charts Row */}
        <div className="grid grid-rows-2 lg:grid-rows-1 lg:grid-cols-2 gap-6">
          <Card className="flex-1 min-h-[300px] p-4">
            <WeeklyReportChart />
          </Card>

          <Card className="flex-1 min-h-[300px] p-4 overflow-auto">
            <PieChartOverview />
          </Card>
        </div>

        {/* Table here */}
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Recent Lost Table */}
          <Card className="p-0 overflow-x-auto lg:overflow-x-visible lg:max-h-[400px] lg:overflow-y-auto">
            <div className="sticky top-0 z-10 bg-white p-2 border-b text-gray-500">
              Recent Lost Items Report
            </div>
            <RecentLostTable data={recentLost} />
          </Card>

          {/* Recent Found Table */}
          <Card className="p-0 overflow-x-auto lg:overflow-x-visible lg:max-h-[400px] lg:overflow-y-auto">
            <div className="sticky top-0 z-10 bg-white p-2 border-b text-gray-500">
              Recent Found Items Report
            </div>
            <RecentFoundTable data={recentFound} />
          </Card>
        </div>
      </div>
    </div>
  );
}
