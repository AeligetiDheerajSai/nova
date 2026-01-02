import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ChevronLeft, Target, TrendingUp, DollarSign, BookOpen, CheckCircle, Lock } from 'lucide-react';

const paths = {
    'cse-cyber': {
        title: "Cyber Security Specialist",
        description: "Master the art of network defense, ethical hacking, and digital forensics. Prepare for a high-demand career protecting critical infrastructure.",
        salary: "$95k - $160k",
        role: "Security Analyst / Pentester",
        growth: "+32% (High Demand)",
        skills: ["Network Security", "Ethical Hacking", "Cryptography", "Risk Analysis"],
        roadmap: [
            { id: 1, title: "Network Defense Essentials", completed: true, type: "course", link: "/course/1" },
            { id: 2, title: "Ethical Hacking 101", completed: false, type: "course", link: "/course/2" },
            { id: 3, title: "Adv. Penetration Testing", completed: false, type: "course", link: "/course/3" },
            { id: 4, title: "Cyber Warfare Simulation", completed: false, type: "project", link: "/lab/network-defense" },
        ]
    },
    'cse-ai': {
        title: "AI & Machine Learning Engineer",
        description: "Build intelligent systems, train neural networks, and deploy machine learning models to production.",
        salary: "$120k - $200k",
        role: "ML Engineer / Data Scientist",
        growth: "+40% (Very High Demand)",
        skills: ["Python", "TensorFlow", "Deep Learning", "Data Pipelines"],
        roadmap: [
            { id: 1, title: "Python Mastery", completed: true, type: "course", link: "/course/4" },
            { id: 2, title: "Math for ML", completed: false, type: "course", link: "/course/5" },
            { id: 3, title: "Neural Networks 101", completed: false, type: "course", link: "/course/2" },
            { id: 4, title: "Build a Chatbot", completed: false, type: "project", link: "/lab/neural-network" },
        ]
    }
};

const LearningPathDetail = () => {
    const { id } = useParams();
    const path = paths[id];

    if (!path) return <div className="p-8 text-white">Path not found.</div>;

    return (
        <div className="min-h-screen bg-slate-950 text-white p-8">
            <Link to="/dashboard" className="flex items-center gap-2 text-slate-400 hover:text-white mb-8 transition">
                <ChevronLeft size={20} /> Back to Dashboard
            </Link>

            <header className="mb-12">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                >
                    <div className="flex items-center gap-3 mb-4">
                        <span className="px-3 py-1 rounded-full bg-blue-600/20 text-blue-400 border border-blue-600/30 text-xs font-bold uppercase tracking-wider">
                            Career Track
                        </span>
                        <span className="px-3 py-1 rounded-full bg-emerald-600/20 text-emerald-400 border border-emerald-600/30 text-xs font-bold uppercase tracking-wider">
                            Professional Certificate
                        </span>
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">
                        {path.title}
                    </h1>
                    <p className="text-xl text-slate-300 max-w-3xl leading-relaxed">
                        {path.description}
                    </p>
                </motion.div>
            </header>

            {/* Career Outlook */}
            <div className="grid md:grid-cols-3 gap-6 mb-16">
                <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl">
                    <div className="bg-green-500/20 w-12 h-12 rounded-xl flex items-center justify-center text-green-400 mb-4">
                        <DollarSign size={24} />
                    </div>
                    <div className="text-slate-400 text-sm mb-1">Avg. Salary</div>
                    <div className="text-2xl font-bold">{path.salary}</div>
                </div>
                <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl">
                    <div className="bg-blue-500/20 w-12 h-12 rounded-xl flex items-center justify-center text-blue-400 mb-4">
                        <Target size={24} />
                    </div>
                    <div className="text-slate-400 text-sm mb-1">Target Role</div>
                    <div className="text-2xl font-bold">{path.role}</div>
                </div>
                <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl">
                    <div className="bg-purple-500/20 w-12 h-12 rounded-xl flex items-center justify-center text-purple-400 mb-4">
                        <TrendingUp size={24} />
                    </div>
                    <div className="text-slate-400 text-sm mb-1">Market Growth</div>
                    <div className="text-2xl font-bold">{path.growth}</div>
                </div>
            </div>

            {/* Roadmap */}
            <div className="max-w-4xl">
                <h2 className="text-2xl font-bold mb-8 flex items-center gap-2">
                    <BookOpen className="text-blue-400" /> Curriculum Roadmap
                </h2>

                <div className="space-y-4">
                    {path.roadmap.map((item, index) => (
                        <div key={item.id} className="relative pl-8 pb-8 border-l border-slate-800 last:pb-0">
                            {/* Dot */}
                            <div className={`absolute left-[-9px] top-0 w-4 h-4 rounded-full border-2 
                                ${item.completed ? 'bg-green-500 border-green-500' : 'bg-slate-900 border-slate-700'}`}>
                            </div>

                            <motion.div
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: index * 0.1 }}
                                className="bg-slate-900 p-6 rounded-2xl border border-slate-800 hover:border-slate-700 transition"
                            >
                                <div className="flex justify-between items-start">
                                    <div>
                                        <div className="flex items-center gap-3 mb-2">
                                            <span className={`text-xs font-bold uppercase tracking-wider px-2 py-0.5 rounded
                                                ${item.type === 'project' ? 'bg-purple-500/20 text-purple-400' : 'bg-blue-500/20 text-blue-400'}`}>
                                                {item.type}
                                            </span>
                                            {item.completed && <span className="text-green-400 text-xs flex items-center gap-1"><CheckCircle size={12} /> Completed</span>}
                                        </div>
                                        <h3 className="text-xl font-bold text-slate-200">{item.title}</h3>
                                    </div>
                                    <button className={`px-4 py-2 rounded-lg text-sm font-bold transition
                                        ${item.completed ? 'bg-slate-800 text-slate-500 cursor-default' : 'bg-blue-600 hover:bg-blue-700 text-white'}`}>
                                        {item.completed ? 'Review' : 'Start'}
                                    </button>
                                </div>
                            </motion.div>
                        </div>
                    ))}

                    <div className="relative pl-8 pt-4">
                        <div className="absolute left-[-9px] top-4 w-4 h-4 rounded-full bg-slate-800 border-2 border-slate-700"></div>
                        <div className="p-6 border-2 border-dashed border-slate-800 rounded-2xl flex items-center gap-4 text-slate-500">
                            <Lock size={20} />
                            <span>Complete previous steps to unlock automated career matching.</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LearningPathDetail;
