/* eslint-disable jsx-a11y/tabindex-no-positive */
/* eslint-disable jsx-a11y/no-noninteractive-tabindex */
/* eslint-disable jsx-a11y/no-static-element-interactions */
import React from 'react';
import { Stage, Layer } from 'react-konva';
import './App.css';
import { useRecoilBridgeAcrossReactRoots_UNSTABLE, useRecoilState } from 'recoil';
import Grid from './Grid';
import { Symbol } from './Symbol';
import { toFixedVirtualGrid } from './helpers/gridhelper';
import { useWindowSize } from './hooks/useWindowSize';
import { useWire } from './hooks/useWire';
import { Mode } from './helpers/modehelper';
import { symbolsAtom, modeAtom, pitchAtom, symbolTypeAtom, upperLeftAtom } from './atoms';
import Wire from './Wire';
import { useSymbol } from './hooks/useSymbol';

const DrawArea: React.FC = () => {
  const Bridge = useRecoilBridgeAcrossReactRoots_UNSTABLE();

  const { height, width } = useWindowSize();

  const { setWire } = useWire();
  const { setSymbol } = useSymbol();
  const [pitch] = useRecoilState(pitchAtom);
  const [upperLeft] = useRecoilState(upperLeftAtom);
  const [symbols, setSymbols] = useRecoilState(symbolsAtom);
  const [mode] = useRecoilState(modeAtom);
  const [symbolType] = useRecoilState(symbolTypeAtom);

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
            setWire(vpos);
            break;
          case Mode.SYMBOL:
            setSymbol(vpos);
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
