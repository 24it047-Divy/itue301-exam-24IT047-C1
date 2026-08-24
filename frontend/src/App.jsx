import React, { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import HomePage from './pages/HomePage';
import RestaurantsPage from './pages/RestaurantsPage';
import OrderPage from './pages/OrderPage';
import './App.css';

// Task 2 Lazy-loaded AdminPanel component using React.lazy
const AdminPanel = lazy(() => import('./pages/AdminPanel'));

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="app-container">
          <Navbar />
          <Suspense fallback={
            <div className="container page-wrapper" style={{ textAlign: 'center', paddingTop: '4rem' }}>
              <div className="status-alert info">⏳ Loading module via React Suspense...</div>
            </div>
          }>
            <Routes>
              {/* Task 2 Client-side Routes */}
              <Route path="/" element={<HomePage />} />
              <Route path="/restaurants" element={<RestaurantsPage />} />
              <Route 
                path="/order" 
                element={
                  <ProtectedRoute>
                    <OrderPage />
                  </ProtectedRoute>
                } 
              />
              <Route path="/admin" element={<AdminPanel />} />
            </Routes>
          </Suspense>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
