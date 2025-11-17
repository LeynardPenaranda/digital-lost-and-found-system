import mongoose from "mongoose";

const lostItemsSchema = new mongoose.Schema(
  {
    reportedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
      required: true,
    },
    item: {
      type: String,
      default: "",
    },
    location: {
      type: String,
      default: "",
    },
    itemDescription: {
      type: String,
      default: "",
    },
    lostItemsImages: {
      type: [String],
      default: [],
    },
    lostItemStatus: {
      type: String,
      enum: ["pending", "found"],
      default: "pending",
    },
  },
  { timestamps: true }
);

// ✅ Safe model reuse — avoids deleteModel issues
const LostItemModel =
  mongoose.models.lostItem || mongoose.model("lostItem", lostItemsSchema);

export default LostItemModel;
