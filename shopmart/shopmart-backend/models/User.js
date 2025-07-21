import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, default: "user" },
  cart: [
    {
      productId: String,
      title: String,
      price: Number,
      quantity: Number,
      images: [String],
    },
  ],
  orders: [
    {
      items: [
        {
          productId: String,
          title: String,
          price: Number,
          quantity: Number,
          images: [String],
        },
      ],
      orderedAt: { type: Date, default: Date.now },
    },
  ],
});

export default mongoose.model("User", UserSchema);