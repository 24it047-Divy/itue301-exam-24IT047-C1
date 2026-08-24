import React, { useContext } from 'react';
import { NavLink } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Navbar = () => {
  const { customer, isAuthenticated, login, logout } = useContext(AuthContext);

  const handleSimulateLogin = async () => {
    try {
      const response = await fetch('/api/v1/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: '24it047@charusat.edu.in', name: 'Darshan Patel (24IT047)' })
      });
      const data = await response.json();
      if (data.success) {
        login(data.customer, data.token);
      } else {
        alert('Login failed: ' + data.message);
      }
    } catch (err) {
      console.error('Error logging in:', err);
      // Fallback dummy token for testing if offline
      login(
        { id: '65d8a9f1234567890abcdef1', name: 'Darshan Patel (24IT047)', email: '24it047@charusat.edu.in' },
        'dummy_jwt_token_24IT047'
      );
    }
  };

  return (
    <header className="navbar">
      <div className="container navbar-container">
        <NavLink to="/" className="brand-logo">
          🍔 QuickBite
        </NavLink>

        <nav>
          <ul className="nav-links">
            <li>
              <NavLink to="/" className={({ isActive }) => (isActive ? 'nav-item active' : 'nav-item')}>
                Home
              </NavLink>
            </li>
            <li>
              <NavLink to="/restaurants" className={({ isActive }) => (isActive ? 'nav-item active' : 'nav-item')}>
                Restaurants
              </NavLink>
            </li>
            <li>
              <NavLink to="/order" className={({ isActive }) => (isActive ? 'nav-item active' : 'nav-item')}>
                Place Order (Protected)
              </NavLink>
            </li>
            <li>
              <NavLink to="/admin" className={({ isActive }) => (isActive ? 'nav-item active' : 'nav-item')}>
                Admin Panel (Lazy)
              </NavLink>
            </li>
          </ul>
        </nav>

        <div className="auth-badge">
          {isAuthenticated ? (
            <>
              <span style={{ fontSize: '0.88rem', color: '#4ade80' }}>
                👤 {customer?.name || 'Logged In'}
              </span>
              <button onClick={logout} className="btn-logout">
                Logout
              </button>
            </>
          ) : (
            <button onClick={handleSimulateLogin} className="btn-login">
              Login to Order
            </button>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
