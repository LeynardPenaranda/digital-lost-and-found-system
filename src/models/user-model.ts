import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    clerkUserId: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    userName: { type: String, required: true, unique: true },
    email: { type: String, required: false },
    profilePicture: { type: String, required: false },
    role: {
      type: String,
      enum: ["admin", "user"],
      default: "user",
    },

    // NEW FIELDS
    isBanned: { type: Boolean, default: false },
    banReason: { type: String, default: "" },
  },
  { timestamps: true }
);

if (mongoose.models && mongoose.models["users"]) {
  mongoose.deleteModel("users");
}

const UserModel = mongoose.model("users", userSchema);
export default UserModel;
