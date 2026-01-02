import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Zap, FileText, AlertCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import api from '../api/client';

const ChatInterface = () => {
    const [messages, setMessages] = useState([
        { id: 1, sender: 'ai', text: 'Hello! I am your SkillTree AI instructor. How can I help you with your studies today?' }
    ]);
    const [inputText, setInputText] = useState('');
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(scrollToBottom, [messages]);

    const handleSend = async () => {
        if (!inputText.trim()) return;

        const userMsg = { id: Date.now(), sender: 'user', text: inputText };
        setMessages(prev => [...prev, userMsg]);
        setInputText('');

        try {
            // Assuming 'api' is an imported axios instance or similar
            // You would need to import/define 'api' elsewhere, e.g.:
            // import axios from 'axios';
            // const api = axios.create({ baseURL: 'http://localhost:3000' }); // Or your actual API base URL
            const response = await api.post('/api/chat', { message: userMsg.text });
            const aiMsg = {
                id: Date.now() + 1,
                sender: 'ai',
                text: response.data.response,
                action: response.data.action_link ? {
                    link: response.data.action_link,
                    text: response.data.action_text
                } : null
            };
            setMessages(prev => [...prev, aiMsg]);
        } catch (error) {
            const errorMsg = {
                id: Date.now() + 1,
                sender: 'ai',
                text: "Sorry, I'm having trouble connecting to the server right now."
            };
            setMessages(prev => [...prev, errorMsg]);
        }
    };

    const handleUpload = async () => {
        // Simulate file selection
        const userMsg = { id: Date.now(), sender: 'user', text: "Analyzing my resume..." };
        setMessages(prev => [...prev, userMsg]);

        try {
            const response = await api.post('/api/upload-resume');
            const data = response.data;
            const aiMsg = {
                id: Date.now() + 1,
                sender: 'ai',
                text: "Here is your resume analysis:",
                resumeData: {
                    role: data.match_role,
                    score: data.score,
                    recommendation: data.recommendation,
                    missingSkills: data.missing_skills
                }
            };
            setMessages(prev => [...prev, aiMsg]);
        } catch (error) {
            const errorMsg = { id: Date.now() + 1, sender: 'ai', text: "Failed to upload resume." };
            setMessages(prev => [...prev, errorMsg]);
        }
    };

    return (
        <div className="flex flex-col h-[calc(100vh-6rem)] bg-slate-900 rounded-2xl border border-slate-700 overflow-hidden m-4">
            {/* Header */}
            <div className="bg-slate-800 p-4 border-b border-slate-700 flex items-center space-x-3">
                <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center">
                    <Bot className="text-white" size={24} />
                </div>
                <div>
                    <h2 className="font-bold text-lg">AI Instructor</h2>
                    <p className="text-xs text-green-400 flex items-center px-1">
                        <span className="w-2 h-2 rounded-full bg-green-400 mr-2"></span> Online
                    </p>
                </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map((msg) => (
                    <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-[80%] p-4 rounded-2xl ${msg.sender === 'user'
                            ? 'bg-blue-600 text-white rounded-br-none'
                            : 'bg-slate-800 text-slate-200 border border-slate-700 rounded-bl-none'
                            }`}>
                            <p className="leading-relaxed whitespace-pre-line">{msg.text}</p>
                            {/* Resume Analysis Card */}
                            {msg.resumeData && (
                                <div className="mt-4 bg-slate-900 border border-slate-700 rounded-xl p-4 w-full">
                                    <div className="flex justify-between items-start mb-4">
                                        <div>
                                            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Target Role</span>
                                            <h3 className="font-bold text-lg text-white">{msg.resumeData.role}</h3>
                                        </div>
                                        <div className="flex flex-col items-center">
                                            <div className={`text-xl font-bold ${msg.resumeData.score >= 80 ? 'text-green-400' : 'text-yellow-400'}`}>
                                                {msg.resumeData.score}%
                                            </div>
                                            <span className="text-[10px] text-slate-500">MATCH</span>
                                        </div>
                                    </div>

                                    <div className="mb-4">
                                        <div className="flex items-center gap-2 text-sm text-blue-300 mb-2">
                                            <AlertCircle size={14} /> Recommendation
                                        </div>
                                        <p className="text-sm text-slate-400">{msg.resumeData.recommendation}</p>
                                    </div>

                                    {msg.resumeData.missingSkills && (
                                        <div>
                                            <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Recommended Skills</div>
                                            <div className="flex flex-wrap gap-2">
                                                {msg.resumeData.missingSkills.map((skill, idx) => (
                                                    <span key={idx} className="bg-slate-800 text-slate-300 px-2 py-1 rounded text-xs border border-slate-700">
                                                        {skill}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* Action Link */}
                            {msg.action && (
                                <Link
                                    to={msg.action.link}
                                    className="mt-4 inline-flex items-center gap-2 bg-blue-500/20 hover:bg-blue-500 hover:text-white text-blue-300 px-4 py-2 rounded-lg font-bold transition-all border border-blue-500/30"
                                >
                                    <Zap size={16} /> {msg.action.text}
                                </Link>
                            )}
                        </div>
                    </div>
                ))}
                <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-4 bg-slate-800 border-t border-slate-700">
                <div className="flex space-x-2">
                    <button
                        onClick={handleUpload}
                        className="p-3 bg-slate-700 rounded-xl hover:bg-slate-600 text-slate-300 transition-colors"
                        title="Upload Resume"
                    >
                        <User size={24} />
                    </button>
                    <input
                        type="text"
                        value={inputText}
                        onChange={(e) => setInputText(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                        placeholder="Ask about your courses, simulations, or career..."
                        className="flex-1 bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
                    />
                    <button
                        onClick={handleSend}
                        className="bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-xl transition-colors"
                    >
                        <Send size={24} />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ChatInterface;
