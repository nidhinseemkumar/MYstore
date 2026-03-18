import React from 'react';
import { useAuthStore } from '../../store/useAuthStore';
import { useLocationStore } from '../../store/useLocationStore';
import { useNavigate, Link } from 'react-router-dom';
import { User, MapPin, Package, LogIn, ChevronRight, Phone } from 'lucide-react';
import { motion } from 'framer-motion';

export const MyAccount = () => {
    const { user, logout } = useAuthStore();
    const { location } = useLocationStore();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    if (!user) {
        return (
            <div className="min-h-[60vh] flex flex-col items-center justify-center">
                <p className="text-gray-500 mb-4">Please log in to view your account.</p>
                <button
                    onClick={() => navigate('/login')}
                    className="bg-primary text-white font-bold px-6 py-2 rounded-lg"
                >
                    Login
                </button>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 pb-20 pt-8">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="mb-8 hidden sm:block">
                    <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">My Account</h1>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Left Sidebar */}
                    <div className="col-span-1 space-y-4">
                        {/* Profile Summary Card */}
                        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex flex-col items-center text-center">
                            <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                                <User size={40} className="text-primary" />
                            </div>
                            <h2 className="text-xl font-bold text-gray-900">{user.email?.split('@')[0] || 'User'}</h2>
                            <p className="text-gray-500 text-sm mt-1">{user.email}</p>
                            <span className="mt-3 bg-gray-100 text-gray-700 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide">
                                {user.role}
                            </span>
                        </div>

                        {/* Navigation Menu */}
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                            <div className="flex flex-col">
                                <Link to="/orders" className="flex items-center justify-between p-4 hover:bg-gray-50 border-b border-gray-50 transition-colors">
                                    <div className="flex items-center gap-3">
                                        <Package size={20} className="text-gray-500" />
                                        <span className="font-medium text-gray-700">My Orders</span>
                                    </div>
                                    <ChevronRight size={16} className="text-gray-400" />
                                </Link>
                                <button 
                                    onClick={handleLogout}
                                    className="flex items-center justify-between p-4 hover:bg-gray-50 transition-colors text-left"
                                >
                                    <div className="flex items-center gap-3">
                                        <LogIn size={20} className="text-red-500 rotate-180" />
                                        <span className="font-medium text-red-600">Logout</span>
                                    </div>
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Right Content Area */}
                    <div className="col-span-1 md:col-span-2 space-y-6">
                        {/* Account Details */}
                        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                            <h3 className="text-lg font-bold text-gray-900 mb-4 border-b border-gray-100 pb-2">Personal Information</h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-medium text-gray-500 mb-1">Email Address</label>
                                    <p className="text-sm font-medium text-gray-900">{user.email}</p>
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-gray-500 mb-1">Account Created</label>
                                    <p className="text-sm font-medium text-gray-900">
                                        {user.created_at ? new Date(user.created_at).toLocaleDateString() : 'N/A'}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Saved Addresses */}
                        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                            <div className="flex items-center justify-between mb-4 border-b border-gray-100 pb-2">
                                <h3 className="text-lg font-bold text-gray-900">Saved Address</h3>
                            </div>
                            
                            <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                                <div className="flex items-start justify-between">
                                    <div className="flex items-start gap-3">
                                        <div className="mt-1">
                                            <MapPin size={20} className="text-primary" />
                                        </div>
                                        <div>
                                            <div className="flex items-center gap-2 mb-1">
                                                <span className="font-bold text-gray-900">{location.type || 'Home'}</span>
                                            </div>
                                            <p className="text-sm text-gray-600 leading-relaxed max-w-sm">
                                                {location.address || 'No detailed address added.'}
                                                <br />
                                                {location.city ? `${location.city}, ` : ''}{location.pincode || ''}
                                                {location.landmark && (
                                                    <span className="block mt-1 text-xs text-gray-500">
                                                        Landmark: {location.landmark}
                                                    </span>
                                                )}
                                            </p>
                                            {location.phone && (
                                                <div className="flex items-center gap-2 mt-3 text-sm font-medium text-gray-700">
                                                    <Phone size={14} className="text-gray-400" />
                                                    {location.phone}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                    
                                </div>
                                <p className="text-xs text-center text-gray-400 mt-4 pt-4 border-t border-gray-200">
                                    To edit this address, use the location button in the top navigation bar.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
