import React from 'react';

/**
 * EmptyState Component
 * @param {string} icon - Bootstrap icon name (without bi- prefix)
 * @param {string} title - Main title text
 * @param {string} message - Subtext/description
 * @param {Object} action - Action object { label: string, onClick: function }
 */
const EmptyState = ({ 
    icon = 'inbox', 
    title = 'Belum ada data', 
    message = 'Data yang Anda cari tidak ditemukan atau belum ditambahkan.',
    action = null 
}) => {
    return (
        <div className="text-center py-5">
            <div className="mb-4">
                <i className={`bi bi-${icon} text-secondary opacity-25`} style={{ fontSize: '5rem' }}></i>
            </div>
            <h4 className="fw-bold text-dark">{title}</h4>
            <p className="text-muted mx-auto mb-4" style={{ maxWidth: '400px' }}>
                {message}
            </p>
            {action && (
                <button 
                    onClick={action.onClick} 
                    className="btn btn-primary px-4 rounded-pill"
                >
                    <i className={`bi bi-${action.icon || 'plus-lg'} me-2`}></i>
                    {action.label}
                </button>
            )}
        </div>
    );
};

export default EmptyState;
