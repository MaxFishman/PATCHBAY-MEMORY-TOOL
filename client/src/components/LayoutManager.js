import React from 'react';
import './LayoutManager.css';

function LayoutManager({ layouts, onLoadLayout, onDeleteLayout, currentLayoutId }) {
  return (
    <div className="layout-manager">
      <h2>Saved Layouts</h2>
      {layouts.length === 0 ? (
        <p className="no-layouts">No saved layouts yet</p>
      ) : (
        <div className="layout-list">
          {layouts.map((layout) => (
            <div
              key={layout.id}
              className={`layout-item ${currentLayoutId === layout.id ? 'active' : ''}`}
            >
              <div
                className="layout-info"
                onClick={() => onLoadLayout(layout.id)}
              >
                <h3>{layout.title}</h3>
                <p className="layout-date">
                  {new Date(layout.updated_at).toLocaleDateString()}
                </p>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onDeleteLayout(layout.id);
                }}
                className="btn btn-danger"
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default LayoutManager;
