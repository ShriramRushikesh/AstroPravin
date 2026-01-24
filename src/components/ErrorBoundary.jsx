import React from 'react';

class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null, errorInfo: null };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true };
    }

    componentDidCatch(error, errorInfo) {
        console.error("Uncaught error:", error, errorInfo);
        this.setState({ error, errorInfo });
    }

    render() {
        if (this.state.hasError) {
            return (
                <div className="min-h-screen flex flex-col items-center justify-center bg-black text-white p-6 text-center">
                    <h1 className="text-3xl text-primary mb-4">Something went wrong.</h1>
                    <p className="text-white/60 mb-8 max-w-md">
                        We encountered an unexpected error. Please try refreshing the page or navigating back to home.
                    </p>
                    <button
                        onClick={() => window.location.href = '/'}
                        className="px-6 py-3 bg-white/10 border border-white/20 rounded-full hover:bg-secondary hover:text-black transition-all"
                    >
                        Go to Home
                    </button>
                    <details className="mt-8 text-left bg-white/5 p-4 rounded text-xs text-red-400 w-full max-w-2xl overflow-auto">
                        <summary>Error Details</summary>
                        <pre className="mt-2">{this.state.error && this.state.error.toString()}</pre>
                    </details>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
