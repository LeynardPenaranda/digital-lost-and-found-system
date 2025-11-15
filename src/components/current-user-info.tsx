"use client";
import { UserType } from "@/interfaces";
import { Button, Drawer, message, Upload } from "antd";
import dayjs from "dayjs";

import { useClerk } from "@clerk/nextjs";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import socket from "@/config/socket-config";
import { UploadImageToFireBaseAndReturnUrl } from "@/lib/image-upload";
import { UpdateUserProfilePicture } from "@/server-actions/users";
import { useDispatch } from "react-redux";
import { setCurrentUserData } from "@/redux/userSlice";

const CurrentUserInfo = ({
  currentUserData,
  setShowCurrentUserInfo,
  showCurrentUserInfo,
}: {
  currentUserData: UserType;
  setShowCurrentUserInfo: (show: boolean) => void;
  showCurrentUserInfo: boolean;
}) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const { signOut } = useClerk();
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const dispatch = useDispatch();

  const getProperty = (key: string, value: string | Date) => {
    return (
      <div className="flex flex-col">
        <span className="font-semibold text-gray-700">{key} </span>
        <span className="text-gray-600">
          {value instanceof Date ? value.toLocaleDateString() : value}
        </span>
      </div>
    );
  };

  const onLogout = async () => {
    try {
      setLoading(true);
      socket.emit("logout", currentUserData?._id!);
      await signOut();
      message.success("Logged out successfully");
      router.push("/sign-in");
    } catch (error: any) {
      message.error(error.message || "Something went wrong during logout");
    } finally {
      setLoading(false);
    }
  };

  const onProfilePictureUpdate = async () => {
    try {
      setLoading(true);
      const profileURL = await UploadImageToFireBaseAndReturnUrl(selectedFile!);
      const response = await UpdateUserProfilePicture(currentUserData?._id, {
        profilePicture: profileURL,
      });

      if (response.error) throw new Error(response.error);
      dispatch(setCurrentUserData(response));
      message.success("Profile picture updated successfully");
      setShowCurrentUserInfo(false);
    } catch (error: any) {
      message.error(error.message);
    } finally {
      setLoading(false);
      setSelectedFile(null);
    }
  };

  return (
    <Drawer
      open={showCurrentUserInfo}
      onClose={() => setShowCurrentUserInfo(false)}
      title="Profile Information"
    >
      <div className="flex flex-col gap-10">
        <div className="flex flex-col gap-4 justify-center items-center">
          {!selectedFile && (
            <Avatar className="w-20 h-20">
              <AvatarImage src={currentUserData?.profilePicture} />
              <AvatarFallback>U</AvatarFallback>
            </Avatar>
          )}
          <Upload
            beforeUpload={(file) => {
              setSelectedFile(file);
              return false;
            }}
            className="cursor-pointer"
            listType={selectedFile ? "picture-circle" : "text"}
            maxCount={1}
            onRemove={() => {
              setSelectedFile(null); // restore avatar
            }}
          >
            {selectedFile ? (
              "Click here to change"
            ) : (
              <Button>Change Profile Picture</Button>
            )}
          </Upload>
        </div>
        <div className="flex flex-col gap-5">
          {getProperty("Name", currentUserData.name)}
          {getProperty("Username", currentUserData.userName)}
          {getProperty("ID", currentUserData._id)}
          {getProperty(
            "Joined On",
            dayjs(currentUserData.createdAt).format("MMM, DD, YYYY hh:mm A")
          )}
        </div>
        <div>
          <Button
            className="w-full mt-5"
            block
            onClick={onProfilePictureUpdate}
            disabled={!selectedFile}
            loading={loading}
          >
            Update Profile Picture
          </Button>
          <Button
            className="w-full mt-5"
            block
            onClick={onLogout}
            disabled={loading}
            loading={loading && !selectedFile}
          >
            Logout
          </Button>
        </div>
      </div>
    </Drawer>
  );
};

export default CurrentUserInfo;
