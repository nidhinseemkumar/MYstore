import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Store, User, ShieldCheck, ArrowRight, Lock, Mail, ArrowLeft } from 'lucide-react';
import { useAuthStore } from '../store/useAuthStore';

export const Login = () => {
    const navigate = useNavigate();
    const { login, signup } = useAuthStore();
    const [isLoginMode, setIsLoginMode] = useState(true);
    const [role, setRole] = useState('buyer');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [fullName, setFullName] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        try {
            if (isLoginMode) {
                const { user } = await login(email, password);
                let userRole = user?.user_metadata?.role || 'buyer';

                if (user?.email === 'admin@mystore.com') {
                    userRole = 'admin';
                }

                if (userRole === 'seller') navigate('/seller');
                else if (userRole === 'admin') navigate('/admin');
                else navigate('/');
            } else {
                const { session } = await signup(email, password, fullName, role);
                if (session) {
                    // Auto-logged in (Email confirmation disabled or not required)
                    let userRole = session.user?.user_metadata?.role || 'buyer';
                    if (session.user?.email === 'admin@mystore.com') {
                        userRole = 'admin';
                    }

                    if (userRole === 'seller') navigate('/seller');
                    else if (userRole === 'admin') navigate('/admin');
                    else navigate('/');
                } else {
                    // Email confirmation required
                    alert("Sign up successful! Please check your email to confirm.");
                    setIsLoginMode(true);
                }
            }
        } catch (err) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4 relative">
            <Link to="/" className="absolute top-6 left-6 text-gray-500 hover:text-primary flex items-center gap-2 transition-colors font-medium">
                <ArrowLeft size={20} />
                <span className="hidden sm:inline">Back to Home</span>
            </Link>
            <div className="max-w-md w-full bg-white rounded-2xl shadow-xl overflow-hidden">
                <div className="p-8">
                    <div className="text-center mb-8">
                        <div className="flex items-center justify-center gap-0.5 mb-4">
                            <span className="text-3xl font-bold text-primary tracking-tighter">MY</span>
                            <span className="text-3xl font-bold text-gray-900 tracking-tight">store</span>
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900">{isLoginMode ? 'Welcome Back' : 'Create Account'}</h2>
                        <p className="text-gray-500 text-sm mt-1">
                            {isLoginMode ? 'Sign in to access your account' : 'Join us today!'}
                        </p>
                    </div>

                    {!isLoginMode && (
                        <div className="flex bg-gray-100 p-1 rounded-xl mb-6">
                            {['buyer', 'seller'].map((r) => (
                                <button
                                    key={r}
                                    type="button"
                                    onClick={() => setRole(r)}
                                    className={`flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-medium rounded-lg transition-all ${role === r
                                        ? 'bg-white text-gray-900 shadow-sm'
                                        : 'text-gray-500 hover:text-gray-700'
                                        }`}
                                >
                                    {r === 'buyer' && <User size={16} />}
                                    {r === 'seller' && <Store size={16} />}
                                    <span className="capitalize">{r}</span>
                                </button>
                            ))}
                        </div>
                    )}

                    {error && (
                        <div className="bg-red-50 text-red-600 text-sm p-3 rounded-lg mb-4">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        {!isLoginMode && (
                            <div className="space-y-1.5">
                                <label className="text-sm font-medium text-gray-700">Full Name</label>
                                <div className="relative">
                                    <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                    <input
                                        type="text"
                                        value={fullName}
                                        onChange={(e) => setFullName(e.target.value)}
                                        className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                                        placeholder="John Doe"
                                        required={!isLoginMode}
                                    />
                                </div>
                            </div>
                        )}

                        <div className="space-y-1.5">
                            <label className="text-sm font-medium text-gray-700">Email Address</label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                                    placeholder="name@example.com"
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-sm font-medium text-gray-700">Password</label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                                    placeholder="••••••••"
                                    required
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-primary text-white py-3 rounded-xl font-bold shadow-lg shadow-primary/20 hover:bg-green-700 hover:shadow-xl active:scale-[0.98] transition-all flex items-center justify-center gap-2"
                        >
                            {isLoading ? (
                                <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            ) : (
                                <>
                                    {isLoginMode ? 'Sign In' : 'Sign Up'}
                                    <ArrowRight size={18} />
                                </>
                            )}
                        </button>
                    </form>

                    <div className="mt-8 text-center text-sm text-gray-500">
                        {isLoginMode ? "Don't have an account?" : "Already have an account?"}
                        <button
                            onClick={() => setIsLoginMode(!isLoginMode)}
                            className="text-primary font-bold ml-1 hover:underline"
                        >
                            {isLoginMode ? 'Create Account' : 'Login'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};
