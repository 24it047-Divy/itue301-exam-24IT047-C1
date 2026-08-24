import React from 'react';

const RestaurantCard = ({ name, cuisine, rating, isOpen }) => {
  return (
    <div className="restaurant-card">
      <div className="card-header">
        <h3 className="restaurant-name">{name}</h3>
        <span className={`badge-status ${isOpen ? 'open' : 'closed'}`}>
          {isOpen ? 'Open Now' : 'Closed'}
        </span>
      </div>

      <div className="card-body">
        <p className="cuisine-type">
          <strong>Cuisine:</strong> {cuisine}
        </p>
        <div className="rating-tag">
          <span>★</span> {rating ? Number(rating).toFixed(1) : '4.0'} / 5.0
        </div>
      </div>
    </div>
  );
};

export default RestaurantCard;
