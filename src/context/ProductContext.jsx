import React, { createContext, useState, useContext } from "react";
import toast from "react-hot-toast";

export const ProductContext = createContext();

export const ProductProvider = ({ children }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch all products
  const fetchProducts = async (query = {}) => {
    setLoading(true);
    setError(null);
    try {
      const url = new URL("/api/products", window.location.origin);
      if (query.q) url.searchParams.append("q", query.q);
      const res = await fetch(url, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch products");
      const data = await res.json();
      setProducts(data.products || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Fetch single product by ID
  const fetchProductById = async (id) => {
    const res = await fetch(`/api/products/${id}`, { credentials: "include" });
    if (!res.ok) throw new Error("Failed to fetch product");
    return await res.json();
  };

  // Add to Cart (protected: pass user object)
  const addToCart = async (product, user) => {
    if (!user) {
      toast.error("You must be logged in to add products to cart!");
      return;
    }

    try {
      const res = await fetch("/api/cart/items", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId: product._id, qty: 1 })
      });
      const result = await res.json();
      if (!res.ok) {
        toast.error(result.message || "Failed to add to cart");
        return;
      }
      toast.success(`${product.name} added to cart!`);
      // (Optionally update any local cart state here if needed)
    } catch (err) {
      toast.error("Network error, please try again.");
    }
  };

  const addProduct = async (formData, user) => {
    if (!user?.isAdmin) return toast.error("Not authorized!");
    try {
      const res = await fetch("/api/products", {
        method: "POST",
        credentials: "include",
        body: formData,
      });
      if (!res.ok) throw new Error("Failed to add product");
      const data = await res.json();
      setProducts((prev) => [data.product, ...prev]);
      toast.success("Product added successfully!");
      return data;
    } catch (err) {
      console.error(err.message);
      toast.error(err.message);
      return null;
    }
  };

  const editProduct = async (id, updatedProduct, user) => {
    if (!user?.isAdmin) return toast.error("Not authorized!");
    try {
      const res = await fetch(`/api/products/${id}`, {
        method: "PUT",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedProduct),
      });
      if (!res.ok) throw new Error("Failed to update product");
      const data = await res.json();
      setProducts((prev) =>
        prev.map((product) => (product._id === id ? data : product))
      );
      toast.success("Product updated successfully!");
    } catch (err) {
      toast.error(err.message);
    }
  };

  // ✅ New: Delete product
  const deleteProduct = async (id, user) => {
    if (!user?.isAdmin) return toast.error("Not authorized!");
    try {
      const res = await fetch(`/api/products/${id}`, {
        method: "DELETE",
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to delete product");
      setProducts((prev) => prev.filter((product) => product._id !== id));
      toast.success("Product deleted successfully!");
    } catch (err) {
      toast.error(err.message);
    }
  };

  return (
    <ProductContext.Provider
      value={{
        products,
        loading,
        error,
        fetchProducts,
        addToCart,
        addProduct,
        editProduct,
        deleteProduct,
      }}
    >
      {children}
    </ProductContext.Provider>
  );
};

// Custom hook to use ProductContext
export const useProducts = () => useContext(ProductContext);
