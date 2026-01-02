import React from 'react';
import { Link } from 'react-router-dom';
import { useStore } from '../store';
import { Award, Shield, Cpu, Lock, FileText, Printer } from 'lucide-react';

const Achievements = () => {
    const { user, achievements, fetchAchievements } = useStore();

    React.useEffect(() => {
        fetchAchievements();
    }, []);

    const { badges, certificates } = achievements;

    // Helper to map string icon names to Lucide components if needed
    // For now, we will use a simple mapping or default
    const getIcon = (iconName) => {
        const icons = { 'Shield': Shield, 'Cpu': Cpu, 'Brain': Brain, 'Lock': Lock };
        return icons[iconName] || Award;
    };

    return (
        <div className="p-8 max-w-7xl mx-auto space-y-12">
            <h1 className="text-3xl font-bold">Your Achievements</h1>

            {/* Badges */}
            <section>
                <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                    <Award className="text-yellow-400" /> Skill Badges
                </h2>
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
                    {badges.map(badge => {
                        const Icon = getIcon(badge.icon);
                        return (
                            <div key={badge.id} className={`p-4 rounded-xl border ${badge.earned ? 'bg-slate-800 border-blue-500/50' : 'bg-slate-900 border-slate-800 opacity-50'} flex flex-col items-center text-center transition-all hover:scale-105`}>
                                <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-3 ${badge.earned ? 'bg-blue-600' : 'bg-slate-800'}`}>
                                    <Icon size={32} className="text-white" />
                                </div>
                                <h3 className="font-bold text-sm mb-1">{badge.name}</h3>
                                <p className="text-xs text-slate-400">{badge.desc}</p>
                            </div>
                        );
                    })}
                </div>
            </section>

            {/* Certificates */}
            <section>
                <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                    <FileText className="text-emerald-400" /> Certificates
                </h2>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {certificates.map(cert => (
                        <div key={cert.id} className="bg-slate-800 rounded-xl overflow-hidden border border-slate-700">
                            <div className="h-48 bg-slate-700 relative">
                                <img src={cert.image} alt="Certificate" className="w-full h-full object-cover" />
                                <div className="absolute inset-0 bg-black/20" />
                            </div>
                            <div className="p-4">
                                <h3 className="font-bold text-lg mb-1">{cert.title}</h3>
                                <p className="text-sm text-slate-400 mb-4">Issued on {cert.date}</p>
                                <Link
                                    to={`/certificate/${cert.id}`}
                                    className="w-full py-2 bg-slate-700 hover:bg-slate-600 rounded-lg flex items-center justify-center gap-2 text-sm font-medium transition-colors text-white"
                                >
                                    <Printer size={16} /> View Certificate
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
};

// Quick fix for Brain icon which was not imported
const Brain = ({ size, className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M12 5a3 3 0 1 0-5.997.125 4 4 0 0 0-2.526 5.77 4 4 0 0 0 .556 6.588A4 4 0 1 0 12 18Z" /><path d="M12 5a3 3 0 1 1 5.997.125 4 4 0 0 1 2.526 5.77 4 4 0 0 1-.556 6.588A4 4 0 1 1 12 18Z" /><path d="M15 13a4.5 4.5 0 0 1-3-4 4.5 4.5 0 0 1-3 4" /><path d="M17.599 6.5a3 3 0 0 0 .399-1.375" /><path d="M6.003 5.125A3 3 0 0 0 6.401 6.5" /><path d="M3.477 10.896a4 4 0 0 1 .585-.396" /><path d="M19.938 10.5a4 4 0 0 1 .585.396" /><path d="M6 18a4 4 0 0 1-1.97-3.284" /><path d="M17.97 14.716A4 4 0 0 1 16 18" /></svg>
);

export default Achievements;
