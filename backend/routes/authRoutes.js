const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const Customer = require('../models/Customer');

// POST /api/v1/auth/login
router.post('/login', async (req, res, next) => {
  try {
    const { email, name } = req.body;
    const userEmail = email || 'student@charusat.ac.in';
    const userName = name || 'Student User';

    let customer = await Customer.findOne({ email: userEmail });
    if (!customer) {
      customer = await Customer.create({
        name: userName,
        email: userEmail,
        phone: '9876543210',
        address: 'CSPIT Campus, Changa'
      });
    }

    const payload = {
      id: customer._id,
      name: customer.name,
      email: customer.email,
      role: 'Customer'
    };

    const token = jwt.sign(
      payload,
      process.env.JWT_SECRET || 'quickbite_secret_key_2026_exam',
      { expiresIn: '24h' }
    );

    res.status(200).json({
      success: true,
      message: 'Login successful',
      token,
      customer: {
        id: customer._id,
        name: customer.name,
        email: customer.email,
        phone: customer.phone,
        address: customer.address
      }
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
