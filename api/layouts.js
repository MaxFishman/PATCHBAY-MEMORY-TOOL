const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = '/tmp/patchbay.db';

const getDb = () => {
  return new sqlite3.Database(dbPath);
};

const db = getDb();

// Initialize tables
db.serialize(() => {
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
});

module.exports = (req, res) => {
  // CORS headers
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  const url = req.url;
  const method = req.method;

  if (url === '/api/layouts' && method === 'GET') {
    db.all('SELECT * FROM layouts ORDER BY updated_at DESC', [], (err, rows) => {
      if (err) {
        res.status(500).json({ error: err.message });
      } else {
        res.status(200).json(rows || []);
      }
    });
    return;
  }

  const layoutMatch = url.match(/^\/api\/layouts\/(\d+)$/);
  if (layoutMatch && method === 'GET') {
    const layoutId = layoutMatch[1];
    db.get('SELECT * FROM layouts WHERE id = ?', [layoutId], (err, layout) => {
      if (err || !layout) {
        res.status(404).json({ error: 'Layout not found' });
        return;
      }
      db.all('SELECT * FROM patchbays WHERE layout_id = ?', [layoutId], (err, patchbays) => {
        db.all('SELECT * FROM connections WHERE layout_id = ?', [layoutId], (err, connections) => {
          res.status(200).json({
            ...layout,
            patchbays: patchbays || [],
            connections: connections || []
          });
        });
      });
    });
    return;
  }

  if (url === '/api/layouts' && method === 'POST') {
    const { title, patchbays, connections } = req.body;
    db.run('INSERT INTO layouts (title) VALUES (?)', [title], function(err) {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      const layoutId = this.lastID;

      let completed = 0;
      const total = (patchbays?.length || 0) + (connections?.length || 0);

      if (total === 0) {
        res.status(200).json({ id: layoutId, title });
        return;
      }

      (patchbays || []).forEach((pb) => {
        db.run(
          'INSERT INTO patchbays (layout_id, type, position_x, position_y, label) VALUES (?, ?, ?, ?, ?)',
          [layoutId, pb.type, pb.position_x, pb.position_y, pb.label],
          () => {
            completed++;
            if (completed === total) {
              res.status(200).json({ id: layoutId, title });
            }
          }
        );
      });

      (connections || []).forEach((conn) => {
        db.run(
          'INSERT INTO connections (layout_id, from_patchbay_id, from_jack, to_patchbay_id, to_jack, cable_color) VALUES (?, ?, ?, ?, ?, ?)',
          [layoutId, conn.from_patchbay_id, conn.from_jack, conn.to_patchbay_id, conn.to_jack, conn.cable_color],
          () => {
            completed++;
            if (completed === total) {
              res.status(200).json({ id: layoutId, title });
            }
          }
        );
      });
    });
    return;
  }

  if (layoutMatch && method === 'PUT') {
    const layoutId = layoutMatch[1];
    const { title, patchbays, connections } = req.body;

    db.run('UPDATE layouts SET title = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?', [title, layoutId], (err) => {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }

      db.run('DELETE FROM patchbays WHERE layout_id = ?', [layoutId], () => {
        db.run('DELETE FROM connections WHERE layout_id = ?', [layoutId], () => {
          let completed = 0;
          const total = (patchbays?.length || 0) + (connections?.length || 0);

          if (total === 0) {
            res.status(200).json({ id: layoutId, title });
            return;
          }

          (patchbays || []).forEach((pb) => {
            db.run(
              'INSERT INTO patchbays (layout_id, type, position_x, position_y, label) VALUES (?, ?, ?, ?, ?)',
              [layoutId, pb.type, pb.position_x, pb.position_y, pb.label],
              () => {
                completed++;
                if (completed === total) {
                  res.status(200).json({ id: layoutId, title });
                }
              }
            );
          });

          (connections || []).forEach((conn) => {
            db.run(
              'INSERT INTO connections (layout_id, from_patchbay_id, from_jack, to_patchbay_id, to_jack, cable_color) VALUES (?, ?, ?, ?, ?, ?)',
              [layoutId, conn.from_patchbay_id, conn.from_jack, conn.to_patchbay_id, conn.to_jack, conn.cable_color],
              () => {
                completed++;
                if (completed === total) {
                  res.status(200).json({ id: layoutId, title });
                }
              }
            );
          });
        });
      });
    });
    return;
  }

  if (layoutMatch && method === 'DELETE') {
    const layoutId = layoutMatch[1];
    db.run('DELETE FROM layouts WHERE id = ?', [layoutId], (err) => {
      if (err) {
        res.status(500).json({ error: err.message });
      } else {
        res.status(200).json({ message: 'Layout deleted' });
      }
    });
    return;
  }

  res.status(404).json({ error: 'Not found' });
};
