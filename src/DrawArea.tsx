/* eslint-disable jsx-a11y/tabindex-no-positive */
/* eslint-disable jsx-a11y/no-noninteractive-tabindex */
/* eslint-disable jsx-a11y/no-static-element-interactions */
import React, { useEffect } from 'react';
import { Stage, Layer } from 'react-konva';
import './App.css';
import { useRecoilBridgeAcrossReactRoots_UNSTABLE, useRecoilState } from 'recoil';
import { createComponent, nextType } from './components';
import Grid from './Grid';
import { add, RealPoint, sub, toFixedVirtualGrid, toVirtualGrid } from './helpers/gridhelper';
import { useWindowSize } from './hooks/useWindowSize';
import { useLines } from './hooks/useLines';
import { Mode, modeToCursorStyle } from './helpers/modehelper';
import { usePreviousMode } from './hooks/usePreviousMode';
import { componentsAtom, modeAtom, pitchAtom, componentTypeAtom, upperLeftAtom } from './atoms';

const DrawArea: React.FC = () => {
  const Bridge = useRecoilBridgeAcrossReactRoots_UNSTABLE();

  const { height, width } = useWindowSize();

  const [setPoint, setPreview, resetSelect, createLines] = useLines();
  const [pitch, setPitch] = useRecoilState(pitchAtom);
  const [upperLeft, setUpperLeft] = useRecoilState(upperLeftAtom);
  const [components, setComponents] = useRecoilState(componentsAtom);
  const [mode, setMode] = useRecoilState(modeAtom);
  const prevMode = usePreviousMode(mode);
  const [componentType, setComponentType] = useRecoilState(componentTypeAtom);

  // mode unmount
  useEffect(() => {
    if (prevMode === Mode.LINE) {
      resetSelect();
    }
    if (prevMode === Mode.COMPONENT) {
      setComponents(components.slice(0, -1));
    }
  }, [mode]);
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
        <Bridge>
          <Layer>
            <Grid />
            {createLines(pitch, upperLeft)}
            {components.map((c, i) => createComponent(c, pitch, upperLeft, `components_${i}_${c.type}`))}
          </Layer>
        </Bridge>
      </Stage>
    </div>
  );
};

export default DrawArea;
