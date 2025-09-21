import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    try {
      const res = await axios.get("http://localhost:3000/api/orders/myorders", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      setOrders(res.data);
      setLoading(false);
    } catch (error) {
      console.error("Order fetch error:", error);
      toast.error("Failed to fetch orders");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  return (
    <div className="min-h-screen py-10 px-4 md:px-10 bg-gray-50">
      <ToastContainer />
      <h1 className="text-3xl font-bold mb-6 text-center text-blue-600">My Orders</h1>
      {loading ? (
        <p className="text-center">Loading orders...</p>
      ) : orders.length === 0 ? (
        <p className="text-center text-gray-600">You have no orders.</p>
      ) : (
        <div className="space-y-6">
          {orders.map((order, index) => (
            <div
              key={order._id || index}
              className="bg-white rounded-xl shadow-md p-6 border border-gray-200"
            >
              <h2 className="text-xl font-semibold mb-4">Order #{orders.length - index}</h2>
              <p className="text-sm text-gray-500 mb-2">
                Placed on: {new Date(order.createdAt).toLocaleString()}
              </p>

              <div className="mb-4 text-sm text-gray-600 space-y-1">
                <p>
                  <span className="font-medium text-gray-700">Payment Status:</span>{" "}
                  <span
                    className={`font-semibold ${
                      order.paymentStatus === "Paid" ? "text-green-600" : "text-yellow-600"
                    }`}
                  >
                    {order.paymentStatus || "Pending"}
                  </span>
                </p>
                {order.paymentId && (
                  <p>
                    <span className="font-medium">Payment ID:</span> {order.paymentId}
                  </p>
                )}
                {order.razorpayOrderId && (
                  <p>
                    <span className="font-medium">Razorpay Order ID:</span> {order.razorpayOrderId}
                  </p>
                )}
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {order.items.map((item, i) => (
                  <div
                    key={i}
                    className="flex bg-gray-100 rounded-lg shadow-sm p-3"
                  >
                    <img
                      src={item.images[0]}
                      alt={item.title}
                      className="w-20 h-20 object-cover rounded-lg mr-4"
                    />
                    <div>
                      <h3 className="font-semibold">{item.title}</h3>
                      <p>Price: ₹{item.price}</p>
                      <p>Quantity: {item.quantity}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Orders;