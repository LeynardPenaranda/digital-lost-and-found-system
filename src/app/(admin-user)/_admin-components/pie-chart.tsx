"use client";

import { PieChart, Pie, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { useEffect, useState } from "react";
import {
  getTotalsForPie,
  PieChartTotals,
} from "@/server-actions/admin-server-action/overview";

export default function PieChartOverview() {
  const [data, setData] = useState<PieChartTotals[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const totals = await getTotalsForPie();
      setData(totals);
    };
    fetchData();
  }, []);

  return (
    <div className="flex flex-col items-center justify-center w-full h-full">
      <h2 className="text-xl font-bold mb-3 text-center sticky top-0 bg-white">
        Lost & Found Overview
      </h2>

      {/* Give the container a fixed height for ResponsiveContainer */}
      <div className="w-full" style={{ height: 300 }}>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              nameKey="name"
              innerRadius="60%"
              outerRadius="80%"
              cornerRadius={10}
              paddingAngle={2}
              isAnimationActive
            />
            <Tooltip />
            <Legend verticalAlign="bottom" height={36} />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
