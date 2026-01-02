import React from 'react';
import { Link } from 'react-router-dom';
import { Brain, Shield, Code, ChevronRight, Zap, Globe, Cpu } from 'lucide-react';
import { motion } from 'framer-motion';

const LandingPage = () => {
    return (
        <div className="min-h-screen bg-slate-950 text-white overflow-hidden">
            {/* Navbar */}
            <nav className="p-6 flex justify-between items-center max-w-7xl mx-auto z-10 relative">
                <div className="flex items-center gap-2">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-emerald-500 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20">
                        <Brain className="text-white" size={24} />
                    </div>
                    <span className="text-xl font-bold tracking-tight">SkillTree AI</span>
                </div>
                <div className="hidden md:flex gap-8 text-sm font-medium text-slate-300">
                    <a href="#" className="hover:text-white transition-colors">Features</a>
                    <a href="#" className="hover:text-white transition-colors">Career Paths</a>
                    <a href="#" className="hover:text-white transition-colors">Pricing</a>
                </div>
                <Link to="/login" className="bg-white/10 hover:bg-white/20 px-6 py-2 rounded-full text-sm font-bold backdrop-blur-sm transition-all border border-white/5">
                    Sign In
                </Link>
            </nav>

            {/* Hero Section */}
            <header className="relative pt-20 pb-32 px-6">
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-blue-500/20 rounded-full blur-[128px]" />
                    <div className="absolute bottom-[0%] left-[-10%] w-[500px] h-[500px] bg-purple-500/20 rounded-full blur-[128px]" />
                </div>

                <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 items-center relative z-10">
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8 }}
                    >
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-bold mb-6">
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
                            </span>
                            New: AI Resume Analysis Available
                        </div>
                        <h1 className="text-5xl md:text-7xl font-bold leading-tight mb-6">
                            Master Tech with <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-emerald-400">
                                AI & Implementation
                            </span>
                        </h1>
                        <p className="text-lg text-slate-400 mb-8 leading-relaxed max-w-lg">
                            The first platform that combines AI-driven guidance with immersive 3D simulations. Don't just watch tutorials—build firewalls, wire circuits, and train neural networks in your browser.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4">
                            <Link to="/register" className="px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold flex items-center justify-center gap-2 shadow-lg shadow-blue-600/20 hover:scale-105 transition-all">
                                Get Started Free <ChevronRight size={18} />
                            </Link>
                            <Link to="/login" className="px-8 py-4 bg-slate-900 border border-slate-700 hover:border-slate-600 text-white rounded-xl font-bold flex items-center justify-center hover:scale-105 transition-all">
                                Explore Labs
                            </Link>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="relative"
                    >
                        <div className="absolute inset-0 bg-gradient-to-tr from-blue-600 to-purple-600 rounded-2xl blur-2xl opacity-20 transform rotate-6 scale-95" />
                        <div className="bg-slate-900/80 backdrop-blur-xl border border-slate-700 rounded-2xl p-6 shadow-2xl relative overflow-hidden">
                            {/* Mock UI for Visual Interest */}
                            <div className="flex items-center gap-2 mb-4 border-b border-slate-800 pb-4">
                                <div className="w-3 h-3 rounded-full bg-red-500" />
                                <div className="w-3 h-3 rounded-full bg-yellow-500" />
                                <div className="w-3 h-3 rounded-full bg-green-500" />
                                <div className="ml-auto text-xs text-slate-500">SkillTree AI v2.0</div>
                            </div>
                            <div className="space-y-4">
                                <div className="flex items-center gap-4 p-3 rounded-lg bg-slate-800/50 border border-slate-700/50">
                                    <div className="p-2 bg-blue-500/20 rounded-lg text-blue-400"><Shield size={20} /></div>
                                    <div>
                                        <div className="text-sm font-bold">Network Defense Lab</div>
                                        <div className="text-xs text-emerald-400">Simulation Active</div>
                                    </div>
                                    <div className="ml-auto text-xs font-mono text-slate-400">Running...</div>
                                </div>
                                <div className="flex items-center gap-4 p-3 rounded-lg bg-slate-800/50 border border-slate-700/50">
                                    <div className="p-2 bg-purple-500/20 rounded-lg text-purple-400"><Brain size={20} /></div>
                                    <div>
                                        <div className="text-sm font-bold">Neural Network Viz</div>
                                        <div className="text-xs text-blue-400">Training Model</div>
                                    </div>
                                    <div className="ml-auto text-xs font-mono text-slate-400">Epoch 4/10</div>
                                </div>
                                <div className="flex items-center gap-4 p-3 rounded-lg bg-slate-800/50 border border-slate-700/50">
                                    <div className="p-2 bg-yellow-500/20 rounded-lg text-yellow-400"><Cpu size={20} /></div>
                                    <div>
                                        <div className="text-sm font-bold">Circuit Builder</div>
                                        <div className="text-xs text-slate-400">Logic Gates</div>
                                    </div>
                                    <div className="ml-auto text-xs font-mono text-slate-400">Ready</div>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </header>

            {/* Features Preview */}
            <section className="py-20 bg-slate-900/50">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl font-bold mb-4">Why SkillTree AI?</h2>
                        <p className="text-slate-400 max-w-2xl mx-auto">We bridge the gap between theory and practice with next-generation tools.</p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        <div className="p-8 rounded-2xl bg-slate-900 border border-slate-800 hover:border-blue-500/50 transition-all">
                            <div className="w-12 h-12 bg-blue-900/50 rounded-lg flex items-center justify-center text-blue-400 mb-6">
                                <Globe size={24} />
                            </div>
                            <h3 className="text-xl font-bold mb-3">Immersive Labs</h3>
                            <p className="text-slate-400 leading-relaxed">
                                Forget static text. Interact with 3D simulations of networks, algorithms, and circuits directly in your browser.
                            </p>
                        </div>
                        <div className="p-8 rounded-2xl bg-slate-900 border border-slate-800 hover:border-purple-500/50 transition-all">
                            <div className="w-12 h-12 bg-purple-900/50 rounded-lg flex items-center justify-center text-purple-400 mb-6">
                                <Zap size={24} />
                            </div>
                            <h3 className="text-xl font-bold mb-3">AI Instructor</h3>
                            <p className="text-slate-400 leading-relaxed">
                                Get instant feedback, project ideas, and career advice from an AI that knows your progress and goals.
                            </p>
                        </div>
                        <div className="p-8 rounded-2xl bg-slate-900 border border-slate-800 hover:border-emerald-500/50 transition-all">
                            <div className="w-12 h-12 bg-emerald-900/50 rounded-lg flex items-center justify-center text-emerald-400 mb-6">
                                <Code size={24} />
                            </div>
                            <h3 className="text-xl font-bold mb-3">Career Ready</h3>
                            <p className="text-slate-400 leading-relaxed">
                                Build a portfolio of verified skills. Upload your resume to get matched with roles that fit your achievements.
                            </p>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default LandingPage;
