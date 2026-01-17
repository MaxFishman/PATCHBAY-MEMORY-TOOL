# Quick Start Guide 🚀

## Your Patchbay Memory Tool is Ready!

Both the backend server and React frontend are running:
- **Backend API**: http://localhost:5000
- **Frontend App**: http://localhost:3000 (should open automatically in your browser)

## First Steps

1. **The application is now running** - Check your browser for http://localhost:3000

2. **Add Your First Patchbay**:
   - Look at the left sidebar
   - Click on any patchbay type (e.g., "TT 48-Point")
   - A patchbay will appear on the canvas

3. **Try It Out**:
   - **Drag** patchbays around to position them
   - **Double-click** on a patchbay's name to rename it
   - **Click** on a jack (small circle) to start a connection
   - **Click** on another jack on a different patchbay to complete the connection
   - **Click** on any cable to delete it
   - Press **ESC** to cancel a connection in progress

4. **Save Your Layout**:
   - Enter a name in the "Layout Title" field at the top
   - Click the **Save** button
   - Your layout will appear in the "Saved Layouts" section

5. **Load a Saved Layout**:
   - Click on any saved layout in the left sidebar
   - The entire configuration will load

## Example Workflow

Let's create a simple studio setup:

1. Add a "TT 48-Point" patchbay
2. Add another "TT 48-Point" patchbay
3. Drag them to position them side by side
4. Double-click the first patchbay and name it "Inputs"
5. Double-click the second patchbay and name it "Outputs"
6. Click on jack #1 on the "Inputs" patchbay
7. Click on jack #1 on the "Outputs" patchbay
8. You'll see a colored cable connecting them!
9. Enter "My Studio Setup" as the title
10. Click Save

## Tips

- **Grid Background**: The canvas has a grid to help with alignment
- **Multiple Patchbays**: Add as many as you need for your studio
- **Color-Coded Cables**: Each new connection gets a random color for easy visual tracking
- **Delete Patchbay**: Click the red × button on any patchbay to remove it (and all its connections)
- **Multiple Layouts**: Save different configurations for different sessions or rooms

## Keyboard Shortcuts

- **ESC**: Cancel connection in progress
- **Double-click**: Edit patchbay label

## Patchbay Types Available

- **TT (Tiny Telephone)**: 96, 48, and 24-point
- **Bantam**: 96 and 48-point  
- **1/4 inch**: 48 and 24-point

## Troubleshooting

**App not loading?**
- Check that both servers are running (you should see output in the terminal)
- Frontend: http://localhost:3000
- Backend: http://localhost:5000

**Can't save layouts?**
- Make sure the backend server is running
- Check the browser console for any errors

**Connections not working?**
- Make sure you're clicking on jacks from different patchbays
- You can't connect a patchbay to itself

## Stopping the Application

To stop the development servers:
1. Go to the terminal
2. Press `Ctrl+C`

To restart:
```bash
npm run dev
```

## Next Time

To run the application again in the future:

```bash
cd /workspaces/PATCHBAY-MEMORY-TOOL
npm run dev
```

Enjoy mapping your patchbay configurations! 🎵🔌
