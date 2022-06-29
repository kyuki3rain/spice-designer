import React, { useEffect, useRef, useState } from 'react';
import { Stage, Layer, Line } from 'react-konva';
import './App.css';
import { HorizontalGrids, VerticalGrids } from './Grid';
import { add, fix, RealPoint, sub, toFixedVirtualGrid, toRealGrid, toVirtualGrid, VirtualPoint } from './helpers/gridhelper';
import { useWindowSize } from './useWindowSize';

type LineState = {
  points: VirtualPoint[];
  key: string;
  color: string;
}

const createLine = (line: LineState, pitch: number, upperLeft: VirtualPoint) => {
  return <Line
    key={line.key}
    x={0}
    y={0}
    points={line.points.reduce((a, vp) => {
      let rp = toRealGrid(vp, pitch, upperLeft);
      return a.concat([rp.x, rp.y])
    }, [] as number[])}
    stroke={line.color}
    strokeWidth={2}
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
  const [upperLeft, setUpperLeft] = useState({ vx: 0, vy: 0 });
  const [lines, setLines] = useState([] as LineState[]);
  const [selectedPoints, setSelectedPoints] = useState([] as VirtualPoint[]);
  const [mode, setMode] = useState("none");

  const onWheel = (e: any) => {
    e.preventDefault();

    if (e.ctrlKey) {
      let pos: RealPoint = { x: e.clientX, y: e.clientY };
      let raw_vpos = toVirtualGrid(pos, pitch, upperLeft);

      let new_pitch = pitch;
      if (e.deltaY < 0) new_pitch++; // Zoom in
      else new_pitch--; // Zoom out

      new_pitch = Math.min(Math.max(5, new_pitch), 50);
      let new_raw_vpos = toVirtualGrid(pos, new_pitch, upperLeft);

      setPitch(new_pitch);
      setUpperLeft(add(upperLeft, sub(raw_vpos, new_raw_vpos)));
    } else {
      setUpperLeft(add(upperLeft, toVirtualGrid({ x: e.deltaX, y: e.deltaY }, pitch, { vx: 0, vy: 0 })));
    }
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
      let next_mode = mode;
      switch (e.code) {
        case 'Escape':
          next_mode = "none";
          break;
        case 'KeyL':
          next_mode = "line";
          break;
        case 'KeyE':
          setPitch(pitch + 1);
          break;
        case 'KeyR':
          setPitch(pitch - 1);
          break;
        default:
      }
      if (mode === "line" && next_mode !== mode && selectedPoints.length > 0) {
        setLines(lines.slice(0, -1).concat({ points: selectedPoints, key: `line_${lines.length}`, color: "black" }));
        setSelectedPoints([]);
      }
      setMode(next_mode);
    }} style={{ cursor: modeToCursorStyle(mode) }}>
      <Stage width={width} height={height} onClick={e => {
        switch (mode) {
          case "line":
            let pos = e.target.getRelativePointerPosition();
            let vpos = toFixedVirtualGrid(pos, pitch, upperLeft);

            let newSelectedPoints = [...selectedPoints, vpos];
            if (selectedPoints.length) {
              setLines(lines.slice(0, -1).concat({ points: newSelectedPoints, key: `line_${lines.length}`, color: "black" }));
            } else {
              setLines(lines.concat({ points: newSelectedPoints, key: `line_${lines.length + 1}`, color: "black" }));
            }

            setSelectedPoints(newSelectedPoints);
            break;
          default:
        }
      }} onMouseMove={e => {
        switch (mode) {
          case "line":
            if (!selectedPoints.length) break;

            let vpos = toFixedVirtualGrid(e.target.getRelativePointerPosition(), pitch, upperLeft);
            let newSelectedPoints = [...selectedPoints, vpos];
            setLines(lines.slice(0, -1).concat({ points: newSelectedPoints, key: `line_${lines.length}`, color: "black" }));
            break;
          default:
        }
      }}>
        <Layer>
          {VerticalGrids(pitch, width, height, upperLeft.vx)}
          {HorizontalGrids(pitch, width, height, upperLeft.vy)}
          {lines.map(l => createLine(l, pitch, upperLeft))}
        </Layer>
      </Stage>
    </div >
  );
}

export default App;
