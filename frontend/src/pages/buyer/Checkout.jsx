import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, CheckCircle, CreditCard, Smartphone, Banknote, Building, AlertCircle } from 'lucide-react';
import { useCartStore } from '../../store/useCartStore';
import { useAuthStore } from '../../store/useAuthStore';
import { supabase } from '../../lib/supabase';
import { toast } from 'react-hot-toast';

export const Checkout = () => {
    const navigate = useNavigate();
    const { items, total, clearCart } = useCartStore();
    const { user } = useAuthStore();

    const [step, setStep] = useState(1); // 1 = Address, 2 = Payment
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [selectedPayment, setSelectedPayment] = useState(null);
    const [showConfirmModal, setShowConfirmModal] = useState(false);

    // Simple address form state
    const [address, setAddress] = useState({
        street: '',
        city: '',
        zip: '',
    });

    if (items.length === 0 && !success) {
        return <div className="p-8 text-center">Cart is empty! <button onClick={() => navigate('/')} className="text-primary underline">Go Home</button></div>;
    }

    const handleProceedToPayment = (e) => {
        e.preventDefault();
        if (!user) {
            toast.error("Please login to proceed.");
            navigate('/login');
            return;
        }
        setStep(2);
    };

    const handleSelectPayment = (method) => {
        setSelectedPayment(method);
        if (method !== 'COD') {
            toast.error("Only Cash on Delivery is available right now");
        } else {
            setShowConfirmModal(true);
        }
    };

    const handlePlaceOrder = async () => {
        setShowConfirmModal(false);
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
                    payment_method: 'COD'
                })
                .select()
                .single();

            if (orderError) throw new Error("Order Creation Failed: " + JSON.stringify(orderError));

            // 2. Create Order Items
            const orderItems = items.map(item => ({
                order_id: orderData.id,
                product_id: item.id,
                // Fallback for mock data that lacks a seller_id
                seller_id: item.seller_id || user.id,
                quantity: item.quantity,
                price_at_purchase: item.price
            }));

            const { error: itemsError } = await supabase
                .from('order_items')
                .insert(orderItems);

            if (itemsError) throw new Error("Order Items Creation Failed: " + JSON.stringify(itemsError));

            toast.success("Order Placed Successfully!");
            setSuccess(true);
            clearCart();

        } catch (err) {
            console.error(err);
            toast.error("Failed to place order: " + err.message);
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
                <button
                    onClick={() => step === 2 ? setStep(1) : navigate('/cart')}
                    className="mr-4 text-gray-600 hover:text-gray-900 transition-colors"
                >
                    <ArrowLeft size={20} />
                </button>
                <h1 className="text-lg font-bold">Checkout</h1>
            </header>

            <main className="max-w-3xl mx-auto p-4 md:p-8 relative">

                {/* Progress Indicators */}
                <div className="flex items-center justify-center mb-8 gap-4 px-4">
                    <div className={`flex items-center gap-2 ${step >= 1 ? 'text-primary' : 'text-gray-400'}`}>
                        <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${step >= 1 ? 'bg-primary text-white' : 'bg-gray-200'}`}>1</div>
                        <span className="font-bold text-sm">Shipping</span>
                    </div>
                    <div className="h-0.5 w-12 bg-gray-200"><div className={`h-full bg-primary transition-all ${step >= 2 ? 'w-full' : 'w-0'}`}></div></div>
                    <div className={`flex items-center gap-2 ${step >= 2 ? 'text-primary' : 'text-gray-400'}`}>
                        <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${step >= 2 ? 'bg-primary text-white' : 'bg-gray-200'}`}>2</div>
                        <span className="font-bold text-sm">Payment</span>
                    </div>
                </div>

                <div className="grid md:grid-cols-3 gap-6">
                    {/* Form Section */}
                    <div className="md:col-span-2 space-y-6">
                        {step === 1 && (
                            <section className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 animate-in fade-in slide-in-from-right-4 duration-300">
                                <h2 className="font-bold text-gray-900 mb-4">Shipping Address</h2>
                                <form id="address-form" onSubmit={handleProceedToPayment} className="space-y-4">
                                    <div className="space-y-1">
                                        <label className="text-xs font-medium text-gray-500">Street Address</label>
                                        <input
                                            required
                                            type="text"
                                            className="w-full border border-gray-200 rounded-lg p-3 text-sm focus:ring-2 focus:ring-primary/20 outline-none transition-shadow"
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
                                                className="w-full border border-gray-200 rounded-lg p-3 text-sm focus:ring-2 focus:ring-primary/20 outline-none transition-shadow"
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
                                                className="w-full border border-gray-200 rounded-lg p-3 text-sm focus:ring-2 focus:ring-primary/20 outline-none transition-shadow"
                                                value={address.zip}
                                                onChange={e => setAddress({ ...address, zip: e.target.value })}
                                                placeholder="560001"
                                            />
                                        </div>
                                    </div>
                                </form>
                            </section>
                        )}

                        {step === 2 && (
                            <section className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 animate-in fade-in slide-in-from-right-4 duration-300">
                                <h2 className="font-bold text-gray-900 mb-4">Payment Method</h2>
                                <p className="text-sm text-gray-500 mb-6">Please select your preferred payment method.</p>

                                <div className="space-y-3">
                                    {/* COD Option */}
                                    <button
                                        onClick={() => handleSelectPayment('COD')}
                                        className="w-full text-left border-2 rounded-xl p-4 flex items-center justify-between hover:border-primary/50 hover:bg-green-50/30 transition-all focus:outline-none border-gray-100"
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className="bg-green-100 p-2 rounded-lg text-green-700">
                                                <Banknote size={24} />
                                            </div>
                                            <div>
                                                <span className="font-bold text-gray-900 block">Cash on Delivery</span>
                                                <span className="text-xs text-gray-500">Pay when you receive the order</span>
                                            </div>
                                        </div>
                                    </button>

                                    {/* Other Payment Options (Disabled/Mock in UI but clickable to show toast) */}
                                    <button
                                        onClick={() => handleSelectPayment('CARD')}
                                        className="w-full text-left border rounded-xl p-4 flex items-center justify-between hover:bg-gray-50 transition-all focus:outline-none border-gray-100 opacity-80"
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className="bg-blue-50 p-2 rounded-lg text-blue-600">
                                                <CreditCard size={24} />
                                            </div>
                                            <div>
                                                <span className="font-bold text-gray-900 block">Credit/Debit Card</span>
                                                <span className="text-xs text-gray-500">Visa, Mastercard, RuPay</span>
                                            </div>
                                        </div>
                                    </button>

                                    <button
                                        onClick={() => handleSelectPayment('UPI')}
                                        className="w-full text-left border rounded-xl p-4 flex items-center justify-between hover:bg-gray-50 transition-all focus:outline-none border-gray-100 opacity-80"
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className="bg-purple-50 p-2 rounded-lg text-purple-600">
                                                <Smartphone size={24} />
                                            </div>
                                            <div>
                                                <span className="font-bold text-gray-900 block">UPI</span>
                                                <span className="text-xs text-gray-500">Google Pay, PhonePe, Paytm</span>
                                            </div>
                                        </div>
                                    </button>

                                    <button
                                        onClick={() => handleSelectPayment('NETBANKING')}
                                        className="w-full text-left border rounded-xl p-4 flex items-center justify-between hover:bg-gray-50 transition-all focus:outline-none border-gray-100 opacity-80"
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className="bg-orange-50 p-2 rounded-lg text-orange-600">
                                                <Building size={24} />
                                            </div>
                                            <div>
                                                <span className="font-bold text-gray-900 block">Net Banking</span>
                                                <span className="text-xs text-gray-500">Select from list of banks</span>
                                            </div>
                                        </div>
                                    </button>
                                </div>
                            </section>
                        )}
                    </div>

                    {/* Summary Section */}
                    <div>
                        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 sticky top-24">
                            <h2 className="font-bold text-gray-900 mb-4">Order Summary</h2>
                            <div className="space-y-3 mb-6 text-sm text-gray-600">
                                <div className="flex justify-between">
                                    <span>Items ({items.length})</span>
                                    <span className="text-gray-900 font-medium">₹{total}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Delivery</span>
                                    <span className="text-green-600 font-medium">FREE</span>
                                </div>
                            </div>
                            <div className="border-t border-gray-100 pt-4 mb-6 flex justify-between items-center">
                                <span className="font-bold text-gray-900 text-lg">Total</span>
                                <span className="font-black text-primary text-xl">₹{total}</span>
                            </div>

                            {step === 1 ? (
                                <button
                                    form="address-form"
                                    type="submit"
                                    className="w-full bg-primary text-white py-4 rounded-xl font-bold shadow-lg shadow-primary/30 hover:shadow-primary/50 hover:-translate-y-0.5 transition-all flex justify-center items-center gap-2"
                                >
                                    Proceed to Payment
                                </button>
                            ) : (
                                <p className="text-xs text-gray-500 text-center uppercase tracking-wide font-bold">Please select a payment method on the left</p>
                            )}
                        </div>
                    </div>
                </div>

                {/* Confirmation Modal overlay */}
                {showConfirmModal && (
                    <div className="fixed inset-0 bg-gray-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                        <div className="bg-white rounded-2xl shadow-xl max-w-sm w-full p-6 animate-in zoom-in-95 duration-200">
                            <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                                <AlertCircle size={24} />
                            </div>
                            <h3 className="text-xl font-bold text-center text-gray-900 mb-2">Confirm COD Order</h3>
                            <p className="text-center text-gray-500 mb-6 text-sm leading-relaxed">
                                You are about to place an order for <strong className="text-gray-900">₹{total}</strong> using Cash on Delivery. Do you wish to proceed?
                            </p>
                            <div className="flex gap-3">
                                <button
                                    onClick={() => setShowConfirmModal(false)}
                                    className="flex-1 py-3 bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold rounded-xl transition-colors"
                                    disabled={loading}
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handlePlaceOrder}
                                    className="flex-1 py-3 bg-primary hover:bg-green-700 text-white font-bold rounded-xl transition-colors shadow-lg shadow-primary/30 flex justify-center items-center"
                                    disabled={loading}
                                >
                                    {loading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : 'Confirm Order'}
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
};
