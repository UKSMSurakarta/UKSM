import React from 'react';

const StatusBadge = ({ published }) => {
    return published ? (
        <span className="badge rounded-pill bg-success-subtle text-success border border-success-subtle px-3">
            <i className="bi bi-check-circle-fill me-1"></i> Published
        </span>
    ) : (
        <span className="badge rounded-pill bg-warning-subtle text-warning border border-warning-subtle px-3">
            <i className="bi bi-pencil-fill me-1"></i> Draft
        </span>
    );
};

export default StatusBadge;
