import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useStore } from '../store';
import { Award, Printer, ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';

const CertificateView = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user, achievements } = useStore();

    // In a real app, we'd fetch the specific certificate details by ID
    // For now, we'll find it in the store or use a mock if mostly visual
    const cert = achievements.certificates.find(c => c.id.toString() === id) || {
        title: "Network Security Fundamentals",
        date: new Date().toLocaleDateString(),
        instructor: "SkillTree AI"
    };

    return (
        <div className="min-h-screen bg-slate-900 flex items-center justify-center p-8 print:bg-white print:p-0">
            {/* Controls - Hidden when printing */}
            <div className="fixed top-8 left-8 flex gap-4 print:hidden">
                <button
                    onClick={() => navigate(-1)}
                    className="p-3 bg-slate-800 rounded-full text-white hover:bg-slate-700 transition"
                >
                    <ArrowLeft size={24} />
                </button>
            </div>

            <div className="fixed top-8 right-8 print:hidden">
                <button
                    onClick={() => window.print()}
                    className="flex items-center gap-2 px-6 py-3 bg-blue-600 rounded-xl text-white font-bold hover:bg-blue-700 transition shadow-lg shadow-blue-900/20"
                >
                    <Printer size={20} /> Print Certificate
                </button>
            </div>

            {/* Certificate Paper */}
            <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="bg-[#fffdf5] text-slate-900 w-[1123px] h-[794px] relative print:w-full print:h-full print:shadow-none shadow-2xl p-16 flex flex-col items-center justify-between border-[20px] border-double border-slate-900 overflow-hidden"
            >
                {/* Decorative Corners */}
                <div className="absolute top-0 left-0 w-32 h-32 border-t-[40px] border-l-[40px] border-blue-900" />
                <div className="absolute top-0 right-0 w-32 h-32 border-t-[40px] border-r-[40px] border-blue-900" />
                <div className="absolute bottom-0 left-0 w-32 h-32 border-b-[40px] border-l-[40px] border-blue-900" />
                <div className="absolute bottom-0 right-0 w-32 h-32 border-b-[40px] border-r-[40px] border-blue-900" />

                {/* Content */}
                <div className="text-center z-10 space-y-8 mt-12">
                    <div className="flex justify-center mb-8">
                        <Award size={80} className="text-blue-900" />
                    </div>

                    <h1 className="text-6xl font-serif font-bold tracking-wider text-blue-900">CERTIFICATE</h1>
                    <h2 className="text-2xl font-serif tracking-widest uppercase text-slate-500">OF COMPLETION</h2>

                    <div className="py-8">
                        <p className="text-xl text-slate-600 italic mb-4">This is to certify that</p>
                        <p className="text-5xl font-script font-bold text-blue-600 border-b-2 border-slate-300 pb-4 px-12 inline-block">
                            {user ? user.name : "Student Name"}
                        </p>
                    </div>

                    <div>
                        <p className="text-xl text-slate-600 italic mb-4">Has successfully completed the course</p>
                        <h3 className="text-4xl font-bold text-slate-900">{cert.title}</h3>
                    </div>

                    <div className="flex justify-between w-full max-w-4xl mt-16 px-16">
                        <div className="text-center">
                            <p className="font-bold text-xl border-t-2 border-slate-900 pt-2 px-8">{cert.date}</p>
                            <p className="text-sm text-slate-500 uppercase tracking-wider mt-2">Date</p>
                        </div>

                        <div className="w-24 h-24 relative opacity-80">
                            {/* Seal */}
                            <div className="absolute inset-0 border-4 border-blue-900 rounded-full flex items-center justify-center">
                                <span className="text-xs font-bold text-blue-900 text-center uppercase">SkillTree<br />AI<br />Verified</span>
                            </div>
                        </div>

                        <div className="text-center">
                            <div className="font-script text-3xl text-blue-900 border-t-2 border-slate-900 pt-2 px-8">SkillTree AI</div>
                            <p className="text-sm text-slate-500 uppercase tracking-wider mt-2">Instructor</p>
                        </div>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default CertificateView;
