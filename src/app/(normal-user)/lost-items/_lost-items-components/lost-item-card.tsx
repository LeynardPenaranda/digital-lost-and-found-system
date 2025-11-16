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

const LostItemCard = ({ items }: { items: LostItemReportType }) => {
  const [showMore, setShowMore] = useState(false);

  const descriptionTooLong = items.itemDescription.length > 25;
  return (
    <Card className="h-[25rem] w-[20rem]">
      <CardHeader>
        <div className="flex gap-2">
          <Avatar>
            <AvatarImage src={items.reportedBy.profilePicture} />
            <AvatarFallback>U</AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <span className="text-xs">{items.reportedBy.name}</span>
            <span className="text-xs">
              {dayjs(items.createdAt).format("DD MMM YYYY")}
            </span>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-0 m-0 flex-1">
        <div className=" relative">
          <LostItemCarousel images={items.lostItemsImages} />
        </div>
      </CardContent>
      <CardFooter className="px-2 m-0">
        <div className="flex flex-col gap-2 w-full">
          <div className="flex flex-col">
            <div className="flex gap-2 text-xs">
              <span className="text-gray-500">Lost Item: </span>
              <span>{items.item}</span>
            </div>
            <div className="flex gap-2 text-xs">
              <span className="text-gray-500">Location:</span>
              <span>{items.location}</span>
            </div>
          </div>

          <div className="flex flex-col text-xs">
            <span className="text-gray-500">Description:</span>
            <div className="flex items-center">
              <span>
                {showMore || !descriptionTooLong
                  ? items.itemDescription
                  : items.itemDescription.slice(0, 25) + "..."}
              </span>
              {descriptionTooLong && (
                <span
                  className="text-gray-500 underline text-xs mt-1 self-start cursor-pointer"
                  onClick={() => setShowMore(!showMore)}
                >
                  {showMore ? "Show Less" : "Show More"}
                </span>
              )}
            </div>
          </div>
          <div className="flex justify-end w-full">
            <Button className="rounded-full">Contact</Button>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
};

export default LostItemCard;
