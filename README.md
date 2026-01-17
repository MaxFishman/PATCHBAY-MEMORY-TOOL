# 🔌 Patchbay Memory Tool

A visual patchbay layout interface for audio engineers to design, manage, and save their studio patchbay configurations with interactive patch cable connections.

## Features

- **Multiple Patchbay Types**: Support for various patchbay formats including:
  - TT (Tiny Telephone) - 96, 48, and 24-point
  - Bantam - 96 and 48-point
  - 1/4" - 48 and 24-point

- **Visual Interface**: 
  - Drag-and-drop patchbays to position them on the canvas
  - Click jacks to create visual patch cable connections
  - Color-coded cables showing signal flow
  - Realistic cable rendering with bezier curves

- **Layout Management**:
  - Save multiple layouts with custom titles
  - Load and edit existing layouts
  - Delete outdated configurations
  - SQLite database storage

- **Interactive Controls**:
  - Double-click patchbay labels to rename
  - Click cables to remove connections
  - ESC key to cancel connection in progress
  - Visual feedback for all interactions

## Installation

### Prerequisites
- Node.js (v14 or higher)
- npm

### Setup

1. Install root dependencies:
```bash
npm install
```

2. Install client dependencies:
```bash
cd client
npm install
cd ..
```

Or use the convenience script:
```bash
npm run install-all
```

## Running the Application

### Development Mode (Recommended)

Run both server and client concurrently:
```bash
npm run dev
```

This will start:
- Backend server on http://localhost:5000
- React frontend on http://localhost:3000

### Run Separately

**Backend only:**
```bash
npm run server
```

**Frontend only:**
```bash
npm run client
```

## Deployment

See [DEPLOYMENT.md](DEPLOYMENT.md) for detailed instructions on deploying to:
- **Frontend:** GitHub Pages (free)
- **Backend:** Render.com (free tier)

Quick deploy:
```bash
cd client
npm run deploy
```

## Usage

1. **Add Patchbays**: Click on patchbay types in the left sidebar to add them to your layout

2. **Position Patchbays**: Drag patchbays around the canvas to arrange your layout

3. **Rename Patchbays**: Double-click on a patchbay label to edit its name

4. **Create Connections**: 
   - Click on a jack (the small circles on each patchbay)
   - Click on another jack on a different patchbay to create a connection
   - Press ESC to cancel

5. **Delete Connections**: Click on any cable to remove it

6. **Save Layout**: 
   - Enter a title in the header
   - Click the "Save" button

7. **Load Layout**: Click on any saved layout in the left sidebar

8. **New Layout**: Click "New" to start a fresh layout

## Technology Stack

### Backend
- Node.js
- Express.js
- SQLite3
- CORS & Body Parser

### Frontend
- React 18
- Axios for API calls
- SVG for cable rendering
- CSS3 for styling

## Database Schema

### Tables

**layouts**
- id (PRIMARY KEY)
- title (TEXT)
- created_at (DATETIME)
- updated_at (DATETIME)

**patchbays**
- id (PRIMARY KEY)
- layout_id (FOREIGN KEY)
- type (TEXT)
- position_x (INTEGER)
- position_y (INTEGER)
- label (TEXT)

**connections**
- id (PRIMARY KEY)
- layout_id (FOREIGN KEY)
- from_patchbay_id (FOREIGN KEY)
- from_jack (INTEGER)
- to_patchbay_id (FOREIGN KEY)
- to_jack (INTEGER)
- cable_color (TEXT)

## API Endpoints

- `GET /api/layouts` - Get all layouts
- `GET /api/layouts/:id` - Get specific layout with details
- `POST /api/layouts` - Create new layout
- `PUT /api/layouts/:id` - Update existing layout
- `DELETE /api/layouts/:id` - Delete layout

## Project Structure

```
PATCHBAY-MEMORY-TOOL/
├── client/                 # React frontend
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   │   ├── PatchbayCanvas.js    # Main canvas component
│   │   │   ├── Patchbay.js          # Individual patchbay
│   │   │   ├── PatchCable.js        # Cable rendering
│   │   │   ├── PatchbaySelector.js  # Add patchbay controls
│   │   │   └── LayoutManager.js     # Load/save layouts
│   │   ├── App.js
│   │   ├── App.css
│   │   ├── index.js
│   │   └── index.css
│   └── package.json
├── server/
│   └── index.js           # Express server & API
├── package.json
└── README.md
```

## Future Enhancements

- Export layouts as PDF/images
- Collaborative editing
- Custom patchbay configurations
- Label templates for common setups
- Undo/redo functionality
- Zoom and pan controls
- Dark/light theme toggle

## License

MIT

## Author

Built for audio engineers who need to remember their complex studio routing configurations.