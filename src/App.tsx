import React, { useState } from 'react';
import { Stage, Layer, Line } from 'react-konva';
import './App.css';
import { useWindowSize } from './useWindowSize';

const limit = (x: number, pitch: number) => {
  return pitch * Math.round(x / pitch)
}

const createLine = (points: number[], key: string, color: string) => {
  return <Line
    key={key}
    x={0}
    y={0}
    points={points}
    stroke={color}
    strokeWidth={2}
  />
}

const createGrid = (points: number[], key: string) => {
  return <Line
    key={key}
    x={0}
    y={0}
    points={points}
    stroke="lightgray"
    strokeWidth={1}
  />
}

const modeToCursorStyle = (mode: string) => {
  switch (mode) {
    case "line": return "crosshair";
    default: return "default";
  }
}

const App: React.FC = () => {
  const { height, width } = useWindowSize();
  const [pitch, setPitch] = useState(20);
  const [lines, setLines] = useState([] as JSX.Element[]);
  const [selectedPoints, setSelectedPoints] = useState([] as number[]);
  const [mode, setMode] = useState("none");

  let VerticalGrids = [...Array(Math.floor(width / pitch))].map((_, i) =>
    createGrid([i * pitch, 0, i * pitch, height], `vertical_grid_${i}`)
  );
  let HorizontalGrids = [...Array(Math.floor(height / pitch))].map((_, i) =>
    createGrid([0, i * pitch, width, i * pitch], `horizontal_grid_${i}`)
  );

  return (
    <div tabIndex={1} onKeyDown={e => {
      console.log(e.code);
      switch (e.code) {
        case 'Escape':
          setMode("none");
          break;
        case 'KeyL':
          setMode("line");
          break;
        default:
      }
    }} style={{ cursor: modeToCursorStyle(mode) }}>
      <Stage width={width} height={height} onClick={e => {
        switch (mode) {
          case "line":
            let pos = e.target.getRelativePointerPosition();
            console.log(pos);

            let newSelectedPoints = [...selectedPoints, limit(pos.x, pitch), limit(pos.y, pitch)];
            if (selectedPoints.length) {
              setLines(lines.slice(0, -1).concat(createLine(newSelectedPoints, `line_${lines.length}`, "black")));
            }

            setSelectedPoints(newSelectedPoints);
            break;
          default:
        }
      }} onMouseMove={e => {
        switch (mode) {
          case "line":
            if (!selectedPoints.length) break;

            let pos = e.target.getRelativePointerPosition();
            console.log(pos);
            let newSelectedPoints = [...selectedPoints, limit(pos.x, pitch), limit(pos.y, pitch)];
            setLines(lines.slice(0, -1).concat(createLine(newSelectedPoints, `line_${lines.length}`, "black")));
            break;
          default:
        }
      }}>
        <Layer>
          {VerticalGrids}
          {HorizontalGrids}
          {lines}
        </Layer>
      </Stage>
    </div >
  );
}

export default App;
