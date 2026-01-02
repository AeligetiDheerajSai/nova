import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ChevronLeft, Play, FileText, Activity, CheckCircle, Lock } from 'lucide-react';
import api from '../api/client';
import Quiz from '../components/Quiz';

const LessonPlayer = () => {
    const { id } = useParams();
    const [lesson, setLesson] = useState(null);
    const [loading, setLoading] = useState(true);
    const [completed, setCompleted] = useState(false);

    useEffect(() => {
        const fetchLessonData = async () => {
            try {
                const lessonRes = await api.get(`/api/courses/lessons/${id}`);
                setLesson(lessonRes.data);
                // Ideally fetch progress state here too to set initial 'completed'
            } catch (error) {
                console.error("Failed to fetch lesson:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchLessonData();
    }, [id]);

    const handleProgressUpdate = async (score = null) => {
        try {
            await api.post('/api/users/progress', {
                lesson_id: parseInt(id),
                completed: true,
                score: score
            });
            setCompleted(true);
        } catch (error) {
            console.error("Failed to update progress:", error);
        }
    };

    if (loading) return <div className="p-8 text-white">Loading...</div>;
    if (!lesson) return <div className="p-8 text-white">Lesson not found.</div>;

    const renderContent = () => {
        switch (lesson.content_type) {
            case 'video':
                return (
                    <div className="aspect-video bg-black rounded-xl overflow-hidden shadow-2xl">
                        <iframe
                            width="100%"
                            height="100%"
                            src={lesson.content_url}
                            title={lesson.title}
                            frameBorder="0"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                        ></iframe>
                    </div>
                );
            case 'text':
                return (
                    <div className="bg-slate-900 p-8 rounded-xl border border-slate-800 prose prose-invert max-w-none">
                        <h1>{lesson.title}</h1>
                        <div dangerouslySetInnerHTML={{ __html: lesson.content_url }} />
                    </div>
                );
            case 'simulation':
                return (
                    <div className="text-center p-12 bg-slate-900 rounded-xl border border-slate-800">
                        <Activity size={48} className="mx-auto text-blue-500 mb-4" />
                        <h2 className="text-2xl font-bold mb-4">Interactive Lab: {lesson.title}</h2>
                        <p className="text-slate-400 mb-8">This lesson requires launching a virtual lab environment.</p>
                        <Link
                            to={lesson.content_url}
                            className="bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 px-8 rounded-full transition shadow-lg shadow-blue-900/40"
                            onClick={() => handleProgressUpdate()}
                        >
                            Launch Lab
                        </Link>
                    </div>
                );
            case 'quiz':
                return <Quiz data={lesson.content_url} onComplete={handleProgressUpdate} />;
            default:
                return <div>Unknown content type</div>;
        }
    };

    return (
        <div className="flex flex-col h-screen bg-slate-950 text-white">
            {/* Header */}
            <header className="h-16 flex items-center px-6 border-b border-slate-800 bg-slate-900/50 backdrop-blur">
                <Link to="/courses" className="flex items-center gap-2 text-slate-400 hover:text-white transition mr-8">
                    <ChevronLeft size={20} /> Back to Course
                </Link>
                <div className="h-6 w-px bg-slate-700 mr-8" />
                <h1 className="font-bold text-lg truncate flex-1">{lesson.title}</h1>
                {completed && (
                    <div className="text-green-400 flex items-center gap-2 font-bold text-sm">
                        <CheckCircle size={16} /> Completed
                    </div>
                )}
            </header>

            <div className="flex flex-1 overflow-hidden">
                {/* Main Content */}
                <main className="flex-1 overflow-y-auto p-8">
                    <div className="max-w-4xl mx-auto">
                        {renderContent()}

                        {/* Navigation / Actions for non-auto-tracked types */}
                        {(lesson.content_type === 'video' || lesson.content_type === 'text') && (
                            <div className="mt-8 flex justify-between items-center bg-slate-900/50 p-6 rounded-xl border border-slate-800">
                                <button className="text-slate-400 font-bold hover:text-white transition">Previous Lesson</button>
                                <button
                                    onClick={() => handleProgressUpdate()}
                                    disabled={completed}
                                    className={`font-bold py-2 px-6 rounded-lg transition flex items-center gap-2 ${completed ? 'bg-green-600/20 text-green-400 cursor-default' : 'bg-green-600 hover:bg-green-500 text-white'}`}
                                >
                                    <CheckCircle size={18} /> {completed ? 'Completed' : 'Mark Complete'}
                                </button>
                                <button className="text-slate-400 font-bold hover:text-white transition">Next Lesson</button>
                            </div>
                        )}
                    </div>
                </main>

                {/* Sidebar (Simplified) */}
                <aside className="w-80 bg-slate-900 border-l border-slate-800 hidden lg:block overflow-y-auto">
                    <div className="p-6 border-b border-slate-800">
                        <h3 className="font-bold text-slate-400 uppercase text-xs tracking-wider">Course Content</h3>
                    </div>
                    <div className="p-6 text-sm text-slate-500 italic">
                        {/* Future: Render full module list here with checkmarks */}
                        Loading other lessons...
                    </div>
                </aside>
            </div>
        </div>
    );
};

export default LessonPlayer;
