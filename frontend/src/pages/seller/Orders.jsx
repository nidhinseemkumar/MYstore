import React, { useEffect, useState } from 'react';
import { Filter, Eye, Package, Loader, CheckCircle, XCircle } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useAuthStore } from '../../store/useAuthStore';

export const SellerOrders = () => {
    const { user } = useAuthStore();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('All');

    useEffect(() => {
        if (!user) return;

        const fetchSellerOrders = async () => {
            try {
                // Fetch order items belonging to this seller
                const { data, error } = await supabase
                    .from('order_items')
                    .select(`
                        id,
                        quantity,
                        price_at_purchase,
                        created_at,
                        product:products(name, image_url),
                        order:orders(id, status, shipping_address)
                    `)
                    .eq('seller_id', user.id)
                    .order('created_at', { ascending: false });

                if (error) throw error;
                setOrders(data || []);
            } catch (err) {
                console.error("Error fetching seller orders:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchSellerOrders();
    }, [user]);

    const filteredOrders = orders.filter(item => {
        if (filter === 'All') return true;
        if (filter === 'Pending' && item.order?.status === 'pending') return true;
        if (filter === 'Completed' && item.order?.status === 'completed') return true;
        return false;
    });

    if (loading) {
        return <div className="flex justify-center items-center h-64"><Loader className="animate-spin text-primary" size={32} /></div>;
    }

    return (
        <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Orders</h2>

            <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="p-4 border-b border-gray-100 flex justify-between overflow-x-auto">
                    <div className="flex gap-2 min-w-max">
                        {['All', 'Pending', 'Completed'].map(f => (
                            <button
                                key={f}
                                onClick={() => setFilter(f)}
                                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${filter === f
                                        ? 'bg-primary/10 text-primary'
                                        : 'bg-white hover:bg-gray-50 text-gray-600 border border-gray-200'
                                    }`}
                            >
                                {f}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="p-0">
                    {filteredOrders.length === 0 ? (
                        <div className="text-center p-8 text-gray-500 flex flex-col items-center">
                            <Package size={48} className="text-gray-300 mb-4" />
                            <p>No orders found.</p>
                        </div>
                    ) : (
                        <div className="divide-y divide-gray-100">
                            {filteredOrders.map((item) => (
                                <div key={item.id} className="p-6 flex flex-col md:flex-row justify-between gap-4 hover:bg-gray-50/50 transition-colors">
                                    <div className="flex gap-4">
                                        <div className="h-16 w-16 bg-gray-100 rounded-lg flex items-center justify-center p-2 flex-shrink-0">
                                            {item.product?.image_url ? (
                                                <img src={item.product?.image_url} alt="" className="h-full w-full object-contain mix-blend-multiply" />
                                            ) : (
                                                <Package className="text-gray-400" />
                                            )}
                                        </div>
                                        <div>
                                            <div className="flex items-center gap-3 mb-1">
                                                <span className="font-bold text-gray-900 line-clamp-1">{item.product?.name}</span>
                                                <span className={`px-2 py-0.5 text-[10px] font-bold uppercase rounded-full tracking-wider ${item.order?.status === 'completed' ? 'bg-green-100 text-green-700' :
                                                        item.order?.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                                                            'bg-gray-100 text-gray-700'
                                                    }`}>
                                                    {item.order?.status || 'Unknown'}
                                                </span>
                                            </div>
                                            <div className="text-sm text-gray-500 mb-2">
                                                Order #{item.order?.id?.slice(0, 8) || 'N/A'} • {new Date(item.created_at).toLocaleDateString()}
                                            </div>
                                            <div className="text-xs text-gray-500 bg-gray-50 p-2 rounded border border-gray-100 line-clamp-2 max-w-md">
                                                <span className="font-semibold text-gray-700">Ship to:</span> {item.order?.shipping_address || 'Address not provided'}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex flex-col items-end justify-between min-w-[120px]">
                                        <div className="text-right">
                                            <p className="font-bold text-lg text-gray-900">₹{item.price_at_purchase * item.quantity}</p>
                                            <p className="text-xs text-gray-500">{item.quantity} × ₹{item.price_at_purchase}</p>
                                        </div>
                                        <button className="text-primary font-bold text-sm flex items-center gap-1 hover:underline mt-4 md:mt-0">
                                            Update Status <CheckCircle size={16} />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
