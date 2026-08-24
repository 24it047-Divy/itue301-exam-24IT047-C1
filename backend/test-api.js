const http = require('http');

const makeRequest = (options, postData) => {
  return new Promise((resolve, reject) => {
    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => (data += chunk));
      res.on('end', () => {
        try {
          resolve({ status: res.statusCode, data: JSON.parse(data) });
        } catch (e) {
          resolve({ status: res.statusCode, raw: data });
        }
      });
    });

    req.on('error', (err) => reject(err));

    if (postData) {
      req.write(typeof postData === 'string' ? postData : JSON.stringify(postData));
    }
    req.end();
  });
};

async function runApiTests() {
  console.log('=== RUNNING API TESTS ===\n');

  // Test 1: GET /api/v1/restaurants
  console.log('Test 1: GET /api/v1/restaurants (Public)');
  const res1 = await makeRequest({
    hostname: 'localhost',
    port: 5000,
    path: '/api/v1/restaurants',
    method: 'GET'
  });
  console.log('Status:', res1.status);
  console.log('Count:', res1.data?.count);
  console.log('First Restaurant:', res1.data?.data?.[0]?.name, '-', res1.data?.data?.[0]?.cuisine, '\n');

  const restaurantId = res1.data?.data?.[0]?._id;

  // Test 2: POST /api/v1/auth/login
  console.log('Test 2: POST /api/v1/auth/login');
  const res2 = await makeRequest(
    {
      hostname: 'localhost',
      port: 5000,
      path: '/api/v1/auth/login',
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    },
    { email: '24it047@charusat.edu.in', name: 'Darshan Patel (24IT047)' }
  );
  console.log('Status:', res2.status);
  console.log('Message:', res2.data?.message);
  console.log('Token Received:', !!res2.data?.token);

  const token = res2.data?.token;
  const customerId = res2.data?.customer?.id;

  // Test 3: POST /api/v1/orders (Protected)
  console.log('\nTest 3: POST /api/v1/orders (Protected)');
  const res3 = await makeRequest(
    {
      hostname: 'localhost',
      port: 5000,
      path: '/api/v1/orders',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    },
    {
      restaurantId: restaurantId,
      customerId: customerId,
      items: [{ itemName: 'Butter Chicken', quantity: 2, price: 280 }],
      totalAmount: 560,
      deliveryAddress: 'CSPIT IT Department, CHARUSAT'
    }
  );
  console.log('Status:', res3.status);
  console.log('Order ID Created:', res3.data?.data?._id);
  console.log('Populated Customer Name:', res3.data?.data?.customerId?.name);
  console.log('Populated Restaurant Name:', res3.data?.data?.restaurantId?.name);

  const newOrderId = res3.data?.data?._id;

  // Test 4: GET /api/v1/orders (Protected with populate)
  console.log('\nTest 4: GET /api/v1/orders (Protected & Populated)');
  const res4 = await makeRequest({
    hostname: 'localhost',
    port: 5000,
    path: '/api/v1/orders',
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  console.log('Status:', res4.status);
  console.log('Orders Count:', res4.data?.count);

  // Test 5: PATCH /api/v1/orders/:id/status (Protected)
  console.log('\nTest 5: PATCH /api/v1/orders/:id/status');
  const res5 = await makeRequest(
    {
      hostname: 'localhost',
      port: 5000,
      path: `/api/v1/orders/${newOrderId}/status`,
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    },
    { status: 'out-for-delivery' }
  );
  console.log('Status:', res5.status);
  console.log('Updated Order Status:', res5.data?.data?.status);

  // Test 6: Validation Error Demonstration
  console.log('\nTest 6: Validation Error Demonstration (Invalid Status)');
  const res6 = await makeRequest(
    {
      hostname: 'localhost',
      port: 5000,
      path: `/api/v1/orders/${newOrderId}/status`,
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    },
    { status: 'invalid_status_value' }
  );
  console.log('Status (Expected 400):', res6.status);
  console.log('Structured JSON Error:', JSON.stringify(res6.data));

  console.log('\n=== ALL API TESTS COMPLETE ===');
}

runApiTests().catch(console.error);
