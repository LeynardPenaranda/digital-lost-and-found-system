import mongoose from "mongoose";

const foundItemsSchema = new mongoose.Schema(
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
    foundItemsImages: {
      type: [String],
      default: [],
    },
    foundItemStatus: {
      type: String,
      enum: ["pending", "claimed"],
      default: "pending",
    },
  },
  { timestamps: true }
);

// ✅ Safe model reuse — avoids deleteModel issues
const FoundItemModel =
  mongoose.models.foundItem || mongoose.model("foundItem", foundItemsSchema);

export default FoundItemModel;
