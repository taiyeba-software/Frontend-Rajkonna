import React, { useState } from "react";
import toast from "react-hot-toast";
import { ProductContext } from "./ProductContext";

// 🔧 Use environment variable or fallback to localhost
const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

export const ProductProvider = ({ children }) => {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // 🟢 Fetch all products
  const fetchProducts = async (query = {}) => {
    setLoading(true);
    setError(null);
    try {
      const url = new URL(`${API_BASE}/api/products`);
      if (query.q) url.searchParams.append("q", query.q);

      const res = await fetch(url, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch products");

      const data = await res.json();
      setProducts(data.products || []);
    } catch (err) {
      console.error("fetchProducts error:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // 🟢 Fetch single product by ID
  const fetchProductById = async (id) => {
    try {
      const res = await fetch(`${API_BASE}/api/products/${id}`, {
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to fetch product");
      const data = await res.json();
      return data.product || data; // backend might return {product: {...}} or directly {...}
    } catch (err) {
      console.error("fetchProductById error:", err);
      throw err;
    }
  };

  // 🟢 Add to Cart
  const addToCart = async (product, user) => {
    if (!user) {
      toast.error("You must be logged in to add products to cart!");
      return;
    }

    try {
      const res = await fetch(`${API_BASE}/api/cart/items`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId: product._id, qty: 1 }),
      });

      const result = await res.json();
      if (!res.ok) {
        toast.error(result.message || "Failed to add to cart");
        return;
      }

      toast.success(`${product.name} added to cart!`);
    } catch (err) {
      console.error("addToCart error:", err);
      toast.error("Network error, please try again.");
    }
  };

  // 🟢 Add new product (Admin)
  const addProduct = async (formData, user) => {
    if (!user?.isAdmin) return toast.error("Not authorized!");
    try {
      const res = await fetch(`${API_BASE}/api/products`, {
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

  // 🟢 Edit product (Admin)
  const editProduct = async (id, updatedProduct, user) => {
    if (!user?.isAdmin) return toast.error("Not authorized!");
    try {
      const res = await fetch(`${API_BASE}/api/products/${id}`, {
        method: "PUT",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedProduct),
      });
      if (!res.ok) throw new Error("Failed to update product");

      const data = await res.json();
      setProducts((prev) =>
        prev.map((p) => (p._id === id ? data.product || data : p))
      );
      toast.success("Product updated successfully!");
    } catch (err) {
      console.error("editProduct error:", err);
      toast.error(err.message);
    }
  };

  // 🟢 Delete product (Admin)
  const deleteProduct = async (id, user) => {
    if (!user?.isAdmin) return toast.error("Not authorized!");
    try {
      const res = await fetch(`${API_BASE}/api/products/${id}`, {
        method: "DELETE",
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to delete product");

      setProducts((prev) => prev.filter((p) => p._id !== id));
      toast.success("Product deleted successfully!");
    } catch (err) {
      console.error("deleteProduct error:", err);
      toast.error(err.message);
    }
  };

  // 🟢 Remove item from cart
  const removeItemFromCart = async (productId, user) => {
    if (!user) {
      toast.error("You must be logged in to remove items from cart!");
      return;
    }

    try {
      const res = await fetch(`${API_BASE}/api/cart/items/${productId}`, {
        method: "DELETE",
        credentials: "include",
      });

      if (!res.ok) {
        const errorData = await res.json();
        toast.error(errorData.message || "Failed to remove item from cart");
        return;
      }

      toast.success("Item removed from cart!");
      // Optionally refetch cart or update local state
      // Since CartPage fetches fresh data, we can leave it as is
    } catch (err) {
      console.error("removeItemFromCart error:", err);
      toast.error("Network error, please try again.");
    }
  };

  // 🟢 Clear entire cart
  const clearCart = async (user, skipConfirm = false) => {
    if (!user) {
      toast.error("You must be logged in to clear cart!");
      return;
    }

    // Confirm before clearing unless skipped
    if (!skipConfirm && !window.confirm("Are you sure you want to clear your entire cart?")) {
      return;
    }

    try {
      const res = await fetch(`${API_BASE}/api/cart`, {
        method: "DELETE",
        credentials: "include",
      });

      if (!res.ok) {
        const errorData = await res.json();
        toast.error(errorData.message || "Failed to clear cart");
        return;
      }

      toast.success("Cart cleared successfully!");
      // Optionally update local cart state
      setCart(null);
    } catch (err) {
      console.error("clearCart error:", err);
      toast.error("Network error, please try again.");
    }
  };

  // 🟢 Update cart item quantity
  const updateCartItemQuantity = async (productId, newQty, user) => {
    if (!user) {
      toast.error("You must be logged in to update cart!");
      return;
    }

    if (newQty < 1) {
      toast.error("Quantity must be at least 1");
      return;
    }

    try {
      const res = await fetch(`${API_BASE}/api/cart/items/${productId}`, {
        method: "PUT",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ qty: newQty }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        toast.error(errorData.message || "Failed to update quantity");
        return;
      }

      toast.success("Quantity updated!");
      // Optionally refetch cart or update local state
      // Since CartPage fetches fresh data, we can leave it as is
    } catch (err) {
      console.error("updateCartItemQuantity error:", err);
      toast.error("Network error, please try again.");
    }
  };

  return (
    <ProductContext.Provider
      value={{
        products,
        cart,
        loading,
        error,
        fetchProducts,
        fetchProductById,
        addToCart,
        addProduct,
        editProduct,
        deleteProduct,
        removeItemFromCart,
        clearCart,
        updateCartItemQuantity,
      }}
    >
      {children}
    </ProductContext.Provider>
  );
};
