import React, { useState, useEffect } from 'react';
import { Search, Plus, Trash2, Loader, Image as ImageIcon } from 'lucide-react';
import { motion } from 'framer-motion';
import { supabase } from '../../lib/supabase';
import { toast } from 'react-hot-toast';

export const AdminCategories = () => {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [isAddMode, setIsAddMode] = useState(false);

    // New Category Form State
    const [newCategory, setNewCategory] = useState({
        name: '',
        image_url: '',
        color: 'bg-gray-50'
    });

    const fetchCategories = async () => {
        setLoading(true);
        try {
            const { data, error } = await supabase
                .from('categories')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) throw error;
            setCategories(data || []);
        } catch (err) {
            console.error("Error fetching categories:", err);
            toast.error("Failed to load categories or table missing");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCategories();
    }, []);

    const handleAddCategory = async (e) => {
        e.preventDefault();
        if (!newCategory.name.trim()) return toast.error("Name is required");

        try {
            toast.loading("Adding category...", { id: 'add-cat' });
            const { error } = await supabase
                .from('categories')
                .insert([newCategory]);

            if (error) throw error;

            toast.success("Category added!", { id: 'add-cat' });
            setNewCategory({ name: '', image_url: '', color: 'bg-gray-50' });
            setIsAddMode(false);
            fetchCategories();
        } catch (err) {
            toast.error("Failed to add category: " + err.message, { id: 'add-cat' });
        }
    };

    const handleDeleteCategory = async (id, name) => {
        if (!confirm(`Are you sure you want to delete "${name}"? This might affect products referencing it!`)) return;

        try {
            toast.loading("Deleting...", { id: 'del-cat' });
            const { error } = await supabase
                .from('categories')
                .delete()
                .eq('id', id);

            if (error) throw error;

            toast.success("Deleted successfully", { id: 'del-cat' });
            setCategories(categories.filter(c => c.id !== id));
        } catch (err) {
            toast.error("Failed to delete: " + err.message, { id: 'del-cat' });
        }
    };

    const filteredCategories = categories.filter((cat) =>
        cat.name?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const colorOptions = [
        { label: 'Green', value: 'bg-green-50' },
        { label: 'Blue', value: 'bg-blue-50' },
        { label: 'Orange', value: 'bg-orange-50' },
        { label: 'Red', value: 'bg-red-50' },
        { label: 'Yellow', value: 'bg-yellow-50' },
        { label: 'Amber', value: 'bg-amber-50' },
        { label: 'Gray', value: 'bg-gray-50' },
    ];

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-900">Category Management</h2>
                <button
                    onClick={() => setIsAddMode(!isAddMode)}
                    className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-lg font-bold hover:bg-green-700 transition"
                >
                    {isAddMode ? 'Cancel' : <><Plus size={18} /> Add Category</>}
                </button>
            </div>

            {/* Add Category Panel */}
            {isAddMode && (
                <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm"
                >
                    <h3 className="text-lg font-bold mb-4">Create New Category</h3>
                    <form onSubmit={handleAddCategory} className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
                        <div className="space-y-1">
                            <label className="text-sm font-medium text-gray-700">Name</label>
                            <input
                                required
                                type="text"
                                value={newCategory.name}
                                onChange={e => setNewCategory({ ...newCategory, name: e.target.value })}
                                className="w-full border p-2 rounded-lg outline-none focus:ring-2 focus:ring-primary/20 text-sm"
                                placeholder="e.g. Fresh Meat"
                            />
                        </div>
                        <div className="space-y-1">
                            <label className="text-sm font-medium text-gray-700">Image URL</label>
                            <input
                                type="url"
                                value={newCategory.image_url}
                                onChange={e => setNewCategory({ ...newCategory, image_url: e.target.value })}
                                className="w-full border p-2 rounded-lg outline-none focus:ring-2 focus:ring-primary/20 text-sm"
                                placeholder="https://..."
                            />
                        </div>
                        <div className="space-y-1">
                            <label className="text-sm font-medium text-gray-700">Theme Color</label>
                            <select
                                value={newCategory.color}
                                onChange={e => setNewCategory({ ...newCategory, color: e.target.value })}
                                className="w-full border p-2 rounded-lg outline-none focus:ring-2 focus:ring-primary/20 text-sm bg-white"
                            >
                                {colorOptions.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
                            </select>
                        </div>
                        <div>
                            <button
                                type="submit"
                                className="w-full bg-gray-900 text-white font-bold py-2 rounded-lg hover:bg-gray-800 transition shadow-sm text-sm"
                            >
                                Save Category
                            </button>
                        </div>
                    </form>
                </motion.div>
            )}

            {/* List */}
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden min-h-[300px]">
                <div className="p-4 border-b border-gray-100 flex justify-between items-center gap-4">
                    <div className="relative flex-1 max-w-sm">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                        <input
                            type="text"
                            placeholder="Search categories..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-10 pr-4 py-2 w-full border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                        />
                    </div>
                </div>

                {loading ? (
                    <div className="flex justify-center items-center h-64">
                        <Loader className="animate-spin text-primary" size={32} />
                    </div>
                ) : categories.length === 0 ? (
                    <div className="text-center py-12 text-gray-500 flex flex-col items-center">
                        <ImageIcon size={48} className="text-gray-300 mb-4" />
                        <p>No categories found or database table is empty.</p>
                        <p className="text-sm">Please ensure the SQL script was run.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 p-6">
                        {filteredCategories.map((cat) => (
                            <motion.div
                                key={cat.id}
                                layout
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className={`group relative h-40 ${cat.color || 'bg-gray-50'} rounded-xl border border-gray-100 shadow-sm flex flex-col items-center justify-center p-4 text-center`}
                            >
                                <button
                                    onClick={() => handleDeleteCategory(cat.id, cat.name)}
                                    className="absolute -top-2 -right-2 bg-white text-red-500 shadow-md rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-50"
                                    title="Delete Category"
                                >
                                    <Trash2 size={14} />
                                </button>

                                {cat.image_url ? (
                                    <img src={cat.image_url} alt={cat.name} className="w-16 h-16 object-contain mb-3 drop-shadow-sm mix-blend-multiply" />
                                ) : (
                                    <div className="w-16 h-16 bg-white/50 rounded-full flex items-center justify-center mb-3">
                                        <ImageIcon size={24} className="text-gray-400" />
                                    </div>
                                )}
                                <span className="text-sm font-bold text-gray-800 leading-tight">{cat.name}</span>
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};
