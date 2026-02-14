import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronRight } from 'lucide-react';
import { CATEGORIES } from '../data/mockData';

export const AllCategoriesModal = ({ isOpen, onClose }) => {
    // Expanded categories list (mock)
    const ALL_CATEGORIES = [
        ...CATEGORIES,
        { id: '7', name: 'Bakery & Biscuits', image: 'https://cdn-icons-png.flaticon.com/512/3081/3081927.png', color: 'bg-amber-50' },
        { id: '8', name: 'Chicken, Meat & Fish', image: 'https://cdn-icons-png.flaticon.com/512/1134/1134447.png', color: 'bg-red-50' },
        { id: '9', name: 'Baby Care', image: 'https://cdn-icons-png.flaticon.com/512/3050/3050160.png', color: 'bg-pink-50' },
        { id: '10', name: 'Cleaning Essentials', image: 'https://cdn-icons-png.flaticon.com/512/2622/2622112.png', color: 'bg-blue-50' },
        { id: '11', name: 'Home & Office', image: 'https://cdn-icons-png.flaticon.com/512/2405/2405553.png', color: 'bg-gray-50' },
        { id: '12', name: 'Personal Care', image: 'https://cdn-icons-png.flaticon.com/512/2909/2909787.png', color: 'bg-purple-50' },
        { id: '13', name: 'Pet Care', image: 'https://cdn-icons-png.flaticon.com/512/3049/3049962.png', color: 'bg-yellow-50' },
        { id: '14', name: 'Sweet Tooth', image: 'https://cdn-icons-png.flaticon.com/512/2553/2553653.png', color: 'bg-rose-50' },
    ];

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-[100] bg-black/50 backdrop-blur-sm flex justify-end"
                    onClick={onClose}
                >
                    <motion.div
                        initial={{ x: '100%' }}
                        animate={{ x: 0 }}
                        exit={{ x: '100%' }}
                        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                        className="w-full max-w-md bg-white h-full shadow-2xl p-6 overflow-y-auto"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="flex items-center justify-between mb-8">
                            <h2 className="text-2xl font-bold text-gray-900">All Categories</h2>
                            <button
                                onClick={onClose}
                                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                            >
                                <X size={24} className="text-gray-500" />
                            </button>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            {ALL_CATEGORIES.map((cat) => (
                                <div
                                    key={cat.id}
                                    className={`flex flex-col items-center justify-center p-4 rounded-xl border border-gray-100 cursor-pointer hover:shadow-md transition-all ${cat.color} bg-opacity-50`}
                                >
                                    <img src={cat.image} alt={cat.name} className="w-16 h-16 object-contain mb-3" />
                                    <span className="text-sm font-bold text-gray-800 text-center leading-tight">{cat.name}</span>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};
