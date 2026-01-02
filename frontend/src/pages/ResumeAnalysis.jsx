import React, { useState } from 'react';
import { Upload, FileText, CheckCircle, AlertTriangle, BookOpen, Loader } from 'lucide-react';
import { motion } from 'framer-motion';
import api from '../api/client';
import { Link } from 'react-router-dom';

const ResumeAnalysis = () => {
    const [file, setFile] = useState(null);
    const [analyzing, setAnalyzing] = useState(false);
    const [result, setResult] = useState(null);
    const [dragActive, setDragActive] = useState(false);

    const handleDrag = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true);
        } else if (e.type === "dragleave") {
            setDragActive(false);
        }
    };

    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            setFile(e.dataTransfer.files[0]);
        }
    };

    const handleChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            setFile(e.target.files[0]);
        }
    };

    const analyzeResume = async () => {
        if (!file) return;
        setAnalyzing(true);

        const formData = new FormData();
        formData.append("file", file);

        try {
            const response = await api.post('/api/resume/analyze', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            setResult(response.data);
        } catch (error) {
            console.error("Analysis failed:", error);
        } finally {
            setAnalyzing(false);
        }
    };

    return (
        <div className="p-8 max-w-4xl mx-auto min-h-screen">
            <header className="mb-8 text-center">
                <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400 mb-2">
                    AI Resume Analysis
                </h1>
                <p className="text-slate-400">
                    Upload your resume to get instant feedback and personalized course recommendations.
                </p>
            </header>

            {!result && (
                <div className="max-w-xl mx-auto">
                    <div
                        onDragEnter={handleDrag}
                        onDragLeave={handleDrag}
                        onDragOver={handleDrag}
                        onDrop={handleDrop}
                        className={`
                            border-2 border-dashed rounded-2xl p-12 text-center transition-all cursor-pointer
                            ${dragActive ? 'border-blue-500 bg-blue-500/10' : 'border-slate-700 bg-slate-900/50 hover:bg-slate-900'}
                        `}
                    >
                        <input
                            type="file"
                            id="resume-upload"
                            className="hidden"
                            onChange={handleChange}
                            accept=".pdf,.txt,.docx"
                        />
                        <label htmlFor="resume-upload" className="cursor-pointer">
                            <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4 text-blue-400">
                                {file ? <FileText size={32} /> : <Upload size={32} />}
                            </div>
                            <h3 className="font-bold text-lg text-white mb-2">
                                {file ? file.name : "Drag & Drop your resume"}
                            </h3>
                            <p className="text-sm text-slate-500">
                                {file ? "Ready to analyze" : "or click to browse (PDF, TXT)"}
                            </p>
                        </label>
                    </div>

                    <div className="mt-6 text-center">
                        <button
                            onClick={analyzeResume}
                            disabled={!file || analyzing}
                            className={`
                                px-8 py-3 rounded-xl font-bold text-white transition-all shadow-lg
                                ${!file || analyzing ? 'bg-slate-800 text-slate-500 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-500 shadow-blue-900/40'}
                            `}
                        >
                            {analyzing ? (
                                <span className="flex items-center gap-2">
                                    <Loader className="animate-spin" size={18} /> Analyzing...
                                </span>
                            ) : "Analyze Resume"}
                        </button>
                    </div>
                </div>
            )}

            {result && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="grid grid-cols-1 md:grid-cols-3 gap-6"
                >
                    {/* Score Card */}
                    <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl text-center md:col-span-1">
                        <h3 className="text-slate-400 text-sm font-bold uppercase mb-4">Match Score</h3>
                        <div className="relative w-32 h-32 mx-auto flex items-center justify-center">
                            <svg className="w-full h-full transform -rotate-90">
                                <circle cx="64" cy="64" r="60" stroke="#1e293b" strokeWidth="8" fill="transparent" />
                                <circle
                                    cx="64" cy="64" r="60"
                                    stroke={result.score > 70 ? "#22c55e" : "#eab308"}
                                    strokeWidth="8"
                                    fill="transparent"
                                    strokeDasharray={377}
                                    strokeDashoffset={377 - (377 * result.score) / 100}
                                    strokeLinecap="round"
                                />
                            </svg>
                            <span className="absolute text-4xl font-bold text-white">{result.score}%</span>
                        </div>
                        <p className="mt-4 text-slate-300 font-medium">Role: {result.match_role}</p>
                    </div>

                    {/* Analysis Details */}
                    <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl md:col-span-2">
                        <h3 className="text-lg font-bold text-white mb-4">Analysis Report</h3>

                        <div className="mb-6">
                            <h4 className="flex items-center gap-2 text-sm text-slate-400 mb-2">
                                <AlertTriangle size={16} className="text-yellow-500" /> Missing Skills
                            </h4>
                            <div className="flex flex-wrap gap-2">
                                {result.missing_skills.map((skill, i) => (
                                    <span key={i} className="px-3 py-1 rounded-lg bg-red-500/10 text-red-400 text-sm font-medium border border-red-500/20">
                                        {skill}
                                    </span>
                                ))}
                            </div>
                        </div>

                        <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-4">
                            <h4 className="flex items-center gap-2 text-blue-400 font-bold mb-2">
                                <BookOpen size={18} /> Recommendation
                            </h4>
                            <p className="text-slate-300 text-sm mb-3">
                                {result.recommendation}
                            </p>
                            <Link to="/courses" className="text-white bg-blue-600 hover:bg-blue-500 px-4 py-2 rounded-lg text-sm font-bold inline-block">
                                View Recommended Courses
                            </Link>
                        </div>

                        {/* Job Recommendations */}
                        {result.recommended_jobs && result.recommended_jobs.length > 0 && (
                            <div className="mt-6">
                                <h4 className="font-bold text-white mb-4">Recommended Jobs for You</h4>
                                <div className="space-y-4">
                                    {result.recommended_jobs.map((job, idx) => (
                                        <div key={idx} className="bg-slate-800/50 border border-slate-700 p-4 rounded-xl flex justify-between items-center hover:border-blue-500/30 transition-all">
                                            <div>
                                                <h5 className="font-bold text-white text-sm">{job.title}</h5>
                                                <p className="text-slate-400 text-xs">{job.company} • {job.location}</p>
                                                <p className="text-green-400 text-xs mt-1 font-mono">{job.salary_range}</p>
                                            </div>
                                            <div className="text-right">
                                                <div className="text-sm font-bold text-blue-400">{job.match_score}% Match</div>
                                                <button className="mt-2 bg-white text-slate-900 text-xs font-bold px-3 py-1.5 rounded hover:bg-slate-200 transition-colors">
                                                    Apply
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        <div className="mt-6 text-right">
                            <button onClick={() => { setResult(null); setFile(null); }} className="text-slate-500 hover:text-white text-sm">
                                Analyze another resume
                            </button>
                        </div>
                    </div>
                </motion.div>
            )}
        </div>
    );
};

export default ResumeAnalysis;
