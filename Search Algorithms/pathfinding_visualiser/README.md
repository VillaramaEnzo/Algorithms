# Pathfinding Visualizer

An interactive web application for visualizing various pathfinding and maze generation algorithms. Built with React, TypeScript, and Vite, this tool provides real-time visualization of how different algorithms explore grids and find paths.

## Features

### View Modes

- **Single View**: Run and visualize one algorithm at a time
- **Compare All**: Run all pathfinding algorithms simultaneously to compare their performance
- **Compare Maze Generation**: Compare different maze generation algorithms side-by-side

### Pathfinding Algorithms

- **BFS (Breadth-First Search)**: Explores nodes level by level, guarantees shortest path
- **DFS (Depth-First Search)**: Explores as far as possible along each branch
- **Dijkstra's Algorithm**: Finds shortest path considering weighted edges
- **A* (A-Star)**: Uses heuristics for efficient pathfinding
- **Flood Fill**: Area-filling algorithm that expands outward
- **Dead-End Filling**: Maze-solving technique that fills dead ends

### Maze Generation Algorithms

- **Recursive Backtracking**: Creates perfect mazes using depth-first traversal
- **Prim's Algorithm**: Generates mazes using minimum spanning tree approach
- **Wilson's Algorithm**: Creates unbiased random mazes using loop-erased random walks

### Maze Modes

- **Multiple Paths**: Generates mazes with multiple possible solutions
- **Perfect Maze**: Creates mazes with exactly one path between any two points
- **Open Grid**: Standard grid without walls for basic pathfinding

### Interactive Features

- Adjustable grid size (5×5 to 50×50)
- Real-time visualization with pause/resume functionality
- Keyboard shortcuts for quick controls
- Reset functionality to try different configurations
- Step-by-step algorithm execution visualization

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/pathfinding_visualiser.git
cd pathfinding_visualiser
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:5173`

### Build for Production

```bash
npm run build
```

The built files will be in the `dist` directory.

### Preview Production Build

```bash
npm run preview
```

## Usage

1. **Select View Mode**: Choose between Single View, Compare All, or Compare Maze Generation
2. **Adjust Grid Size**: Set the grid dimensions (N×N) using the input field
3. **Choose Maze Mode**: Select Multiple Paths, Perfect Maze, or Open Grid
4. **For Perfect Mazes**: Select a maze generation algorithm and click "Visualise Maze Generation"
5. **Run Algorithms**:
   - In Single View: Click any algorithm button (BFS, DFS, etc.)
   - In Compare All: Click "Run All Algorithms"
   - In Maze Compare: Click "Generate All Mazes"
6. **Control Execution**: Use pause/resume during visualization
7. **Reset**: Clear the grid and start over

### Keyboard Shortcuts

- **Space**: Pause/Resume algorithm execution

## Project Structure

```
pathfinding_visualiser/
├── src/
│   ├── algorithms/          # Algorithm implementations
│   │   ├── bfsVisualizer.ts
│   │   ├── dfsVisualizer.ts
│   │   ├── dijkstraVisualizer.ts
│   │   ├── astarVisualizer.ts
│   │   ├── floodFillVisualizer.ts
│   │   ├── deadEndFillingVisualizer.ts
│   │   ├── grid.ts
│   │   ├── mazeGenerators/
│   │   │   ├── recursiveBacktracking.ts
│   │   │   ├── prims.ts
│   │   │   └── wilsons.ts
│   │   └── ...
│   ├── components/          # React components
│   │   ├── SingleView.tsx
│   │   ├── CompareView.tsx
│   │   ├── MazeCompareView.tsx
│   │   ├── GridVisualizer.tsx
│   │   ├── GridCell.tsx
│   │   └── Sidebar.tsx
│   ├── hooks/              # Custom React hooks
│   │   ├── useAppState.ts
│   │   ├── useAppHandlers.ts
│   │   ├── useAlgorithmExecution.ts
│   │   ├── useCellSizes.ts
│   │   └── useKeyboardShortcuts.ts
│   ├── utils/              # Utility functions
│   │   ├── algorithmRunners.ts
│   │   ├── comparisonHelpers.ts
│   │   └── mazeGeneration.ts
│   ├── App.tsx
│   └── main.tsx
├── index.html
├── package.json
├── tsconfig.json
├── vite.config.ts
└── README.md
```

## Technologies Used

- **React 18**: UI framework
- **TypeScript**: Type-safe JavaScript
- **Vite**: Fast build tool and dev server
- **CSS**: Styling and animations

## How It Works

### Algorithm Visualization

Each algorithm returns a series of steps showing:
- Nodes being explored (visited)
- The final path from start to end
- Whether a solution was found

The visualizer animates these steps in real-time, allowing you to see how each algorithm explores the grid differently.

### Grid System

- The grid is represented as a 2D array of cells
- Each cell can be a start point, end point, wall, or empty space
- Algorithms navigate through the grid avoiding walls to find paths

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is open source and available under the [MIT License](LICENSE).

## Acknowledgments

- Inspired by various pathfinding visualization tools
- Built as an educational tool to understand search and maze generation algorithms

## Future Enhancements

- [ ] Interactive grid editing (add/remove walls with mouse)
- [ ] Weighted nodes for Dijkstra and A*
- [ ] Save and load grid configurations
- [ ] Algorithm performance statistics
- [ ] Mobile-responsive design improvements
