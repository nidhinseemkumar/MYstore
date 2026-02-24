import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Minus, Plus, Trash2, ArrowRight } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useCartStore } from '../../store/useCartStore';

export const Cart = () => {
  const navigate = useNavigate();
  const { items, updateQuantity, removeItem, total, itemCount, addItem } = useCartStore();

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
        <img
          src="https://cdn-icons-png.flaticon.com/512/11329/11329060.png"
          alt="Empty Cart"
          className="w-48 h-48 mb-6 opacity-80"
        />
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Your cart is empty</h2>
        <p className="text-gray-500 mb-8">Add items to start your shopping journey</p>
        <Link
          to="/"
          className="bg-primary text-white px-8 py-3 rounded-xl font-bold shadow-md hover:bg-green-700 transition-colors"
        >
          Start Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto pb-20">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">My Cart ({itemCount} Items)</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items List */}
        <div className="lg:col-span-2 space-y-4">
          <AnimatePresence>
            {items.map((item) => (
              <motion.div
                key={item.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex gap-4"
              >
                <div className="h-20 w-20 bg-gray-50 rounded-lg flex items-center justify-center p-2 flex-shrink-0">
                  <img src={item.image} alt={item.name} className="h-full object-contain mix-blend-multiply" />
                </div>

                <div className="flex-1 flex flex-col justify-between">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-sm font-medium text-gray-900 line-clamp-1">{item.name}</h3>
                      <p className="text-xs text-gray-500">{item.quantity * item.price} / unit</p>
                    </div>
                    <button
                      onClick={() => removeItem(item.id)}
                      className="text-gray-400 hover:text-red-500 transition-colors"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>

                  <div className="flex justify-between items-end mt-2">
                    <div className="flex items-center bg-green-50 rounded-lg h-8 border border-green-100">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="w-8 h-full flex items-center justify-center text-green-700 hover:bg-green-200 rounded-l-lg transition-colors"
                      >
                        <Minus size={14} />
                      </button>
                      <span className="text-gray-900 text-xs font-bold w-6 text-center">{item.quantity}</span>
                      <button
                        onClick={() => addItem(item)}
                        className="w-8 h-full flex items-center justify-center text-green-700 hover:bg-green-200 rounded-r-lg transition-colors"
                      >
                        <Plus size={14} />
                      </button>
                    </div>
                    <span className="text-base font-bold text-gray-900">₹{item.price * item.quantity}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Bill Details */}
        <div className="lg:col-span-1 h-fit">
          <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm sticky top-24">
            <h3 className="font-bold text-gray-900 mb-4">Bill Details</h3>

            <div className="space-y-3 text-sm mb-4 border-b border-gray-100 pb-4">
              <div className="flex justify-between text-gray-600">
                <span>Item Total</span>
                <span>₹{total}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Delivery Charge</span>
                <span className="text-green-600 font-medium">FREE</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Handling Charge</span>
                <span>₹2</span>
              </div>
            </div>

            <div className="flex justify-between font-bold text-lg text-gray-900 mb-6">
              <span>To Pay</span>
              <span>₹{total + 2}</span>
            </div>

            <button
              onClick={() => navigate('/checkout')}
              className="w-full bg-primary text-white py-3.5 rounded-xl font-bold shadow-md hover:bg-green-700 transition-all flex items-center justify-center gap-2 group"
            >
              Proceed to Checkout
              <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
