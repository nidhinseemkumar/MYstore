import React, { useState, useEffect } from 'react';
import { Search, MoreVertical, Store, CheckCircle, XCircle, Loader } from 'lucide-react';
import { motion } from 'framer-motion';
import { supabase } from '../../lib/supabase';

export const AdminSellers = () => {
    const [sellers, setSellers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const fetchSellers = async () => {
            try {
                // Fetch profiles with role = seller
                const { data: sellerProfiles, error: profileError } = await supabase
                    .from('profiles')
                    .select('*')
                    .eq('role', 'seller')
                    .order('created_at', { ascending: false });

                if (profileError) throw profileError;

                // For each seller, fetch product count
                // (Note: in a real production MVP, a view or RPC might be better, but this handles simple setups well)
                const sellersWithStats = await Promise.all(
                    (sellerProfiles || []).map(async (seller) => {
                        const { count, error: countError } = await supabase
                            .from('products')
                            .select('*', { count: 'exact', head: true })
                            .eq('seller_id', seller.id);

                        return {
                            ...seller,
                            productsCount: countError ? 0 : (count || 0),
                            status: 'Active', // Mocking status approval workflow for now
                            rating: '4.5' // Mocking rating for now
                        };
                    })
                );

                setSellers(sellersWithStats);
            } catch (err) {
                console.error("Error fetching sellers:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchSellers();
    }, []);

    const filteredSellers = sellers.filter((seller) =>
        (seller.full_name?.toLowerCase() || '').includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-900">Seller Management</h2>
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                    <input
                        type="text"
                        placeholder="Search sellers..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                    />
                </div>
            </div>

            <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden min-h-[400px]">
                {loading ? (
                    <div className="flex justify-center items-center h-64">
                        <Loader className="animate-spin text-primary" size={32} />
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-gray-50 border-b border-gray-100">
                                <tr>
                                    <th className="p-4 text-xs font-semibold text-gray-500 uppercase">Store / Owner</th>
                                    <th className="p-4 text-xs font-semibold text-gray-500 uppercase">Status</th>
                                    <th className="p-4 text-xs font-semibold text-gray-500 uppercase">Products</th>
                                    <th className="p-4 text-xs font-semibold text-gray-500 uppercase">Rating</th>
                                    <th className="p-4 text-xs font-semibold text-gray-500 uppercase">Joined</th>
                                    <th className="p-4 text-xs font-semibold text-gray-500 uppercase text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {filteredSellers.map((seller) => (
                                    <motion.tr
                                        key={seller.id}
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        className="hover:bg-gray-50 transition-colors"
                                    >
                                        <td className="p-4">
                                            <div className="flex items-center gap-3">
                                                <div className="h-10 w-10 bg-indigo-100 rounded-lg flex items-center justify-center text-indigo-600 font-bold flex-shrink-0">
                                                    <Store size={20} />
                                                </div>
                                                <div>
                                                    <div className="font-medium text-gray-900">{seller.full_name || 'Unnamed Store'}</div>
                                                    <div className="text-xs text-gray-500" title={seller.id}>ID: ...{seller.id.slice(-6)}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="p-4">
                                            <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${seller.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                                                }`}>
                                                {seller.status}
                                            </span>
                                        </td>
                                        <td className="p-4 font-medium text-gray-900">{seller.productsCount}</td>
                                        <td className="p-4 text-sm text-gray-600">
                                            <div className="flex items-center gap-1">
                                                <span className="text-yellow-400">⭐</span> {seller.rating}
                                            </div>
                                        </td>
                                        <td className="p-4 text-sm text-gray-500">
                                            {new Date(seller.created_at).toLocaleDateString()}
                                        </td>
                                        <td className="p-4 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                {seller.status === 'Pending' && (
                                                    <>
                                                        <button className="p-2 text-green-600 hover:bg-green-50 rounded transition-colors" title="Approve">
                                                            <CheckCircle size={18} />
                                                        </button>
                                                        <button className="p-2 text-red-600 hover:bg-red-50 rounded transition-colors" title="Reject">
                                                            <XCircle size={18} />
                                                        </button>
                                                    </>
                                                )}
                                                <button className="p-2 text-gray-400 hover:bg-gray-100 rounded transition-colors">
                                                    <MoreVertical size={18} />
                                                </button>
                                            </div>
                                        </td>
                                    </motion.tr>
                                ))}
                            </tbody>
                        </table>
                        {filteredSellers.length === 0 && (
                            <div className="text-center py-12 text-gray-500 flex flex-col items-center">
                                <Store size={48} className="text-gray-300 mb-4" />
                                <p>No sellers registered yet.</p>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};
