"use server";

import { connectMongoDB } from "@/config/mongodb-config";
import UserModel from "@/models/user-model";

connectMongoDB();

// ✔ Get ALL users
export async function GetAllUsers() {
  const users = await UserModel.find().lean();
  return JSON.parse(JSON.stringify(users));
}

// ✔ Delete a user
export async function DeleteUser(id: string) {
  await UserModel.findByIdAndDelete(id);
  return { success: true };
}

// ✔ Update user role dynamically
export async function UpdateUserRole(id: string, newRole: "admin" | "user") {
  await UserModel.findByIdAndUpdate(id, { role: newRole });
  return { success: true, updatedRole: newRole };
}
