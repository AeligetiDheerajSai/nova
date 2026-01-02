import React, { useState, useEffect } from 'react';
import { RefreshCw, Play, Code } from 'lucide-react';

const WebDevLab = () => {
    const [html, setHtml] = useState('<h1>Hello World</h1>\n<p>Welcome to your first web page!</p>\n<button class="btn">Click me</button>');
    const [css, setCss] = useState('body {\n  font-family: sans-serif;\n  background: #f0f9ff;\n  display: flex;\n  flex-direction: column;\n  align-items: center;\n  justify-content: center;\n  height: 100vh;\n}\n\nh1 {\n  color: #2563eb;\n}\n\n.btn {\n  background: #2563eb;\n  color: white;\n  border: none;\n  padding: 10px 20px;\n  border-radius: 5px;\n  cursor: pointer;\n  margin-top: 20px;\n}\n\n.btn:hover {\n  background: #1d4ed8;\n}');
    const [srcDoc, setSrcDoc] = useState('');

    useEffect(() => {
        const timeout = setTimeout(() => {
            setSrcDoc(`
                <html>
                <style>${css}</style>
                <body>${html}</body>
                </html>
            `);
        }, 500); // Debounce updates

        return () => clearTimeout(timeout);
    }, [html, css]);

    return (
        <div className="h-screen flex flex-col bg-slate-900 text-white overflow-hidden">
            {/* Header */}
            <div className="p-4 bg-slate-800 border-b border-slate-700 flex justify-between items-center h-16">
                <div className="flex items-center gap-2">
                    <Code className="text-blue-500" />
                    <h1 className="font-bold">Web Dev Playground</h1>
                </div>
                <div className="flex gap-2 text-sm text-slate-400">
                    <span className="flex items-center gap-1"><Play size={14} className="text-green-500" /> Auto-Run Enabled</span>
                </div>
            </div>

            {/* Main Layout */}
            <div className="flex-1 flex flex-col md:flex-row h-[calc(100vh-4rem)]">
                {/* Editors */}
                <div className="w-full md:w-1/2 flex flex-col border-r border-slate-700">
                    {/* HTML Editor */}
                    <div className="flex-1 flex flex-col min-h-0 border-b border-slate-700">
                        <div className="bg-slate-950 px-4 py-2 text-xs font-bold text-orange-400 border-b border-slate-800">HTML</div>
                        <textarea
                            value={html}
                            onChange={(e) => setHtml(e.target.value)}
                            className="flex-1 bg-slate-900 p-4 font-mono text-sm resize-none focus:outline-none text-slate-300 leading-relaxed"
                            spellCheck="false"
                        />
                    </div>
                    {/* CSS Editor */}
                    <div className="flex-1 flex flex-col min-h-0">
                        <div className="bg-slate-950 px-4 py-2 text-xs font-bold text-blue-400 border-b border-slate-800">CSS</div>
                        <textarea
                            value={css}
                            onChange={(e) => setCss(e.target.value)}
                            className="flex-1 bg-slate-900 p-4 font-mono text-sm resize-none focus:outline-none text-slate-300 leading-relaxed"
                            spellCheck="false"
                        />
                    </div>
                </div>

                {/* Preview */}
                <div className="w-full md:w-1/2 bg-white flex flex-col">
                    <div className="bg-slate-100 border-b border-slate-200 px-4 py-2 text-xs font-bold text-slate-500 flex justify-between items-center">
                        PREVIEW
                        <RefreshCw size={12} className="text-slate-400" />
                    </div>
                    <iframe
                        srcDoc={srcDoc}
                        title="output"
                        sandbox="allow-scripts"
                        frameBorder="0"
                        className="flex-1 w-full h-full bg-white"
                    />
                </div>
            </div>
        </div>
    );
};

export default WebDevLab;
