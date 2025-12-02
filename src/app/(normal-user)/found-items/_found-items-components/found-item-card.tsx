"use client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { FoundItemReportType } from "@/interfaces";
import dayjs from "dayjs";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { CircleCheck, SearchCheck } from "lucide-react";
import FoundItemCarousel from "./found-item-carousel";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { UserState } from "@/redux/userSlice";
import { GetOrCreateChat, SendMessage } from "@/server-actions/chats";
import { SetSelectedChat } from "@/redux/chatSlice";
import { message } from "antd";

const FoundItemCard = ({ items }: { items: FoundItemReportType }) => {
  const [showMore, setShowMore] = useState(false);
  const [contacting, setContacting] = useState(false);
  const descriptionTooLong = items.itemDescription.length > 155;

  const dispatch = useDispatch();
  const router = useRouter();

  const { currentUserData }: UserState = useSelector(
    (state: any) => state.user
  );

  const openChat = async () => {
    if (!currentUserData?._id) return;

    try {
      setContacting(true); // Start loader

      // Get or create chat
      const chat = await GetOrCreateChat(
        currentUserData._id,
        items.reportedBy._id
      );

      if (chat.error) {
        message.error(chat.error);
        return;
      }

      // Auto-send item details message
      await SendMessage({
        chatId: chat._id,
        sender: currentUserData._id,
        text: [
          `Item name: ${items.item}`,
          `Location: ${items.location}`,
          `Current Item Status: Found Item ${items.foundItemStatus}`,
        ].join("\n"),
        image: items.foundItemsImages?.[0] || "",
      });

      // Set chat in Redux
      dispatch(SetSelectedChat(chat));

      // Navigate to chat page
      router.push("/user-messages");
    } catch (err: any) {
      message.error(err.message || "Something went wrong");
    } finally {
      setContacting(false); // Stop loader
    }
  };

  if (items.foundItemStatus === "pending") {
    return (
      <Card className="h-[30rem] w-[80%] sm:w-[18rem] md:w-[20rem]">
        <div className="w-full bg-yellow-200/40 flex gap-2 items-center justify-center py-2 rounded-t-sm">
          <span className="text-yellow-500 font-semibold">Found Item</span>
          <SearchCheck className="text-yellow-500" />
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
            <FoundItemCarousel item={items} />
          </div>
        </CardContent>
        <CardFooter className="px-2 py-0 m-0 flex flex-col gap-2 h-[45%] w-full ">
          {/* Lost Item & Location fixed at top */}
          <div className="flex flex-col gap-1 w-full">
            <div className="flex gap-2 text-xs">
              <span className="text-gray-500">Found Item Name:</span>
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
              <Button
                className="w-full"
                onClick={openChat}
                disabled={contacting}
              >
                {contacting ? "Contacting..." : "Contact"}
              </Button>
            )}
          </div>
        </CardFooter>
      </Card>
    );
  } else {
    return (
      <Card className="h-[30rem] w-[80%] sm:w-[18rem] md:w-[20rem]">
        <div className="w-full bg-green-200 flex gap-2 items-center justify-center py-2 rounded-t-sm">
          <span className="text-green-500 font-semibold">
            Claimed Found item
          </span>
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
            <FoundItemCarousel item={items} />
          </div>
        </CardContent>
        <CardFooter className="px-2 py-0 m-0 flex flex-col gap-2 h-[45%] w-full ">
          {/* Lost Item & Location fixed at top */}
          <div className="flex flex-col gap-1 w-full">
            <div className="flex gap-2 text-xs">
              <span className="text-gray-500">Found Item Name:</span>
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
              <Button
                className="w-full"
                onClick={openChat}
                disabled={contacting}
              >
                {contacting ? "Contacting..." : "Contact"}
              </Button>
            )}
          </div>
        </CardFooter>
      </Card>
    );
  }
};

export default FoundItemCard;
