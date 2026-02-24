import React, { useState, useEffect } from 'react';
import { X, Image, Loader } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuthStore } from '../store/useAuthStore';
import { useCategoryStore } from '../store/useCategoryStore';

export const AddProductModal = ({ isOpen, onClose, onProductAdded }) => {
    const { user } = useAuthStore();
    const { categories, fetchCategories } = useCategoryStore();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        price: '',
        category: 'Vegetables & Fruits',
        stock_quantity: 100,
        image_url: '' // Using URL for simplicity for now, file upload is complex
    });

    useEffect(() => {
        if (isOpen && categories.length === 0) {
            fetchCategories();
        }
    }, [isOpen, categories.length, fetchCategories]);

    if (!isOpen) return null;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            if (!user) throw new Error("Not authenticated");

            const { error } = await supabase
                .from('products')
                .insert([{
                    ...formData,
                    seller_id: user.id
                }]);

            if (error) throw error;

            onProductAdded();
            onClose();
        } catch (error) {
            console.error(error);
            alert("Error adding product: " + error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
            <div className="bg-white rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl">
                <div className="p-4 border-b border-gray-100 flex justify-between items-center">
                    <h3 className="font-bold text-lg">Add New Product</h3>
                    <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full"><X size={20} /></button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Product Name</label>
                        <input
                            required
                            type="text"
                            className="w-full border rounded-lg p-2.5 focus:ring-2 focus:ring-primary/20 outline-none"
                            value={formData.name}
                            onChange={e => setFormData({ ...formData, name: e.target.value })}
                            placeholder="e.g., Fresh Organic Apples"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Price (₹)</label>
                            <input
                                required
                                type="number"
                                min="0"
                                className="w-full border rounded-lg p-2.5 focus:ring-2 focus:ring-primary/20 outline-none"
                                value={formData.price}
                                onChange={e => setFormData({ ...formData, price: e.target.value })}
                                placeholder="0.00"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Stock</label>
                            <input
                                required
                                type="number"
                                min="0"
                                className="w-full border rounded-lg p-2.5 focus:ring-2 focus:ring-primary/20 outline-none"
                                value={formData.stock_quantity}
                                onChange={e => setFormData({ ...formData, stock_quantity: e.target.value })}
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                        <select
                            className="w-full border rounded-lg p-2.5 focus:ring-2 focus:ring-primary/20 outline-none bg-white"
                            value={formData.category}
                            onChange={e => setFormData({ ...formData, category: e.target.value })}
                        >
                            {categories.map(c => (
                                <option key={c.id || c.name} value={c.name}>{c.name}</option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Image URL</label>
                        <div className="flex gap-2">
                            <input
                                type="url"
                                className="w-full border rounded-lg p-2.5 focus:ring-2 focus:ring-primary/20 outline-none"
                                value={formData.image_url}
                                onChange={e => setFormData({ ...formData, image_url: e.target.value })}
                                placeholder="https://example.com/image.jpg"
                            />
                        </div>
                        <p className="text-xs text-gray-500 mt-1">Paste a direct image link from the internet.</p>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                        <textarea
                            rows="3"
                            className="w-full border rounded-lg p-2.5 focus:ring-2 focus:ring-primary/20 outline-none"
                            value={formData.description}
                            onChange={e => setFormData({ ...formData, description: e.target.value })}
                            placeholder="Describe your product..."
                        ></textarea>
                    </div>

                    <div className="pt-4">
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-primary text-white py-3 rounded-xl font-bold hover:bg-green-700 transition disabled:opacity-70 flex justify-center items-center gap-2"
                        >
                            {loading ? <Loader className="animate-spin" size={20} /> : 'Publish Product'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};
