import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../../api/axios";
import { toast } from "react-toastify";

export default function AddProduct() {
  const [formData, setFormData] = useState({
    title: "",
    price: "",
    description: "",
    category: "Electronics",
    images: "",
    offer: 0,
  });
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const categories = ["Clothes", "Electronics", "Furniture", "Miscellaneous", "Shoes"];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.title.trim()) newErrors.title = "Title is required.";
    if (!formData.price) newErrors.price = "Price is required.";
    if (!formData.description.trim()) newErrors.description = "Description is required.";
    if (!formData.images.trim()) newErrors.images = "Image URL is required.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const imagesArray = formData.images.split(",").map(url => url.trim());
    const productData = { ...formData, images: imagesArray };
    const token = localStorage.getItem("token");

    const addProductPromise = axios.post("/products", productData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    toast.promise(
      addProductPromise,
      {
        pending: 'Adding product...',
        success: 'Product added successfully!',
        error: 'Failed to add product.'
      }
    ).then(() => {
      navigate("/admin/products");
    }).catch(() => {
      // toast.error is handled by toast.promise
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold mb-6 text-center text-blue-600">
        Add New Product
      </h2>
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="col-span-1 md:col-span-2">
            <label className="block text-gray-700">Title</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="w-full mt-1 p-2 border rounded-md"
            />
            {errors.title && (
              <p className="text-red-500 text-sm">{errors.title}</p>
            )}
          </div>
          <div>
            <label className="block text-gray-700">Price</label>
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleChange}
              className="w-full mt-1 p-2 border rounded-md"
            />
            {errors.price && (
              <p className="text-red-500 text-sm">{errors.price}</p>
            )}
          </div>
          <div>
            <label className="block text-gray-700">Category</label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="w-full mt-1 p-2 border rounded-md"
            >
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>
          <div className="col-span-1 md:col-span-2">
            <label className="block text-gray-700">Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="w-full mt-1 p-2 border rounded-md h-24"
            />
            {errors.description && (
              <p className="text-red-500 text-sm">{errors.description}</p>
            )}
          </div>
          <div className="col-span-1 md:col-span-2">
            <label className="block text-gray-700">Images (comma-separated URLs)</label>
            <input
              type="text"
              name="images"
              value={formData.images}
              onChange={handleChange}
              className="w-full mt-1 p-2 border rounded-md"
            />
            {errors.images && (
              <p className="text-red-500 text-sm">{errors.images}</p>
            )}
          </div>
          <div>
            <label className="block text-gray-700">Offer (%)</label>
            <input
              type="number"
              name="offer"
              value={formData.offer}
              onChange={handleChange}
              min="0"
              max="100"
              className="w-full mt-1 p-2 border rounded-md"
            />
          </div>
        </div>
        <button
          type="submit"
          className="w-full bg-blue-600 text-white p-3 rounded-md mt-6 hover:bg-blue-700 transition"
        >
          Add Product
        </button>
      </form>
    </div>
  );
}