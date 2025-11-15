"use client";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "../ui/button";
import { Plus } from "lucide-react";
import { useState } from "react";
import NewChatModal from "./new-chat-modal";
import { Input } from "../ui/input";

const ChatsHeader = () => {
  const [showNewChatModal, setShowNewChatModal] = useState(false);
  return (
    <div>
      <div className="flex justify-between">
        <h1 className="text-xl text-gray-500 font-bold">Messages</h1>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline">
              <Plus />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56" align="start">
            <DropdownMenuLabel>Add New Message</DropdownMenuLabel>
            <DropdownMenuGroup>
              <DropdownMenuItem
                className="cursor-pointer"
                onClick={() => setShowNewChatModal(true)}
              >
                New Chat
              </DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>

        {showNewChatModal && (
          <NewChatModal
            setShowNewChatModal={setShowNewChatModal}
            showNewChatModal={showNewChatModal}
          />
        )}
      </div>
      <Input
        type="text"
        placeholder="Search Chat"
        className="mt-5 border-gray-300 focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:outline-none focus-visible:border-gray-300 bg-gray-200"
      />
    </div>
  );
};

export default ChatsHeader;
