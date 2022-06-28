import React, { useEffect, useRef, useState } from 'react';
import { Stage, Layer, Line } from 'react-konva';
import './App.css';
import { useWindowSize } from './useWindowSize';

type LineState = {
  points: number[];
  key: string;
  color: string;
}

const limit = (x: number, pitch: number) => {
  return pitch * Math.round(x / pitch)
}

const createLine = (line: LineState) => {
  return <Line
    key={line.key}
    x={0}
    y={0}
    points={line.points}
    stroke={line.color}
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

function usePrevious(value: any) {
  const ref = useRef(null);
  useEffect(() => {
    ref.current = value;
  });
  return ref.current;
}

const App: React.FC = () => {
  const { height, width } = useWindowSize();
  const [pitch, setPitch] = useState(20);
  const [lines, setLines] = useState([] as LineState[]);
  const [selectedPoints, setSelectedPoints] = useState([] as number[]);
  const [mode, setMode] = useState("none");
  const prevPitch = usePrevious(pitch);

  let VerticalGrids = [...Array(Math.floor(width / pitch))].map((_, i) =>
    createGrid([i * pitch, 0, i * pitch, height], `vertical_grid_${i}`)
  );
  let HorizontalGrids = [...Array(Math.floor(height / pitch))].map((_, i) =>
    createGrid([0, i * pitch, width, i * pitch], `horizontal_grid_${i}`)
  );

  useEffect(() => {
    setSelectedPoints([]);
  }, [mode]);

  useEffect(() => {
    if (prevPitch)
      setLines(lines.map(l => { return { ...l, points: l.points.map(p => p / prevPitch * pitch) } }))
  }, [pitch]);

  const onWheel = (e: any) => {
    e.preventDefault();
    let new_pitch = pitch;

    if (e.deltaY < 0) new_pitch++; // Zoom in
    else new_pitch--; // Zoom out

    // Restrict scale
    setPitch(Math.min(Math.max(5, new_pitch), 50));
  };
  const divRef = useRef(null);

  useEffect(() => {
    // @ts-ignore
    divRef.current?.addEventListener("wheel", onWheel, { passive: false });
    return (() => {
      // @ts-ignore
      divRef.current?.removeEventListener("wheel", onWheel, { passive: false });
    });
  });

  return (
    <div ref={divRef} tabIndex={1} onKeyDown={e => {
      console.log(e.code);
      switch (e.code) {
        case 'Escape':
          setMode("none");
          break;
        case 'KeyL':
          setMode("line");
          break;
        case 'KeyE':
          setPitch(pitch + 1);
          break;
        case 'KeyR':
          setPitch(pitch - 1);
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
              setLines(lines.slice(0, -1).concat({ points: newSelectedPoints, key: `line_${lines.length}`, color: "black" }));
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
            setLines(lines.slice(0, -1).concat({ points: newSelectedPoints, key: `line_${lines.length}`, color: "black" }));
            break;
          default:
        }
      }}>
        <Layer>
          {VerticalGrids}
          {HorizontalGrids}
          {lines.map(l => createLine(l))}
        </Layer>
      </Stage>
    </div >
  );
}

export default App;
