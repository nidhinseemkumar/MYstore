import React, { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { useAuthStore } from '../../store/useAuthStore';
import { Package, Calendar, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';
import { PLACEHOLDER_IMAGE } from '../../data/mockData';

export const OrderHistory = () => {
    const { user } = useAuthStore();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!user) return;

        const fetchOrders = async () => {
            try {
                // Fetch orders with items
                const { data, error } = await supabase
                    .from('orders')
                    .select(`
    *,
    items: order_items(
                            *,
        product: products(name, image_url)
    )
                    `)
                    .eq('user_id', user.id)
                    .order('created_at', { ascending: false });

                if (error) throw error;
                setOrders(data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchOrders();
    }, [user]);

    if (!user) {
        return <div className="p-8 text-center">Please log in to view orders.</div>;
    }

    if (loading) {
        return (
            <div className="flex justify-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto px-4 py-8 pb-20">
            <h1 className="text-2xl font-bold text-gray-900 mb-6">My Orders</h1>

            {orders.length === 0 ? (
                <div className="bg-white p-8 rounded-xl text-center shadow-sm">
                    <Package size={48} className="mx-auto text-gray-300 mb-4" />
                    <h3 className="text-lg font-medium text-gray-900">No orders yet</h3>
                    <p className="text-gray-500 mb-6">Looks like you haven't placed any orders yet.</p>
                    <Link to="/" className="text-primary font-bold hover:underline">Start Shopping</Link>
                </div>
            ) : (
                <div className="space-y-4">
                    {orders.map((order) => (
                        <div key={order.id} className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
                            {/* Order Header */}
                            <div className="bg-gray-50 px-6 py-4 border-b border-gray-100 flex justify-between items-center flex-wrap gap-4">
                                <div className="flex items-center gap-4">
                                    <div className="bg-green-100 p-2 rounded-lg">
                                        <Package className="text-green-700" size={20} />
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold text-gray-900">Order #{order.id.slice(0, 8)}</p>
                                        <div className="flex items-center gap-1 text-xs text-gray-500">
                                            <Calendar size={12} />
                                            {new Date(order.created_at).toLocaleDateString()}
                                            <span className="mx-1">•</span>
                                            <Clock size={12} />
                                            {new Date(order.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </div>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="text-sm font-bold text-gray-900">₹{order.total_amount}</p>
                                    <span className={`inline - block px - 2 py - 0.5 rounded text - [10px] uppercase font - bold tracking - wider ${order.status === 'completed' ? 'bg-green-100 text-green-700' :
                                            order.status === 'cancelled' ? 'bg-red-100 text-red-700' :
                                                'bg-blue-100 text-blue-700'
                                        } `}>
                                        {order.status}
                                    </span>
                                </div>
                            </div>

                            {/* Order Items */}
                            <div className="p-6">
                                <div className="space-y-4">
                                    {order.items.map((item) => (
                                        <div key={item.id} className="flex gap-4">
                                            <div className="h-16 w-16 bg-gray-50 rounded-lg flex-shrink-0 flex items-center justify-center p-1">
                                                <img
                                                    src={item.product?.image_url || PLACEHOLDER_IMAGE}
                                                    alt={item.product?.name}
                                                    className="h-full object-contain mix-blend-multiply"
                                                    onError={(e) => { e.target.src = PLACEHOLDER_IMAGE; }}
                                                />
                                            </div>
                                            <div>
                                                <h4 className="text-sm font-medium text-gray-900 line-clamp-1">{item.product?.name || "Product Removed"}</h4>
                                                <p className="text-xs text-gray-500">Qty: {item.quantity} × ₹{item.price_at_purchase}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                <div className="mt-4 pt-4 border-t border-gray-100 text-xs text-gray-500">
                                    <span className="font-medium">Delivered to:</span> {order.shipping_address}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};
