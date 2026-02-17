import React from 'react';
import { Users, Store, DollarSign, Activity, TrendingUp, TrendingDown, Clock, ArrowRight } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Cell } from 'recharts';
import { motion } from 'framer-motion';

export const AdminDashboard = () => {
    const stats = [
        { label: 'Total Revenue', value: '₹12.5L', change: '+12.5%', isPositive: true, icon: <DollarSign size={24} className="text-white" />, color: 'bg-green-600' },
        { label: 'Active Users', value: '25.4K', change: '+5.2%', isPositive: true, icon: <Users size={24} className="text-white" />, color: 'bg-blue-600' },
        { label: 'Total Sellers', value: '142', change: '-2.4%', isPositive: false, icon: <Store size={24} className="text-white" />, color: 'bg-indigo-600' },
        { label: 'Server Load', value: '24%', change: 'Stable', isPositive: true, icon: <Activity size={24} className="text-white" />, color: 'bg-orange-500' },
    ];

    const revenueData = [
        { name: 'Jan', revenue: 4000 },
        { name: 'Feb', revenue: 3000 },
        { name: 'Mar', revenue: 5000 },
        { name: 'Apr', revenue: 4500 },
        { name: 'May', revenue: 6000 },
        { name: 'Jun', revenue: 7500 },
        { name: 'Jul', revenue: 8200 },
    ];

    const recentActivity = [
        { id: 1, user: 'Alice Smith', action: 'placed an order', time: '2 mins ago', amount: '₹1,200' },
        { id: 2, user: 'Fresh Mart', action: 'added 5 new products', time: '15 mins ago', amount: '' },
        { id: 3, user: 'John Doe', action: 'registered as a seller', time: '1 hour ago', amount: '' },
        { id: 4, user: 'Sarah Connor', action: 'left a review', time: '2 hours ago', amount: '⭐⭐⭐⭐⭐' },
    ];

    const topSellers = [
        { name: 'Fresh Mart', sales: '₹4.2L', orders: 1205 },
        { name: 'Organic Choice', sales: '₹2.8L', orders: 850 },
        { name: 'Daily Needs', sales: '₹1.5L', orders: 420 },
    ];

    return (
        <div className="space-y-8">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, index) => (
                    <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow"
                    >
                        <div className="flex items-center justify-between mb-4">
                            <div className={`p-3 rounded-lg shadow-sm ${stat.color}`}>
                                {stat.icon}
                            </div>
                            <span className={`text-xs font-bold px-2 py-1 rounded-full flex items-center gap-1 ${stat.isPositive ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>
                                {stat.isPositive ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                                {stat.change}
                            </span>
                        </div>
                        <div>
                            <p className="text-sm font-medium text-gray-500 mb-1">{stat.label}</p>
                            <h3 className="text-2xl font-bold text-gray-900">{stat.value}</h3>
                        </div>
                    </motion.div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Revenue Chart */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.4 }}
                    className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm lg:col-span-2 min-h-[400px]"
                >
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-lg font-bold text-gray-900">Revenue Overview</h3>
                        <select className="text-sm border-gray-200 rounded-lg text-gray-500 focus:ring-primary focus:border-primary">
                            <option>Last 6 Months</option>
                            <option>This Year</option>
                        </select>
                    </div>
                    <div className="h-80 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={revenueData}>
                                <defs>
                                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#0C831F" stopOpacity={0.1} />
                                        <stop offset="95%" stopColor="#0C831F" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#9CA3AF', fontSize: 12 }} dy={10} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#9CA3AF', fontSize: 12 }} tickFormatter={(value) => `₹${value}`} />
                                <Tooltip
                                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                    itemStyle={{ color: '#0C831F', fontWeight: 'bold' }}
                                />
                                <Area type="monotone" dataKey="revenue" stroke="#0C831F" strokeWidth={3} fillOpacity={1} fill="url(#colorRevenue)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </motion.div>

                {/* Right Column Widgets */}
                <div className="space-y-8">
                    {/* Recent Activity */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.5 }}
                        className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm"
                    >
                        <h3 className="text-lg font-bold text-gray-900 mb-4">Recent Activity</h3>
                        <div className="space-y-4">
                            {recentActivity.map((activity) => (
                                <div key={activity.id} className="flex gap-4 items-start pb-4 border-b border-gray-50 last:border-0 last:pb-0">
                                    <div className="mt-1 min-w-[32px] w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-xs font-bold text-gray-600">
                                        {activity.user.charAt(0)}
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-sm text-gray-800">
                                            <span className="font-semibold">{activity.user}</span> {activity.action}
                                        </p>
                                        <div className="flex items-center justify-between mt-1">
                                            <span className="text-xs text-gray-400 flex items-center gap-1">
                                                <Clock size={10} /> {activity.time}
                                            </span>
                                            {activity.amount && (
                                                <span className="text-xs font-bold text-primary">{activity.amount}</span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <button className="w-full mt-4 py-2 text-sm text-primary font-bold hover:bg-green-50 rounded-lg transition-colors flex items-center justify-center gap-2">
                            View All Activity <ArrowRight size={14} />
                        </button>
                    </motion.div>

                    {/* Top Sellers */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.6 }}
                        className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm"
                    >
                        <h3 className="text-lg font-bold text-gray-900 mb-4">Top Sellers</h3>
                        <div className="space-y-4">
                            {topSellers.map((seller, index) => (
                                <div key={index} className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600 font-bold text-xs">
                                            {index + 1}
                                        </div>
                                        <div>
                                            <h4 className="text-sm font-bold text-gray-900">{seller.name}</h4>
                                            <span className="text-xs text-gray-500">{seller.orders} orders</span>
                                        </div>
                                    </div>
                                    <span className="text-sm font-bold text-gray-900">{seller.sales}</span>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    );
};
