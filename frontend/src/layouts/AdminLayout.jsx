import React from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Users, Store, Settings, LogOut } from 'lucide-react';
import { useAuthStore } from '../store/useAuthStore';

export const AdminLayout = () => {
    const { logout } = useAuthStore();
    const location = useLocation();

    const menuItems = [
        { icon: <LayoutDashboard size={20} />, label: 'Dashboard', path: '/admin' },
        { icon: <Users size={20} />, label: 'Users', path: '/admin/users' },
        { icon: <Store size={20} />, label: 'Sellers', path: '/admin/sellers' },
        { icon: <Settings size={20} />, label: 'Settings', path: '/admin/settings' },
    ];

    return (
        <div className="flex h-screen bg-gray-50">
            <aside className="w-64 bg-gray-900 text-white flex flex-col">
                <div className="p-6 border-b border-gray-800 flex items-center gap-2">
                    <div className="flex items-center gap-0.5">
                        <span className="text-xl font-bold text-primary tracking-tighter">MY</span>
                        <span className="text-xl font-bold text-white tracking-tight">store</span>
                    </div>
                    <span className="text-sm font-medium text-gray-400 ml-2 border-l border-gray-700 pl-2">Admin</span>
                </div>

                <nav className="flex-1 p-4 space-y-1">
                    {menuItems.map((item) => {
                        const isActive = location.pathname === item.path;
                        return (
                            <Link
                                key={item.path}
                                to={item.path}
                                className={`flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-colors ${isActive
                                    ? 'bg-primary text-white'
                                    : 'text-gray-400 hover:bg-gray-800 hover:text-white'
                                    }`}
                            >
                                {item.icon}
                                {item.label}
                            </Link>
                        );
                    })}
                </nav>

                <div className="p-4 border-t border-gray-800">
                    <button
                        onClick={logout}
                        className="flex items-center gap-3 px-4 py-3 w-full rounded-lg font-medium text-gray-400 hover:bg-red-900/20 hover:text-red-400 transition-colors"
                    >
                        <LogOut size={20} />
                        Logout
                    </button>
                </div>
            </aside>

            <main className="flex-1 overflow-auto">
                <header className="h-16 bg-white border-b border-gray-100 flex items-center justify-between px-8 sticky top-0 z-10 shadow-sm">
                    <h1 className="text-lg font-bold text-gray-900">Platform Overview</h1>
                    <div className="flex items-center gap-4">
                        <div className="h-10 w-10 bg-gray-900 text-white rounded-full flex items-center justify-center font-bold">
                            AD
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
