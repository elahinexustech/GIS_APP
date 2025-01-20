// src/App.js
import React, { useContext } from 'react';
import 'bootstrap';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { AuthProvider } from './components/AuthContext.jsx';
import { Home } from './pages/Home';
import Support from './pages/Support.jsx';
import { Signin } from './pages/Signin';
import TermsAndConditions from './pages/TermsConditions.jsx';
import Register from './pages/Register';
import Map from './pages/Map';
import { Navbar } from './components/Navbar';
import { RegionProvider } from './components/RegionContext';
import Dashboard from './clientdashboard/pages/Dashboard.jsx'
import { Aboutus } from './pages/Aboutus';
import { Profile } from './pages/Profile';
import Demo from './pages/Demo';
import SubscriptionDetails from './pages/SubscriptionDetails';
import SharedLinkHandler from './pages/SharedLinkHandler.jsx'

function App() {
    const isLoggedIn = useContext(AuthProvider);
    return (
        <AuthProvider>
            <RegionProvider>
                <Router>
                    <Navbar />


                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/about-us" element={<Aboutus />} />
                        <Route path="/demo" element={<Demo />} />
                        <Route path="/support" element={<Support />} />
                        <Route path="/legal" element={<TermsAndConditions />} />

                        {/* Dashboard urls */}
                        <Route path="/dashboard" element={<Dashboard />} />

                        {/* Buyers Maps */}
                        <Route path="/buyers/maps" element={<SharedLinkHandler />} />

                        <Route path="/login" element={<Signin />} />
                        <Route path="/register" element={<Register />} />
                        <Route path="/map" element={<Map />} />
                        <Route path="/profile" element={<Profile />} />
                        <Route path="/subscription-details" element={<SubscriptionDetails />} />
                    </Routes>


                </Router>
            </RegionProvider>
        </AuthProvider>
    );
}

export default App;