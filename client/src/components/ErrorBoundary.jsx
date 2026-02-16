import React from 'react';

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
                <div className="min-h-screen flex items-center justify-center bg-red-50 p-10 font-mono">
                    <div className="max-w-4xl bg-white p-8 rounded-2xl shadow-xl border border-red-100 overflow-auto">
                        <h1 className="text-2xl font-bold text-red-600 mb-4">Application Crash</h1>
                        <p className="text-slate-600 mb-4 font-bold">{this.state.error?.toString()}</p>
                        <details className="whitespace-pre-wrap text-xs text-slate-500 bg-slate-50 p-4 rounded-lg">
                            {this.state.errorInfo?.componentStack}
                        </details>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
