import mongoose from "mongoose";

const cartItemSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  productId: { type: String, required: true },
  title: String,
  price: Number,
  quantity: Number,
  images: [String],
});

export default mongoose.model("CartItem", cartItemSchema);
