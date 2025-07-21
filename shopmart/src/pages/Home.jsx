import { useEffect, useState } from "react";
import axios from "../api/axios";
import { FaShoppingCart } from "react-icons/fa";
import { toast } from "react-toastify";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { FaFilter } from "react-icons/fa";

export default function Home() {
  const [products, setProducts] = useState([]);
  const [activeFilter, setActiveFilter] = useState("All Products");
  const [showDropdown, setShowDropdown] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const categories = ["Clothes", "Electronics", "Furniture", "Miscellaneous", "Shoes"];

  const fetchAllProducts = async () => {
    try {
      const res = await axios.get("/products");
      setProducts(res.data);
      setActiveFilter("All Products");
    } catch (err) {
      toast.error("Failed to fetch products.");
    }
  };

  const fetchProductsByCategory = async (category) => {
    try {
      const res = await axios.get(`/products?category=${category}`);
      setProducts(res.data);
      setActiveFilter(category);
      setShowDropdown(false);
    } catch (err) {
      toast.error(`Failed to fetch products for category: ${category}`);
    }
  };

  useEffect(() => {
    fetchAllProducts();
  }, []);

  useEffect(() => {
    if (location.state?.highlightProductId && products.length > 0) {
      const productElement = document.getElementById(
        `product-${location.state.highlightProductId}`
      );
      if (productElement) {
        productElement.scrollIntoView({ behavior: "smooth", block: "center" });
        productElement.classList.add("ring", "ring-blue-400");
        setTimeout(() => {
          productElement.classList.remove("ring", "ring-blue-400");
        }, 1000);
      }
    }
  }, [products, location.state]);

  const addToCart = async (e, product) => {
    e.stopPropagation();

    if (!user) {
      toast.error("Please login to add to cart");
      navigate("/login");
      return;
    }

    try {
      const token = localStorage.getItem("token");

      await axios.post(
        "/cart/add",
        {
          productId: product._id,
          title: product.title,
          price: product.price,
          images: product.images,
          offer: product.offer, // Now including the offer field
          quantity: 1,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      toast.dismiss();
      toast.success("Added to cart");
    } catch (error) {
      toast.error("Failed to add to cart");
    }
  };

  return (
    <div className="px-4 py-8 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-blue-600">
          {activeFilter === "All Products" ? "All Products" : activeFilter}
        </h1>
        <div className="flex items-center space-x-4">
          <button
            onClick={fetchAllProducts}
            className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded-md transition duration-300"
          >
            Show All
          </button>
          <div className="relative inline-block text-left">
            <button
              onClick={() => setShowDropdown(!showDropdown)}
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md transition duration-300 flex items-center gap-2"
            >
              <FaFilter /> Filter
            </button>
            {showDropdown && (
              <div className="origin-top-right absolute z-10 right-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
                <div className="py-1">
                  {categories.map((category) => (
                    <button
                      key={category}
                      onClick={() => fetchProductsByCategory(category)}
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                    >
                      {category}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products.map((product) => (
          <div
            key={product._id}
            id={`product-${product._id}`}
            onClick={() => navigate(`/product/${product._id}`)}
            className="bg-white shadow-md rounded-xl p-4 relative transform transition-transform duration-300 hover:scale-105 cursor-pointer"
          >
            <img
              src={product.images?.[0] || "/no-image.png"}
              alt={product.title}
              className="w-full h-56 object-cover rounded-lg mb-4"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = "/no-image.png";
              }}
            />
            {product.offer > 0 && (
              <div className="absolute top-6 left-6 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                {product.offer}% OFF
              </div>
            )}
            <h2 className="text-lg font-semibold">{product.title}</h2>
            {product.offer > 0 ? (
              <div className="flex items-baseline space-x-2">
                <p className="text-gray-400 line-through">
                  ₹{product.price}
                </p>
                <p className="text-blue-600 font-bold mb-2">
                  ₹{(product.price * (1 - product.offer / 100)).toFixed(0)}
                </p>
              </div>
            ) : (
              <p className="text-blue-600 font-bold mb-2">₹{product.price}</p>
            )}

            <button
              onClick={(e) => addToCart(e, product)}
              className="absolute bottom-4 right-4 bg-blue-600 text-white p-2 rounded-full hover:bg-blue-700 transition"
            >
              <FaShoppingCart />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}