import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';

const AdminDashboard = () => {
  const navigate = useNavigate();

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showDetails, setShowDetails] = useState(false);
  const [userDetails, setUserDetails] = useState(null);
  const [userDetailsLoading, setUserDetailsLoading] = useState(false);
  const [userDetailsError, setUserDetailsError] = useState(null);
  const profileCache = useRef({});
  const { user } = useAuth();




  // Fetch orders
  const fetchOrders = async (currentPage = 1) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`/api/orders?page=${currentPage}&limit=10`, {
        method: 'GET',
        credentials: 'include',
      });
      if (!response.ok) {
        throw new Error('Failed to fetch orders');
      }
      const data = await response.json();
      setOrders(data.orders || []);
      setTotalPages(data.totalPages || 1);
    } catch (err) {
      setError(err.message);
      toast.error('Failed to load orders');
    } finally {
      setLoading(false);
    }
  };



  // Fetch order details
  const fetchOrderDetails = async (orderId) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`/api/orders/${orderId}`, {
        method: 'GET',
        credentials: 'include',
      });
      if (!response.ok) {
        throw new Error('Failed to fetch order details');
      }
      const data = await response.json();
      setSelectedOrder(data);
      // Reset any previous user details
      setUserDetails(null);
      setUserDetailsError(null);

      // If current viewer is admin and order contains a user id, fetch profile
      const orderUserId = data?.user && typeof data.user === 'string' ? data.user : data?.user?._id;
      if (user && user.role === 'admin' && orderUserId) {
        try {
          setUserDetailsLoading(true);
          const profile = await getProfileCached(orderUserId);
          setUserDetails(profile);
        } catch (err) {
          setUserDetailsError(err.message || 'Failed to load customer details');
          // show a non-blocking toast but keep order details visible
          toast.error(err.message || 'Failed to load customer details');
        } finally {
          setUserDetailsLoading(false);
        }
      }
      setShowDetails(true);
    } catch {
      setError('Failed to load order details');
      toast.error('Failed to load order details');
    } finally {
      setLoading(false);
    }
  };

  // Cached profile fetcher
  async function getProfileCached(userId) {
    if (!userId) return null;
    if (profileCache.current[userId]) return profileCache.current[userId];

    const res = await fetch(`/api/auth/profile?userId=${userId}`, {
      method: 'GET',
      credentials: 'include',
    });

    if (!res.ok) {
      // Handle specific statuses for better UX
      if (res.status === 403) throw new Error('Forbidden: insufficient permissions to view profile');
      if (res.status === 404) throw new Error('Customer not found');
      if (res.status === 401) throw new Error('Unauthorized: please login');
      throw new Error('Profile fetch failed');
    }

    const data = await res.json();
    const profile = data?.user || null;
    if (profile) profileCache.current[userId] = profile;
    return profile;
  }

  // Try to extract customer info from known order fields as a best-effort fallback
  function extractCustomerInfo(order) {
    if (!order) return null;

    // If order.user is an object, prefer that
    if (order.user && typeof order.user === 'object') {
      return {
        name: order.user.name || order.user.fullName || order.user.customerName || null,
        email: order.user.email || order.user.customerEmail || null,
        phone: order.user.phone || order.user.mobile || null,
        address:
          order.user.address || order.user.location || (order.user.shipping && order.user.shipping.address) || null,
      };
    }

    // Common top-level fields used by various backends
    const name = order.customerName || order.name || order.customer || order.buyerName || null;
    const email = order.customerEmail || order.email || order.buyerEmail || null;
    const phone = order.customerPhone || order.phone || order.contact || order.buyerPhone || null;
    const address =
      order.shippingAddress || order.address || (order.shipping && order.shipping.address) || null;

    if (name || email || phone || address) return { name, email, phone, address };

    return null;
  }



  useEffect(() => {
    fetchOrders(page);
  }, [page]);

  // Prefetch profiles for visible orders on the page (admin-only)
  useEffect(() => {
    if (!orders || orders.length === 0) return;
    if (!user || user.role !== 'admin') return;

    const uniqueIds = Array.from(
      new Set(
        orders
          .map((o) => (o && o.user && typeof o.user === 'string' ? o.user : o?.user?._id))
          .filter(Boolean)
      )
    );

    // Only prefetch ids not already cached
    const idsToFetch = uniqueIds.filter((id) => !profileCache.current[id]);
    if (idsToFetch.length === 0) return;

    // Batch prefetch to avoid too many simultaneous requests
    const batchSize = 5;
    (async function prefetch() {
      for (let i = 0; i < idsToFetch.length; i += batchSize) {
        const batch = idsToFetch.slice(i, i + batchSize);
        await Promise.all(
          batch.map((id) => getProfileCached(id).catch(() => null))
        );
      }
    })();
  }, [orders, user]);

  const handleViewOrder = (orderId) => {
    fetchOrderDetails(orderId);
  };

  const handlePrevPage = () => {
    if (page > 1) setPage(page - 1);
  };

  const handleNextPage = () => {
    if (page < totalPages) setPage(page + 1);
  };

  return (
    <div className="min-h-screen bg-background text-foreground p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-[#7ca4a1]">Admin Dashboard</h1>
          <button
            onClick={() => navigate(-1)}
            className="cosmic-button"
          >
            Back
          </button>
        </div>

        {error && <div className="text-red-500 mb-4">{error}</div>}

        {/* Orders List */}
        <div className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Orders List</h2>
          {loading && <div>Loading...</div>}
          {!loading && orders.length === 0 && <div>No orders found.</div>}
          {!loading && orders.length > 0 && (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse border border-border text-black">
                <thead>
                  <tr className="bg-card1">
                    <th className="border border-border p-2">Status</th>
                    <th className="border border-border p-2">Total Payable</th>
                    <th className="border border-border p-2">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order) => (
                    <tr key={order._id} className="bg-card2">
                      <td className="border border-border p-2">{order.status}</td>
                      <td className="border border-border p-2">৳{order.totalPayable}</td>
                      <td className="border border-border p-2">
                        <button
                          onClick={() => handleViewOrder(order._id)}
                          className="cosmic-button text-sm"
                        >
                          View
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          {/* Pagination */}
          <div className="flex justify-between mt-4">
            <button
              onClick={handlePrevPage}
              disabled={page === 1}
              className="cosmic-button disabled:opacity-50"
            >
              Prev
            </button>
            <span>Page {page} of {totalPages}</span>
            <button
              onClick={handleNextPage}
              disabled={page === totalPages}
              className="cosmic-button disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>

        {/* Order Details */}
        {showDetails && selectedOrder && (
          <div className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Order Details</h2>
            {/* Order Summary */}
            <div className="bg-card2 p-4 rounded text-black">
              <h3 className="text-xl font-semibold mb-3 text-[#7ca4a1]">Order Summary</h3>

              {/* Customer Details (from profile endpoint when admin) */}
              <div className="mb-4">
                <h4 className="text-lg font-medium">Customer</h4>
                {userDetailsLoading ? (
                  <div className="text-sm">Loading customer details...</div>
                ) : (
                  (() => {
                    const extracted = extractCustomerInfo(selectedOrder);
                    const display = userDetails || extracted;
                    const hasAny = display && (display.name || display.phone || display.email || display.address);

                    if (hasAny) {
                      return (
                        <div className="text-sm">
                          <div>Name: {display.name || 'N/A'}</div>
                          <div>Phone: {display.phone || 'N/A'}</div>
                          <div>Email: {display.email || 'N/A'}</div>
                          <div>Address: {display.address || 'N/A'}</div>
                        </div>
                      );
                    }

                    // If there's a user id (string) show it and note profile unavailable
                    if (selectedOrder.user && typeof selectedOrder.user === 'string') {
                      return <div className="text-sm">User ID: {selectedOrder.user} — profile not available</div>;
                    }

                    return <div className="text-sm">Customer details not available</div>;
                  })()
                )}
                {userDetailsError && (
                  <div className="text-sm text-red-500 mt-2">{userDetailsError}</div>
                )}
              </div>

              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm">Status:</span>
                  <span className="text-sm font-medium">{selectedOrder.status}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Payment Method:</span>
                  <span className="text-sm font-medium">{selectedOrder.paymentMethod}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Subtotal:</span>
                  <span className="text-sm">৳{selectedOrder.subtotal}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Delivery Charge:</span>
                  <span className="text-sm">৳{selectedOrder.deliveryCharge}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Discount:</span>
                  <span className="text-sm text-green-600">-৳{selectedOrder.discountAmount}</span>
                </div>
                <hr className="my-2" />
                <div className="flex justify-between font-semibold">
                  <span className="text-sm">Total Payable:</span>
                  <span className="text-sm">৳{selectedOrder.totalPayable}</span>
                </div>
              </div>
            </div>

            {/* Items List */}
            <div className="bg-card2 p-4 rounded mt-6">
              <h3 className="text-xl font-semibold mb-3 text-[#7ca4a1]">Items</h3>
              <div className="space-y-3 text-black">
                {selectedOrder.items && selectedOrder.items.map((item, index) => (
                  <div key={index} className="flex justify-between items-center p-3 bg-background/50 rounded">
                    <div className="flex-1">
                      <span className="font-medium text-sm">
                        {item.product && item.product.name ? item.product.name : 'Unknown Product'}
                      </span>
                    </div>
                    <div className="flex items-center gap-4 text-sm">
                      <span>Qty: {item.qty}</span>
                      <span className="font-medium">৳{item.lineTotal}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}


      </div>
    </div>
  );
};

export default AdminDashboard;
