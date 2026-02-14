import React from 'react';
import { Outlet, Link, useLocation, Navigate } from 'react-router-dom';
import { Package, BarChart2, ShoppingBag, Settings, LogOut } from 'lucide-react';
import { useAuthStore } from '../store/useAuthStore';

export const SellerLayout = () => {
    const { logout, isAuthenticated, isLoading, user } = useAuthStore();
    const location = useLocation();

    if (isLoading) {
        return <div className="h-screen flex items-center justify-center bg-gray-50 text-primary">Loading...</div>;
    }

    if (!isAuthenticated || user?.role !== 'seller') {
        return <Navigate to="/login" replace />;
    }

    const menuItems = [
        { icon: <BarChart2 size={20} />, label: 'Overview', path: '/seller' },
        { icon: <Package size={20} />, label: 'Products', path: '/seller/products' },
        { icon: <ShoppingBag size={20} />, label: 'Orders', path: '/seller/orders' },
        { icon: <Settings size={20} />, label: 'Settings', path: '/seller/settings' },
    ];

    return (
        <div className="flex h-screen bg-gray-50">
            {/* Sidebar */}
            <aside className="w-64 bg-white border-r border-gray-100 flex flex-col">
                <div className="p-6 border-b border-gray-100 flex items-center gap-2">
                    <div className="flex items-center gap-0.5">
                        <span className="text-xl font-bold text-primary tracking-tighter">MY</span>
                        <span className="text-xl font-bold text-gray-900 tracking-tight">store</span>
                    </div>
                    <span className="text-sm font-medium text-gray-500 ml-2 border-l pl-2">Seller Hub</span>
                </div>

                <nav className="flex-1 p-4 space-y-1">
                    {menuItems.map((item) => {
                        const isActive = location.pathname === item.path;
                        return (
                            <Link
                                key={item.path}
                                to={item.path}
                                className={`flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-colors ${isActive
                                    ? 'bg-green-50 text-primary'
                                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                                    }`}
                            >
                                {item.icon}
                                {item.label}
                            </Link>
                        );
                    })}
                </nav>

                <div className="p-4 border-t border-gray-100">
                    <button
                        onClick={logout}
                        className="flex items-center gap-3 px-4 py-3 w-full rounded-lg font-medium text-gray-600 hover:bg-red-50 hover:text-red-600 transition-colors"
                    >
                        <LogOut size={20} />
                        Logout
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-auto">
                <header className="h-16 bg-white border-b border-gray-100 flex items-center justify-between px-8 sticky top-0 z-10">
                    <h1 className="text-lg font-bold text-gray-900">Dashboard</h1>
                    <div className="flex items-center gap-4">
                        <div className="text-sm text-right hidden sm:block">
                            <div className="font-bold text-gray-900">John Doe</div>
                            <div className="text-xs text-gray-500">Apna Kirana Store</div>
                        </div>
                        <div className="h-10 w-10 bg-gray-100 rounded-full flex items-center justify-center text-gray-500">
                            JD
                        </div>
                    </div>
                </header>
                <div className="p-8">
                    <Outlet />
                </div>
            </main>
        </div>
    );
};
