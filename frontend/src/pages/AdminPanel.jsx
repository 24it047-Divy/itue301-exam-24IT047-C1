import React, { useState, useEffect } from 'react';

const AdminPanel = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch all system orders for admin view
  useEffect(() => {
    // Admin request with fallback token
    const token = localStorage.getItem('quickbite_token') || 'dummy_jwt_token_24IT047';
    fetch('/api/v1/orders', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setOrders(data.data || []);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error('Admin Panel fetch error:', err);
        setLoading(false);
      });
  }, []);

  const handleUpdateStatus = async (orderId, newStatus) => {
    const token = localStorage.getItem('quickbite_token') || 'dummy_jwt_token_24IT047';
    try {
      const response = await fetch(`/api/v1/orders/${orderId}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status: newStatus })
      });
      const data = await response.json();
      if (data.success) {
        setOrders(orders.map((o) => (o._id === orderId ? data.data : o)));
      } else {
        alert('Failed to update status: ' + data.message);
      }
    } catch (err) {
      alert('Error updating status: ' + err.message);
    }
  };

  return (
    <div className="page-wrapper container">
      <div style={{ background: 'rgba(99, 102, 241, 0.1)', border: '1px solid rgba(99, 102, 241, 0.3)', padding: '1rem 1.5rem', borderRadius: '12px', marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.8rem', color: '#818cf8', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          🛡️ Admin Control Panel
        </h1>
        <p style={{ color: 'var(--text-muted)' }}>
          This component was loaded on-demand via <code>React.lazy()</code> + <code>Suspense</code> code-splitting.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.5rem', marginBottom: '2.5rem' }}>
        <div className="restaurant-card" style={{ textAlign: 'center' }}>
          <h3 style={{ fontSize: '2rem', color: 'var(--primary-color)' }}>{orders.length}</h3>
          <p style={{ color: 'var(--text-muted)' }}>Total System Orders</p>
        </div>
        <div className="restaurant-card" style={{ textAlign: 'center' }}>
          <h3 style={{ fontSize: '2rem', color: '#4ade80' }}>
            {orders.filter(o => o.status === 'delivered').length}
          </h3>
          <p style={{ color: 'var(--text-muted)' }}>Delivered Orders</p>
        </div>
        <div className="restaurant-card" style={{ textAlign: 'center' }}>
          <h3 style={{ fontSize: '2rem', color: '#ffb74d' }}>
            {orders.filter(o => o.status === 'pending' || o.status === 'preparing').length}
          </h3>
          <p style={{ color: 'var(--text-muted)' }}>Active Orders</p>
        </div>
      </div>

      <h2 style={{ marginBottom: '1rem', fontSize: '1.4rem' }}>Manage Incoming Orders</h2>

      {loading ? (
        <div className="status-alert info">Loading order records for admin view...</div>
      ) : orders.length === 0 ? (
        <div className="status-alert info">No orders recorded in the system yet.</div>
      ) : (
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', background: 'var(--card-bg)', borderRadius: '12px', overflow: 'hidden' }}>
            <thead>
              <tr style={{ background: 'rgba(15, 23, 42, 0.9)', textAlign: 'left', color: 'var(--text-muted)' }}>
                <th style={{ padding: '1rem' }}>Customer</th>
                <th style={{ padding: '1rem' }}>Restaurant</th>
                <th style={{ padding: '1rem' }}>Amount</th>
                <th style={{ padding: '1rem' }}>Current Status</th>
                <th style={{ padding: '1rem' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((ord) => (
                <tr key={ord._id} style={{ borderTop: '1px solid var(--card-border)' }}>
                  <td style={{ padding: '1rem' }}>
                    <div><strong>{ord.customerId?.name || 'Customer'}</strong></div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{ord.customerId?.email}</div>
                  </td>
                  <td style={{ padding: '1rem' }}>
                    {ord.restaurantId?.name || 'Restaurant'}
                  </td>
                  <td style={{ padding: '1rem', fontWeight: '600', color: '#4ade80' }}>
                    ₹{ord.totalAmount}
                  </td>
                  <td style={{ padding: '1rem' }}>
                    <span className="badge-status open" style={{ textTransform: 'capitalize' }}>
                      {ord.status}
                    </span>
                  </td>
                  <td style={{ padding: '1rem' }}>
                    <select
                      className="form-control"
                      style={{ padding: '0.4rem 0.6rem', fontSize: '0.85rem' }}
                      value={ord.status}
                      onChange={(e) => handleUpdateStatus(ord._id, e.target.value)}
                    >
                      <option value="pending">pending</option>
                      <option value="preparing">preparing</option>
                      <option value="out-for-delivery">out-for-delivery</option>
                      <option value="delivered">delivered</option>
                      <option value="cancelled">cancelled</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminPanel;
