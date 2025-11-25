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

// Spinner loader
function Spinner() {
  return (
    <div className="w-6 h-6 border-4 border-gray-300 border-t-transparent rounded-full animate-spin"></div>
  );
}

export default function AdminPage() {
  const [lostData, setLostData] = useState<any>(null);
  const [foundData, setFoundData] = useState<any>(null);

  useEffect(() => {
    (async () => {
      const lost = await GetLostTotals();
      const found = await GetFoundTotals();
      setLostData(lost);
      setFoundData(found);
    })();
  }, []);

  return (
    <div className="flex-1 p-4 bg-gray-50 overflow-auto min-h-screen">
      <div className="flex flex-col gap-6 min-w-0">
        {/* Header */}
        <div className="text-2xl font-bold">Admin Dashboard Overview</div>

        {/* Cards Row */}
        <div className="flex flex-wrap justify-center gap-4">
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
        <div className="grid grid-rows-2 lg:grid-cols-2 gap-6">
          <Card className="flex-1 min-h-[300px] p-4">
            <WeeklyReportChart />
          </Card>

          <div>
            <Card className="flex-1 min-h-[300px] p-4 overflow-auto">
              <PieChartOverview />
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
