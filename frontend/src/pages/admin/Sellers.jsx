import React, { useState } from 'react';
import { Search, MoreVertical, Store, CheckCircle, XCircle } from 'lucide-react';
import { motion } from 'framer-motion';

export const AdminSellers = () => {
    // Mock data for sellers
    const [sellers] = useState([
        { id: 1, storeName: 'Fresh Mart', owner: 'Mike Johnson', status: 'Active', products: 45, rating: 4.8 },
        { id: 2, storeName: 'Green Grocers', owner: 'Alice Brown', status: 'Pending', products: 0, rating: 0 },
        { id: 3, storeName: 'Dairy King', owner: 'Bob Wilson', status: 'Active', products: 12, rating: 4.5 },
    ]);

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-900">Seller Management</h2>
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                    <input
                        type="text"
                        placeholder="Search sellers..."
                        className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                    />
                </div>
            </div>

            <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-gray-50 border-b border-gray-100">
                        <tr>
                            <th className="p-4 text-xs font-semibold text-gray-500 uppercase">Store</th>
                            <th className="p-4 text-xs font-semibold text-gray-500 uppercase">Owner</th>
                            <th className="p-4 text-xs font-semibold text-gray-500 uppercase">Status</th>
                            <th className="p-4 text-xs font-semibold text-gray-500 uppercase">Products</th>
                            <th className="p-4 text-xs font-semibold text-gray-500 uppercase">Rating</th>
                            <th className="p-4 text-xs font-semibold text-gray-500 uppercase text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {sellers.map((seller) => (
                            <motion.tr
                                key={seller.id}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="border-b border-gray-50 hover:bg-gray-50 transition-colors"
                            >
                                <td className="p-4">
                                    <div className="flex items-center gap-3">
                                        <div className="h-10 w-10 bg-indigo-100 rounded-lg flex items-center justify-center text-indigo-600 font-bold">
                                            <Store size={20} />
                                        </div>
                                        <div className="font-medium text-gray-900">{seller.storeName}</div>
                                    </div>
                                </td>
                                <td className="p-4 text-sm text-gray-600">{seller.owner}</td>
                                <td className="p-4">
                                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${seller.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                                        }`}>
                                        {seller.status}
                                    </span>
                                </td>
                                <td className="p-4 text-sm text-gray-600">{seller.products}</td>
                                <td className="p-4 text-sm text-gray-600">⭐ {seller.rating || '-'}</td>
                                <td className="p-4 text-right">
                                    <div className="flex items-center justify-end gap-2">
                                        {seller.status === 'Pending' && (
                                            <>
                                                <button className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors" title="Approve">
                                                    <CheckCircle size={18} />
                                                </button>
                                                <button className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors" title="Reject">
                                                    <XCircle size={18} />
                                                </button>
                                            </>
                                        )}
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
