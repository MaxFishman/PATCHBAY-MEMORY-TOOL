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

    const jacksPerRow = 8;
    const jackWidth = 20;
    const jackHeight = 20;
    const row = Math.floor(jackIndex / jacksPerRow);
    const col = jackIndex % jacksPerRow;

    return {
      x: patchbay.position_x + 40 + col * jackWidth,
      y: patchbay.position_y + 80 + row * jackHeight,
    };
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
