import React, { useState, useEffect } from 'react';
import { Users, Store, DollarSign, Activity, TrendingUp, TrendingDown, Clock, ArrowRight, Loader } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { motion } from 'framer-motion';
import { supabase } from '../../lib/supabase';

export const AdminDashboard = () => {
    const [loading, setLoading] = useState(true);
    const [statsData, setStatsData] = useState({
        totalRevenue: 0,
        activeUsers: 0,
        totalSellers: 0,
        recentActivity: [],
    });

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                // Fetch profiles counts
                const { count: usersCount, error: usersError } = await supabase
                    .from('profiles')
                    .select('*', { count: 'exact', head: true })
                    .eq('role', 'buyer');

                const { count: sellersCount, error: sellersError } = await supabase
                    .from('profiles')
                    .select('*', { count: 'exact', head: true })
                    .eq('role', 'seller');

                // Fetch total revenue from orders
                const { data: ordersData, error: ordersError } = await supabase
                    .from('orders')
                    .select('total_amount')
                    .eq('status', 'completed'); // only count completed

                let totalRevenue = 0;
                if (!ordersError && ordersData) {
                    totalRevenue = ordersData.reduce((acc, order) => acc + (Number(order.total_amount) || 0), 0);
                }

                // Fetch recent orders for activity
                const { data: recentOrdersData, error: recentOrdersError } = await supabase
                    .from('orders')
                    .select(`
                        id,
                        total_amount,
                        created_at,
                        status,
                        user:user_id(email)
                    `)
                    .order('created_at', { ascending: false })
                    .limit(5);

                // Fetch real names if possible, but user_id here points to auth.users, so we might not have names.
                // It's better to fetch profiles manually if needed. For now we use ID or email
                const formattedActivity = (recentOrdersData || []).map(order => ({
                    id: order.id,
                    user: order.user?.email || 'A user',
                    action: `placed an order (${order.status})`,
                    time: new Date(order.created_at).toLocaleDateString(),
                    amount: `₹${order.total_amount}`
                }));

                setStatsData({
                    activeUsers: usersCount || 0,
                    totalSellers: sellersCount || 0,
                    totalRevenue: totalRevenue,
                    recentActivity: formattedActivity,
                });

            } catch (err) {
                console.error("Error fetching admin stats:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, []);

    if (loading) {
        return <div className="flex h-96 items-center justify-center"><Loader className="animate-spin text-primary" size={40} /></div>;
    }

    const stats = [
        { label: 'Total Revenue', value: `₹${statsData.totalRevenue}`, change: '+0%', isPositive: true, icon: <DollarSign size={24} className="text-white" />, color: 'bg-green-600' },
        { label: 'Active Buyers', value: statsData.activeUsers.toString(), change: '+0%', isPositive: true, icon: <Users size={24} className="text-white" />, color: 'bg-blue-600' },
        { label: 'Total Sellers', value: statsData.totalSellers.toString(), change: '+0%', isPositive: true, icon: <Store size={24} className="text-white" />, color: 'bg-indigo-600' },
        { label: 'Platform Status', value: 'Online', change: 'Stable', isPositive: true, icon: <Activity size={24} className="text-white" />, color: 'bg-orange-500' },
    ];

    // Placeholder chart data
    const revenueData = [
        { name: 'Jan', revenue: 0 },
        { name: 'Feb', revenue: 0 },
        { name: 'Mar', revenue: 0 },
        { name: 'Apr', revenue: 0 },
        { name: 'May', revenue: 0 },
        { name: 'Jun', revenue: 0 },
        { name: 'Jul', revenue: statsData.totalRevenue }, // Put all current revenue here for now
    ];

    // Placeholder top sellers
    const topSellers = [
        { name: 'Market Leaders', sales: 'Loading...', orders: 0 },
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
                            <span className={`text-xs font-bold px-2 py-1 rounded-full flex items-center gap-1 ${stat.isPositive ? 'bg-green-50 text-green-600' : 'bg-gray-50 text-gray-600'}`}>
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
                        <select className="text-sm border-gray-200 rounded-lg text-gray-500 focus:ring-primary focus:border-primary outline-none px-2 py-1 border">
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
                            {statsData.recentActivity.length === 0 ? (
                                <p className="text-sm text-gray-500">No recent activity.</p>
                            ) : (
                                statsData.recentActivity.map((activity) => (
                                    <div key={activity.id} className="flex gap-4 items-start pb-4 border-b border-gray-50 last:border-0 last:pb-0">
                                        <div className="mt-1 flex-shrink-0 w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-xs font-bold text-gray-600 uppercase">
                                            {activity.user.charAt(0)}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm text-gray-800 line-clamp-2">
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
                                ))
                            )}
                        </div>
                    </motion.div>

                    {/* Top Sellers (Placeholder for now) */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.6 }}
                        className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm"
                    >
                        <h3 className="text-lg font-bold text-gray-900 mb-4">Top Sellers</h3>
                        <div className="space-y-4">
                            {topSellers.map((seller, index) => (
                                <div key={index} className="flex items-center justify-between opacity-50">
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
                            <p className="text-xs text-gray-400 text-center mt-2 italic">Data processing...</p>
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    );
};
