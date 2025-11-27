"use server";

import { connectMongoDB } from "@/config/mongodb-config";
import UserModel from "@/models/user-model";

connectMongoDB();

// ✔ Get ALL users
export async function GetAllUsers() {
  try {
    const users = await UserModel.find().lean();
    return { success: true, data: JSON.parse(JSON.stringify(users)) };
  } catch (err) {
    return { success: false, message: "Failed to load users" };
  }
}

// ✔ Ban user
export async function BanUser(userId: string, reason: string) {
  try {
    await UserModel.findByIdAndUpdate(userId, {
      isBanned: true,
      banReason: reason,
    });

    return { success: true, message: "User banned successfully" };
  } catch (err) {
    return { success: false, message: "Failed to ban user" };
  }
}

// ✔ Unban user
export async function UnbanUser(userId: string) {
  try {
    await UserModel.findByIdAndUpdate(userId, {
      isBanned: false,
      banReason: "",
    });

    return { success: true, message: "User unbanned successfully" };
  } catch (err) {
    return { success: false, message: "Failed to unban user" };
  }
}

// ✔ Update role
export async function UpdateUserRole(id: string, newRole: "admin" | "user") {
  try {
    await UserModel.findByIdAndUpdate(id, { role: newRole });

    return {
      success: true,
      updatedRole: newRole,
      message: "Role updated successfully",
    };
  } catch (err) {
    return { success: false, message: "Failed to update role" };
  }
}
