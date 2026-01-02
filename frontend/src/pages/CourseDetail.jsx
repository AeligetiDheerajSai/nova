import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Clock, Star, PlayCircle, Lock, CheckCircle, ChevronDown, ChevronUp, Zap } from 'lucide-react';
import api from '../api/client';
import { motion } from 'framer-motion';

const CourseDetail = () => {
    const { id } = useParams();
    const [course, setCourse] = useState(null);
    const [loading, setLoading] = useState(true);
    const [enrolled, setEnrolled] = useState(false);
    const [expandedModules, setExpandedModules] = useState({});

    useEffect(() => {
        const fetchCourse = async () => {
            try {
                const [courseRes, statusRes] = await Promise.all([
                    api.get(`/api/courses/${id}`),
                    api.get(`/api/courses/${id}/status`)
                ]);

                setCourse(courseRes.data);
                setEnrolled(statusRes.data.enrolled);

                if (courseRes.data.modules.length > 0) {
                    setExpandedModules({
                        [courseRes.data.modules[0].id]: true
                    });
                }
            } catch (error) {
                console.error("Failed to fetch course:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchCourse();
    }, [id]);

    const handleEnroll = async () => {
        try {
            await api.post(`/api/courses/${id}/enroll`);
            setEnrolled(true);
        } catch (error) {
            console.error("Enrollment failed:", error);
        }
    };

    const toggleModule = (moduleId) => {
        setExpandedModules(prev => ({
            ...prev,
            [moduleId]: !prev[moduleId]
        }));
    };

    const getLabLink = (title) => {
        if (!title) return null;
        const t = title.toLowerCase();
        if (t.includes('network')) return '/lab/network-defense';
        if (t.includes('neural') || t.includes('ai')) return '/lab/neural-network';
        if (t.includes('web')) return '/lab/web-dev';
        if (t.includes('circuit') || t.includes('logic')) return '/lab/circuit-logic';
        if (t.includes('algorithm') || t.includes('sorting')) return '/lab/sorting-algo';
        return null;
    };

    if (loading) return <div className="p-8 text-white">Loading...</div>;
    if (!course) return <div className="p-8 text-white">Course not found.</div>;

    const labLink = getLabLink(course.title);

    return (
        <div className="flex flex-col min-h-screen bg-slate-950 text-white">
            {/* Hero Section */}
            <div className="relative h-96 w-full overflow-hidden">
                <img
                    src={course.image_url || "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=80&w=1000"}
                    alt={course.title}
                    className="absolute inset-0 w-full h-full object-cover opacity-50"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/80 to-transparent" />

                <div className="absolute bottom-0 left-0 w-full p-8 max-w-7xl mx-auto">
                    <span className="bg-blue-600 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide mb-4 inline-block">
                        {course.category}
                    </span>
                    <h1 className="text-4xl md:text-5xl font-bold mb-4">{course.title}</h1>
                    <p className="text-slate-300 max-w-2xl mb-6 text-lg">{course.description}</p>

                    <div className="flex flex-col md:flex-row md:items-center gap-6 text-sm font-medium text-slate-400">
                        <div className="flex items-center gap-6">
                            <div className="flex items-center gap-2"><Clock size={18} /> {course.duration}</div>
                            <div className="flex items-center gap-2"><Star size={18} className="text-yellow-500" /> {course.rating}</div>
                            <div className="flex items-center gap-2">
                                {course.modules?.reduce((acc, m) => acc + m.lessons.length, 0)} Lessons
                            </div>
                        </div>

                        <div className="flex-1 md:text-right flex items-center justify-end gap-4">
                            {/* Lab Button */}
                            {labLink && (
                                <Link to={labLink} className="bg-purple-600/20 hover:bg-purple-600 hover:text-white text-purple-400 border border-purple-600/50 px-6 py-3 rounded-xl font-bold flex items-center gap-2 transition-all">
                                    <Zap size={18} /> Launch Lab
                                </Link>
                            )}

                            {enrolled ? (
                                <button disabled className="bg-green-600/20 text-green-400 border border-green-600/50 px-8 py-3 rounded-xl font-bold flex items-center gap-2 cursor-default">
                                    <CheckCircle /> Enrolled
                                </button>
                            ) : (
                                <button
                                    onClick={handleEnroll}
                                    className="bg-blue-600 hover:bg-blue-500 text-white px-8 py-3 rounded-xl font-bold shadow-lg shadow-blue-900/40 transition flex items-center gap-2"
                                >
                                    Enroll Now
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Curriculum Section */}
            <div className={`flex-1 max-w-5xl mx-auto w-full p-8 transition-opacity duration-500 ${enrolled ? 'opacity-100' : 'opacity-50 pointer-events-none grayscale'}`}>
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold">Course Curriculum</h2>
                    {!enrolled && <div className="text-sm text-yellow-500 font-bold bg-yellow-500/10 px-3 py-1 rounded-lg border border-yellow-500/20">Enroll to access content</div>}
                </div>

                <div className="space-y-4">
                    {course.modules?.map((module, index) => (
                        <div key={module.id} className="border border-slate-800 rounded-xl bg-slate-900/50 overflow-hidden">
                            <button
                                onClick={() => toggleModule(module.id)}
                                className="w-full flex items-center justify-between p-6 hover:bg-slate-800/80 transition text-left"
                            >
                                <div>
                                    <h3 className="font-bold text-lg mb-1">{index + 1}. {module.title}</h3>
                                    <p className="text-xs text-slate-500">{module.lessons.length} Lessons</p>
                                </div>
                                {expandedModules[module.id] ? <ChevronUp className="text-slate-500" /> : <ChevronDown className="text-slate-500" />}
                            </button>

                            {/* Lessons List */}
                            {expandedModules[module.id] && (
                                <div className="border-t border-slate-800 bg-slate-900/20">
                                    {module.lessons.map((lesson) => (
                                        <Link
                                            key={lesson.id}
                                            to={enrolled ? `/lesson/${lesson.id}` : '#'}
                                            className={`flex items-center justify-between p-4 px-6 border-b last:border-0 border-slate-800/50 ${enrolled ? 'hover:bg-slate-800/50 group cursor-pointer' : 'cursor-not-allowed opacity-70'}`}
                                        >
                                            <div className="flex items-center gap-4">
                                                <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-slate-500 group-hover:bg-blue-600/20 group-hover:text-blue-400 transition">
                                                    {enrolled ? <PlayCircle size={16} /> : <Lock size={14} />}
                                                </div>
                                                <div>
                                                    <h4 className="font-medium group-hover:text-blue-400 transition">{lesson.title}</h4>
                                                    <div className="flex items-center gap-2 mt-1">
                                                        <span className="text-xs text-slate-500 uppercase">{lesson.content_type}</span>
                                                        <span className="text-xs text-slate-600">•</span>
                                                        <span className="text-xs text-slate-500">{lesson.duration_minutes} min</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                            )}
                        </div>
                    ))}

                    {(!course.modules || course.modules.length === 0) && (
                        <div className="text-slate-500 text-center py-12 bg-slate-900 rounded-xl border border-slate-800 border-dashed">
                            No modules content available yet.
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default CourseDetail;
