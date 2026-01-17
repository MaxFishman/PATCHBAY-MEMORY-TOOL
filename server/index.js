const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Initialize SQLite database
const db = new sqlite3.Database('./patchbay.db', (err) => {
  if (err) {
    console.error('Error opening database:', err);
  } else {
    console.log('Connected to SQLite database');
    initializeDatabase();
  }
});

// Create tables if they don't exist
function initializeDatabase() {
  db.run(`
    CREATE TABLE IF NOT EXISTS layouts (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS patchbays (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      layout_id INTEGER,
      type TEXT NOT NULL,
      position_x INTEGER,
      position_y INTEGER,
      label TEXT,
      FOREIGN KEY (layout_id) REFERENCES layouts(id) ON DELETE CASCADE
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS connections (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      layout_id INTEGER,
      from_patchbay_id INTEGER,
      from_jack INTEGER,
      to_patchbay_id INTEGER,
      to_jack INTEGER,
      cable_color TEXT DEFAULT '#FF0000',
      FOREIGN KEY (layout_id) REFERENCES layouts(id) ON DELETE CASCADE,
      FOREIGN KEY (from_patchbay_id) REFERENCES patchbays(id) ON DELETE CASCADE,
      FOREIGN KEY (to_patchbay_id) REFERENCES patchbays(id) ON DELETE CASCADE
    )
  `);
}

// API Routes

// Get all layouts
app.get('/api/layouts', (req, res) => {
  db.all('SELECT * FROM layouts ORDER BY updated_at DESC', [], (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(rows);
  });
});

// Get a specific layout with all its patchbays and connections
app.get('/api/layouts/:id', (req, res) => {
  const layoutId = req.params.id;
  
  db.get('SELECT * FROM layouts WHERE id = ?', [layoutId], (err, layout) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    if (!layout) {
      res.status(404).json({ error: 'Layout not found' });
      return;
    }

    db.all('SELECT * FROM patchbays WHERE layout_id = ?', [layoutId], (err, patchbays) => {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }

      db.all('SELECT * FROM connections WHERE layout_id = ?', [layoutId], (err, connections) => {
        if (err) {
          res.status(500).json({ error: err.message });
          return;
        }

        res.json({
          ...layout,
          patchbays,
          connections
        });
      });
    });
  });
});

// Create a new layout
app.post('/api/layouts', (req, res) => {
  const { title, patchbays, connections } = req.body;
  
  db.run('INSERT INTO layouts (title) VALUES (?)', [title], function(err) {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }

    const layoutId = this.lastID;

    // Insert patchbays
    const patchbayPromises = (patchbays || []).map((patchbay) => {
      return new Promise((resolve, reject) => {
        db.run(
          'INSERT INTO patchbays (layout_id, type, position_x, position_y, label) VALUES (?, ?, ?, ?, ?)',
          [layoutId, patchbay.type, patchbay.position_x, patchbay.position_y, patchbay.label],
          function(err) {
            if (err) reject(err);
            else resolve({ ...patchbay, id: this.lastID });
          }
        );
      });
    });

    Promise.all(patchbayPromises)
      .then((insertedPatchbays) => {
        // Insert connections
        const connectionPromises = (connections || []).map((conn) => {
          return new Promise((resolve, reject) => {
            db.run(
              'INSERT INTO connections (layout_id, from_patchbay_id, from_jack, to_patchbay_id, to_jack, cable_color) VALUES (?, ?, ?, ?, ?, ?)',
              [layoutId, conn.from_patchbay_id, conn.from_jack, conn.to_patchbay_id, conn.to_jack, conn.cable_color],
              function(err) {
                if (err) reject(err);
                else resolve({ ...conn, id: this.lastID });
              }
            );
          });
        });

        return Promise.all(connectionPromises);
      })
      .then(() => {
        res.json({ id: layoutId, title, message: 'Layout created successfully' });
      })
      .catch((err) => {
        res.status(500).json({ error: err.message });
      });
  });
});

// Update a layout
app.put('/api/layouts/:id', (req, res) => {
  const layoutId = req.params.id;
  const { title, patchbays, connections } = req.body;

  // Update layout title and timestamp
  db.run(
    'UPDATE layouts SET title = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
    [title, layoutId],
    (err) => {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }

      // Delete existing patchbays and connections
      db.run('DELETE FROM patchbays WHERE layout_id = ?', [layoutId], (err) => {
        if (err) {
          res.status(500).json({ error: err.message });
          return;
        }

        db.run('DELETE FROM connections WHERE layout_id = ?', [layoutId], (err) => {
          if (err) {
            res.status(500).json({ error: err.message });
            return;
          }

          // Insert new patchbays
          const patchbayPromises = (patchbays || []).map((patchbay) => {
            return new Promise((resolve, reject) => {
              db.run(
                'INSERT INTO patchbays (layout_id, type, position_x, position_y, label) VALUES (?, ?, ?, ?, ?)',
                [layoutId, patchbay.type, patchbay.position_x, patchbay.position_y, patchbay.label],
                function(err) {
                  if (err) reject(err);
                  else resolve({ ...patchbay, id: this.lastID });
                }
              );
            });
          });

          Promise.all(patchbayPromises)
            .then((insertedPatchbays) => {
              // Insert new connections
              const connectionPromises = (connections || []).map((conn) => {
                return new Promise((resolve, reject) => {
                  db.run(
                    'INSERT INTO connections (layout_id, from_patchbay_id, from_jack, to_patchbay_id, to_jack, cable_color) VALUES (?, ?, ?, ?, ?, ?)',
                    [layoutId, conn.from_patchbay_id, conn.from_jack, conn.to_patchbay_id, conn.to_jack, conn.cable_color],
                    function(err) {
                      if (err) reject(err);
                      else resolve({ ...conn, id: this.lastID });
                    }
                  );
                });
              });

              return Promise.all(connectionPromises);
            })
            .then(() => {
              res.json({ id: layoutId, title, message: 'Layout updated successfully' });
            })
            .catch((err) => {
              res.status(500).json({ error: err.message });
            });
        });
      });
    }
  );
});

// Delete a layout
app.delete('/api/layouts/:id', (req, res) => {
  const layoutId = req.params.id;

  db.run('DELETE FROM layouts WHERE id = ?', [layoutId], function(err) {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({ message: 'Layout deleted successfully' });
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

// Graceful shutdown
process.on('SIGINT', () => {
  db.close((err) => {
    if (err) {
      console.error(err.message);
    }
    console.log('Database connection closed');
    process.exit(0);
  });
});
