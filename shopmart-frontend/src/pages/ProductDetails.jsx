import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "../api/axios";

export default function ProductDetails() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [selectedSize, setSelectedSize] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get(`/products/${id}`)
      .then((res) => setProduct(res.data))
      .catch((err) => {
        setProduct({ error: true });
      });
  }, [id]);

  if (product?.error) {
    return <div className="p-8 text-red-600">Product not found or invalid ID.</div>;
  }

  const handleBuy = () => {
    const discountedPrice = product.offer > 0 ? product.price * (1 - product.offer / 100) : product.price;
    navigate("/payment", { state: { product, discountedPrice, size: selectedSize } });
  };

  if (!product) return <div className="p-8 text-gray-600">Loading...</div>;

  const discountedPrice = product.offer > 0 ? product.price * (1 - product.offer / 100) : product.price;

  return (
    <div className="px-4 flex justify-center items-center" style={{ minHeight: "calc(100vh - 6rem)" }}>
      <div className="max-w-5xl w-full bg-white rounded-xl shadow-lg flex flex-col md:flex-row overflow-hidden">
        <div className="md:w-1/2 w-full p-6 flex flex-col items-center justify-center bg-gray-50">
          <div className="w-full max-w-md h-80 bg-white rounded-lg shadow">
            <img
              src={product.images?.[0] || "/no-image.png"}
              alt={product.title}
              className="w-full h-full object-contain rounded-lg"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = "/no-image.png";
              }}
            />
          </div>

          <button
            onClick={handleBuy}
            className="mt-6 bg-green-600 hover:bg-green-700 text-white text-lg py-3 px-6 w-full max-w-md rounded transition"
          >
            Buy
          </button>
        </div>

        <div className="w-px bg-gray-300 hidden md:block" />

        <div className="md:w-1/2 w-full p-6 space-y-5">
          <h1 className="text-3xl font-bold text-blue-700">{product.title}</h1>
          <p className="text-gray-700 leading-relaxed">{product.description}</p>
          
          <div className="flex items-baseline space-x-2">
            {product.offer > 0 && (
              <p className="text-xl text-gray-400 line-through">
                ₹{product.price}
              </p>
            )}
            <p className="text-2xl font-semibold text-green-600">
              ₹{discountedPrice}
            </p>
            {product.offer > 0 && (
              <span className="text-sm font-bold text-red-500">
                ({product.offer}% OFF)
              </span>
            )}
          </div>

          {product.sizes && product.sizes.length > 0 && (
            <div>
              <h3 className="text-lg font-medium text-gray-800 mb-2">Sizes</h3>
              <div className="flex gap-2">
                {product.sizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`px-4 py-2 border rounded-md font-semibold transition ${
                      selectedSize === size
                        ? "bg-blue-600 text-white border-blue-600"
                        : "bg-white text-gray-700 hover:bg-gray-100"
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}