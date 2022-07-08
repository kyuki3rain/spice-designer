import React, { ComponentState, useEffect, useRef, useState } from 'react';
import { Stage, Layer } from 'react-konva';
import './App.css';
import { ComponentType, ComponentTypes, createComponent, nextType } from './components';
import { HorizontalGrids, VerticalGrids } from './Grid';
import { add, RealPoint, sub, toFixedVirtualGrid, toVirtualGrid, VirtualPoint } from './helpers/gridhelper';
import { useWindowSize } from './hooks/useWindowSize';
import useLines from './hooks/useLines';

const modeToCursorStyle = (mode: string) => {
  switch (mode) {
    case "line": return "crosshair";
    default: return "default";
  }
}

const App: React.FC = () => {
  const { height, width } = useWindowSize();

  const [setPoint, setPreview, resetSelect, createLines] = useLines();
  const [pitch, setPitch] = useState(20);
  const [upperLeft, setUpperLeft] = useState({ vx: 0, vy: 0 } as VirtualPoint);
  const [components, setComponents] = useState([] as ComponentState[]);
  const [mode, setMode] = useState("none");
  const [componentType, setComponentType] = useState(ComponentTypes.CELL as ComponentType);

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
    <React.StrictMode>
      <div ref={divRef} tabIndex={1} onKeyDown={e => {
        let next_mode = mode;
        switch (e.code) {
          case 'Escape':
            next_mode = "none";
            break;
          case 'KeyL':
            next_mode = "line";
            break;
          case 'KeyP':
            next_mode = "component";
            if (mode != next_mode) {
              setComponents(components.concat({ type: componentType, point: { vx: 0, vy: 0 } }));
            } else {
              setComponentType(nextType(componentType));
            }
            break;
          case 'KeyE':
            setPitch(pitch + 1);
            break;
          case 'KeyR':
            setPitch(pitch - 1);
            break;
          default:
        }
        if (mode === "line" && next_mode !== mode) {
          resetSelect();
        }
        if (mode === "component" && next_mode !== mode) {
          setComponents(components.slice(0, -1));
        }
        setMode(next_mode);
      }} style={{ cursor: modeToCursorStyle(mode) }}>
        <Stage width={width} height={height} onClick={e => {
          let stage = e.target.getStage();
          if (!stage) return;
          let pos = stage.getPointerPosition();
          if (!pos) return;

          let vpos = toFixedVirtualGrid(pos, pitch, upperLeft);
          switch (mode) {
            case "line":
              setPoint(vpos);
              break;
            case "component":
              setComponents(components.slice(0, -1).concat({ type: componentType, point: vpos }).concat({ type: componentType, point: vpos }));
              break;
            default:
          }
        }} onMouseMove={e => {
          let stage = e.target.getStage();
          if (!stage) return;
          let pos = stage.getPointerPosition();
          if (!pos) return;

          const vpos = toFixedVirtualGrid(pos, pitch, upperLeft);
          switch (mode) {
            case "line":
              setPreview(vpos);
              break;
            case "component":
              setComponents(components.slice(0, -1).concat({ type: componentType, point: vpos }));
              break;
            default:
          }
        }}>
          <Layer>
            {VerticalGrids(pitch, width, height, upperLeft.vx)}
            {HorizontalGrids(pitch, width, height, upperLeft.vy)}
            {createLines(pitch, upperLeft)}
            {components.map((c, i) => createComponent(c, pitch, upperLeft, `components_${i}_${c.type}`))}
          </Layer>
        </Stage>
      </div>
    </React.StrictMode >
  );
}

export default App;
