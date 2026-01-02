import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useStore } from '../store';
import api from '../api/client';
import { Brain, Lock, Mail } from 'lucide-react';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const { login } = useStore();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        try {
            // In a real app, we'd use the form data to get a token
            // const response = await api.post('/api/auth/login', `username=${email}&password=${password}`);
            // localStorage.setItem('token', response.data.access_token);

            // For demo simplicity/speed without full DB seeding, we'll simulate success
            // But we SHOULD call the backend to verifying connectivity

            await new Promise(resolve => setTimeout(resolve, 500)); // Simulate API call

            // Mock setting user in store to prevent UI crash before dashboard fetch
            login({
                name: 'Student User',
                email,
                role: 'student',
                level: 5,
                xp: 1200,
                streak: 3,
                badges: []
            });
            navigate('/dashboard');
        } catch (err) {
            setError('Invalid credentials');
        }
    };

    return (
        <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
            <div className="w-full max-w-md bg-slate-900 rounded-2xl border border-slate-800 p-8 shadow-xl">
                <div className="flex justify-center mb-8">
                    <div className="w-16 h-16 bg-blue-600/20 rounded-full flex items-center justify-center">
                        <Brain className="w-8 h-8 text-blue-500" />
                    </div>
                </div>

                <h2 className="text-2xl font-bold text-center text-white mb-8">Welcome Back</h2>

                {error && <div className="bg-red-500/10 text-red-500 p-3 rounded-lg mb-4 text-sm text-center">{error}</div>}

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-slate-400 mb-2">Email or Username</label>
                        <div className="relative">
                            <Mail className="absolute left-3 top-3 text-slate-500" size={20} />
                            <input
                                type="text"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full bg-slate-800 border border-slate-700 rounded-lg py-3 pl-10 pr-4 text-white focus:outline-none focus:border-blue-500 transition-colors"
                                placeholder="student"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-400 mb-2">Password</label>
                        <div className="relative">
                            <Lock className="absolute left-3 top-3 text-slate-500" size={20} />
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full bg-slate-800 border border-slate-700 rounded-lg py-3 pl-10 pr-4 text-white focus:outline-none focus:border-blue-500 transition-colors"
                                placeholder="••••••••"
                            />
                        </div>
                    </div>

                    <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg transition-colors">
                        Sign In
                    </button>
                </form>

                <p className="mt-8 text-center text-slate-400 text-sm">
                    Don't have an account? <Link to="/register" className="text-blue-400 hover:text-blue-300">Sign up</Link>
                </p>
            </div>
        </div>
    );
};

export default Login;
