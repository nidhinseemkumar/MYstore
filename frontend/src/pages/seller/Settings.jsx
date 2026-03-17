import React, { useState } from 'react';
import { Save, Store, User, MapPin, Truck, ShieldCheck, Mail, Phone, Camera } from 'lucide-react';
import { useAuthStore } from '../../store/useAuthStore';
import toast from 'react-hot-toast';

export const SellerSettings = () => {
    const { user } = useAuthStore();
    
    // State for Profile Info
    const [profileData, setProfileData] = useState({
        fullName: user?.full_name || '',
        email: user?.email || '',
        phone: user?.phone || '',
    });

    // State for Store Info
    const [storeData, setStoreData] = useState({
        storeName: user?.store_name || '',
        description: user?.store_description || '',
        address: user?.address || '',
        gstin: user?.gstin || '',
        deliveryRadius: '5',
        minimumOrder: '100',
    });

    const [isLoading, setIsLoading] = useState(false);

    const handleProfileChange = (e) => setProfileData({ ...profileData, [e.target.name]: e.target.value });
    const handleStoreChange = (e) => setStoreData({ ...storeData, [e.target.name]: e.target.value });

    const handleSave = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        // Simulate API call
        setTimeout(() => {
            setIsLoading(false);
            toast.success("Settings saved successfully!");
        }, 800);
    };

    return (
        <div className="max-w-4xl space-y-8 animate-in fade-in duration-500">
            <div>
                <h2 className="text-2xl font-bold text-gray-900">Store Settings</h2>
                <p className="text-sm text-gray-500 mt-1">Manage your store profile, contact details, and preferences.</p>
            </div>

            <form onSubmit={handleSave} className="space-y-6">
                
                {/* Profile Section */}
                <div className="bg-white p-6 md:p-8 rounded-2xl border border-gray-100 shadow-sm relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-bl-full -z-10 transition-transform group-hover:scale-110" />
                    <div className="flex items-center gap-3 mb-6">
                        <div className="p-2.5 bg-blue-50 text-blue-600 rounded-xl">
                            <User size={22} className="stroke-[2.5]" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900">Personal Information</h3>
                    </div>

                    <div className="flex flex-col md:flex-row gap-8">
                        {/* Avatar */}
                        <div className="flex flex-col items-center gap-3">
                            <div className="w-24 h-24 bg-gray-100 rounded-full border-4 border-white shadow-md flex items-center justify-center relative group/avatar cursor-pointer">
                                <span className="text-2xl font-bold text-gray-400">
                                    {profileData.fullName ? profileData.fullName.charAt(0).toUpperCase() : 'S'}
                                </span>
                                <div className="absolute inset-0 bg-black/40 rounded-full opacity-0 group-hover/avatar:opacity-100 transition-opacity flex items-center justify-center">
                                    <Camera size={20} className="text-white" />
                                </div>
                            </div>
                            <span className="text-xs font-medium text-gray-500">Upload Photo</span>
                        </div>

                        {/* Fields */}
                        <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-5">
                            <div className="space-y-1.5 focus-within:text-primary transition-colors">
                                <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">Full Name</label>
                                <div className="relative">
                                    <User size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                    <input
                                        type="text"
                                        name="fullName"
                                        value={profileData.fullName}
                                        onChange={handleProfileChange}
                                        className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary focus:bg-white transition-all shadow-sm"
                                        placeholder="John Doe"
                                    />
                                </div>
                            </div>
                            
                            <div className="space-y-1.5 focus-within:text-primary transition-colors">
                                <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">Email Address</label>
                                <div className="relative">
                                    <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                    <input
                                        type="email"
                                        name="email"
                                        value={profileData.email}
                                        onChange={handleProfileChange}
                                        disabled
                                        className="w-full pl-10 pr-4 py-2.5 bg-gray-100 border border-gray-200 rounded-xl text-sm text-gray-500 cursor-not-allowed shadow-sm"
                                    />
                                </div>
                                <p className="text-[10px] text-gray-400 mt-1">Email cannot be changed.</p>
                            </div>

                            <div className="space-y-1.5 focus-within:text-primary transition-colors md:col-span-2">
                                <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">Phone Number</label>
                                <div className="relative">
                                    <Phone size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                    <input
                                        type="tel"
                                        name="phone"
                                        value={profileData.phone}
                                        onChange={handleProfileChange}
                                        className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary focus:bg-white transition-all shadow-sm"
                                        placeholder="+91 98765 43210"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Store Information Section */}
                <div className="bg-white p-6 md:p-8 rounded-2xl border border-gray-100 shadow-sm relative overflow-hidden group">
                    <div className="absolute top-0 left-0 w-32 h-32 bg-orange-50 rounded-br-full -z-10 transition-transform group-hover:scale-110" />
                    <div className="flex items-center gap-3 mb-6">
                        <div className="p-2.5 bg-orange-50 text-orange-600 rounded-xl">
                            <Store size={22} className="stroke-[2.5]" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900">Store Profile</h3>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-1.5 md:col-span-2 focus-within:text-primary transition-colors">
                            <label className="text-sm font-semibold text-gray-700">Store Name</label>
                            <input
                                type="text"
                                name="storeName"
                                value={storeData.storeName}
                                onChange={handleStoreChange}
                                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary focus:bg-white transition-all shadow-sm"
                                placeholder="E.g., Fresh Supermarket"
                            />
                        </div>

                        <div className="space-y-1.5 md:col-span-2 focus-within:text-primary transition-colors">
                            <label className="text-sm font-semibold text-gray-700">Store Description</label>
                            <textarea
                                name="description"
                                value={storeData.description}
                                onChange={handleStoreChange}
                                rows={3}
                                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary focus:bg-white transition-all shadow-sm resize-none"
                                placeholder="Tell customers about your store..."
                            />
                        </div>

                        <div className="space-y-1.5 md:col-span-2 focus-within:text-primary transition-colors">
                            <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                                <MapPin size={16} /> Business Address
                            </label>
                            <textarea
                                name="address"
                                value={storeData.address}
                                onChange={handleStoreChange}
                                rows={2}
                                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary focus:bg-white transition-all shadow-sm resize-none"
                                placeholder="Full store address"
                            />
                        </div>
                        
                        <div className="space-y-1.5 focus-within:text-primary transition-colors">
                            <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                                <ShieldCheck size={16} /> GSTIN / Tax ID
                            </label>
                            <input
                                type="text"
                                name="gstin"
                                value={storeData.gstin}
                                onChange={handleStoreChange}
                                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm uppercase focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary focus:bg-white transition-all shadow-sm"
                                placeholder="22AAAAA0000A1Z5"
                            />
                        </div>
                    </div>
                </div>

                {/* Operations Section */}
                <div className="bg-white p-6 md:p-8 rounded-2xl border border-gray-100 shadow-sm relative overflow-hidden group">
                     <div className="flex items-center gap-3 mb-6">
                        <div className="p-2.5 bg-purple-50 text-purple-600 rounded-xl">
                            <Truck size={22} className="stroke-[2.5]" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900">Delivery & Operations</h3>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-1.5 focus-within:text-primary transition-colors">
                            <label className="text-sm font-semibold text-gray-700">Delivery Radius (km)</label>
                            <input
                                type="number"
                                name="deliveryRadius"
                                value={storeData.deliveryRadius}
                                onChange={handleStoreChange}
                                min="1"
                                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary focus:bg-white transition-all shadow-sm"
                            />
                        </div>

                        <div className="space-y-1.5 focus-within:text-primary transition-colors">
                            <label className="text-sm font-semibold text-gray-700">Minimum Order Amount (₹)</label>
                            <input
                                type="number"
                                name="minimumOrder"
                                value={storeData.minimumOrder}
                                onChange={handleStoreChange}
                                min="0"
                                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary focus:bg-white transition-all shadow-sm"
                            />
                        </div>
                    </div>
                </div>

                {/* Submit Action */}
                <div className="flex justify-end pt-4 pb-12">
                     <button
                        type="submit"
                        disabled={isLoading}
                        className="bg-primary text-white py-3 px-8 rounded-xl font-bold shadow-lg shadow-primary/25 hover:bg-green-700 hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0 transition-all flex items-center gap-2"
                    >
                        {isLoading ? (
                            <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        ) : (
                            <>
                                <Save size={20} />
                                Save All Changes
                            </>
                        )}
                    </button>
                </div>
            </form>
        </div>
    );
};
