import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useProducts } from "../context/ProductContext";
import { useAuth } from "../context/AuthContext";

const ProductDetail = () => {
  const { productId } = useParams();
  const { fetchProductById, addToCart } = useProducts();
  const { user } = useAuth();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const getProduct = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await fetchProductById(productId);
        setProduct(data);
      } catch (err) {
        setError("Failed to load product.");
      } finally {
        setLoading(false);
      }
    };
    getProduct();
  }, [productId, fetchProductById]);

  const handleAddToCart = () => {
    addToCart(product, user); // only allows logged-in users
  };

  if (loading) return <p className="text-center mt-10">Loading...</p>;
  if (error) return <p className="text-center mt-10 text-red-500">{error}</p>;
  if (!product) return <p className="text-center mt-10">Product not found.</p>;

  return (
    <div className="max-w-5xl mx-40% p-6 flex flex-col md:flex-row gap-6">
      <div className="md:w-1/2">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-auto rounded-md object-cover shadow"
        />
      </div>
      <div className="md:w-1/2 flex flex-col">
        <h1 className="text-3xl font-bold mb-4">{product.name}</h1>
        <p className="text-gray-700 mb-4">{product.description}</p>
        <p className="text-indigo-600 font-bold text-2xl mb-6">${product.price}</p>
        <button
          className="bg-indigo-500 text-white px-6 py-3 rounded hover:bg-indigo-600 transition"
          onClick={handleAddToCart}
        >
          Add to Cart
        </button>
      </div>
    </div>
  );
};

export default ProductDetail;
