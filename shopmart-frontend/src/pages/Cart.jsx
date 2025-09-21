import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useAuth } from "../context/AuthContext";
import axios from "../api/axios";

export default function Cart() {
  const [cart, setCart] = useState([]);
  const navigate = useNavigate();
  const { user } = useAuth();

  const fetchCart = async () => {
    try {
      if (user) {
        const token = localStorage.getItem("token");
        const res = await axios.get("/cart", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setCart(res.data || []);
      } else {
        const savedCart = JSON.parse(localStorage.getItem("cart")) || [];
        setCart(savedCart);
      }
    } catch (err) {
      toast.error("Failed to load cart.");
    }
  };

  useEffect(() => {
    fetchCart();
  }, [user]);

  const updateQuantity = async (productId, newQuantity) => {
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        "/cart",
        { productId, quantity: newQuantity },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      fetchCart();
    } catch (err) {
      toast.error("Could not update quantity");
    }
  };

  const handleDecrease = (productId, currentQty) => {
    if (currentQty > 1) {
      updateQuantity(productId, currentQty - 1);
    } else {
      handleRemove(productId);
    }
  };

  const handleAdd = (productId, currentQty) => {
    updateQuantity(productId, currentQty + 1);
  };

  const handleRemove = async (productId) => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`/cart/${productId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      fetchCart();
      toast.success("Item removed from cart");
    } catch (err) {
      toast.error("Failed to remove item");
    }
  };

  const totalAmount = cart.reduce((total, item) => {
    const price = item.product?.price ?? 0;
    const offer = item.product?.offer ?? 0;
    const quantity = item?.quantity ?? 0;
    const finalPrice = price * (1 - offer / 100);
    return total + finalPrice * quantity;
  }, 0);

  return (
    <div className="px-2 py-8 max-w-5xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-blue-600">Your Cart</h1>

      {cart.length === 0 ? (
        <p className="text-gray-500">
          {user ? "Your cart is empty." : "Please login to view your cart."}
        </p>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {cart.map((item) => {
              const product = item.product;
              if (!product) return null;

              const price = product?.price ?? 0;
              const offer = product?.offer ?? 0;
              const quantity = item?.quantity ?? 0;
              const discountedPrice = price * (1 - offer / 100);
              const total = discountedPrice * quantity;
              const imageUrl = product.images?.[0] || "https://placehold.co/300x300?text=No+Image";

              return (
                <div
                  key={product._id}
                  className="bg-white shadow-lg rounded-xl p-4 relative cursor-pointer hover:shadow-xl transition"
                  onClick={() => navigate(`/product/${product._id}`)}
                >
                  <img
                    src={imageUrl}
                    alt={product.title || "No Title"}
                    className="w-full h-64 object-cover rounded-lg mb-4"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = "https://placehold.co/300x300?text=No+Image";
                    }}
                  />
                  <div className="p-3 bg-gray-50 rounded shadow-sm">
                    <h2 className="text-lg font-semibold mb-1 text-gray-800">
                      {product.title || "No Title"}
                    </h2>

                    {offer > 0 ? (
                      <div className="flex items-baseline space-x-2">
                        <p className="text-gray-400 line-through">
                          ₹{price}
                        </p>
                        <p className="text-blue-600 font-bold">
                          ₹{discountedPrice.toFixed(0)}
                        </p>
                      </div>
                    ) : (
                      <p className="text-blue-600 font-bold">₹{price}</p>
                    )}

                    <div className="flex items-center justify-between mb-1 mt-2">
                      <p className="text-gray-700">Quantity: {quantity}</p>
                      <div className="flex gap-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDecrease(product._id, quantity);
                          }}
                          className="bg-red-500 text-white w-7 h-7 rounded hover:bg-red-600 transition"
                        >
                          −
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleAdd(product._id, quantity);
                          }}
                          className="bg-green-500 text-white w-7 h-7 rounded hover:bg-green-600 transition"
                        >
                          +
                        </button>
                      </div>
                    </div>
                    <p className="text-gray-800 mt-2 font-semibold">
                      Total: ₹{total.toFixed(0)}
                    </p>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRemove(product._id);
                      }}
                      className="mt-3 bg-red-500 text-white px-4 py-1 rounded hover:bg-red-600 transition"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-8 flex justify-between items-center text-xl font-semibold text-green-600">
            <div>Total Amount: ₹{totalAmount.toFixed(0)}</div>
          </div>
        </>
      )}
    </div>
  );
}