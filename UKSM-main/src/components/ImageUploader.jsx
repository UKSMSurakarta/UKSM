import React, { useState } from 'react';

const ImageUploader = ({ onImageSelect, initialImage, label = "Thumbnail Konten" }) => {
    const [preview, setPreview] = useState(initialImage || null);

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setPreview(URL.createObjectURL(file));
            onImageSelect(file);
        }
    };

    const removeImage = () => {
        setPreview(null);
        onImageSelect(null);
    };

    return (
        <div className="image-uploader">
            <label className="form-label fw-bold small text-uppercase text-muted">{label}</label>
            <div 
                className="border-2 border-dashed rounded-3 p-4 text-center position-relative hover-bg-light transition-all"
                style={{ borderStyle: 'dashed', borderColor: '#dee2e6', cursor: 'pointer' }}
                onClick={() => !preview && document.getElementById('fileInput').click()}
            >
                {preview ? (
                    <div className="position-relative d-inline-block">
                        <img src={preview} alt="Preview" className="img-fluid rounded shadow-sm" style={{ maxHeight: '200px' }} />
                        <button 
                            type="button" 
                            className="btn btn-danger btn-sm position-absolute top-0 end-0 translate-middle rounded-circle shadow"
                            onClick={(e) => { e.stopPropagation(); removeImage(); }}
                        >
                            <i className="bi bi-x"></i>
                        </button>
                    </div>
                ) : (
                    <div className="py-3">
                        <i className="bi bi-image text-muted display-4"></i>
                        <p className="mb-0 mt-2 text-muted small">Klik untuk unggah atau drag & drop</p>
                        <p className="extra-small text-muted opacity-50">JPG, PNG (Maks 500Kb)</p>
                    </div>
                )}
                <input 
                    type="file" 
                    id="fileInput" 
                    className="d-none" 
                    accept="image/*" 
                    onChange={handleFileChange} 
                />
            </div>
            
            <style>{`
                .extra-small { font-size: 0.75rem; }
                .hover-bg-light:hover { background-color: #f8f9fa; border-color: #0d6efd !important; }
                .transition-all { transition: all 0.2s ease-in-out; }
            `}</style>
        </div>
    );
};

export default ImageUploader;
