"use client";

import { useState } from "react";
import { UploadButton } from "@/lib/uploadthing";
import { UpdateUserProfilePicture } from "@/server-actions/users";
import { message, Spin } from "antd";

const ProfileUploader = ({ userId }: { userId: string }) => {
  const [isUploading, setIsUploading] = useState(false);

  return (
    <div className="flex flex-col items-center gap-3">
      <span>Click below to update Profile</span>
      <UploadButton
        endpoint="imageUploader"
        onUploadBegin={() => setIsUploading(true)}
        onClientUploadComplete={async (res) => {
          setIsUploading(false);
          const imageUrl = res?.[0]?.url;
          if (imageUrl) {
            await UpdateUserProfilePicture(userId, {
              profilePicture: imageUrl,
            });
            message.success("Profile picture updated!");
          }
        }}
        onUploadError={(error) => {
          setIsUploading(false);
          message.error(error.message || "Upload failed");
        }}
      />
      {isUploading && (
        <div className="flex items-center gap-2 text-gray-500">
          <Spin size="small" />
          <span>Please wait...Uploading...</span>
        </div>
      )}
    </div>
  );
};

export default ProfileUploader;
