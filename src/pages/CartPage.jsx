import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useProducts } from "../context/useProducts";
import { normalizeId } from "../lib/utils";
import toast from "react-hot-toast";
import ProfileSidebar from "../components/ProfileSidebar";
import api from "@/api/axiosInstance";

const CartPage = () => {
  const { user } = useAuth();
  const { removeItemFromCart, clearCart, updateCartItemQuantity } = useProducts();
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [removingItems, setRemovingItems] = useState(new Set());
  const [updatingQuantities, setUpdatingQuantities] = useState(new Set());
  const [isProfileSidebarOpen, setIsProfileSidebarOpen] = useState(false);
  const [isCheckingOut, setIsCheckingOut] = useState(false);

  const fetchCart = async () => {
    setLoading(true);
    try {
      const { data } = await api.get("/cart");
      setCart(data);
    } catch (error) {
      console.error(error);
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
    } catch {
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
    } catch {
      // Error already handled in clearCart
    }
  };

  const handleUpdateQuantity = async (productId, newQty) => {
    setUpdatingQuantities(prev => new Set(prev).add(productId));
    try {
      await updateCartItemQuantity(productId, newQty, user);
      await fetchCart(); // Refresh cart data
    } catch {
      // Error already handled in updateCartItemQuantity
    } finally {
      setUpdatingQuantities(prev => {
        const newSet = new Set(prev);
        newSet.delete(productId);
        return newSet;
      });
    }
  };

  const handleCheckout = async () => {
    setIsCheckingOut(true);
    try {
      const response = await api.post("/orders", { paymentMethod: "COD" });
      if (response.status === 200) {
        toast.success("Order placed successfully!");
        await clearCart(user, true);
        await fetchCart();
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to place order");
    } finally {
      setIsCheckingOut(false);
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

  const colorPalette = [];

  return (
    <>
      <div className="min-h-screen bg-background text-black p-6 mx-10%">
          <h1 className="text-3xl font-bold mb-6">Your Cart</h1>

          {/* List of items */}
          <div className="space-y-4">
            {items.map(({ product, qty, lineTotal }, index) => {
              const bgColor = colorPalette[index % colorPalette.length];
              return (
                <div
                  key={normalizeId(product._id)}
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
                          onClick={() => handleUpdateQuantity(normalizeId(product._id), qty - 1)}
                          disabled={updatingQuantities.has(normalizeId(product._id)) || qty <= 1}
                          className="px-2 py-1 bg-gray-300 text-black rounded hover:bg-gray-400 disabled:opacity-50 text-sm"
                        >
                          -
                        </button>
                        <span className="px-2">{qty}</span>
                        <button
                          onClick={() => handleUpdateQuantity(normalizeId(product._id), qty + 1)}
                          disabled={updatingQuantities.has(normalizeId(product._id))}
                          className="px-2 py-1 bg-gray-300 text-black rounded hover:bg-gray-400 disabled:opacity-50 text-sm"
                        >
                          +
                        </button>
                        {updatingQuantities.has(normalizeId(product._id)) && <span className="text-sm text-gray-500">Updating...</span>}
                      </div>
                    </div>
                  </div>
                  <div className="text-right flex flex-col items-end gap-2">
                    <p className="font-bold">Item Total: ৳{lineTotal}</p>
                    <button
                      onClick={() => handleRemoveItem(normalizeId(product._id))}
                      disabled={removingItems.has(normalizeId(product._id))}
                      className="px-3 py-1 text-white rounded disabled:opacity-50 text-sm"
                      style={{ backgroundColor: 'crimson' }}
                    >
                      {removingItems.has(normalizeId(product._id)) ? "Removing..." : "Remove"}
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

          {/* Checkout button */}
          <div className="mt-6 flex justify-center">
            <button
              onClick={handleCheckout}
              disabled={isCheckingOut}
              className="cosmic-button disabled:opacity-50"
            >
              {isCheckingOut ? "Processing..." : "Checkout (Cash on Delivery)"}
            </button>
          </div>
        </div>

        {/* Profile Sidebar */}
        {user && (
          <ProfileSidebar
            isOpen={isProfileSidebarOpen}
            onClose={() => setIsProfileSidebarOpen(false)}
          />
        )}
      </>
  );
};

export default CartPage;
