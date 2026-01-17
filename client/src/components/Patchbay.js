import React, { useState } from 'react';
import './Patchbay.css';

const PATCHBAY_CONFIG = {
  'TT-96': { jacks: 96, rows: 12 },
  'TT-48': { jacks: 48, rows: 6 },
  'TT-24': { jacks: 24, rows: 3 },
  'Bantam-96': { jacks: 96, rows: 12 },
  'Bantam-48': { jacks: 48, rows: 6 },
  '1/4-48': { jacks: 48, rows: 6 },
  '1/4-24': { jacks: 24, rows: 3 },
};

function Patchbay({ patchbay, onMouseDown, onDelete, onUpdateLabel, onJackClick, connectingFrom }) {
  const [isEditingLabel, setIsEditingLabel] = useState(false);
  const [labelValue, setLabelValue] = useState(patchbay.label);

  const config = PATCHBAY_CONFIG[patchbay.type] || { jacks: 48, rows: 6 };
  const jacksPerRow = 8;

  const handleLabelSubmit = () => {
    onUpdateLabel(labelValue);
    setIsEditingLabel(false);
  };

  const handleJackClick = (e, jackIndex) => {
    e.stopPropagation();
    onJackClick(jackIndex);
  };

  const isJackConnected = (jackIndex) => {
    return connectingFrom && 
           connectingFrom.patchbayId === patchbay.id && 
           connectingFrom.jackIndex === jackIndex;
  };

  return (
    <div
      className="patchbay"
      style={{
        left: `${patchbay.position_x}px`,
        top: `${patchbay.position_y}px`,
      }}
    >
      <div className="patchbay-header" onMouseDown={onMouseDown}>
        {isEditingLabel ? (
          <input
            type="text"
            value={labelValue}
            onChange={(e) => setLabelValue(e.target.value)}
            onBlur={handleLabelSubmit}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleLabelSubmit();
              if (e.key === 'Escape') {
                setLabelValue(patchbay.label);
                setIsEditingLabel(false);
              }
            }}
            onClick={(e) => e.stopPropagation()}
            autoFocus
            className="patchbay-label-input"
          />
        ) : (
          <h3 
            className="patchbay-label" 
            onDoubleClick={(e) => {
              e.stopPropagation();
              setIsEditingLabel(true);
            }}
          >
            {patchbay.label}
          </h3>
        )}
        <button
          className="delete-btn"
          onClick={(e) => {
            e.stopPropagation();
            onDelete();
          }}
        >
          ×
        </button>
      </div>

      <div className="patchbay-body">
        <div className="jack-grid">
          {Array.from({ length: config.jacks }, (_, i) => (
            <div
              key={i}
              className={`jack ${isJackConnected(i) ? 'connecting' : ''}`}
              onClick={(e) => handleJackClick(e, i)}
              title={`Jack ${i + 1}`}
            />
          ))}
        </div>
      </div>

      <div className="patchbay-footer">
        <span className="patchbay-type">{patchbay.type}</span>
      </div>
    </div>
  );
}

export default Patchbay;
