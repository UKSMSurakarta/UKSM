import React, { useState } from 'react';

const DataTable = ({ columns, data, loading, onEdit, onDelete, pagination, onPageChange }) => {
    const [search, setSearch] = useState('');

    const filteredData = data.filter(item => 
        Object.values(item).some(val => 
            String(val).toLowerCase().includes(search.toLowerCase())
        )
    );

    return (
        <div className="card border-0 shadow-sm overflow-hidden">
            <div className="card-header bg-white py-3 border-0">
                <div className="row align-items-center">
                    <div className="col">
                        <div className="input-group" style={{ maxWidth: '300px' }}>
                            <span className="input-group-text bg-light border-0"><i className="bi bi-search"></i></span>
                            <input 
                                type="text" 
                                className="form-control bg-light border-0 small" 
                                placeholder="Cari data..." 
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                        </div>
                    </div>
                </div>
            </div>
            <div className="card-body p-0">
                <div className="table-responsive">
                    <table className="table table-hover align-middle mb-0">
                        <thead className="bg-light">
                            <tr className="small text-muted text-uppercase">
                                {columns.map((col, idx) => (
                                    <th key={idx} className="px-4 py-3 border-0" style={{ width: col.width }}>{col.label}</th>
                                ))}
                                <th className="py-3 border-0 text-center" style={{ width: '120px' }}>Aksi</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr>
                                    <td colSpan={columns.length + 1} className="text-center py-5">
                                        <div className="spinner-border text-primary spinner-border-sm me-2"></div>
                                        Memuat data...
                                    </td>
                                </tr>
                            ) : filteredData.length > 0 ? (
                                filteredData.map((item, rowIdx) => (
                                    <tr key={rowIdx}>
                                        {columns.map((col, colIdx) => (
                                            <td key={colIdx} className="px-4 py-3">
                                                {col.render ? col.render(item) : item[col.key]}
                                            </td>
                                        ))}
                                        <td className="text-center">
                                            <div className="btn-group">
                                                <button className="btn btn-sm btn-light border me-1" onClick={() => onEdit(item)} title="Edit">
                                                    <i className="bi bi-pencil-square text-dark"></i>
                                                </button>
                                                <button className="btn btn-sm btn-light border text-danger" onClick={() => onDelete(item)} title="Hapus">
                                                    <i className="bi bi-trash"></i>
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={columns.length + 1} className="text-center py-5 text-muted">Data tidak ditemukan.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
            
            {pagination && pagination.last_page > 1 && (
                <div className="card-footer bg-white border-0 py-3">
                    <nav className="d-flex justify-content-between align-items-center">
                        <small className="text-muted">Halaman {pagination.current_page} dari {pagination.last_page}</small>
                        <ul className="pagination pagination-sm m-0">
                            <li className={`page-item ${pagination.current_page === 1 ? 'disabled' : ''}`}>
                                <button className="page-link" onClick={() => onPageChange(pagination.current_page - 1)}>Sebelumnya</button>
                            </li>
                            <li className="page-item active">
                                <span className="page-link">{pagination.current_page}</span>
                            </li>
                            <li className={`page-item ${pagination.current_page === pagination.last_page ? 'disabled' : ''}`}>
                                <button className="page-link" onClick={() => onPageChange(pagination.current_page + 1)}>Berikutnya</button>
                            </li>
                        </ul>
                    </nav>
                </div>
            )}
        </div>
    );
};

export default DataTable;
