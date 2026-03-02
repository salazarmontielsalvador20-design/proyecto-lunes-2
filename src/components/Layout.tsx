import { Outlet, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LayoutDashboard, CheckSquare, LogOut, CheckCircle2 } from 'lucide-react';
import { ThemeToggle } from './ThemeToggle';

export default function Layout() {
    const { signOut, user } = useAuth();
    const location = useLocation();

    const navItems = [
        { name: 'Dashboard', path: '/', icon: LayoutDashboard },
        { name: 'Tareas', path: '/tasks', icon: CheckSquare },
    ];

    return (
        <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 flex flex-col md:flex-row">
            {/* Sidebar / Topbar */}
            <aside className="border-r border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 w-full md:w-64 flex-shrink-0 flex flex-col">
                <div className="p-6 flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                        <div className="bg-primary/10 text-primary p-2 rounded-xl">
                            <CheckCircle2 className="w-6 h-6" />
                        </div>
                        <span className="text-xl font-bold text-zinc-900 dark:text-zinc-50">TaskCloud</span>
                    </div>
                    <ThemeToggle />
                </div>

                <nav className="flex-1 px-4 space-y-1 mb-6 md:mb-0 overflow-y-auto">
                    {navItems.map((item) => {
                        const isActive = location.pathname === item.path;
                        const Icon = item.icon;
                        return (
                            <Link
                                key={item.path}
                                to={item.path}
                                className={`flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${isActive
                                    ? 'bg-primary/10 text-primary'
                                    : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 hover:text-zinc-900 dark:hover:text-zinc-50'
                                    }`}
                            >
                                <Icon className="w-5 h-5" />
                                <span>{item.name}</span>
                            </Link>
                        );
                    })}
                </nav>

                <div className="p-4 mt-auto border-t border-zinc-200 dark:border-zinc-800">
                    <div className="mb-4 px-4">
                        <p className="text-xs font-medium text-zinc-500 truncate dark:text-zinc-500">
                            {user?.email}
                        </p>
                    </div>
                    <button
                        onClick={signOut}
                        className="flex items-center space-x-3 px-4 py-2 w-full rounded-lg text-sm font-medium text-zinc-600 dark:text-zinc-400 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-500/10 dark:hover:text-red-400 transition-colors"
                    >
                        <LogOut className="w-5 h-5" />
                        <span>Cerrar Sesión</span>
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-y-auto">
                <Outlet />
            </main>
        </div>
    );
}
