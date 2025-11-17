import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { LostItemReportType } from "@/interfaces";
import dayjs from "dayjs";
import LostItemCarousel from "./lost-item-carousel";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { BadgeX, CircleCheck } from "lucide-react";

const LostItemCard = ({ items }: { items: LostItemReportType }) => {
  const [showMore, setShowMore] = useState(false);

  const descriptionTooLong = items.itemDescription.length > 155;
  if (items.lostItemStatus === "pending") {
    return (
      <Card className="h-[30rem] w-[20rem]">
        <div className="w-full bg-red-200 flex gap-2 items-center justify-center py-2 rounded-t-sm">
          <span className="text-red-500 font-semibold">Missing</span>
          <BadgeX className="text-red-500" />
        </div>
        <CardHeader className="py-2 px-1">
          <div className="flex gap-2">
            <Avatar>
              <AvatarImage src={items.reportedBy.profilePicture} />
              <AvatarFallback>U</AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
              <span className="text-xs">{items.reportedBy.name}</span>
              <div>
                <span className="text-xs">reported on </span>
                <span className="text-xs">
                  {dayjs(items.createdAt).format("DD MMM YYYY")}
                </span>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0 m-0 flex-1">
          <div>
            <LostItemCarousel images={items.lostItemsImages} />
          </div>
        </CardContent>
        <CardFooter className="px-2 py-0 m-0 flex flex-col gap-2 h-[45%] w-full ">
          {/* Lost Item & Location fixed at top */}
          <div className="flex flex-col gap-1 w-full">
            <div className="flex gap-2 text-xs">
              <span className="text-gray-500">Lost Item:</span>
              <span>{items.item}</span>
            </div>
            <div className="flex gap-2 text-xs">
              <span className="text-gray-500">Location:</span>
              <span>{items.location}</span>
            </div>
          </div>

          {/* Description scrollable */}
          <div className="w-full h-[495px] overflow-auto">
            <div className="flex flex-col relative w-full h-full">
              <span className="text-gray-500 text-xs mb-1">Description:</span>

              <div className="flex-1 relative overflow-auto text-xs">
                <span className="whitespace-pre-wrap block text-justify">
                  {descriptionTooLong
                    ? showMore
                      ? items.itemDescription + "."
                      : items.itemDescription.slice(0, 155) + "..."
                    : items.itemDescription + "."}

                  {descriptionTooLong && (
                    <span
                      className="text-gray-500 underline cursor-pointer bg-white/80 px-1"
                      onClick={() => setShowMore(!showMore)}
                    >
                      {showMore ? "Show Less" : "Show More"}
                    </span>
                  )}
                </span>
              </div>
            </div>
          </div>

          {/* Contact button fixed at bottom */}
          <div className="flex justify-end mt-2 w-full">
            <Button className="rounded-full">Contact</Button>
          </div>
        </CardFooter>
      </Card>
    );
  } else {
    return (
      <Card className="h-[30rem] w-[20rem]">
        <div className="w-full bg-green-200 flex gap-2 items-center justify-center py-2 rounded-t-sm">
          <span className="text-green-500 font-semibold">Found item</span>
          <CircleCheck className="text-green-500" />
        </div>
        <CardHeader className="py-2 px-1">
          <div className="flex gap-3">
            <Avatar>
              <AvatarImage src={items.reportedBy.profilePicture} />
              <AvatarFallback>U</AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
              <span className="text-xs">{items.reportedBy.name}</span>
              <div>
                <span className="text-xs">reported on </span>
                <span className="text-xs">
                  {dayjs(items.createdAt).format("DD MMM YYYY")}
                </span>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0 m-0 flex-1">
          <div>
            <LostItemCarousel images={items.lostItemsImages} />
          </div>
        </CardContent>
        <CardFooter className="px-2 py-0 m-0 flex flex-col gap-2 h-[45%] w-full ">
          {/* Lost Item & Location fixed at top */}
          <div className="flex flex-col gap-1 w-full">
            <div className="flex gap-2 text-xs">
              <span className="text-gray-500">Lost Item:</span>
              <span>{items.item}</span>
            </div>
            <div className="flex gap-2 text-xs">
              <span className="text-gray-500">Location:</span>
              <span>{items.location}</span>
            </div>
          </div>

          {/* Description scrollable */}
          <div className="w-full h-[495px] overflow-auto">
            <div className="flex flex-col relative w-full h-full">
              <span className="text-gray-500 text-xs mb-1">Description:</span>

              <div className="flex-1 relative overflow-auto text-xs">
                <span className="whitespace-pre-wrap block text-justify">
                  {descriptionTooLong
                    ? showMore
                      ? items.itemDescription + "."
                      : items.itemDescription.slice(0, 155) + "..."
                    : items.itemDescription + "."}

                  {descriptionTooLong && (
                    <span
                      className="text-gray-500 underline cursor-pointer bg-white/80 px-1"
                      onClick={() => setShowMore(!showMore)}
                    >
                      {showMore ? "Show Less" : "Show More"}
                    </span>
                  )}
                </span>
              </div>
            </div>
          </div>

          {/* Contact button fixed at bottom */}
          <div className="flex justify-end mt-2 w-full">
            <Button className="rounded-full">Contact</Button>
          </div>
        </CardFooter>
      </Card>
    );
  }
};

export default LostItemCard;
