/* eslint-disable jsx-a11y/tabindex-no-positive */
/* eslint-disable jsx-a11y/no-noninteractive-tabindex */
/* eslint-disable jsx-a11y/no-static-element-interactions */
import React, { useEffect, useState } from 'react';
import { Stage, Layer } from 'react-konva';
import './App.css';
import { ComponentState, ComponentType, ComponentTypes, createComponent, nextType } from './components';
import { HorizontalGrids, VerticalGrids } from './Grid';
import { add, RealPoint, sub, toFixedVirtualGrid, toVirtualGrid, VirtualPoint } from './helpers/gridhelper';
import { useWindowSize } from './hooks/useWindowSize';
import { useLines } from './hooks/useLines';
import { Mode, ModeType } from './helpers/modehelper';
import { usePreviousMode } from './hooks/usePreviousMode';

const modeToCursorStyle = (mode: string) => {
  switch (mode) {
    case Mode.LINE:
      return 'crosshair';
    default:
      return 'default';
  }
};

const App: React.FC = () => {
  const { height, width } = useWindowSize();

  const [setPoint, setPreview, resetSelect, createLines] = useLines();
  const [pitch, setPitch] = useState(20);
  const [upperLeft, setUpperLeft] = useState({ vx: 0, vy: 0 } as VirtualPoint);
  const [components, setComponents] = useState([] as ComponentState[]);
  const [mode, setMode] = useState(Mode.NONE as ModeType);
  const prevMode = usePreviousMode(mode);
  const [componentType, setComponentType] = useState(ComponentTypes.CELL as ComponentType);

  // mode unmount
  useEffect(() => {
    if (prevMode === Mode.LINE) {
      resetSelect();
    }
    if (prevMode === Mode.COMPONENT) {
      setComponents(components.slice(0, -1));
    }
  }, [prevMode]);
  // mode unmount

  // mode mount
  useEffect(() => {
    if (mode === Mode.COMPONENT) {
      setComponents(
        components.concat({
          type: componentType,
          point: { vx: 0, vy: 0 },
          key: `components_${components.length + 1}`,
        })
      );
    }
  }, [mode]);
  // mode mount

  return (
    <React.StrictMode>
      <div
        onWheel={(e) => {
          e.preventDefault();

          if (e.ctrlKey) {
            const pos: RealPoint = { x: e.clientX, y: e.clientY };
            const rawVPos = toVirtualGrid(pos, pitch, upperLeft);

            let newPitch = pitch;
            if (e.deltaY < 0) newPitch += 1; // Zoom in
            else newPitch -= 1; // Zoom out

            newPitch = Math.min(Math.max(5, newPitch), 50);
            const newRawVPos = toVirtualGrid(pos, newPitch, upperLeft);

            setPitch(newPitch);
            setUpperLeft(add(upperLeft, sub(rawVPos, newRawVPos)));
          } else {
            setUpperLeft(add(upperLeft, toVirtualGrid({ x: e.deltaX, y: e.deltaY }, pitch, { vx: 0, vy: 0 })));
          }
        }}
        tabIndex={1}
        onKeyDown={(e) => {
          switch (e.code) {
            case 'Escape':
              setMode(Mode.NONE);
              break;
            case 'KeyL':
              setMode(Mode.LINE);
              break;
            case 'KeyP':
              if (mode === Mode.COMPONENT) setComponentType(nextType(componentType));
              else setMode(Mode.COMPONENT);
              break;
            case 'KeyE':
              setPitch(pitch + 1);
              break;
            case 'KeyR':
              setPitch(pitch - 1);
              break;
            default:
          }
        }}
        style={{ cursor: modeToCursorStyle(mode) }}
      >
        <Stage
          width={width}
          height={height}
          onClick={(e) => {
            const stage = e.target.getStage();
            if (!stage) return;
            const pos = stage.getPointerPosition();
            if (!pos) return;

            const vpos = toFixedVirtualGrid(pos, pitch, upperLeft);
            switch (mode) {
              case Mode.LINE:
                setPoint(vpos);
                break;
              case Mode.COMPONENT:
                setComponents(
                  components
                    .slice(0, -1)
                    .concat({ type: componentType, point: vpos, key: `components_${components.length}` })
                    .concat({ type: componentType, point: vpos, key: `components_${components.length + 1}` })
                );
                break;
              default:
            }
          }}
          onMouseMove={(e) => {
            const stage = e.target.getStage();
            if (!stage) return;
            const pos = stage.getPointerPosition();
            if (!pos) return;

            const vpos = toFixedVirtualGrid(pos, pitch, upperLeft);
            switch (mode) {
              case Mode.LINE:
                setPreview(vpos);
                break;
              case Mode.COMPONENT:
                setComponents(
                  components
                    .slice(0, -1)
                    .concat({ type: componentType, point: vpos, key: `components_${components.length}` })
                );
                break;
              default:
            }
          }}
        >
          <Layer>
            {VerticalGrids(pitch, width, height, upperLeft.vx)}
            {HorizontalGrids(pitch, width, height, upperLeft.vy)}
            {createLines(pitch, upperLeft)}
            {components.map((c, i) => createComponent(c, pitch, upperLeft, `components_${i}_${c.type}`))}
          </Layer>
        </Stage>
      </div>
    </React.StrictMode>
  );
};

export default App;
