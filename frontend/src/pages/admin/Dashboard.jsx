import React from 'react';
import { Users, Store, DollarSign, Activity } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export const AdminDashboard = () => {
    const stats = [
        { label: 'Total Revenue', value: '₹12.5L', icon: <DollarSign size={24} className="text-white" />, color: 'bg-green-600' },
        { label: 'Active Users', value: '25.4K', icon: <Users size={24} className="text-white" />, color: 'bg-blue-600' },
        { label: 'Total Sellers', value: '142', icon: <Store size={24} className="text-white" />, color: 'bg-indigo-600' },
        { label: 'Server Load', value: '24%', icon: <Activity size={24} className="text-white" />, color: 'bg-orange-500' },
    ];

    const data = [
        { name: 'Jan', revenue: 4000 },
        { name: 'Feb', revenue: 3000 },
        { name: 'Mar', revenue: 5000 },
        { name: 'Apr', revenue: 4500 },
        { name: 'May', revenue: 6000 },
        { name: 'Jun', revenue: 7500 },
    ];

    return (
        <div className="space-y-8">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {stats.map((stat, index) => (
                    <div key={index} className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-500 mb-1">{stat.label}</p>
                            <h3 className="text-2xl font-bold text-gray-900">{stat.value}</h3>
                        </div>
                        <div className={`p-3 rounded-lg shadow-md ${stat.color}`}>
                            {stat.icon}
                        </div>
                    </div>
                ))}
            </div>

            {/* Charts Section */}
            <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm h-96">
                <h3 className="text-lg font-bold text-gray-900 mb-6">Revenue Growth</h3>
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={data}>
                        <defs>
                            <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#0C831F" stopOpacity={0.1} />
                                <stop offset="95%" stopColor="#0C831F" stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} />
                        <XAxis dataKey="name" axisLine={false} tickLine={false} />
                        <YAxis axisLine={false} tickLine={false} />
                        <Tooltip />
                        <Area type="monotone" dataKey="revenue" stroke="#0C831F" fillOpacity={1} fill="url(#colorRevenue)" />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};
