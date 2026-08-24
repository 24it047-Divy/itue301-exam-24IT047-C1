const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Customer = require('./models/Customer');
const Restaurant = require('./models/Restaurant');
const Order = require('./models/Order');

dotenv.config();

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/quickbite');
    console.log('Connected to MongoDB for seeding...');

    // Clear existing data
    await Customer.deleteMany({});
    await Restaurant.deleteMany({});
    await Order.deleteMany({});

    console.log('Cleared existing data.');

    // Create Customers
    const customer1 = await Customer.create({
      name: 'Darshan Patel',
      email: '24it047@charusat.edu.in',
      phone: '+91 9876543210',
      address: 'CSPIT IT Dept, CHARUSAT Campus, Changa'
    });

    const customer2 = await Customer.create({
      name: 'Ananya Sharma',
      email: 'ananya@example.com',
      phone: '+91 9123456789',
      address: 'Hostel 3, Room 204, CHARUSAT'
    });

    console.log('Customers created.');

    // Create Restaurants
    const restaurants = await Restaurant.create([
      {
        name: 'The Spice Hub',
        cuisine: 'North Indian',
        rating: 4.8,
        isOpen: true
      },
      {
        name: 'Italiano Bistro',
        cuisine: 'Italian & Pizza',
        rating: 4.5,
        isOpen: true
      },
      {
        name: 'Dragon Wok Express',
        cuisine: 'Chinese & Asian',
        rating: 4.2,
        isOpen: false
      },
      {
        name: 'Burger Craft',
        cuisine: 'Fast Food',
        rating: 4.6,
        isOpen: true
      },
      {
        name: 'South Flavors',
        cuisine: 'South Indian',
        rating: 4.4,
        isOpen: true
      }
    ]);

    console.log('Restaurants created.');

    // Create initial sample order
    const sampleOrder = await Order.create({
      customerId: customer1._id,
      restaurantId: restaurants[0]._id,
      items: [
        { itemName: 'Paneer Butter Masala', quantity: 2, price: 240 },
        { itemName: 'Garlic Naan', quantity: 4, price: 40 }
      ],
      totalAmount: 640,
      deliveryAddress: 'CSPIT IT Dept, CHARUSAT Campus, Changa',
      status: 'preparing'
    });

    console.log('Sample Order created.');

    console.log('Database seeding completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedData();
