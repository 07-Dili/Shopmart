// seedProducts.js
import mongoose from "mongoose";
import axios from "axios";
import dotenv from "dotenv";
import Product from "./models/Product.js"; // Ensure this path matches your folder structure

dotenv.config();

const MONGO_URL = process.env.MONGO_URI;

const seedProducts = async () => {
  try {
    await mongoose.connect(MONGO_URL);
    console.log(" MongoDB connected");

    // Fetch data from external API
    const { data } = await axios.get("https://api.escuelajs.co/api/v1/products");

    // Optional: Clear existing products
    await Product.deleteMany();

    // Format data for your Product model
    const formattedProducts = data.map((item) => ({
      title: item.title,
      price: item.price,
      description: item.description,
      category: item.category?.name || "General",
      images: item.images || [],
    }));

    // Insert into MongoDB
    await Product.insertMany(formattedProducts);
    console.log(" Products imported successfully!");
    process.exit();
  } catch (error) {
    console.error(" Error seeding products:", error.message);
    process.exit(1);
  }
};

seedProducts();
