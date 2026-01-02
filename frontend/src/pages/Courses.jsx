import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Clock, Star, ChevronRight, Filter } from 'lucide-react';
import { motion } from 'framer-motion';
import api from '../api/client';

const Courses = () => {
    const [courses, setCourses] = useState([]);
    const [branches, setBranches] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedBranch, setSelectedBranch] = useState(null);
    const [selectedYear, setSelectedYear] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                // Fetch branches
                const branchRes = await api.get('/api/courses/meta/branches');
                setBranches(branchRes.data);

                // Fetch courses with filters
                let url = '/api/courses/';
                const params = new URLSearchParams();
                if (selectedBranch) params.append('branch_id', selectedBranch);
                if (selectedYear) params.append('year', selectedYear);

                const response = await api.get(`${url}?${params.toString()}`);

                const data = response.data.map(c => ({
                    ...c,
                    image: c.image_url || "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=80&w=1000"
                }));
                setCourses(data);
            } catch (error) {
                console.error("Failed to fetch data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [selectedBranch, selectedYear]);

    return (
        <div className="flex min-h-screen bg-slate-950">
            {/* Sidebar Filters */}
            <aside className="w-64 bg-slate-900 border-r border-slate-800 p-6 hidden lg:block sticky top-0 h-screen overflow-y-auto">
                <div className="flex items-center gap-2 mb-8 text-white font-bold text-xl">
                    <Filter className="text-blue-500" /> Filters
                </div>

                <div className="mb-8">
                    <h3 className="text-slate-400 font-bold uppercase text-xs tracking-wider mb-4">Branch</h3>
                    <div className="space-y-2">
                        <button
                            onClick={() => setSelectedBranch(null)}
                            className={`w-full text-left px-3 py-2 rounded-lg text-sm transition ${!selectedBranch ? 'bg-blue-600 text-white' : 'text-slate-400 hover:bg-slate-800'}`}
                        >
                            All Branches
                        </button>
                        {branches.map(b => (
                            <button
                                key={b.id}
                                onClick={() => setSelectedBranch(b.id)}
                                className={`w-full text-left px-3 py-2 rounded-lg text-sm transition ${selectedBranch === b.id ? 'bg-blue-600 text-white' : 'text-slate-400 hover:bg-slate-800'}`}
                            >
                                {b.code}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="mb-8">
                    <h3 className="text-slate-400 font-bold uppercase text-xs tracking-wider mb-4">Year</h3>
                    <div className="space-y-2">
                        <button onClick={() => setSelectedYear(null)} className={`w-full text-left px-3 py-2 rounded-lg text-sm transition ${!selectedYear ? 'bg-blue-600 text-white' : 'text-slate-400 hover:bg-slate-800'}`}>All Years</button>
                        {[1, 2, 3, 4].map(y => (
                            <button
                                key={y}
                                onClick={() => setSelectedYear(y)}
                                className={`w-full text-left px-3 py-2 rounded-lg text-sm transition ${selectedYear === y ? 'bg-blue-600 text-white' : 'text-slate-400 hover:bg-slate-800'}`}
                            >
                                {y}st Year
                            </button>
                        ))}
                    </div>
                </div>
            </aside>

            <main className="flex-1 p-8 overflow-y-auto h-screen">
                <header className="mb-12">
                    <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400 mb-4">
                        Explore Courses
                    </h1>
                    <p className="text-slate-400 max-w-2xl">
                        Browse our engineering curriculum by branch and year.
                    </p>
                </header>

                {loading ? (
                    <div className="text-white">Loading...</div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {courses.length > 0 ? (
                            courses.map((course, index) => (
                                <motion.div
                                    key={course.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.1 }}
                                    className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden hover:border-blue-500/50 transition-all group"
                                >
                                    <div className="h-48 overflow-hidden relative">
                                        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 to-transparent z-10" />
                                        <img
                                            src={course.image}
                                            alt={course.title}
                                            className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
                                        />
                                        <div className="absolute bottom-4 left-4 z-20">
                                            <span className="px-3 py-1 rounded-full bg-blue-500/20 text-blue-400 text-xs font-bold border border-blue-500/20">
                                                {course.category}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="p-6">
                                        <h3 className="text-xl font-bold mb-2 group-hover:text-blue-400 transition-colors">
                                            {course.title}
                                        </h3>
                                        <p className="text-slate-400 text-sm mb-4 line-clamp-2">
                                            {course.description}
                                        </p>

                                        <div className="flex items-center gap-4 text-xs text-slate-500 mb-6">
                                            <div className="flex items-center gap-1">
                                                <Clock size={14} /> {course.duration}
                                            </div>
                                            <div className="flex items-center gap-1">
                                                <Star size={14} className="text-yellow-500" /> {course.rating}
                                            </div>
                                        </div>

                                        <Link to={`/course/${course.id}`} className="w-full py-3 rounded-xl bg-slate-800 hover:bg-white hover:text-slate-900 font-bold transition-all flex items-center justify-center gap-2">
                                            View Details <ChevronRight size={16} />
                                        </Link>
                                    </div>
                                </motion.div>
                            ))
                        ) : (
                            <div className="col-span-full text-center text-slate-500 py-12">
                                No courses found for the selected filters.
                            </div>
                        )}
                    </div>
                )}
            </main>
        </div>
    );
};

export default Courses;
