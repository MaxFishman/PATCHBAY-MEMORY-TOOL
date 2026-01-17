import React from 'react';
import './PatchbaySelector.css';

const PATCHBAY_TYPES = [
  { id: 'TT-96', name: 'TT 96-Point', jacks: 96 },
  { id: 'TT-48', name: 'TT 48-Point', jacks: 48 },
  { id: 'TT-24', name: 'TT 24-Point', jacks: 24 },
  { id: 'Bantam-96', name: 'Bantam 96-Point', jacks: 96 },
  { id: 'Bantam-48', name: 'Bantam 48-Point', jacks: 48 },
  { id: '1/4-48', name: '1/4" 48-Point', jacks: 48 },
  { id: '1/4-24', name: '1/4" 24-Point', jacks: 24 },
];

function PatchbaySelector({ onAddPatchbay }) {
  return (
    <div className="patchbay-selector">
      <h2>Add Patchbay</h2>
      <div className="patchbay-types">
        {PATCHBAY_TYPES.map((type) => (
          <button
            key={type.id}
            onClick={() => onAddPatchbay(type.id)}
            className="patchbay-type-btn"
            title={`${type.name} (${type.jacks} jacks)`}
          >
            {type.name}
          </button>
        ))}
      </div>
    </div>
  );
}

export default PatchbaySelector;
