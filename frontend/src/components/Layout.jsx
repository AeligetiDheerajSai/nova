import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Brain, LayoutDashboard, BookOpen, MessageSquare, Trophy, Menu, X, LogOut, User, PlayCircle } from 'lucide-react';
import { useStore } from '../store';
import FloatingAI from './FloatingAI';

const Layout = ({ children }) => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const { user, logout } = useStore();
    const location = useLocation();

    const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

    return (
        <div className="flex h-screen bg-slate-950 text-white font-sans overflow-hidden">
            {/* Mobile Header */}
            <div className="md:hidden fixed top-0 w-full bg-slate-900/80 backdrop-blur-md border-b border-slate-800 z-50 p-4 flex justify-between items-center">
                <div className="flex items-center space-x-2">
                    <Brain className="w-6 h-6 text-blue-500" />
                    <span className="font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-emerald-400">SkillTree AI</span>
                </div>
                <button onClick={toggleSidebar} className="text-slate-300 hover:text-white">
                    {isSidebarOpen ? <X /> : <Menu />}
                </button>
            </div>

            {/* Sidebar Overlay (Mobile) */}
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-40 md:hidden"
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside className={`
                fixed md:static inset-y-0 left-0 z-50 w-64 bg-slate-900 border-r border-slate-800 flex flex-col transition-transform duration-300 ease-in-out
                ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
            `}>
                <div className="p-6 flex items-center space-x-3 hidden md:flex">
                    <Brain className="w-8 h-8 text-blue-500" />
                    <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-emerald-400">
                        SkillTree AI
                    </span>
                </div>

                <nav className="flex-1 px-4 space-y-2 mt-20 md:mt-4">
                    <NavItem to="/dashboard" icon={<LayoutDashboard />} label="Dashboard" active={location.pathname === '/dashboard'} onClick={() => setIsSidebarOpen(false)} />
                    <NavItem to="/my-learning" icon={<PlayCircle />} label="My Learning" active={location.pathname === '/my-learning'} onClick={() => setIsSidebarOpen(false)} />
                    <NavItem to="/courses" icon={<BookOpen />} label="Courses" active={location.pathname === '/courses'} onClick={() => setIsSidebarOpen(false)} />
                    <NavItem to="/chat" icon={<MessageSquare />} label="AI Instructor" active={location.pathname === '/chat'} onClick={() => setIsSidebarOpen(false)} />
                    <NavItem to="/achievements" icon={<Trophy />} label="Achievements" active={location.pathname === '/achievements'} onClick={() => setIsSidebarOpen(false)} />
                    <NavItem to="/profile" icon={<User />} label="Settings" active={location.pathname === '/profile'} onClick={() => setIsSidebarOpen(false)} />
                </nav>

                <div className="p-4 border-t border-slate-800">
                    <div className="flex items-center space-x-3 mb-4">
                        <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center overflow-hidden border border-slate-700">
                            <img
                                src={`https://api.dicebear.com/7.x/${user?.avatar_style || 'adventurer'}/svg?seed=${user?.username || 'Guest'}`}
                                alt="Avatar"
                                className="w-full h-full object-cover"
                            />
                        </div>
                        <div>
                            <p className="text-sm font-medium">{user?.name || 'Guest'}</p>
                            <p className="text-xs text-slate-400">Level {user?.level || 0}</p>
                        </div>
                    </div>
                    <button
                        onClick={logout}
                        className="w-full flex items-center justify-center space-x-2 bg-slate-800 hover:bg-red-500/10 hover:text-red-400 py-2 rounded-lg text-sm transition-colors text-slate-400"
                    >
                        <LogOut size={16} />
                        <span>Sign Out</span>
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-auto relative pt-16 md:pt-0 w-full">
                {children}
            </main>

            <FloatingAI />
        </div>
    );
};

const NavItem = ({ to, icon, label, active, onClick }) => (
    <Link
        to={to}
        onClick={onClick}
        className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-all ${active
            ? 'bg-blue-600/20 text-blue-400 border border-blue-600/30 shadow-lg shadow-blue-500/10'
            : 'text-slate-400 hover:bg-slate-800 hover:text-white'
            }`}
    >
        {React.cloneElement(icon, { size: 20 })}
        <span className="font-medium">{label}</span>
    </Link>
);

export default Layout;

