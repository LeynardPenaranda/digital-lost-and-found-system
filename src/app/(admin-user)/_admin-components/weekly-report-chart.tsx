"use client";

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { useEffect, useState } from "react";
import { getMonthlyReport } from "@/server-actions/admin-server-action/overview";

interface ReportData {
  label: string;
  lost: number;
  found: number;
}

const MonthlyReportChart = () => {
  const [monthlyData, setMonthlyData] = useState<ReportData[]>([]);

  useEffect(() => {
    const fetchMonthlyData = async () => {
      try {
        const result = await getMonthlyReport(); // fetch from DB
        setMonthlyData(
          result.map((m) => ({
            label: m.month,
            lost: m.lost,
            found: m.found,
          }))
        );
      } catch (error) {
        console.error("Failed to fetch monthly report:", error);
      }
    };

    fetchMonthlyData();
  }, []);

  return (
    <div>
      <h2 className="text-xl font-bold mb-3 ml-2">Monthly Report</h2>

      <ResponsiveContainer width="100%" height={400}>
        <AreaChart
          data={monthlyData}
          margin={{ top: 20, right: 20, left: 0, bottom: 0 }}
        >
          {/* Horizontal solid lines only */}
          <CartesianGrid
            stroke="#e0e0e0"
            strokeDasharray="0"
            vertical={false} // remove vertical lines
          />
          <XAxis dataKey="label" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Area
            type="monotone"
            dataKey="lost"
            stroke="#ff4d4f"
            strokeWidth={3}
            fill="#ff4d4f"
            fillOpacity={0.3}
          />
          <Area
            type="monotone"
            dataKey="found"
            stroke="#52c41a"
            strokeWidth={3}
            fill="#52c41a"
            fillOpacity={0.3}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default MonthlyReportChart;
