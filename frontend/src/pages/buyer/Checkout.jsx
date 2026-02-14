import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, CheckCircle } from 'lucide-react';
import { useCartStore } from '../../store/useCartStore';
import { useAuthStore } from '../../store/useAuthStore';
import { supabase } from '../../lib/supabase';

export const Checkout = () => {
    const navigate = useNavigate();
    const { items, total, clearCart } = useCartStore();
    const { user } = useAuthStore();
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);

    // Simple address form state
    const [address, setAddress] = useState({
        street: '',
        city: '',
        zip: '',
    });

    if (items.length === 0 && !success) {
        return <div className="p-8 text-center">Cart is empty! <button onClick={() => navigate('/')} className="text-primary underline">Go Home</button></div>;
    }

    const handlePlaceOrder = async (e) => {
        e.preventDefault();
        if (!user) {
            alert("Please login to place an order.");
            navigate('/login');
            return;
        }

        setLoading(true);

        try {
            // 1. Create Order
            const { data: orderData, error: orderError } = await supabase
                .from('orders')
                .insert({
                    user_id: user.id,
                    total_amount: total,
                    status: 'pending',
                    shipping_address: `${address.street}, ${address.city}, ${address.zip}`,
                    payment_method: 'COD' // Simplified for now
                })
                .select()
                .single();

            if (orderError) throw orderError;

            // 2. Create Order Items
            const orderItems = items.map(item => ({
                order_id: orderData.id,
                product_id: item.id,
                seller_id: item.seller_id,
                quantity: item.quantity,
                price_at_purchase: item.price
            }));

            const { error: itemsError } = await supabase
                .from('order_items')
                .insert(orderItems);

            if (itemsError) throw itemsError;

            setSuccess(true);
            clearCart();

        } catch (err) {
            console.error(err);
            alert("Failed to place order: " + err.message);
        } finally {
            setLoading(false);
        }
    };

    if (success) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
                <div className="bg-white p-8 rounded-2xl shadow-lg max-w-md w-full text-center">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <CheckCircle className="text-green-600" size={32} />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Order Placed Successfully!</h2>
                    <p className="text-gray-500 mb-6">Thank you for shopping with MYstore. Your items will be delivered soon.</p>
                    <button
                        onClick={() => navigate('/')}
                        className="w-full bg-primary text-white py-3 rounded-xl font-bold hover:bg-green-700 transition"
                    >
                        Continue Shopping
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 pb-20">
            <header className="bg-white border-b sticky top-0 z-10 px-4 h-16 flex items-center">
                <button onClick={() => navigate('/cart')} className="mr-4">
                    <ArrowLeft size={20} />
                </button>
                <h1 className="text-lg font-bold">Checkout</h1>
            </header>

            <main className="max-w-3xl mx-auto p-4 md:p-8">
                <div className="grid md:grid-cols-3 gap-6">
                    {/* Form Section */}
                    <div className="md:col-span-2 space-y-6">
                        <section className="bg-white p-6 rounded-xl shadow-sm">
                            <h2 className="font-bold text-gray-900 mb-4">Shipping Address</h2>
                            <form id="checkout-form" onSubmit={handlePlaceOrder} className="space-y-4">
                                <div className="space-y-1">
                                    <label className="text-xs font-medium text-gray-500">Street Address</label>
                                    <input
                                        required
                                        type="text"
                                        className="w-full border rounded-lg p-2 text-sm focus:ring-2 focus:ring-primary/20 outline-none"
                                        value={address.street}
                                        onChange={e => setAddress({ ...address, street: e.target.value })}
                                        placeholder="123 Main St, Apartment 4B"
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-1">
                                        <label className="text-xs font-medium text-gray-500">City</label>
                                        <input
                                            required
                                            type="text"
                                            className="w-full border rounded-lg p-2 text-sm focus:ring-2 focus:ring-primary/20 outline-none"
                                            value={address.city}
                                            onChange={e => setAddress({ ...address, city: e.target.value })}
                                            placeholder="Bangalore"
                                        />
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-xs font-medium text-gray-500">ZIP Code</label>
                                        <input
                                            required
                                            type="text"
                                            className="w-full border rounded-lg p-2 text-sm focus:ring-2 focus:ring-primary/20 outline-none"
                                            value={address.zip}
                                            onChange={e => setAddress({ ...address, zip: e.target.value })}
                                            placeholder="560001"
                                        />
                                    </div>
                                </div>
                            </form>
                        </section>

                        <section className="bg-white p-6 rounded-xl shadow-sm">
                            <h2 className="font-bold text-gray-900 mb-4">Payment Method</h2>
                            <div className="border rounded-lg p-4 flex items-center justify-between bg-green-50 border-green-200">
                                <div className="flex items-center gap-3">
                                    <div className="w-4 h-4 rounded-full border-4 border-primary bg-white"></div>
                                    <span className="font-medium text-gray-900">Cash on Delivery</span>
                                </div>
                                <span className="text-xs font-medium text-primary bg-white px-2 py-1 rounded">Recommended</span>
                            </div>
                        </section>
                    </div>

                    {/* Summary Section */}
                    <div>
                        <div className="bg-white p-6 rounded-xl shadow-sm sticky top-24">
                            <h2 className="font-bold text-gray-900 mb-4">Order Summary</h2>
                            <div className="space-y-2 mb-4 text-sm text-gray-600">
                                <div className="flex justify-between">
                                    <span>Items ({items.length})</span>
                                    <span>₹{total}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Delivery</span>
                                    <span className="text-green-600">FREE</span>
                                </div>
                            </div>
                            <div className="border-t pt-4 mb-6 flex justify-between font-bold text-lg">
                                <span>Total</span>
                                <span>₹{total}</span>
                            </div>
                            <button
                                form="checkout-form"
                                disabled={loading}
                                className="w-full bg-primary text-white py-3 rounded-xl font-bold shadow-lg hover:bg-green-700 transition disabled:opacity-70 disabled:cursor-not-allowed flex justify-center"
                            >
                                {loading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : 'Place Order'}
                            </button>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};
