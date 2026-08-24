const express = require('express');
const router = express.Router();
const Restaurant = require('../models/Restaurant');

// GET /api/v1/restaurants (Public)
router.get('/', async (req, res, next) => {
  try {
    const restaurants = await Restaurant.find().sort({ rating: -1 });
    res.status(200).json({
      success: true,
      count: restaurants.length,
      data: restaurants
    });
  } catch (error) {
    next(error);
  }
});

// POST /api/v1/restaurants (Helper endpoint for adding restaurants)
router.post('/', async (req, res, next) => {
  try {
    const restaurant = await Restaurant.create(req.body);
    res.status(201).json({
      success: true,
      data: restaurant
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
