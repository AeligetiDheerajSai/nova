import React from 'react';
import { TriangleAlert } from 'lucide-react';

class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null, errorInfo: null };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true, error };
    }

    componentDidCatch(error, errorInfo) {
        console.error("Uncaught error:", error, errorInfo);
        this.setState({ error, errorInfo });
    }

    render() {
        if (this.state.hasError) {
            return (
                <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-8 text-center text-white">
                    <div className="bg-red-500/10 p-6 rounded-2xl border border-red-500/20 max-w-2xl w-full">
                        <div className="flex justify-center mb-6">
                            <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center">
                                <TriangleAlert className="w-8 h-8 text-red-500" />
                            </div>
                        </div>
                        <h1 className="text-3xl font-bold mb-4">Critical System Failure</h1>
                        <p className="text-slate-400 mb-6">
                            The application encountered an unexpected error and could not render.
                        </p>

                        <div className="bg-black/50 p-4 rounded-lg text-left overflow-auto max-h-60 mb-6 font-mono text-xs text-red-400 border border-red-500/10">
                            <strong>{this.state.error && this.state.error.toString()}</strong>
                            <br />
                            <br />
                            {this.state.errorInfo && this.state.errorInfo.componentStack}
                        </div>

                        <button
                            onClick={() => window.location.reload()}
                            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-lg transition-colors"
                        >
                            Reboot System
                        </button>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
