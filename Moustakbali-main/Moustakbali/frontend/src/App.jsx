import React from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';

// Pages
import Home from './pages/Home';
import Analyses from './pages/Analyses';
import Dashboard from './pages/Dashboard';
import Academy from './pages/Academy';
import Gaming from './pages/Gaming';
import Gamification from './pages/Gamification';
import Pricing from './pages/Pricing';
import Contact from './pages/Contact';
import Login from './pages/Login';
import Register from './pages/Register';
import About from './pages/About';
import Payment from './pages/Payment';
import IaTool from './pages/IaTool';

import MalisWidget from './components/MalisWidget';


function App() {
  return (
    <AuthProvider>
      <HashRouter>
        <div className="flex flex-col min-h-screen relative">
          {/* Subtle grid background applied globally */}
          <div className="absolute inset-0 bg-grid-pattern opacity-60 pointer-events-none z-[-1]" />
          
          <Navbar />
          
          <main className="flex-grow z-10 pt-48">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/analyses" element={<Analyses />} />
              <Route path="/gaming" element={<Gaming />} />
              <Route path="/pricing" element={<Pricing />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/about" element={<About />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/payment" element={<Payment />} />
              <Route path="/ia-tool" element={<IaTool />} />
              
              {/* Protected Routes */}
              <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
              <Route path="/academy" element={<ProtectedRoute><Academy /></ProtectedRoute>} />
              <Route path="/gamification" element={<ProtectedRoute><Gamification /></ProtectedRoute>} />
            </Routes>
          </main>

          <Footer />
          <MalisWidget />
          <Toaster 
            position="top-right"
            toastOptions={{
              style: {
                background: '#0a2e18',
                color: '#fff',
                border: '1px solid rgba(34,197,94,0.3)',
              },
            }}
          />
        </div>
      </HashRouter>
    </AuthProvider>
  );
}

export default App;
