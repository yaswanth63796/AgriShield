import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import { AdminLayout } from './layouts/AdminLayout';

import { Login } from './pages/Login';
import { Dashboard } from './pages/Dashboard';
import { FarmersList } from './pages/FarmersList';
import { RegisteredCrops } from './pages/RegisteredCrops';
import { CropDetails } from './pages/CropDetails';
import { ClaimCrops } from './pages/ClaimCrops';

export function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public Login Route */}
          <Route path="/login" element={<Login />} />

          {/* Protected Admin Shell */}
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <AdminLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Navigate to="/dashboard" replace />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="farmers" element={<FarmersList />} />
            <Route path="registered-crops" element={<RegisteredCrops />} />
            <Route path="registered-crops/:cropId" element={<CropDetails />} />
            <Route path="claims" element={<ClaimCrops />} />
          </Route>

          {/* Fallback Catch-All */}
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
