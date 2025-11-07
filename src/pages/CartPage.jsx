import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";

const CartPage = () => {
  const { user } = useAuth();
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    // Fetch the user's cart
    const fetchCart = async () => {
      try {
        const res = await fetch("/api/cart", {
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
    fetchCart();
  }, [user]);

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
                  <p>Quantity: {qty}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-bold">Item Total: ৳{lineTotal}</p>
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
