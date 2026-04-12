import mongoose from "mongoose";

const itemSchema = new mongoose.Schema({
  brand: { type: String, required: true },
  price: { type: Number, required: true },

  department: { type: String, required: true },   // 2-digit
  category: { type: String, required: true },     // 4-digit
  styleNumber: { type: String, required: true },  // 6-digit

  imageUrl: { type: String },
  imageUrls: [{ type: String }],

  status: {
    type: String,
    enum: ["available", "sold"],
    default: "available",
  },

  markdownPrice: { type: Number, default: null },

  createdAt: { type: Date, default: Date.now },
});

itemSchema.index({ department: 1 });
itemSchema.index({ price: 1 });
itemSchema.index({ markdownPrice: 1 });
itemSchema.index({ status: 1 });
itemSchema.index({ createdAt: -1 });

export default mongoose.model("Item", itemSchema);