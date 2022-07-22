/* eslint-disable jsx-a11y/tabindex-no-positive */
/* eslint-disable jsx-a11y/no-noninteractive-tabindex */
/* eslint-disable jsx-a11y/no-static-element-interactions */
import React, { useEffect } from 'react';
import { Stage, Layer } from 'react-konva';
import './App.css';
import { useRecoilBridgeAcrossReactRoots_UNSTABLE, useRecoilState } from 'recoil';
import Grid from './Grid';
import { Symbol } from './Symbol';
import { toFixedVirtualGrid } from './helpers/gridhelper';
import { useWindowSize } from './hooks/useWindowSize';
import { useWire } from './hooks/useWire';
import { Mode } from './helpers/modehelper';
import { usePreviousMode } from './hooks/usePreviousMode';
import { symbolsAtom, modeAtom, pitchAtom, symbolTypeAtom, upperLeftAtom } from './atoms';
import Wire from './Wire';

const DrawArea: React.FC = () => {
  const Bridge = useRecoilBridgeAcrossReactRoots_UNSTABLE();

  const { height, width } = useWindowSize();

  const { setPoint, setPreview, resetSelect } = useWire();
  const [pitch] = useRecoilState(pitchAtom);
  const [upperLeft] = useRecoilState(upperLeftAtom);
  const [symbols, setSymbols] = useRecoilState(symbolsAtom);
  const [mode] = useRecoilState(modeAtom);
  const prevMode = usePreviousMode(mode);
  const [symbolType] = useRecoilState(symbolTypeAtom);

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
            setSymbols(symbols.slice(0, -1).concat({ type: symbolType, point: vpos, key: `symbol_${symbols.length}` }));
            break;
          default:
        }
      }}
    >
      <Bridge>
        <Layer>
          <Grid />
          <Wire />
          <Symbol />
        </Layer>
      </Bridge>
    </Stage>
  );
};

export default DrawArea;
