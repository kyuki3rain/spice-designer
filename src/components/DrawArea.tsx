import React from 'react';
import { Stage, Layer } from 'react-konva';
import { useRecoilBridgeAcrossReactRoots_UNSTABLE, useRecoilState } from 'recoil';
import Grid from './drawArea/Grid';
import { Symbol } from './drawArea/Symbol';
import { toFixedVirtualGrid } from '../helpers/gridhelper';
import { useWindowSize } from '../hooks/useWindowSize';
import { useWire } from '../hooks/useWire';
import { Mode } from '../helpers/modehelper';
import { modeAtom, pitchAtom, upperLeftAtom } from '../atoms';
import Wire from './drawArea/Wire';
import { useSymbol } from '../hooks/useSymbol';
import { useLabel } from '../hooks/useLabel';
import Label from './drawArea/Label';
import Node from './drawArea/Node';

const DrawArea: React.FC = () => {
  const Bridge = useRecoilBridgeAcrossReactRoots_UNSTABLE();

  const { height, width } = useWindowSize();

  const { setWire } = useWire();
  const { setSymbol } = useSymbol();
  const { setLabel } = useLabel();
  const [pitch] = useRecoilState(pitchAtom);
  const [upperLeft] = useRecoilState(upperLeftAtom);
  const [mode] = useRecoilState(modeAtom);

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
          case Mode.LABEL:
            setLabel(vpos);
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
          <Label />
          <Node />
        </Layer>
      </Bridge>
    </Stage>
  );
};

export default DrawArea;
