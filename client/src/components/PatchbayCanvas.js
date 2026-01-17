import React, { useState, useRef, useEffect } from 'react';
import './PatchbayCanvas.css';
import Patchbay from './Patchbay';
import PatchCable from './PatchCable';

function PatchbayCanvas({
  patchbays,
  connections,
  onUpdatePatchbay,
  onDeletePatchbay,
  onAddConnection,
  onDeleteConnection,
}) {
  const canvasRef = useRef(null);
  const [draggingPatchbay, setDraggingPatchbay] = useState(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [connectingFrom, setConnectingFrom] = useState(null);
  const [tempCableEnd, setTempCableEnd] = useState(null);

  const handlePatchbayMouseDown = (e, patchbayId) => {
    const patchbay = patchbays.find(pb => pb.id === patchbayId);
    if (patchbay) {
      const rect = canvasRef.current.getBoundingClientRect();
      setDragOffset({
        x: e.clientX - rect.left - patchbay.position_x,
        y: e.clientY - rect.top - patchbay.position_y,
      });
      setDraggingPatchbay(patchbayId);
    }
  };

  const handleMouseMove = (e) => {
    if (draggingPatchbay) {
      const rect = canvasRef.current.getBoundingClientRect();
      const newX = e.clientX - rect.left - dragOffset.x;
      const newY = e.clientY - rect.top - dragOffset.y;
      
      onUpdatePatchbay(draggingPatchbay, {
        position_x: Math.max(0, Math.min(newX, rect.width - 200)),
        position_y: Math.max(0, Math.min(newY, rect.height - 300)),
      });
    } else if (connectingFrom) {
      const rect = canvasRef.current.getBoundingClientRect();
      setTempCableEnd({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      });
    }
  };

  const handleMouseUp = () => {
    setDraggingPatchbay(null);
    setDragOffset({ x: 0, y: 0 });
  };

  const handleJackClick = (patchbayId, jackIndex) => {
    if (!connectingFrom) {
      // Start connection
      setConnectingFrom({ patchbayId, jackIndex });
      setTempCableEnd(null);
    } else {
      // Complete connection
      if (connectingFrom.patchbayId !== patchbayId) {
        onAddConnection({
          from_patchbay_id: connectingFrom.patchbayId,
          from_jack: connectingFrom.jackIndex,
          to_patchbay_id: patchbayId,
          to_jack: jackIndex,
          cable_color: getRandomCableColor(),
        });
      }
      setConnectingFrom(null);
      setTempCableEnd(null);
    }
  };

  const getRandomCableColor = () => {
    const colors = ['#FF0000', '#00FF00', '#0000FF', '#FFFF00', '#FF00FF', '#00FFFF', '#FFA500', '#800080'];
    return colors[Math.floor(Math.random() * colors.length)];
  };

  const getJackPosition = (patchbayId, jackIndex) => {
    const patchbay = patchbays.find(pb => pb.id === patchbayId);
    if (!patchbay) return { x: 0, y: 0 };

    // Configuration for patchbay types
    const PATCHBAY_CONFIG = {
      'TT-96': { jacks: 96 },
      'TT-48': { jacks: 48 },
      'TT-24': { jacks: 24 },
      'Bantam-96': { jacks: 96 },
      'Bantam-48': { jacks: 48 },
      '1/4-48': { jacks: 48 },
      '1/4-24': { jacks: 24 },
    };

    const config = PATCHBAY_CONFIG[patchbay.type] || { jacks: 48 };
    const totalJacks = config.jacks;
    const jacksPerSection = totalJacks / 2; // Half for inputs, half for outputs
    const jacksPerRow = 8;
    
    // Layout measurements based on actual CSS
    const bodyPadding = 16; // 1rem padding on patchbay-body
    const gridGap = 8; // gap: 8px from jack-grid
    const jackSize = 20; // jack width/height
    const labelHeight = 10; // approximate label height (0.65rem)
    const containerGap = 3; // gap between label and jack
    
    // Calculate grid column width (patchbay min-width is 250px, minus padding and borders)
    const patchbayWidth = 250; // min-width from CSS
    const gridWidth = patchbayWidth - (bodyPadding * 2); // 218px
    const columnWidth = (gridWidth - (gridGap * 7)) / 8; // Divide by 8 columns, subtract 7 gaps
    
    // Starting positions
    const baseX = patchbay.position_x + bodyPadding;
    const headerHeight = 60; // Approximate header height
    const sectionHeaderHeight = 24; // section-header height (font + padding + border)
    const sectionHeaderMargin = 8; // 0.5rem margin-bottom
    
    // Determine if this jack is in the inputs or outputs section
    const isOutput = jackIndex >= jacksPerSection;
    const localIndex = isOutput ? jackIndex - jacksPerSection : jackIndex;
    
    const row = Math.floor(localIndex / jacksPerRow);
    const col = localIndex % jacksPerRow;
    
    // Calculate X position - center of the jack in its grid cell
    const x = baseX + (col * (columnWidth + gridGap)) + (columnWidth / 2);
    
    // Calculate Y position
    let y = patchbay.position_y + headerHeight + bodyPadding + sectionHeaderHeight + sectionHeaderMargin;
    y += labelHeight + containerGap; // Account for label above jack
    
    if (isOutput) {
      // Add inputs section height
      const inputRows = Math.ceil(jacksPerSection / jacksPerRow);
      const sectionMargin = 12; // 0.75rem margin-bottom on patchbay-section
      const dividerHeight = 2;
      const dividerMargin = 12; // 0.75rem margin on divider (top and bottom)
      
      y += inputRows * (labelHeight + containerGap + jackSize + gridGap);
      y += sectionMargin + dividerHeight + dividerMargin;
      y += sectionHeaderHeight + sectionHeaderMargin;
      y += labelHeight + containerGap; // Label for output section
    }
    
    // Add row offset
    y += row * (labelHeight + containerGap + jackSize + gridGap);
    y += jackSize / 2; // Center on jack

    return { x, y };
  };

  const cancelConnection = () => {
    setConnectingFrom(null);
    setTempCableEnd(null);
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        cancelConnection();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div
      ref={canvasRef}
      className="patchbay-canvas"
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
    >
      {/* Draw all connections */}
      <svg className="connection-layer">
        {connections.map((conn) => {
          const fromPos = getJackPosition(conn.from_patchbay_id, conn.from_jack);
          const toPos = getJackPosition(conn.to_patchbay_id, conn.to_jack);
          return (
            <PatchCable
              key={conn.id}
              from={fromPos}
              to={toPos}
              color={conn.cable_color}
              onClick={() => onDeleteConnection(conn.id)}
            />
          );
        })}

        {/* Draw temporary cable while connecting */}
        {connectingFrom && tempCableEnd && (
          <PatchCable
            from={getJackPosition(connectingFrom.patchbayId, connectingFrom.jackIndex)}
            to={tempCableEnd}
            color="#FFFFFF"
            temporary={true}
          />
        )}
      </svg>

      {/* Draw all patchbays */}
      {patchbays.map((patchbay) => (
        <Patchbay
          key={patchbay.id}
          patchbay={patchbay}
          onMouseDown={(e) => handlePatchbayMouseDown(e, patchbay.id)}
          onDelete={() => onDeletePatchbay(patchbay.id)}
          onUpdateLabel={(label) => onUpdatePatchbay(patchbay.id, { label })}
          onJackClick={(jackIndex) => handleJackClick(patchbay.id, jackIndex)}
          connectingFrom={connectingFrom}
        />
      ))}

      {connectingFrom && (
        <div className="connection-hint">
          Click on another jack to connect, or press ESC to cancel
        </div>
      )}
    </div>
  );
}

export default PatchbayCanvas;
