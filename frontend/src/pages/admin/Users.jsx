import React, { useState } from 'react';
import { Search, MoreVertical, Trash2, Ban } from 'lucide-react';
import { motion } from 'framer-motion';

export const AdminUsers = () => {
    // Mock data for users
    const [users] = useState([
        { id: 1, name: 'John Doe', email: 'john@example.com', role: 'buyer', status: 'Active', joined: '2023-01-15' },
        { id: 2, name: 'Sarah Smith', email: 'sarah@example.com', role: 'buyer', status: 'Active', joined: '2023-02-10' },
        { id: 3, name: 'Mike Johnson', email: 'mike@example.com', role: 'seller', status: 'Active', joined: '2023-03-05' },
        { id: 4, name: 'Emily Davis', email: 'emily@example.com', role: 'buyer', status: 'Banned', joined: '2023-04-20' },
    ]);

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-900">User Management</h2>
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                    <input
                        type="text"
                        placeholder="Search users..."
                        className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                    />
                </div>
            </div>

            <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-gray-50 border-b border-gray-100">
                        <tr>
                            <th className="p-4 text-xs font-semibold text-gray-500 uppercase">User</th>
                            <th className="p-4 text-xs font-semibold text-gray-500 uppercase">Role</th>
                            <th className="p-4 text-xs font-semibold text-gray-500 uppercase">Status</th>
                            <th className="p-4 text-xs font-semibold text-gray-500 uppercase">Joined</th>
                            <th className="p-4 text-xs font-semibold text-gray-500 uppercase text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map((user) => (
                            <motion.tr
                                key={user.id}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="border-b border-gray-50 hover:bg-gray-50 transition-colors"
                            >
                                <td className="p-4">
                                    <div className="flex items-center gap-3">
                                        <div className="h-10 w-10 bg-gray-100 rounded-full flex items-center justify-center text-gray-600 font-bold">
                                            {user.name.charAt(0)}
                                        </div>
                                        <div>
                                            <div className="font-medium text-gray-900">{user.name}</div>
                                            <div className="text-sm text-gray-500">{user.email}</div>
                                        </div>
                                    </div>
                                </td>
                                <td className="p-4">
                                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${user.role === 'seller' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'
                                        }`}>
                                        {user.role}
                                    </span>
                                </td>
                                <td className="p-4">
                                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${user.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                                        }`}>
                                        {user.status}
                                    </span>
                                </td>
                                <td className="p-4 text-sm text-gray-600">{user.joined}</td>
                                <td className="p-4 text-right">
                                    <div className="flex items-center justify-end gap-2">
                                        <button className="p-2 text-gray-400 hover:text-red-500 transition-colors" title="Ban User">
                                            <Ban size={18} />
                                        </button>
                                        <button className="p-2 text-gray-400 hover:text-red-500 transition-colors" title="Delete User">
                                            <Trash2 size={18} />
                                        </button>
                                        <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
                                            <MoreVertical size={18} />
                                        </button>
                                    </div>
                                </td>
                            </motion.tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};
