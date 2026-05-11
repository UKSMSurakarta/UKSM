import React from 'react';

export const CardSkeleton = () => (
    <div className="card" aria-hidden="true">
        <div className="card-body">
            <h5 className="card-title placeholder-glow">
                <span className="placeholder col-6"></span>
            </h5>
            <p className="card-text placeholder-glow">
                <span className="placeholder col-7"></span>
                <span className="placeholder col-4"></span>
                <span className="placeholder col-4"></span>
                <span className="placeholder col-6"></span>
                <span className="placeholder col-8"></span>
            </p>
            <a href="#" tabIndex="-1" className="btn btn-primary disabled placeholder col-6"></a>
        </div>
    </div>
);

export const TableSkeleton = ({ rows = 5, cols = 4 }) => (
    <div className="table-responsive">
        <table className="table table-hover align-middle">
            <thead>
                <tr>
                    {Array.from({ length: cols }).map((_, i) => (
                        <th key={i}>
                            <span className="placeholder col-8"></span>
                        </th>
                    ))}
                </tr>
            </thead>
            <tbody className="placeholder-glow">
                {Array.from({ length: rows }).map((_, rowIndex) => (
                    <tr key={rowIndex}>
                        {Array.from({ length: cols }).map((_, colIndex) => (
                            <td key={colIndex}>
                                <span className={`placeholder col-${Math.floor(Math.random() * 6) + 4}`}></span>
                            </td>
                        ))}
                    </tr>
                ))}
            </tbody>
        </table>
    </div>
);

const LoadingSkeleton = {
    Card: CardSkeleton,
    Table: TableSkeleton
};

export default LoadingSkeleton;
