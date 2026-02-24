import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronRight } from 'lucide-react';
import { useCategoryStore } from '../store/useCategoryStore';
import { useNavigate } from 'react-router-dom';

export const AllCategoriesModal = ({ isOpen, onClose }) => {
    const navigate = useNavigate();
    const { categories } = useCategoryStore();

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-[100] bg-black/40 backdrop-blur-sm flex items-end sm:items-center justify-center sm:p-4"
                    onClick={onClose}
                >
                    <motion.div
                        initial={{ y: '100%', opacity: 0, scale: 0.95 }}
                        animate={{ y: 0, opacity: 1, scale: 1 }}
                        exit={{ y: '100%', opacity: 0, scale: 0.95 }}
                        transition={{ type: 'spring', bounce: 0.15, duration: 0.5 }}
                        className="w-full max-w-4xl bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl overflow-hidden border border-gray-100 flex flex-col max-h-[85vh] sm:max-h-[80vh]"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Header */}
                        <div className="flex flex-col border-b border-gray-100 bg-white sticky top-0 z-10 pt-4 pb-2 px-6 sm:px-8 sm:py-6">
                            {/* Mobile Pull Tab */}
                            <div className="w-12 h-1.5 bg-gray-200 rounded-full mx-auto mb-4 sm:hidden" />
                            <div className="flex items-center justify-between">
                                <div>
                                    <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">All Categories</h2>
                                    <p className="text-sm text-gray-500 mt-1 hidden sm:block">Explore our wide variety of essential goods</p>
                                </div>
                                <button
                                    onClick={onClose}
                                    className="p-2 bg-gray-100/80 hover:bg-gray-200 text-gray-600 rounded-full transition-colors self-start sm:self-center"
                                >
                                    <X size={20} className="sm:size-24" />
                                </button>
                            </div>
                        </div>

                        {/* Grid Content */}
                        <div className="p-6 sm:p-8 overflow-y-auto">
                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
                                {categories.map((cat) => (
                                    <motion.div
                                        whileHover={{ scale: 1.03, y: -2 }}
                                        whileTap={{ scale: 0.98 }}
                                        key={cat.id}
                                        onClick={() => {
                                            onClose();
                                            navigate(`/category/${encodeURIComponent(cat.name)}`);
                                        }}
                                        className={`group flex flex-col items-center justify-center p-6 rounded-2xl sm:rounded-3xl border border-transparent hover:border-black/5 cursor-pointer shadow-sm hover:shadow-xl transition-all duration-300 ${cat.color}`}
                                    >
                                        <div className="w-20 h-20 sm:w-24 sm:h-24 bg-white/60 rounded-full flex items-center justify-center mb-4 shadow-inner group-hover:scale-110 transition-transform duration-300 overflow-hidden">
                                            <img src={cat.image_url || cat.image} alt={cat.name} className="w-12 h-12 sm:w-14 sm:h-14 object-contain drop-shadow-md mix-blend-multiply" />
                                        </div>
                                        <span className="text-sm sm:text-base font-bold text-gray-800 text-center leading-tight">{cat.name}</span>
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};
