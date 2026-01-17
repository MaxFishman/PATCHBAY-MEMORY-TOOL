import React, { useState, useEffect } from 'react';
import './App.css';
import PatchbayCanvas from './components/PatchbayCanvas';
import LayoutManager from './components/LayoutManager';
import PatchbaySelector from './components/PatchbaySelector';
import axios from 'axios';

function App() {
  const [layouts, setLayouts] = useState([]);
  const [currentLayout, setCurrentLayout] = useState(null);
  const [patchbays, setPatchbays] = useState([]);
  const [connections, setConnections] = useState([]);
  const [layoutTitle, setLayoutTitle] = useState('Untitled Layout');

  // Fetch all layouts on mount
  useEffect(() => {
    fetchLayouts();
  }, []);

  const fetchLayouts = async () => {
    try {
      const response = await axios.get('/api/layouts');
      setLayouts(response.data);
    } catch (error) {
      console.error('Error fetching layouts:', error);
    }
  };

  const loadLayout = async (layoutId) => {
    try {
      const response = await axios.get(`/api/layouts/${layoutId}`);
      const layout = response.data;
      setCurrentLayout(layout.id);
      setLayoutTitle(layout.title);
      setPatchbays(layout.patchbays || []);
      setConnections(layout.connections || []);
    } catch (error) {
      console.error('Error loading layout:', error);
    }
  };

  const saveLayout = async () => {
    try {
      const layoutData = {
        title: layoutTitle,
        patchbays: patchbays.map(pb => ({
          type: pb.type,
          position_x: pb.position_x,
          position_y: pb.position_y,
          label: pb.label
        })),
        connections: connections.map(conn => ({
          from_patchbay_id: conn.from_patchbay_id,
          from_jack: conn.from_jack,
          to_patchbay_id: conn.to_patchbay_id,
          to_jack: conn.to_jack,
          cable_color: conn.cable_color
        }))
      };

      if (currentLayout) {
        await axios.put(`/api/layouts/${currentLayout}`, layoutData);
        alert('Layout updated successfully!');
      } else {
        const response = await axios.post('/api/layouts', layoutData);
        setCurrentLayout(response.data.id);
        alert('Layout saved successfully!');
      }
      fetchLayouts();
    } catch (error) {
      console.error('Error saving layout:', error);
      alert('Error saving layout');
    }
  };

  const deleteLayout = async (layoutId) => {
    if (window.confirm('Are you sure you want to delete this layout?')) {
      try {
        await axios.delete(`/api/layouts/${layoutId}`);
        if (currentLayout === layoutId) {
          newLayout();
        }
        fetchLayouts();
      } catch (error) {
        console.error('Error deleting layout:', error);
      }
    }
  };

  const newLayout = () => {
    setCurrentLayout(null);
    setLayoutTitle('Untitled Layout');
    setPatchbays([]);
    setConnections([]);
  };

  const addPatchbay = (type) => {
    const newPatchbay = {
      id: Date.now(), // Temporary ID for frontend
      type,
      position_x: 100 + patchbays.length * 50,
      position_y: 100 + patchbays.length * 30,
      label: `${type} ${patchbays.length + 1}`
    };
    setPatchbays([...patchbays, newPatchbay]);
  };

  const updatePatchbay = (id, updates) => {
    setPatchbays(patchbays.map(pb => pb.id === id ? { ...pb, ...updates } : pb));
  };

  const deletePatchbay = (id) => {
    setPatchbays(patchbays.filter(pb => pb.id !== id));
    setConnections(connections.filter(conn => 
      conn.from_patchbay_id !== id && conn.to_patchbay_id !== id
    ));
  };

  const addConnection = (connection) => {
    setConnections([...connections, { ...connection, id: Date.now() }]);
  };

  const deleteConnection = (id) => {
    setConnections(connections.filter(conn => conn.id !== id));
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>🔌 Patchbay Memory Tool</h1>
        <div className="header-controls">
          <input
            type="text"
            value={layoutTitle}
            onChange={(e) => setLayoutTitle(e.target.value)}
            className="layout-title-input"
            placeholder="Layout Title"
          />
          <button onClick={newLayout} className="btn btn-secondary">New</button>
          <button onClick={saveLayout} className="btn btn-primary">Save</button>
        </div>
      </header>

      <div className="main-container">
        <aside className="sidebar">
          <PatchbaySelector onAddPatchbay={addPatchbay} />
          <LayoutManager
            layouts={layouts}
            onLoadLayout={loadLayout}
            onDeleteLayout={deleteLayout}
            currentLayoutId={currentLayout}
          />
        </aside>

        <main className="canvas-area">
          <PatchbayCanvas
            patchbays={patchbays}
            connections={connections}
            onUpdatePatchbay={updatePatchbay}
            onDeletePatchbay={deletePatchbay}
            onAddConnection={addConnection}
            onDeleteConnection={deleteConnection}
          />
        </main>
      </div>
    </div>
  );
}

export default App;
