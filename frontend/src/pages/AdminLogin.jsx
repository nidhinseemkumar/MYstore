import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ShieldCheck, ArrowRight, Lock, Mail, ArrowLeft } from 'lucide-react';
import { useAuthStore } from '../store/useAuthStore';

export const AdminLogin = () => {
    const navigate = useNavigate();
    const { login } = useAuthStore();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        try {
            const { user } = await login(email, password);
            const userRole = user?.user_metadata?.role;

            if (userRole === 'admin') {
                navigate('/admin');
            } else {
                setError('Access Denied. You are not an administrator.');
                // Optionally logout immediately if not admin
            }
        } catch (err) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4 relative">
            <Link to="/" className="absolute top-6 left-6 text-gray-400 hover:text-white flex items-center gap-2 transition-colors font-medium">
                <ArrowLeft size={20} />
                <span className="hidden sm:inline">Back to Home</span>
            </Link>
            <div className="max-w-md w-full bg-gray-800 rounded-2xl shadow-xl overflow-hidden border border-gray-700">
                <div className="p-8">
                    <div className="text-center mb-8">
                        <div className="flex items-center justify-center gap-2 mb-4 text-primary">
                            <ShieldCheck size={40} />
                        </div>
                        <h2 className="text-2xl font-bold text-white">Admin Portal</h2>
                        <p className="text-gray-400 text-sm mt-1">
                            Enter credentials to access dashboard
                        </p>
                    </div>

                    {error && (
                        <div className="bg-red-900/30 border border-red-500/50 text-red-200 text-sm p-3 rounded-lg mb-6">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-1.5">
                            <label className="text-sm font-medium text-gray-400">Email Address</label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2.5 bg-gray-700 border border-gray-600 rounded-xl text-sm text-white focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all placeholder-gray-500"
                                    placeholder="admin@mystore.com"
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-sm font-medium text-gray-400">Password</label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2.5 bg-gray-700 border border-gray-600 rounded-xl text-sm text-white focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all placeholder-gray-500"
                                    placeholder="••••••••"
                                    required
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-primary text-white py-3 rounded-xl font-bold shadow-lg shadow-primary/20 hover:bg-green-600 hover:shadow-xl active:scale-[0.98] transition-all flex items-center justify-center gap-2 mt-2"
                        >
                            {isLoading ? (
                                <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            ) : (
                                <>
                                    Access Dashboard
                                    <ArrowRight size={18} />
                                </>
                            )}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};
