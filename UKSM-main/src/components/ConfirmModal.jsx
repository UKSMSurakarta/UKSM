import React from 'react';

const ConfirmModal = ({ show, title, message, onConfirm, onCancel, confirmText = 'Ya, Hapus', confirmVariant = 'danger' }) => {
    if (!show) return null;

    return (
        <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1060 }}>
            <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content border-0 shadow-lg">
                    <div className="modal-header border-0 pb-0">
                        <h5 className="modal-title fw-bold">{title}</h5>
                        <button type="button" className="btn-close" onClick={onCancel}></button>
                    </div>
                    <div className="modal-body py-3">
                        <p className="text-muted mb-0">{message}</p>
                    </div>
                    <div className="modal-footer border-0 pt-0">
                        <button type="button" className="btn btn-light fw-bold px-4" onClick={onCancel}>Batal</button>
                        <button type="button" className={`btn btn-${confirmVariant} fw-bold px-4`} onClick={onConfirm}>
                            {confirmText}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ConfirmModal;
