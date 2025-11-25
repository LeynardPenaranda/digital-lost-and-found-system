"use client";

import Image from "next/image";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatDateTime } from "@/lib/date-formats";

type Props = {
  data: any[] | null;
};

export default function RecentFoundTable({ data }: Props) {
  if (data === null) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="w-6 h-6 border-4 border-gray-300 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-w-[600px]">
      <Table className="border rounded-lg">
        <TableCaption>Recent Found Item Reports</TableCaption>

        <TableHeader>
          <TableRow>
            <TableHead>Image</TableHead>
            <TableHead className="w-[120px]">Item</TableHead>
            <TableHead>Location</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Reported By</TableHead>
            <TableHead className="text-right">Date</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {data.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="text-center py-4">
                No recent found reports.
              </TableCell>
            </TableRow>
          ) : (
            data.map((report, index) => (
              <TableRow key={index}>
                <TableCell className="p-1">
                  {report.foundItemsImages?.[0] ? (
                    <Image
                      src={report.foundItemsImages[0]}
                      alt={report.item}
                      width={60}
                      height={60}
                      className="object-cover rounded"
                    />
                  ) : (
                    <div className="w-14 h-14 bg-gray-200 rounded flex items-center justify-center text-xs text-gray-500">
                      No Image
                    </div>
                  )}
                </TableCell>
                <TableCell className="font-medium">{report.item}</TableCell>
                <TableCell>{report.location}</TableCell>
                <TableCell>{report.foundItemStatus}</TableCell>
                <TableCell>{report.reportedBy?.name || "Unknown"}</TableCell>
                <TableCell className="text-right">
                  {formatDateTime(report.createdAt)}
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
