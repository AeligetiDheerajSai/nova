import React, { useEffect, useState } from 'react';
import { BookOpen, Clock, Star, PlayCircle, Loader } from 'lucide-react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import api from '../api/client';

const MyLearning = () => {
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchMyCourses = async () => {
            try {
                const response = await api.get('/api/users/me/courses');
                // Enhance with image if missing
                const data = response.data.map(c => ({
                    ...c,
                    image: c.image_url || "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=80&w=1000"
                }));
                setCourses(data);
            } catch (error) {
                console.error("Failed to fetch my courses:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchMyCourses();
    }, []);

    if (loading) {
        return (
            <div className="flex h-screen items-center justify-center bg-slate-950 text-white">
                <Loader className="animate-spin text-blue-500" size={32} />
            </div>
        );
    }

    return (
        <div className="p-8 max-w-7xl mx-auto bg-slate-950 min-h-screen">
            <header className="mb-12">
                <h1 className="text-3xl font-bold text-white mb-4">My Learning</h1>
                <p className="text-slate-400">Track your progress and continue where you left off.</p>
            </header>

            {courses.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {courses.map((course, index) => (
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
                                    <span className="px-3 py-1 rounded-full bg-green-500/20 text-green-400 text-xs font-bold border border-green-500/20">
                                        Enrolled
                                    </span>
                                </div>
                            </div>

                            <div className="p-6">
                                <h3 className="text-xl font-bold mb-2 text-white group-hover:text-blue-400 transition-colors">
                                    {course.title}
                                </h3>

                                {/* Progress Bar (Mocked for now until we have course-level progress aggregations) */}
                                <div className="mb-4">
                                    <div className="flex justify-between text-xs text-slate-400 mb-1">
                                        <span>Progress</span>
                                        <span>0%</span>
                                    </div>
                                    <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
                                        <div className="h-full bg-green-500 w-0" />
                                    </div>
                                </div>

                                <Link to={`/course/${course.id}`} className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold transition-all flex items-center justify-center gap-2 shadow-lg shadow-blue-900/20">
                                    <PlayCircle size={18} /> Continue Learning
                                </Link>
                            </div>
                        </motion.div>
                    ))}
                </div>
            ) : (
                <div className="text-center py-20 bg-slate-900/50 rounded-2xl border border-slate-800 border-dashed">
                    <BookOpen size={48} className="text-slate-600 mx-auto mb-4" />
                    <h2 className="text-xl font-bold text-white mb-2">No courses enrolled yet</h2>
                    <p className="text-slate-400 mb-6">Explore our catalog to start your learning journey.</p>
                    <Link to="/courses" className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-6 py-3 rounded-xl font-bold transition">
                        Browse Courses
                    </Link>
                </div>
            )}
        </div>
    );
};

export default MyLearning;
