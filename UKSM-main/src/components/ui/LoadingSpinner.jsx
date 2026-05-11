import React from 'react';

/**
 * LoadingSpinner Component
 * @param {string} size - 'sm', 'md', 'lg' (default: 'md')
 * @param {string} text - Optional text to display next to the spinner
 * @param {string} color - Bootstrap text color class (default: 'primary')
 * @param {boolean} fullPage - If true, displays the spinner centered on the full page
 */
const LoadingSpinner = ({ size = 'md', text = '', color = 'primary', fullPage = false }) => {
    const spinnerSize = size === 'sm' ? 'spinner-border-sm' : size === 'lg' ? 'spinner-border-lg' : '';
    
    // Custom style for LG spinner if needed, as Bootstrap only has SM by default
    const lgStyle = size === 'lg' ? { width: '3rem', height: '3rem' } : {};

    const spinnerContent = (
        <div className="d-flex align-items-center justify-content-center gap-2">
            <div 
                className={`spinner-border text-${color} ${spinnerSize}`} 
                role="status"
                style={lgStyle}
            >
                <span className="visually-hidden">Loading...</span>
            </div>
            {text && <span className={`text-${color} fw-medium`}>{text}</span>}
        </div>
    );

    if (fullPage) {
        return (
            <div 
                className="d-flex align-items-center justify-content-center" 
                style={{ minHeight: '60vh', width: '100%' }}
            >
                {spinnerContent}
            </div>
        );
    }

    return spinnerContent;
};

export default LoadingSpinner;
