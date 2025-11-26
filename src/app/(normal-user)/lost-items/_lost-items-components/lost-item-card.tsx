"use client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { LostItemReportType } from "@/interfaces";
import dayjs from "dayjs";
import LostItemCarousel from "./lost-item-carousel";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { BadgeX, CircleCheck } from "lucide-react";
import { UserState } from "@/redux/userSlice";
import { useDispatch, useSelector } from "react-redux";
import { GetOrCreateChat, SendMessage } from "@/server-actions/chats";
import { SetSelectedChat } from "@/redux/chatSlice";
import { message } from "antd";
import { useRouter } from "next/navigation";

const LostItemCard = ({ items }: { items: LostItemReportType }) => {
  const [showMore, setShowMore] = useState(false);
  const [loading, setLoading] = useState(false);
  const descriptionTooLong = items.itemDescription.length > 155;
  const dispatch = useDispatch();
  const router = useRouter();

  const { currentUserData }: UserState = useSelector(
    (state: any) => state.user
  );

  const openChat = async () => {
    if (!currentUserData?._id) return;

    try {
      setLoading(true); // show loader

      const chat = await GetOrCreateChat(
        currentUserData._id,
        items.reportedBy._id
      );

      if (chat.error) {
        setLoading(false);
        return message.error(chat.error);
      }

      // Send initial message
      await SendMessage({
        chatId: chat._id,
        sender: currentUserData._id,
        text: [
          `Item name: ${items.item}`,
          `Location: ${items.location}`,
          `Current Status: Lost ${items.lostItemStatus}`,
        ].join("\n"),
        image: items.lostItemsImages?.[0] || "",
      });

      dispatch(SetSelectedChat(chat));

      // Navigate to chat page
      router.push("/user-messages");
    } finally {
      // Let Next.js finish navigation then hide loader
      setTimeout(() => setLoading(false), 300);
    }
  };

  if (items.lostItemStatus === "pending") {
    return (
      <Card className="h-[30rem] w-[80%] sm:w-[18rem] md:w-[20rem]">
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
              <span className="text-xs">
                {items.reportedBy.displayName ?? items.reportedBy.name}
              </span>
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
            <LostItemCarousel item={items} />
          </div>
        </CardContent>
        <CardFooter className="px-2 py-0 m-0 flex flex-col gap-2 h-[45%] w-full ">
          {/* Lost Item & Location fixed at top */}
          <div className="flex flex-col gap-1 w-full">
            <div className="flex gap-2 text-xs">
              <span className="text-gray-500">Lost Item Name:</span>
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
            {currentUserData?._id === items?.reportedBy._id ? (
              <div>This is your card</div>
            ) : (
              <Button className="w-full" onClick={openChat}>
                Contact
              </Button>
            )}

            {loading && (
              <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex flex-col items-center justify-center z-50">
                <div className="h-12 w-12 border-4 border-white/30 border-t-white rounded-full animate-spin mb-4"></div>
                <span className="text-white text-sm font-medium tracking-wide animate-pulse">
                  Connecting...
                </span>
              </div>
            )}
          </div>
        </CardFooter>
      </Card>
    );
  } else {
    return (
      <Card className="h-[30rem] w-[80%] sm:w-[18rem] md:w-[20rem]">
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
              <span className="text-xs">
                {items.reportedBy.displayName ?? items.reportedBy.name}
              </span>
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
            <LostItemCarousel item={items} />
          </div>
        </CardContent>
        <CardFooter className="px-2 py-0 m-0 flex flex-col gap-2 h-[45%] w-full ">
          {/* Lost Item & Location fixed at top */}
          <div className="flex flex-col gap-1 w-full">
            <div className="flex gap-2 text-xs">
              <span className="text-gray-500">Lost Item Name:</span>
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
            {currentUserData?._id === items?.reportedBy._id ? (
              <div>This is your card</div>
            ) : (
              <Button className="w-full" onClick={openChat}>
                Contact
              </Button>
            )}
            {loading && (
              <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex flex-col items-center justify-center z-50">
                <div className="h-12 w-12 border-4 border-white/30 border-t-white rounded-full animate-spin mb-4"></div>
                <span className="text-white text-sm font-medium tracking-wide animate-pulse">
                  Connecting...
                </span>
              </div>
            )}
          </div>
        </CardFooter>
      </Card>
    );
  }
};

export default LostItemCard;
