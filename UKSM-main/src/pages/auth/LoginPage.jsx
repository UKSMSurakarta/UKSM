import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { toast } from 'react-toastify';

const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    
    const { login, isAuthenticated, user } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    // Redirect if already authenticated
    useEffect(() => {
        if (isAuthenticated && user) {
            const from = location.state?.from?.pathname || `/${user.role}/dashboard`;
            navigate(from, { replace: true });
        }
    }, [isAuthenticated, user, navigate, location]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!email || !password) {
            toast.error('Silakan isi email dan password Anda.');
            return;
        }

        setIsSubmitting(true);
        try {
            const result = await login(email, password);
            if (result.success) {
                toast.success('Login berhasil!');
                navigate(`/${result.role}/dashboard`, { replace: true });
            } else {
                toast.error(result.message);
            }
        } catch (error) {
            toast.error('Terjadi kesalahan sistem. Silakan coba lagi nanti.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="bg-light min-vh-100 d-flex align-items-center">
            <div className="container">
                <div className="row justify-content-center">
                    <div className="col-md-5 col-lg-4">
                        <div className="text-center mb-4">
                            <h2 className="fw-bold text-primary">Web UKS</h2>
                            <p className="text-muted">Usaha Kesehatan Sekolah - Sistem Assessment</p>
                        </div>
                        
                        <div className="card border-0 shadow-sm p-4">
                            <div className="card-body">
                                <h4 className="card-title mb-4 fw-bold">Login</h4>
                                
                                <form onSubmit={handleSubmit}>
                                    <div className="mb-3">
                                        <label className="form-label text-secondary small fw-bold">Email Address</label>
                                        <input 
                                            type="email" 
                                            className="form-control form-control-lg border-2" 
                                            placeholder="nama@email.com"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            disabled={isSubmitting}
                                        />
                                    </div>
                                    
                                    <div className="mb-4">
                                        <label className="form-label text-secondary small fw-bold">Password</label>
                                        <div className="input-group">
                                            <input 
                                                type={showPassword ? "text" : "password"} 
                                                className="form-control form-control-lg border-2 border-end-0" 
                                                placeholder="••••••••"
                                                value={password}
                                                onChange={(e) => setPassword(e.target.value)}
                                                disabled={isSubmitting}
                                            />
                                            <button 
                                                className="btn btn-outline-secondary border-2 border-start-0" 
                                                type="button"
                                                onClick={() => setShowPassword(!showPassword)}
                                            >
                                                <i className={`bi bi-${showPassword ? 'eye-slash' : 'eye'}`}></i>
                                                {showPassword ? 'Hide' : 'Show'}
                                            </button>
                                        </div>
                                    </div>
                                    
                                    <button 
                                        type="submit" 
                                        className="btn btn-primary btn-lg w-100 fw-bold shadow-sm"
                                        disabled={isSubmitting}
                                    >
                                        {isSubmitting ? (
                                            <>
                                                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                                Logging in...
                                            </>
                                        ) : 'Login'}
                                    </button>
                                </form>
                            </div>
                        </div>
                        
                        <div className="text-center mt-4 text-muted small">
                            &copy; 2026 Web UKS. All rights reserved.
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
