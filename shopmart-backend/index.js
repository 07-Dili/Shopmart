import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import razorpayRoutes from './routes/razorpayRoutes.js';

import userRoutes from "./routes/users.js";
import productRoutes from "./routes/products.js";
import authRoutes from "./routes/auth.js";
import cartRoutes from "./routes/cart.js";
import orderRoutes from "./routes/orders.js";


dotenv.config();


const app = express();
connectDB();


const allowedOrigins = [
  "http://localhost:5173",          
  "https://your-frontend.onrender.com" 
];

app.use(cors({
  origin: allowedOrigins,
  credentials: true,
}));

app.use(express.json());


app.use("/api/users", userRoutes);
app.use("/api/auth", authRoutes);      
app.use("/api/cart", cartRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/products", productRoutes);
app.use('/api/payment', razorpayRoutes);


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
