import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const HomePage = () => {
  const { isAuthenticated, customer } = useContext(AuthContext);

  return (
    <div className="page-wrapper container">
      <div style={{ textAlign: 'center', padding: '4rem 1rem 2rem 1rem' }}>
        <span style={{ 
          background: 'rgba(255, 87, 34, 0.15)', 
          color: '#ff7043', 
          padding: '0.4rem 1rem', 
          borderRadius: '20px', 
          fontSize: '0.9rem',
          fontWeight: '600'
        }}>
          CHARUSAT ITUE301 Practical Exam - SET A
        </span>

        <h1 style={{ fontSize: '3rem', margin: '1.5rem 0 1rem 0', fontWeight: '800', lineHeight: '1.2' }}>
          Delicious Food, Delivered <span style={{ color: 'var(--primary-color)' }}>Quickly</span>.
        </h1>

        <p style={{ color: 'var(--text-muted)', fontSize: '1.15rem', maxWidth: '650px', margin: '0 auto 2.5rem auto' }}>
          Welcome to QuickBite! Browse top-rated restaurants near CHARUSAT Campus, explore multi-cuisine menus, and place instant online food orders.
        </p>

        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
          <Link to="/restaurants" className="btn-login" style={{ padding: '0.8rem 1.8rem', fontSize: '1rem' }}>
            Explore Restaurants
          </Link>
          
          {isAuthenticated ? (
            <Link to="/order" style={{ 
              background: 'rgba(255, 255, 255, 0.1)', 
              color: '#fff', 
              padding: '0.8rem 1.8rem', 
              borderRadius: '8px', 
              fontWeight: '600' 
            }}>
              Go to Order Page
            </Link>
          ) : (
            <span style={{ color: 'var(--text-muted)', alignSelf: 'center', fontSize: '0.9rem' }}>
              (Login required for ordering)
            </span>
          )}
        </div>
      </div>

      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', 
        gap: '2rem', 
        marginTop: '3rem' 
      }}>
        <div className="restaurant-card">
          <h3 style={{ color: 'var(--primary-color)', marginBottom: '0.5rem' }}>🍕 Freshly Prepared</h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
            Choose from top restaurants featuring authentic Indian, Italian, Asian, and fast food delights.
          </p>
        </div>

        <div className="restaurant-card">
          <h3 style={{ color: '#60a5fa', marginBottom: '0.5rem' }}>⚡ Real-time Order Tracking</h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
            Watch your order progress through pending, preparing, out-for-delivery, and delivered states.
          </p>
        </div>

        <div className="restaurant-card">
          <h3 style={{ color: '#4ade80', marginBottom: '0.5rem' }}>🔒 Secure Express API</h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
            Powered by Node.js, Express REST API with custom authGuard middleware and MongoDB persistence.
          </p>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
