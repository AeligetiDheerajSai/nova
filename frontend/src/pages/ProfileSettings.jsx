import React, { useState, useEffect } from 'react';
import { useStore } from '../store';
import api from '../api/client';
import { Check, User, Save, RefreshCw } from 'lucide-react';
import { motion } from 'framer-motion';

const avatarStyles = [
    'adventurer', 'avataaars', 'bottts', 'fun-emoji', 'lorelei', 'notionists'
];

const ProfileSettings = () => {
    const { user, fetchUser } = useStore();
    const [name, setName] = useState('');
    const [bio, setBio] = useState('');
    const [avatarStyle, setAvatarStyle] = useState('adventurer');
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState(null);

    useEffect(() => {
        if (user) {
            setName(user.username || '');
            setBio(user.bio || '');
            setAvatarStyle(user.avatar_style || 'adventurer');
        } else {
            // Initial fetch if user not in store properly
            api.get('/api/users/me').then(res => {
                const u = res.data;
                setName(u.username);
                setBio(u.bio);
                setAvatarStyle(u.avatar_style);
            }).catch(console.error);
        }
    }, [user]);

    const handleSave = async () => {
        setSaving(true);
        setMessage(null);
        try {
            await api.put('/api/users/me', { bio, avatar_style: avatarStyle });
            await fetchUser(); // Update store
            setMessage({ type: 'success', text: 'Profile updated successfully!' });
        } catch (error) {
            setMessage({ type: 'error', text: 'Failed to update profile.' });
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="p-8 max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold mb-8 text-white">Profile Settings</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Avatar Section */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-slate-800 p-6 rounded-2xl border border-slate-700"
                >
                    <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                        <User className="text-blue-400" /> Avatar Customization
                    </h2>

                    <div className="flex flex-col items-center">
                        <div className="w-48 h-48 bg-slate-700 rounded-full mb-6 overflow-hidden border-4 border-slate-600 shadow-xl relative">
                            <img
                                src={`https://api.dicebear.com/7.x/${avatarStyle}/svg?seed=${name}`}
                                alt="Avatar Preview"
                                className="w-full h-full object-cover"
                            />
                        </div>

                        <div className="w-full">
                            <label className="block text-sm font-medium text-slate-400 mb-3">Avatar Style</label>
                            <div className="grid grid-cols-3 gap-3">
                                {avatarStyles.map(style => (
                                    <button
                                        key={style}
                                        onClick={() => setAvatarStyle(style)}
                                        className={`p-2 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all
                                            ${avatarStyle === style
                                                ? 'bg-blue-600 text-white shadow-lg ring-2 ring-blue-400 ring-offset-2 ring-offset-slate-800'
                                                : 'bg-slate-700 text-slate-400 hover:bg-slate-600'
                                            }`}
                                    >
                                        {style}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* Details Section */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="space-y-6"
                >
                    <div className="bg-slate-800 p-6 rounded-2xl border border-slate-700">
                        <h2 className="text-xl font-bold mb-6">Personal Details</h2>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-400 mb-2">Username</label>
                                <input
                                    type="text"
                                    value={name}
                                    disabled
                                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-slate-500 cursor-not-allowed"
                                />
                                <p className="text-xs text-slate-500 mt-1">Username cannot be changed.</p>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-400 mb-2">Bio</label>
                                <textarea
                                    value={bio}
                                    onChange={(e) => setBio(e.target.value)}
                                    rows="4"
                                    placeholder="Tell us about yourself..."
                                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                        </div>
                    </div>

                    {message && (
                        <div className={`p-4 rounded-xl flex items-center gap-2 ${message.type === 'success' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                            {message.type === 'success' ? <Check size={20} /> : <RefreshCw size={20} />}
                            {message.text}
                        </div>
                    )}

                    <button
                        onClick={handleSave}
                        disabled={saving}
                        className="w-full py-4 bg-blue-600 hover:bg-blue-700 rounded-xl text-white font-bold text-lg shadow-lg shadow-blue-900/20 transition flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                        {saving ? (
                            <>Saving...</>
                        ) : (
                            <><Save size={20} /> Save Changes</>
                        )}
                    </button>
                </motion.div>
            </div>
        </div>
    );
};

export default ProfileSettings;
