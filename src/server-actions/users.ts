"use server";

import { connectMongoDB } from "@/config/mongodb-config";
import UserModel from "@/models/user-model";
import { currentUser } from "@clerk/nextjs/server";

connectMongoDB();

export const GetCurrentUserFromMongoDB = async () => {
  try {
    // check if user exists in MongoDB based on Clerk user ID
    const clerkUser = await currentUser();
    const mongoUser = await UserModel.findOne({ clerkUserId: clerkUser?.id });
    if (mongoUser) {
      return JSON.parse(JSON.stringify(mongoUser));
    }

    // if the user not in the MongoDB, then create a new user
    const newUserPayload = {
      clerkUserId: clerkUser?.id!,
      name: clerkUser?.firstName + " " + clerkUser?.lastName || "Unknown User",
      userName: clerkUser?.username,
      email: clerkUser?.emailAddresses[0]?.emailAddress || "",
      profilePicture: clerkUser?.imageUrl,
      role: "user",
    };

    const newUser = await UserModel.create(newUserPayload);
    return JSON.parse(JSON.stringify(newUser));
  } catch (error: any) {
    return {
      error: error.message,
    };
  }
};

export const UpdateUserProfilePicture = async (
  userId: string,
  payload: any
) => {
  try {
    const updatedUserPicture = await UserModel.findByIdAndUpdate(
      userId,
      payload,
      {
        new: true,
      }
    );
    return JSON.parse(JSON.stringify(updatedUserPicture));
  } catch (error: any) {
    return {
      error: error.message,
    };
  }
};

export const GetAllUsers = async () => {
  try {
    const users = await UserModel.find({});
    return JSON.parse(JSON.stringify(users));
  } catch (error: any) {
    return {
      error: error.message,
    };
  }
};
