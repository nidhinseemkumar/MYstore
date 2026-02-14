import React, { useEffect } from 'react';
import { DollarSign, ShoppingBag, Package, TrendingUp, Loader } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useSellerStore } from '../../store/useSellerStore';
import { useAuthStore } from '../../store/useAuthStore';

export const Dashboard = () => {
    const { user } = useAuthStore();
    const { stats, fetchDashboardStats, isLoading } = useSellerStore();

    useEffect(() => {
        if (user) {
            fetchDashboardStats(user.id);
        }
    }, [user, fetchDashboardStats]);

    if (isLoading) {
        return <div className="flex h-96 items-center justify-center"><Loader className="animate-spin text-primary" /></div>;
    }

    const statCards = [
        { label: 'Total Sales', value: `₹${stats.totalSales}`, icon: <DollarSign size={24} className="text-green-600" />, change: '+0%', color: 'bg-green-50' },
        { label: 'Total Orders', value: stats.totalOrders, icon: <ShoppingBag size={24} className="text-blue-600" />, change: '+0%', color: 'bg-blue-50' },
        { label: 'Products', value: stats.productsCount, icon: <Package size={24} className="text-orange-600" />, change: '0%', color: 'bg-orange-50' },
        { label: 'Growth', value: '0%', icon: <TrendingUp size={24} className="text-purple-600" />, change: '+0%', color: 'bg-purple-50' },
    ];

    // Mock chart data for now (calculating weekly from raw timestamps is complex in frontend)
    const chartData = [
        { name: 'Mon', sales: 0 },
        { name: 'Tue', sales: 0 },
        { name: 'Wed', sales: 0 },
        { name: 'Thu', sales: 0 },
        { name: 'Fri', sales: 0 },
        { name: 'Sat', sales: 0 },
        { name: 'Sun', sales: stats.totalSales || 0 }, // Just showing total for today/sun for demo
    ];

    return (
        <div className="space-y-8">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {statCards.map((stat, index) => (
                    <div key={index} className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm flex items-start justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-500 mb-1">{stat.label}</p>
                            <h3 className="text-2xl font-bold text-gray-900">{stat.value}</h3>
                            <span className="text-xs font-medium text-green-600 bg-green-50 px-2 py-0.5 rounded-full mt-2 inline-block">
                                {stat.change} vs last week
                            </span>
                        </div>
                        <div className={`p-3 rounded-lg ${stat.color}`}>
                            {stat.icon}
                        </div>
                    </div>
                ))}
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm h-80">
                    <h3 className="text-lg font-bold text-gray-900 mb-6">Weekly Sales</h3>
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={chartData}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} />
                            <XAxis dataKey="name" axisLine={false} tickLine={false} />
                            <YAxis axisLine={false} tickLine={false} />
                            <Tooltip />
                            <Bar dataKey="sales" fill="#0C831F" radius={[4, 4, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>

                <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm h-80 overflow-auto">
                    <h3 className="text-lg font-bold text-gray-900 mb-4">Recent Sales</h3>
                    <div className="space-y-4">
                        {stats.recentOrders.length === 0 ? (
                            <p className="text-gray-400 text-sm">No sales yet.</p>
                        ) : (
                            stats.recentOrders.map((item) => (
                                <div key={item.id} className="flex items-center justify-between border-b border-gray-50 pb-2">
                                    <div className="flex gap-3">
                                        <img src={item.product?.image_url} alt="" className="w-10 h-10 rounded bg-gray-50 object-contain p-1" />
                                        <div>
                                            <p className="text-sm font-medium text-gray-900 line-clamp-1">{item.product?.name}</p>
                                            <p className="text-xs text-gray-500">
                                                {new Date(item.created_at).toLocaleDateString()} • {item.order?.status || 'Pending'}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-bold text-sm">₹{item.price_at_purchase * item.quantity}</p>
                                        <p className="text-xs text-gray-500">{item.quantity} units</p>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};
