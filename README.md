# QuickBite Food Ordering System 🍔
**ITUE301: Advanced Web Development Frameworks**  
**Open-Book Practical Examination | AY 2026–27 | SET A**  
**Student Name / Roll No**: 24IT047  
**Batch**: C1  
**Institute**: Chandubhai S. Patel Institute of Technology (CSPIT), CHARUSAT  

---

## 📌 Project Overview
QuickBite is a full-stack food ordering platform built using **React**, **Express.js**, **Node.js**, and **MongoDB with Mongoose**. It allows customers to browse restaurants, search by cuisine, place orders online, and view live order statuses.

---

## 📁 Repository Structure
```text
itue301-exam-24IT047-C1
│
├── frontend
│   └── src
│       ├── components
│       │   ├── Navbar.jsx          # Dynamic nav links & auth status
│       │   ├── ProtectedRoute.jsx  # Route guard redirecting unauthenticated users to /
│       │   └── RestaurantCard.jsx  # Reusable card component (name, cuisine, rating, isOpen)
│       │
│       ├── context
│       │   └── AuthContext.jsx     # Global authentication state context ({ customer, token })
│       │
│       ├── pages
│       │   ├── AdminPanel.jsx      # Lazy-loaded admin view (React.lazy + Suspense)
│       │   ├── HomePage.jsx        # Landing page with hero banner & platform highlights
│       │   ├── OrderPage.jsx       # Protected order placement page & order history
│       │   └── RestaurantsPage.jsx # Restaurant list with live API fetch & client-side search
│       │
│       ├── App.jsx                 # React router setup & route configuration
│       ├── App.css                 # Custom styling tokens & component styles
│       ├── index.css               # Core styling tokens & CSS reset
│       └── main.jsx                # React app entry point
│
├── backend
│   ├── config
│   │   └── db.js                   # Mongoose connection configuration
│   │
│   ├── middleware
│   │   ├── authGuard.js            # Authorization middleware for Bearer token
│   │   ├── errorHandler.js         # Global error handling middleware (structured JSON response)
│   │   └── requestLogger.js        # Global logger logging [METHOD] [PATH] [TIMESTAMP]
│   │
│   ├── models
│   │   ├── Customer.js             # Mongoose Customer model (name, email, phone, address)
│   │   ├── Order.js                # Mongoose Order model (ref Customer & Restaurant, status enum)
│   │   └── Restaurant.js           # Mongoose Restaurant model (name, cuisine, rating, isOpen)
│   │
│   ├── routes
│   │   ├── authRoutes.js           # POST /api/v1/auth/login
│   │   ├── orderRoutes.js          # POST, GET, PATCH /api/v1/orders
│   │   └── restaurantRoutes.js     # GET /api/v1/restaurants
│   │
│   ├── .env                        # Local environment variables
│   ├── .env.example                # Template for environment variables
│   ├── seed.js                     # Script to seed sample MongoDB records
│   ├── package.json                # Dependencies and scripts
│   └── server.js                   # Express server entry point
│
├── .gitignore                      # Git ignore file
└── README.md                       # Documentation & run instructions
```

---

## 🛠️ Tech Stack
- **Frontend**: React (Vite), React Router v6, Context API, CSS3
- **Backend**: Express.js, Node.js, JSON Web Tokens (JWT)
- **Database**: MongoDB with Mongoose Schema & Validation
- **Middlewares**: Custom `requestLogger`, `authGuard`, `errorHandler`

---

## 🚀 Setup & Execution Instructions

### Prerequisites
- Node.js (v18+)
- MongoDB (Running locally on `mongodb://127.0.0.1:27017` or MongoDB Atlas URI)

### 1. Backend Setup & Run

1. Navigate to backend directory:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Ensure `.env` is configured (see `.env.example`):
   ```env
   PORT=5000
   MONGO_URI=mongodb://127.0.0.1:27017/quickbite
   JWT_SECRET=quickbite_secret_key_2026_exam
   ```
4. Seed initial database records:
   ```bash
   npm run seed
   ```
5. Start backend server:
   ```bash
   npm start
   # or
   node server.js
   ```
   *The backend will run at `http://localhost:5000`.*

---

### 2. Frontend Setup & Run

1. Navigate to frontend directory in a new terminal:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start Vite dev server:
   ```bash
   npm run dev
   ```
   *The frontend will run at `http://localhost:3000`.*

---

## 📡 REST API Endpoints Overview (`/api/v1/`)

| Method | Endpoint | Protection | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/v1/auth/login` | Public | Authenticates customer & returns JWT Bearer token |
| `GET` | `/api/v1/restaurants` | Public | Fetches all restaurants from MongoDB |
| `POST` | `/api/v1/orders` | Protected (`authGuard`) | Validates & creates a new order in MongoDB |
| `GET` | `/api/v1/orders` | Protected (`authGuard`) | Retrieves orders populated with `customerId` and `restaurantId` |
| `PATCH` | `/api/v1/orders/:id/status` | Protected (`authGuard`) | Updates order status (`pending`, `preparing`, `out-for-delivery`, `delivered`, `cancelled`) |

---

## 🧪 Demonstration of Mongoose Validation & Error Handling
- Invalid status value in `PATCH /api/v1/orders/:id/status` or missing required fields in `POST /api/v1/orders` triggers Mongoose schema validation.
- The global `errorHandler` middleware intercepts Mongoose `ValidationError` and returns a structured 400 JSON response:
```json
{
  "success": false,
  "message": "Validation Error",
  "errors": [
    "invalid_status is not a valid order status"
  ]
}
```

---

## 📝 Task Checklist Verification

- [x] **Task 1: React Component Architecture** - Created `HomePage`, `RestaurantsPage`, `OrderPage`, `RestaurantCard` with props (`name`, `cuisine`, `rating`, `isOpen`) and dynamic CSS badges.
- [x] **Task 2: React Routing & State Management** - React Router links, `/order` protected route using `ProtectedRoute`, lazy loading `/admin` via `React.lazy` + `Suspense`, `AuthContext` holding `{ customer, token }`, `useState` form handling with live preview.
- [x] **Task 3: Express REST API + Middleware** - Implemented 5 REST endpoints, global `requestLogger`, Bearer token `authGuard`, and global JSON `errorHandler`.
- [x] **Task 4: REST API Consumption in React** - `useEffect` fetching `GET /api/v1/restaurants`, handling `loading`, `error`, `restaurants` states, rendering via `RestaurantCard`, client-side live search filter.
- [x] **Task 5: MongoDB + Mongoose Schema & Validation** - `Customer`, `Restaurant`, `Order` Mongoose schemas, `.populate()`, enum validation, `.env` database connection.
