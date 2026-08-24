import React, { useState, useEffect } from 'react';
import RestaurantCard from '../components/RestaurantCard';

const RestaurantsPage = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    setLoading(true);
    setError(null);

    fetch('/api/v1/restaurants')
      .then((res) => {
        if (!res.ok) {
          throw new Error(`Failed to fetch restaurants (Status: ${res.status})`);
        }
        return res.json();
      })
      .then((data) => {
        if (data.success && Array.isArray(data.data)) {
          setRestaurants(data.data);
        } else {
          setRestaurants(data || []);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error('API Error:', err);
        setError(err.message || 'Error loading restaurant data');
        setLoading(false);
      });
  }, []);

  // Client-side search filtering by name or cuisine without new API calls
  const filteredRestaurants = restaurants.filter((restaurant) => {
    const term = searchTerm.toLowerCase();
    return (
      restaurant.name.toLowerCase().includes(term) ||
      restaurant.cuisine.toLowerCase().includes(term)
    );
  });

  return (
    <div className="page-wrapper container">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontSize: '2rem', fontWeight: '700' }}>Available Restaurants</h1>
          <p style={{ color: 'var(--text-muted)' }}>Explore partner restaurants and real-time open/closed status</p>
        </div>

        {/* Client-side search input */}
        <input
          type="text"
          className="search-input"
          placeholder="🔍 Search by restaurant name or cuisine..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* 1) Loading State */}
      {loading && (
        <div className="status-alert info">
          ⏳ Loading restaurants data from Express API...
        </div>
      )}

      {/* 2) Error State */}
      {error && (
        <div className="status-alert error">
          ⚠️ {error}. Please ensure the backend server is running at <code>http://localhost:5000</code>.
        </div>
      )}

      {/* 3) Render Restaurant Data via RestaurantCard */}
      {!loading && !error && filteredRestaurants.length === 0 && (
        <div className="status-alert info">
          No restaurants match your search criteria "{searchTerm}".
        </div>
      )}

      {!loading && !error && filteredRestaurants.length > 0 && (
        <div className="restaurant-grid">
          {filteredRestaurants.map((restaurant) => (
            <RestaurantCard
              key={restaurant._id || restaurant.id || restaurant.name}
              name={restaurant.name}
              cuisine={restaurant.cuisine}
              rating={restaurant.rating}
              isOpen={restaurant.isOpen}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default RestaurantsPage;
