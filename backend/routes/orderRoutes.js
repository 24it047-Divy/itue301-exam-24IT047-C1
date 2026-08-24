const express = require('express');
const router = express.Router();
const Order = require('../models/Order');

// POST /api/v1/orders (Protected) - Create new order
router.post('/', async (req, res, next) => {
  try {
    const { restaurantId, customerId, items, totalAmount, deliveryAddress, status } = req.body;
    
    // Determine customerId from token payload or request body
    const finalCustomerId = customerId || (req.user && req.user.id);

    const orderData = {
      customerId: finalCustomerId,
      restaurantId,
      items,
      totalAmount,
      deliveryAddress,
      status: status || 'pending'
    };

    const newOrder = await Order.create(orderData);
    
    // Populate before sending response
    const populatedOrder = await Order.findById(newOrder._id)
      .populate('customerId', 'name email')
      .populate('restaurantId', 'name cuisine');

    res.status(201).json({
      success: true,
      message: 'Order created successfully',
      data: populatedOrder
    });
  } catch (error) {
    next(error);
  }
});

// GET /api/v1/orders (Protected) - Return orders with populate
router.get('/', async (req, res, next) => {
  try {
    const customerId = req.user ? req.user.id : null;
    let query = {};
    if (customerId) {
      query.customerId = customerId;
    }

    const orders = await Order.find(query)
      .populate('customerId', 'name email')
      .populate('restaurantId', 'name cuisine')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: orders.length,
      data: orders
    });
  } catch (error) {
    next(error);
  }
});

// PATCH /api/v1/orders/:id/status (Protected) - Update order status
router.patch('/:id/status', async (req, res, next) => {
  try {
    const { status } = req.body;
    const allowedStatuses = ['pending', 'preparing', 'out-for-delivery', 'delivered', 'cancelled'];
    
    if (!status || !allowedStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Invalid status '${status}'. Must be one of: ${allowedStatuses.join(', ')}`
      });
    }

    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    order.status = status;
    await order.save();

    const updatedOrder = await Order.findById(order._id)
      .populate('customerId', 'name email')
      .populate('restaurantId', 'name cuisine');

    res.status(200).json({
      success: true,
      message: 'Order status updated successfully',
      data: updatedOrder
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
