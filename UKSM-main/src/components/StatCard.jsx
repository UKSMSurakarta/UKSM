import React from 'react';

const StatCard = ({ title, value, icon, color, subtitle }) => {
    return (
        <div className="card border-0 shadow-sm h-100">
            <div className="card-body">
                <div className="d-flex align-items-center mb-2">
                    <div className={`rounded-circle bg-${color} bg-opacity-10 p-3 me-3`}>
                        <i className={`bi bi-${icon} text-${color} fs-4`}></i>
                    </div>
                    <div>
                        <h6 className="text-muted mb-1 small fw-bold">{title}</h6>
                        <h3 className="fw-bold mb-0">{value}</h3>
                    </div>
                </div>
                {subtitle && <p className="text-muted small mb-0 mt-2">{subtitle}</p>}
            </div>
        </div>
    );
};

export default StatCard;
