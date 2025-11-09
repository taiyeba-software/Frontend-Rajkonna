import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useProducts } from "../context/ProductContext";
import toast from "react-hot-toast";

// 🔧 Use environment variable or fallback to localhost
const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

const CartPage = () => {
  const { user } = useAuth();
  const { removeItemFromCart, clearCart, updateCartItemQuantity } = useProducts();
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [removingItems, setRemovingItems] = useState(new Set());
  const [updatingQuantities, setUpdatingQuantities] = useState(new Set());

  const fetchCart = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/api/cart`, {
        method: "GET",
        credentials: "include"
      });
      if (!res.ok) throw new Error("Failed to fetch cart");
      const data = await res.json();
      setCart(data);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load cart");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!user) return;
    fetchCart();
  }, [user]);

  const handleRemoveItem = async (productId) => {
    setRemovingItems(prev => new Set(prev).add(productId));
    try {
      await removeItemFromCart(productId, user);
      await fetchCart(); // Refresh cart data
    } catch (err) {
      // Error already handled in removeItemFromCart
    } finally {
      setRemovingItems(prev => {
        const newSet = new Set(prev);
        newSet.delete(productId);
        return newSet;
      });
    }
  };

  const handleClearCart = async () => {
    try {
      await clearCart(user);
      await fetchCart(); // Refresh cart data
    } catch (err) {
      // Error already handled in clearCart
    }
  };

  const handleUpdateQuantity = async (productId, newQty) => {
    setUpdatingQuantities(prev => new Set(prev).add(productId));
    try {
      await updateCartItemQuantity(productId, newQty, user);
      await fetchCart(); // Refresh cart data
    } catch (err) {
      // Error already handled in updateCartItemQuantity
    } finally {
      setUpdatingQuantities(prev => {
        const newSet = new Set(prev);
        newSet.delete(productId);
        return newSet;
      });
    }
  };

  if (!user) {
    return <p className="p-4 text-center text-red-500">Please log in to view your cart.</p>;
  }
  if (loading) {
    return <p className="p-4 text-center">Loading cart...</p>;
  }
  if (!cart || cart.items.length === 0) {
    return <p className="p-4 text-center">Your cart is empty.</p>;
  }

  // Destructure totals from cart data
  const { items, subtotal, deliveryCharge, discountPercent, discountAmount, totalPayable } = cart;

  const colorPalette = ["#d3f8e2","#e4c1f9","#f694c1","#ede7b1","#a9def9"];

  return (
    <div className="min-h-screen bg-background text-black p-6 mx-10%">
      <h1 className="text-3xl font-bold mb-6">Your Cart</h1>

      {/* List of items */}
      <div className="space-y-4">
        {items.map(({ product, qty, lineTotal }, index) => {
          const bgColor = colorPalette[index % colorPalette.length];
          return (
            <div
              key={product._id}
              className="flex flex-col md:flex-row md:items-center justify-between border rounded-lg p-4"
              style={{ backgroundColor: bgColor }}
            >
              <div className="flex items-center gap-4">
                {product.images && product.images[0] && (
                  <img
                    src={product.images[0].url}
                    alt={product.name}
                    className="w-24 h-24 object-cover rounded"
                  />
                )}
                <div>
                  <h2 className="text-xl font-semibold">{product.name}</h2>
                  <p>Price: ৳{product.price}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <button
                      onClick={() => handleUpdateQuantity(product._id, qty - 1)}
                      disabled={updatingQuantities.has(product._id) || qty <= 1}
                      className="px-2 py-1 bg-gray-300 text-black rounded hover:bg-gray-400 disabled:opacity-50 text-sm"
                    >
                      -
                    </button>
                    <span className="px-2">{qty}</span>
                    <button
                      onClick={() => handleUpdateQuantity(product._id, qty + 1)}
                      disabled={updatingQuantities.has(product._id)}
                      className="px-2 py-1 bg-gray-300 text-black rounded hover:bg-gray-400 disabled:opacity-50 text-sm"
                    >
                      +
                    </button>
                    {updatingQuantities.has(product._id) && <span className="text-sm text-gray-500">Updating...</span>}
                  </div>
                </div>
              </div>
              <div className="text-right flex flex-col items-end gap-2">
                <p className="font-bold">Item Total: ৳{lineTotal}</p>
                <button
                  onClick={() => handleRemoveItem(product._id)}
                  disabled={removingItems.has(product._id)}
                  className="px-3 py-1 text-white rounded disabled:opacity-50 text-sm"
                  style={{ backgroundColor: 'crimson' }}
                >
                  {removingItems.has(product._id) ? "Removing..." : "Remove"}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Totals summary */}
      <div className="mt-6 p-4 border rounded-lg bg-background/80 max-w-full ml-auto">
        <p>Subtotal: ৳{subtotal}</p>
        <p>Delivery Charge: ৳{deliveryCharge}</p>
        <p>Discount: {discountPercent}% (৳{discountAmount})</p>
        <hr className="my-2"/>
        <p className="text-lg font-bold">Total: ৳{totalPayable}</p>
        <div className="mt-4 flex justify-end">
          <button
            onClick={handleClearCart}
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 text-sm"
          >
            Clear Cart
          </button>
        </div>
      </div>

      {/* Dummy Checkout button */}
      <div className="mt-6 flex justify-center">
        <button
          onClick={() => toast.success("Order placed successfully!")}
          className="cosmic-button"
        >
          Checkout
        </button>
      </div>
    </div>
  );
};

export default CartPage;
