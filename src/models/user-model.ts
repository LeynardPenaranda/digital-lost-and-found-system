import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    clerkUserId: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    userName: { type: String, required: true, unique: true },
    email: { type: String, required: false, unique: false },
    profilePicture: { type: String, required: false },
    role: {
      type: String,
      enum: ["admin", "user"], // restricts allowed values
      default: "user", // default to 'user'
    },
    bio: { type: String, required: false },
  },
  { timestamps: true }
);

// check if the model already exists (to avoid OverwriteModelError), if yes then delete it

if (mongoose.models && mongoose.models["users"]) {
  mongoose.deleteModel("users");
}

// if model not exists, create it using the schema
const UserModel = mongoose.model("users", userSchema);
export default UserModel;
