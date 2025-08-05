// src/App.tsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { KasirPage } from './components/kasir/KasirPage';
import { NasabahPage } from './components/nasabah/NasabahPage';
import { SampahPage } from './components/sampah/SampahPage';
import { TarikPage } from './components/tarik/TarikPage';
import { Toaster } from '@/components/ui/toaster';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Routes>
            {/* Public routes */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            
            {/* Protected routes */}
            <Route path="/" element={
              <ProtectedRoute>
                <KasirPage />
              </ProtectedRoute>
            } />
            
            <Route path="/nasabah" element={
              <ProtectedRoute>
                <NasabahPage />
              </ProtectedRoute>
            } />
            
            <Route path="/sampah" element={
              <ProtectedRoute>
                <SampahPage />
              </ProtectedRoute>
            } />
            
            <Route path="/tarik" element={
              <ProtectedRoute>
                <TarikPage />
              </ProtectedRoute>
            } />
            
            {/* Redirect any other routes to home */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
          
          <Toaster />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;