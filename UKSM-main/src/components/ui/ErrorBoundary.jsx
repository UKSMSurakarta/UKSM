import React from 'react';

class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error) {
        // Update state so the next render will show the fallback UI.
        return { hasError: true, error };
    }

    componentDidCatch(error, errorInfo) {
        // You can also log the error to an error reporting service
        console.error("ErrorBoundary caught an error", error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            // You can render any custom fallback UI
            return (
                <div className="container mt-5">
                    <div className="card border-danger shadow-sm mx-auto" style={{ maxWidth: '600px' }}>
                        <div className="card-body text-center py-5">
                            <div className="mb-4">
                                <i className="bi bi-exclamation-triangle text-danger" style={{ fontSize: '4rem' }}></i>
                            </div>
                            <h3 className="fw-bold mb-3">Waduh, ada kesalahan!</h3>
                            <p className="text-muted mb-4">
                                Aplikasi mengalami kendala yang tidak terduga. Silakan coba muat ulang halaman atau hubungi tim teknis jika masalah berlanjut.
                            </p>
                            <div className="d-flex justify-content-center gap-3">
                                <button 
                                    className="btn btn-outline-secondary px-4"
                                    onClick={() => window.location.reload()}
                                >
                                    Muat Ulang Halaman
                                </button>
                                <button 
                                    className="btn btn-primary px-4"
                                    onClick={() => this.setState({ hasError: false })}
                                >
                                    Coba Lagi
                                </button>
                            </div>
                            {process.env.NODE_ENV === 'development' && (
                                <div className="mt-4 text-start">
                                    <details style={{ whiteSpace: 'pre-wrap' }}>
                                        <summary className="text-danger cursor-pointer">Detail Error (Hanya terlihat di Development)</summary>
                                        <code className="small">{this.state.error?.toString()}</code>
                                    </details>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            );
        }

        return this.props.children; 
    }
}

export default ErrorBoundary;
