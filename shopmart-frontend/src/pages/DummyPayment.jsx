import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function DummyPayment() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const product = state?.product;
  const discountedPrice = state?.discountedPrice;

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    address: "",
    phoneNumber: "",
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (!product) {
      navigate("/");
    }
  }, [product, navigate]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
  };

  const validateForm = () => {
    const newErrors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^\d{10}$/;

    if (!formData.name.trim()) {
      newErrors.name = "Name is required.";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required.";
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = "Invalid email format.";
    }

    if (!formData.address.trim()) {
      newErrors.address = "Address is required.";
    }

    if (!formData.phoneNumber.trim()) {
      newErrors.phoneNumber = "Phone number is required.";
    } else if (!phoneRegex.test(formData.phoneNumber)) {
      newErrors.phoneNumber = "Invalid phone number (10 digits).";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleCheckout = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("You must be logged in to place an order.");
      return;
    }

    try {
      const res = await axios.post(
        "http://localhost:3000/api/payment/create-order",
        {
          amount: discountedPrice,
          customerDetails: formData,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const order = res.data;

      const options = {
        key: "rzp_test_hyp61Dw1epBPBq",
        amount: order.amount,
        currency: "INR",
        name: "FlopMart",
        description: product.title,
        image: product.images?.[0] || "/logo.png",
        order_id: order.id,
        handler: async function (response) {
          try {
            const verifyRes = await axios.post(
              "http://localhost:3000/api/payment/verify",
              {
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                product,
              },
              {
                headers: { Authorization: `Bearer ${token}` },
              }
            );

            if (verifyRes.data.success) {
              await axios.post(
                "http://localhost:3000/api/orders",
                {
                  items: [
                    {
                      productId: product._id,
                      title: product.title,
                      price: discountedPrice,
                      quantity: 1,
                      images: product.images,
                    },
                  ],
                  paymentId: response.razorpay_payment_id,
                  razorpayOrderId: response.razorpay_order_id,
                  razorpaySignature: response.razorpay_signature,
                },
                {
                  headers: { Authorization: `Bearer ${token}` },
                }
              );

              toast.success("Payment successful! Order placed.");
              setTimeout(() => navigate("/orders"), 1500);
            } else {
              toast.error("Payment verification failed.");
            }
          } catch (error) {
            toast.error("Something went wrong while placing the order.");
          }
        },
        theme: { color: "#3b82f6" },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      toast.error("Payment failed. Try again.");
    }
  };

  if (!product) return null;

  return (
    <div className="flex justify-center items-center pt-20">
      <ToastContainer position="top-center" autoClose={1500} hideProgressBar />
      <form
        onSubmit={handleCheckout}
        className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md"
      >
        <h2 className="text-2xl font-bold mb-6 text-center text-blue-600">
          Checkout
        </h2>

        <p className="text-lg font-semibold text-center mb-4">
          Product: {product.title}
        </p>

        <div className="mb-4">
          <input
            type="text"
            name="name"
            placeholder="Name"
            className="w-full p-3 border rounded"
            value={formData.name}
            onChange={handleChange}
          />
          {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
        </div>

        <div className="mb-4">
          <input
            type="email"
            name="email"
            placeholder="Email"
            className="w-full p-3 border rounded"
            value={formData.email}
            onChange={handleChange}
          />
          {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
        </div>

        <div className="mb-4">
          <input
            type="text"
            name="address"
            placeholder="Address"
            className="w-full p-3 border rounded"
            value={formData.address}
            onChange={handleChange}
          />
          {errors.address && <p className="text-red-500 text-sm mt-1">{errors.address}</p>}
        </div>

        <div className="mb-6">
          <input
            type="tel"
            name="phoneNumber"
            placeholder="Phone Number"
            className="w-full p-3 border rounded"
            value={formData.phoneNumber}
            onChange={handleChange}
          />
          {errors.phoneNumber && <p className="text-red-500 text-sm mt-1">{errors.phoneNumber}</p>}
        </div>

        <button
          type="submit"
          className="w-full bg-green-600 text-white p-3 rounded hover:bg-green-700 transition"
        >
          Pay ₹{discountedPrice.toFixed(0)}
        </button>
      </form>
    </div>
  );
}