import React from 'react';
import { Filter, Eye } from 'lucide-react';

export const SellerOrders = () => {
    return (
        <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Orders</h2>

            <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="p-4 border-b border-gray-100 flex justify-between">
                    <div className="flex gap-2">
                        <button className="px-4 py-2 bg-gray-100 rounded-lg text-sm font-medium text-gray-900">All</button>
                        <button className="px-4 py-2 bg-white hover:bg-gray-50 rounded-lg text-sm font-medium text-gray-600">Pending</button>
                        <button className="px-4 py-2 bg-white hover:bg-gray-50 rounded-lg text-sm font-medium text-gray-600">Completed</button>
                    </div>
                </div>

                <div className="space-y-4 p-4">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="border border-gray-100 rounded-lg p-4 flex justify-between items-center hover:border-primary/50 transition-colors cursor-pointer">
                            <div>
                                <div className="flex items-center gap-3 mb-1">
                                    <span className="font-bold text-gray-900">#ORD-2023-00{i}</span>
                                    <span className="px-2 py-0.5 bg-yellow-100 text-yellow-700 text-xs font-bold rounded-full">Pending</span>
                                </div>
                                <div className="text-sm text-gray-500">2 items • ₹245.00 • Today, 10:30 AM</div>
                            </div>
                            <button className="text-primary font-medium text-sm flex items-center gap-1 hover:underline">
                                View Details <Eye size={16} />
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};
