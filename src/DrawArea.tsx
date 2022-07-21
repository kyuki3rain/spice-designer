/* eslint-disable jsx-a11y/tabindex-no-positive */
/* eslint-disable jsx-a11y/no-noninteractive-tabindex */
/* eslint-disable jsx-a11y/no-static-element-interactions */
import React, { useEffect } from 'react';
import { Stage, Layer } from 'react-konva';
import './App.css';
import { useRecoilBridgeAcrossReactRoots_UNSTABLE, useRecoilState } from 'recoil';
import { createSymbol, nextType } from './symbols';
import Grid from './Grid';
import { add, RealPoint, sub, toFixedVirtualGrid, toVirtualGrid } from './helpers/gridhelper';
import { useWindowSize } from './hooks/useWindowSize';
import { useWire } from './hooks/useWire';
import { Mode, modeToCursorStyle } from './helpers/modehelper';
import { usePreviousMode } from './hooks/usePreviousMode';
import { symbolsAtom, modeAtom, pitchAtom, symbolTypeAtom, upperLeftAtom } from './atoms';

const DrawArea: React.FC = () => {
  const Bridge = useRecoilBridgeAcrossReactRoots_UNSTABLE();

  const { height, width } = useWindowSize();

  const [setPoint, setPreview, resetSelect, createWires] = useWire();
  const [pitch, setPitch] = useRecoilState(pitchAtom);
  const [upperLeft, setUpperLeft] = useRecoilState(upperLeftAtom);
  const [symbols, setSymbols] = useRecoilState(symbolsAtom);
  const [mode, setMode] = useRecoilState(modeAtom);
  const prevMode = usePreviousMode(mode);
  const [symbolType, setSymbolType] = useRecoilState(symbolTypeAtom);

  // mode unmount
  useEffect(() => {
    if (prevMode === Mode.WIRE) {
      resetSelect();
    }
    if (prevMode === Mode.SYMBOL) {
      setSymbols(symbols.slice(0, -1));
    }
  }, [mode]);
  // mode unmount

  // mode mount
  useEffect(() => {
    if (mode === Mode.SYMBOL) {
      setSymbols(
        symbols.concat({
          type: symbolType,
          point: { vx: 0, vy: 0 },
          key: `symbol_${symbols.length + 1}`,
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
            setMode(Mode.WIRE);
            break;
          case 'KeyP':
            if (mode === Mode.SYMBOL) setSymbolType(nextType(symbolType));
            else setMode(Mode.SYMBOL);
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
            case Mode.WIRE:
              setPoint(vpos);
              break;
            case Mode.SYMBOL:
              setSymbols(
                symbols
                  .slice(0, -1)
                  .concat({ type: symbolType, point: vpos, key: `symbol_${symbols.length}` })
                  .concat({ type: symbolType, point: vpos, key: `symbol_${symbols.length + 1}` })
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
            case Mode.WIRE:
              setPreview(vpos);
              break;
            case Mode.SYMBOL:
              setSymbols(
                symbols.slice(0, -1).concat({ type: symbolType, point: vpos, key: `symbol_${symbols.length}` })
              );
              break;
            default:
          }
        }}
      >
        <Bridge>
          <Layer>
            <Grid />
            {createWires(pitch, upperLeft)}
            {symbols.map((c, i) => createSymbol(c, pitch, upperLeft, `symbol_${i}_${c.type}`))}
          </Layer>
        </Bridge>
      </Stage>
    </div>
  );
};

export default DrawArea;
