import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showDetails, setShowDetails] = useState(false);
  const [userDetails, setUserDetails] = useState(null);
  const [userLoading, setUserLoading] = useState(false);

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

  // Fetch user details using profile endpoint with userId parameter
  const fetchUserDetails = async (userId) => {
    // Security check: Only allow admins to fetch other users' profiles
    if (!user || user.role !== 'admin') {
      toast.error('Unauthorized: Admin access required');
      setUserDetails(null);
      setUserLoading(false);
      return;
    }

    setUserLoading(true);
    try {
      const response = await fetch(`/api/auth/profile?userId=${userId}`, {
        method: 'GET',
        credentials: 'include',
      });
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `Failed to fetch user details (${response.status})`);
      }
      const data = await response.json();
      setUserDetails(data.user || data);
    } catch (err) {
      console.error('Failed to fetch user details:', err);
      toast.error(`Failed to load customer details: ${err.message}`);
      // Fallback: Use basic user info from order data if available
      if (selectedOrder && selectedOrder.user) {
        setUserDetails({
          _id: selectedOrder.user,
          name: 'User details not available',
          email: 'N/A',
          phone: 'N/A',
          address: 'N/A'
        });
      } else {
        setUserDetails(null);
      }
    } finally {
      setUserLoading(false);
    }
  };

  // Fetch order details
  const fetchOrderDetails = async (orderId) => {
    setLoading(true);
    setError(null);
    setUserDetails(null);
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
      setShowDetails(true);

      // Fetch user details if user ID is available
      if (data.user) {
        fetchUserDetails(data.user);
      }
    } catch {
      setError('Failed to load order details');
      toast.error('Failed to load order details');
    } finally {
      setLoading(false);
    }
  };



  useEffect(() => {
    fetchOrders(page);
  }, [page]);

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
              <table className="w-full border-collapse border border-border">
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
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Customer Information */}
              <div className="bg-card2 p-4 rounded">
                <h3 className="text-xl font-semibold mb-3 text-[#7ca4a1]">Customer Information</h3>
                {userLoading ? (
                  <div className="text-sm text-gray-500">Loading customer details...</div>
                ) : userDetails ? (
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-sm">Name:</span>
                      <span className="text-sm">{userDetails.name || 'N/A'}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-sm">Phone:</span>
                      <span className="text-sm">{userDetails.phone || 'N/A'}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-sm">Email:</span>
                      <span className="text-sm">{userDetails.email || 'N/A'}</span>
                    </div>
                    <div className="flex flex-col gap-1">
                      <span className="font-medium text-sm">Address:</span>
                      <span className="text-sm text-gray-600">
                        {userDetails.address && typeof userDetails.address === 'object'
                          ? `${userDetails.address.line1 || ''} ${userDetails.address.line2 || ''}, ${userDetails.address.city || ''}, ${userDetails.address.state || ''} ${userDetails.address.postalCode || ''}, ${userDetails.address.country || ''}`.replace(/,\s*,/g, ',').replace(/^,\s*|,\s*$/g, '').trim() || 'N/A'
                          : userDetails.address || 'N/A'
                        }
                      </span>
                    </div>
                  </div>
                ) : (
                  <div className="text-sm text-gray-500">Customer details not available</div>
                )}
              </div>

              {/* Order Summary */}
              <div className="bg-card2 p-4 rounded">
                <h3 className="text-xl font-semibold mb-3 text-[#7ca4a1]">Order Summary</h3>
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
            </div>

            {/* Items List */}
            <div className="bg-card2 p-4 rounded mt-6">
              <h3 className="text-xl font-semibold mb-3 text-[#7ca4a1]">Items</h3>
              <div className="space-y-3">
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
