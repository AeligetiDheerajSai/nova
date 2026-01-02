import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useStore } from '../store';
import { Play, TrendingUp, Award, Zap, BookOpen, Activity, TriangleAlert } from 'lucide-react';
import { motion } from 'framer-motion';

const Dashboard = () => {
    const { user, courses, learningPaths, mySkills, fetchDashboard, fetchMySkills, isLoading, error } = useStore();

    useEffect(() => {
        fetchDashboard();
        fetchMySkills();
    }, []);

    if (error) {
        return (
            <div className="p-8 flex flex-col items-center justify-center h-[50vh] text-center space-y-4">
                <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center">
                    <TriangleAlert className="w-8 h-8 text-red-500" />
                </div>
                <h2 className="text-2xl font-bold text-white">System Malfunction</h2>
                <p className="text-slate-400 max-w-md">{error || "Unable to connect to headquarters. Please verify neural link (backend server)."}</p>
                <button
                    onClick={() => { fetchDashboard(); fetchMySkills(); }}
                    className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-bold transition-colors"
                >
                    Retry Connection
                </button>
            </div>
        );
    }

    if (isLoading || !user) {
        return <div className="p-8 text-white animate-pulse">Establishing neural link...</div>;
    }

    const container = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    const item = {
        hidden: { opacity: 0, y: 20 },
        show: { opacity: 1, y: 0 }
    };

    return (
        <motion.div
            className="p-8 max-w-7xl mx-auto space-y-12"
            variants={container}
            initial="hidden"
            animate="show"
        >
            {/* Header / Stats */}
            <motion.div variants={item} className="flex flex-col md:flex-row justify-between items-end gap-6 border-b border-slate-800 pb-8">
                <div>
                    <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-emerald-400 bg-clip-text text-transparent mb-2">
                        Welcome back, {user?.name || 'Student'}
                    </h1>
                    <p className="text-slate-400 flex items-center gap-2">
                        <span className="inline-block w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                        Ready to continue your mission?
                    </p>
                </div>

                <div className="flex gap-4">
                    <div className="bg-slate-900/50 backdrop-blur-md p-4 rounded-2xl border border-slate-700/50 flex flex-col items-center min-w-[100px]">
                        <Activity className="text-blue-500 mb-1" size={20} />
                        <span className="text-2xl font-bold">{user?.level || 0}</span>
                        <span className="text-xs text-slate-500 uppercase tracking-wider">Level</span>
                    </div>
                    <div className="bg-slate-900/50 backdrop-blur-md p-4 rounded-2xl border border-slate-700/50 flex flex-col items-center min-w-[100px]">
                        <Zap className="text-yellow-500 mb-1" size={20} />
                        <span className="text-2xl font-bold">{user?.xp || 0}</span>
                        <span className="text-xs text-slate-500 uppercase tracking-wider">XP</span>
                    </div>
                    <div className="bg-slate-900/50 backdrop-blur-md p-4 rounded-2xl border border-slate-700/50 flex flex-col items-center min-w-[100px]">
                        <TrendingUp className="text-emerald-500 mb-1" size={20} />
                        <span className="text-2xl font-bold">{user?.streak || 0}</span>
                        <span className="text-xs text-slate-500 uppercase tracking-wider">Day Streak</span>
                    </div>
                </div>
            </motion.div>

            {/* Learning Paths */}
            <section>
                <div className="flex items-center gap-2 mb-6">
                    <BookOpen className="text-blue-400" />
                    <h2 className="text-2xl font-bold">Active Missions</h2>
                </div>
                <div className="grid md:grid-cols-2 gap-6">
                    {learningPaths && learningPaths.map(path => (
                        <Link to={`/learning-path/${path.id}`} key={path.id}>
                            <motion.div variants={item} className="group relative overflow-hidden bg-slate-900 rounded-2xl p-6 border border-slate-800 hover:border-blue-500/50 transition-all duration-300 h-full cursor-pointer">
                                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                                    <Award size={100} />
                                </div>
                                <h3 className="text-xl font-bold mb-2 group-hover:text-blue-400 transition-colors">{path.title}</h3>
                                <div className="w-full bg-slate-800 h-2 rounded-full mb-4 overflow-hidden">
                                    <motion.div
                                        className="bg-blue-500 h-full rounded-full"
                                        initial={{ width: 0 }}
                                        animate={{ width: `${path.progress}%` }}
                                        transition={{ duration: 1, delay: 0.5 }}
                                    />
                                </div>
                                <div className="flex justify-between items-center text-sm text-slate-400">
                                    <span>{path.completedCourses}/{path.totalCourses} Courses Completed</span>
                                    <span className="text-blue-400">{path.progress}%</span>
                                </div>
                            </motion.div>
                        </Link>
                    ))}
                </div>
            </section>

            {/* Recommended Courses */}
            <section>
                <div className="flex items-center gap-2 mb-6">
                    <Activity className="text-purple-400" />
                    <h2 className="text-2xl font-bold">Skill Matrix</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {mySkills && mySkills.length > 0 ? mySkills.map(userSkill => (
                        <div key={userSkill.id} className="bg-slate-900 border border-slate-800 p-6 rounded-2xl flex items-center gap-4">
                            <div className="w-12 h-12 rounded-full bg-slate-800 flex items-center justify-center text-xl font-bold text-slate-400">
                                {userSkill.skill.name.charAt(0)}
                            </div>
                            <div className="flex-1">
                                <div className="flex justify-between mb-1">
                                    <h4 className="font-bold">{userSkill.skill.name}</h4>
                                    <span className="text-xs text-blue-400 font-mono">{userSkill.proficiency}%</span>
                                </div>
                                <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                                    <motion.div
                                        className="bg-purple-500 h-full"
                                        initial={{ width: 0 }}
                                        animate={{ width: `${userSkill.proficiency}%` }}
                                        transition={{ duration: 1 }}
                                    />
                                </div>
                                <p className="text-xs text-slate-500 mt-1">{userSkill.skill.category}</p>
                            </div>
                        </div>
                    )) : (
                        <div className="col-span-3 text-slate-500 italic">No skills calibrated yet. Complete tabs to unlock.</div>
                    )}
                </div>
            </section>

            {/* Recommended Courses */}
            <section>
                <div className="flex items-center gap-2 mb-6">
                    <Play className="text-emerald-400" />
                    <h2 className="text-2xl font-bold">Recommended Operations</h2>
                </div>
                <div className="grid md:grid-cols-3 gap-6">
                    {/* New Physics Lab Card */}
                    <motion.div variants={item} className="group bg-slate-900 rounded-2xl overflow-hidden border border-slate-800 hover:shadow-2xl hover:shadow-purple-900/20 hover:-translate-y-1 transition-all duration-300">
                        <div className="h-48 relative overflow-hidden">
                            <div className="absolute inset-0 bg-gradient-to-t from-slate-900 to-transparent z-10" />
                            <img src="https://images.unsplash.com/photo-1635070041078-e363dbe005cb?auto=format&fit=crop&q=80&w=1000" alt="Physics Lab" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                            <div className="absolute top-4 left-4 z-20 bg-purple-950/80 backdrop-blur px-3 py-1 rounded-full text-xs font-bold border border-purple-700">
                                Immersive Lab
                            </div>
                        </div>
                        <div className="p-6">
                            <h3 className="font-bold text-lg mb-2 group-hover:text-purple-400 transition-colors">Gravity & Physics Sandbox</h3>
                            <p className="text-slate-400 text-sm mb-4">Experiment with 3D objects, gravity, and collisions in a real-time environment.</p>
                            <Link to="/lab/physics" className="bg-purple-600 hover:bg-purple-700 text-white w-full py-2 rounded-lg text-sm font-bold transition-all flex items-center justify-center gap-2">
                                <Zap size={14} /> Launch Simulation
                            </Link>
                        </div>
                    </motion.div>
                    {courses && courses.map(course => (
                        <motion.div variants={item} key={course.id} className="group bg-slate-900 rounded-2xl overflow-hidden border border-slate-800 hover:shadow-2xl hover:shadow-blue-900/20 hover:-translate-y-1 transition-all duration-300">
                            <div className="h-48 relative overflow-hidden">
                                <div className="absolute inset-0 bg-gradient-to-t from-slate-900 to-transparent z-10" />
                                <img src={course.image} alt={course.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                                <div className="absolute top-4 left-4 z-20 bg-slate-950/80 backdrop-blur px-3 py-1 rounded-full text-xs font-bold border border-slate-700">
                                    {course.category}
                                </div>
                            </div>
                            <div className="p-6">
                                <h3 className="font-bold text-lg mb-2 group-hover:text-blue-400 transition-colors">{course.title}</h3>
                                <div className="w-full bg-slate-800 h-1.5 rounded-full mb-4">
                                    <div className="bg-emerald-500 h-full rounded-full" style={{ width: `${course.progress}%` }}></div>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-xs text-slate-500">{course.totalModules} Modules</span>

                                    {/* Lab Launch Logic */}
                                    {course.title.includes("Network") && (
                                        <Link to="/lab/network-defense" className="bg-blue-600/20 hover:bg-blue-600 text-blue-400 hover:text-white px-4 py-2 rounded-lg text-sm font-bold transition-all flex items-center gap-2">
                                            <Zap size={14} /> Launch Lab
                                        </Link>
                                    )}
                                    {course.title.includes("Neural") && (
                                        <Link to="/lab/neural-network" className="bg-purple-600/20 hover:bg-purple-600 text-purple-400 hover:text-white px-4 py-2 rounded-lg text-sm font-bold transition-all flex items-center gap-2">
                                            <Zap size={14} /> Launch Lab
                                        </Link>
                                    )}
                                    {course.title.includes("Digital Logic") && (
                                        <Link to="/lab/circuit-logic" className="bg-yellow-600/20 hover:bg-yellow-600 text-yellow-400 hover:text-white px-4 py-2 rounded-lg text-sm font-bold transition-all flex items-center gap-2">
                                            <Zap size={14} /> Build Circuit
                                        </Link>
                                    )}
                                    {course.title.includes("Algorithms") && (
                                        <Link to="/lab/sorting-algo" className="bg-red-600/20 hover:bg-red-600 text-red-400 hover:text-white px-4 py-2 rounded-lg text-sm font-bold transition-all flex items-center gap-2">
                                            <Zap size={14} /> Visualize
                                        </Link>
                                    )}
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </section>
        </motion.div>
    );
};

export default Dashboard;
