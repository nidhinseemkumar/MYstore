import React, { useState } from 'react';
import { Save, Bell, Shield, Wallet } from 'lucide-react';

export const AdminSettings = () => {
    const [platformFee, setPlatformFee] = useState(5);

    return (
        <div className="space-y-8 max-w-4xl">
            <h2 className="text-2xl font-bold text-gray-900">Platform Settings</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* General Settings */}
                <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="p-2 bg-blue-100 text-blue-600 rounded-lg">
                            <Wallet size={20} />
                        </div>
                        <h3 className="text-lg font-bold text-gray-900">Fees & Commission</h3>
                    </div>

                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Platform Fee (%)</label>
                            <input
                                type="number"
                                value={platformFee}
                                onChange={(e) => setPlatformFee(e.target.value)}
                                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                            />
                            <p className="text-xs text-gray-500 mt-1">This percentage will be deducted from every seller transaction.</p>
                        </div>
                        <button className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg font-medium text-sm hover:bg-green-700 transition-colors">
                            <Save size={16} />
                            Save Changes
                        </button>
                    </div>
                </div>

                {/* Notifications */}
                <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="p-2 bg-yellow-100 text-yellow-600 rounded-lg">
                            <Bell size={20} />
                        </div>
                        <h3 className="text-lg font-bold text-gray-900">Notifications</h3>
                    </div>

                    <div className="space-y-3">
                        <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-700">New Seller Signup</span>
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input type="checkbox" className="sr-only peer" defaultChecked />
                                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                            </label>
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-700">New Order Alert</span>
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input type="checkbox" className="sr-only peer" defaultChecked />
                                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                            </label>
                        </div>
                    </div>
                </div>

                {/* Security */}
                <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm md:col-span-2">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="p-2 bg-red-100 text-red-600 rounded-lg">
                            <Shield size={20} />
                        </div>
                        <h3 className="text-lg font-bold text-gray-900">Security</h3>
                    </div>

                    <div className="flex items-center justify-between border-t border-gray-100 pt-4">
                        <div>
                            <h4 className="font-medium text-gray-900">Maintenance Mode</h4>
                            <p className="text-sm text-gray-500">Temporarily disable the platform for all users.</p>
                        </div>
                        <button className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 font-medium text-sm hover:bg-gray-50 transition-colors">
                            Enable Maintenance
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};
