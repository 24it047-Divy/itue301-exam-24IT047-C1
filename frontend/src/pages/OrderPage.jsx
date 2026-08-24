import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

const OrderPage = () => {
  const { customer, token } = useContext(AuthContext);

  // Form states using useState
  const [restaurants, setRestaurants] = useState([]);
  const [selectedRestaurantId, setSelectedRestaurantId] = useState('');
  const [itemName, setItemName] = useState('Paneer Butter Masala');
  const [quantity, setQuantity] = useState(2);
  const [deliveryAddress, setDeliveryAddress] = useState(customer?.address || 'CSPIT IT Dept, CHARUSAT Campus');
  const [itemPrice] = useState(240); // default item price for calculation

  // Submission & API states
  const [myOrders, setMyOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [orderStatusMessage, setOrderStatusMessage] = useState(null);

  // Fetch available restaurants for selection dropdown
  useEffect(() => {
    fetch('/api/v1/restaurants')
      .then((res) => res.json())
      .then((data) => {
        const list = data.data || data || [];
        setRestaurants(list);
        if (list.length > 0) {
          setSelectedRestaurantId(list[0]._id || list[0].id);
        }
      })
      .catch((err) => console.error('Failed to load restaurants for order form:', err));
  }, []);

  // Fetch placed orders for logged-in customer
  const fetchCustomerOrders = () => {
    if (!token) return;
    fetch('/api/v1/orders', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setMyOrders(data.data || []);
        }
      })
      .catch((err) => console.error('Error fetching customer orders:', err));
  };

  useEffect(() => {
    fetchCustomerOrders();
  }, [token]);

  // Derived state value: total calculation displayed dynamically
  const calculatedTotal = Number(quantity) * itemPrice;

  // Find currently selected restaurant object for live preview
  const selectedRestaurantObj = restaurants.find(
    (r) => (r._id || r.id) === selectedRestaurantId
  );

  const handleSubmitOrder = async (e) => {
    e.preventDefault();
    setLoading(true);
    setOrderStatusMessage(null);

    const orderPayload = {
      restaurantId: selectedRestaurantId,
      customerId: customer?.id,
      items: [
        {
          itemName: itemName,
          quantity: Number(quantity),
          price: itemPrice
        }
      ],
      totalAmount: calculatedTotal,
      deliveryAddress: deliveryAddress
    };

    try {
      const response = await fetch('/api/v1/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(orderPayload)
      });

      const result = await response.json();

      if (response.ok && result.success) {
        setOrderStatusMessage({
          type: 'success',
          text: `🎉 Order Placed Successfully! (Order ID: ${result.data._id})`
        });
        fetchCustomerOrders();
      } else {
        setOrderStatusMessage({
          type: 'error',
          text: `Failed to place order: ${result.message || 'Validation error'}`
        });
      }
    } catch (err) {
      setOrderStatusMessage({
        type: 'error',
        text: `Network Error: ${err.message}`
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-wrapper container">
      <h1 style={{ textAlign: 'center', marginBottom: '0.5rem', fontWeight: '700' }}>
        Place Your Food Order
      </h1>
      <p style={{ textAlign: 'center', color: 'var(--text-muted)', marginBottom: '2rem' }}>
        Logged in as: <strong style={{ color: '#4ade80' }}>{customer?.name}</strong> ({customer?.email})
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
        {/* Order Form */}
        <div className="order-form-container" style={{ margin: 0, maxWidth: '100%' }}>
          <h2 style={{ fontSize: '1.4rem', marginBottom: '1.25rem', color: 'var(--primary-color)' }}>
            📝 Order Details
          </h2>

          {orderStatusMessage && (
            <div className={`status-alert ${orderStatusMessage.type}`}>
              {orderStatusMessage.text}
            </div>
          )}

          <form onSubmit={handleSubmitOrder}>
            {/* 1. Selected Restaurant */}
            <div className="form-group">
              <label className="form-label">Select Restaurant</label>
              <select
                className="form-control"
                value={selectedRestaurantId}
                onChange={(e) => setSelectedRestaurantId(e.target.value)}
                required
              >
                {restaurants.map((r) => (
                  <option key={r._id || r.id} value={r._id || r.id}>
                    {r.name} ({r.cuisine}) - {r.isOpen ? 'Open' : 'Closed'}
                  </option>
                ))}
              </select>
            </div>

            {/* 2. Item Name */}
            <div className="form-group">
              <label className="form-label">Food Item Name</label>
              <input
                type="text"
                className="form-control"
                value={itemName}
                onChange={(e) => setItemName(e.target.value)}
                placeholder="e.g. Paneer Butter Masala"
                required
              />
            </div>

            {/* 3. Quantity */}
            <div className="form-group">
              <label className="form-label">Quantity</label>
              <input
                type="number"
                min="1"
                max="20"
                className="form-control"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                required
              />
            </div>

            {/* 4. Delivery Address */}
            <div className="form-group">
              <label className="form-label">Delivery Address</label>
              <textarea
                className="form-control"
                rows="3"
                value={deliveryAddress}
                onChange={(e) => setDeliveryAddress(e.target.value)}
                placeholder="Enter complete delivery address"
                required
              ></textarea>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-login"
              style={{ width: '100%', padding: '0.85rem', fontSize: '1rem', marginTop: '0.5rem' }}
            >
              {loading ? 'Submitting Order...' : `Confirm Order (₹${calculatedTotal})`}
            </button>
          </form>
        </div>

        {/* Dynamic Order Live Preview & Recent Orders */}
        <div>
          {/* Live Order Summary Box */}
          <div className="order-summary-box">
            <h3 style={{ color: 'var(--primary-color)', marginBottom: '0.75rem', fontSize: '1.2rem' }}>
              ⚡ Live Order Summary (State Preview)
            </h3>
            <p style={{ margin: '0.4rem 0' }}>
              <strong>Restaurant:</strong> {selectedRestaurantObj ? selectedRestaurantObj.name : 'Loading...'}
            </p>
            <p style={{ margin: '0.4rem 0' }}>
              <strong>Item:</strong> {itemName || 'None'} x {quantity}
            </p>
            <p style={{ margin: '0.4rem 0' }}>
              <strong>Address:</strong> {deliveryAddress || 'Not provided'}
            </p>
            <hr style={{ borderColor: 'rgba(255, 87, 34, 0.3)', margin: '0.75rem 0' }} />
            <p style={{ fontSize: '1.15rem', fontWeight: '700', color: '#ffffff' }}>
              Total Payable Amount: <span style={{ color: '#4ade80' }}>₹{calculatedTotal}</span>
            </p>
          </div>

          {/* Placed Customer Orders */}
          <div style={{ marginTop: '2rem' }}>
            <h3 style={{ fontSize: '1.25rem', marginBottom: '1rem' }}>
              📦 Your Recent Orders ({myOrders.length})
            </h3>

            {myOrders.length === 0 ? (
              <p style={{ color: 'var(--text-muted)' }}>No previous orders found.</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxHeight: '350px', overflowY: 'auto' }}>
                {myOrders.map((ord) => (
                  <div
                    key={ord._id}
                    style={{
                      background: 'rgba(30, 41, 59, 0.6)',
                      border: '1px solid var(--card-border)',
                      borderRadius: '12px',
                      padding: '1rem'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                      <strong style={{ color: '#ffffff' }}>
                        {ord.restaurantId?.name || 'Restaurant'}
                      </strong>
                      <span className="badge-status open" style={{ textTransform: 'capitalize' }}>
                        {ord.status}
                      </span>
                    </div>
                    <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                      Items: {ord.items.map((it) => `${it.itemName} (${it.quantity})`).join(', ')}
                    </p>
                    <p style={{ fontSize: '0.95rem', fontWeight: '600', color: '#4ade80', marginTop: '0.4rem' }}>
                      Total: ₹{ord.totalAmount}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderPage;
