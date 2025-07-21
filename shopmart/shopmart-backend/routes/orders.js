import express from "express";
import { protect, admin } from "../middleware/auth.js";
import Order from "../models/Order.js";

const router = express.Router();

router.post("/", protect, async (req, res) => {
  try {
    const { items, paymentId, razorpayOrderId, razorpaySignature } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ message: "No items provided" });
    }

    const order = new Order({
      user: req.user._id,
      items,
      paymentId,
      razorpayOrderId,
      razorpaySignature,
      paymentStatus: paymentId ? "Paid" : "Pending",
    });

    await order.save();

    res.status(201).json({ message: "Order placed successfully", order });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

router.get("/myorders", protect, async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// Admin routes
router.get("/admin", protect, admin, async (req, res) => {
  try {
    const orders = await Order.find({}).populate("user", "name email");
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch orders" });
  }
});

router.put("/:id", protect, admin, async (req, res) => {
  const { paymentStatus, shippingStatus } = req.body;
  try {
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    if (paymentStatus) {
      order.paymentStatus = paymentStatus;
    }
    if (shippingStatus) {
      order.shippingStatus = shippingStatus;
    }

    const updatedOrder = await order.save();
    res.json(updatedOrder);
  } catch (error) {
    res.status(500).json({ message: "Failed to update order" });
  }
});

export default router;