/* eslint-disable jsx-a11y/tabindex-no-positive */
/* eslint-disable jsx-a11y/no-noninteractive-tabindex */
/* eslint-disable jsx-a11y/no-static-element-interactions */
import React, { useEffect, useRef } from 'react';
import './App.css';
import { useRecoilState } from 'recoil';
import { nextType } from './symbols';
import { add, RealPoint, sub, toFixedVirtualGrid, toVirtualGrid } from './helpers/gridhelper';
import { Mode, modeToCursorStyle } from './helpers/modehelper';
import { modeAtom, pitchAtom, symbolTypeAtom, upperLeftAtom } from './atoms';
import { usePrevious } from './hooks/usePrevious';
import { usePreview } from './hooks/usePreview';

type Props = {
  children: React.ReactNode;
};

const Controller: React.FC<Props> = ({ children }) => {
  const [pitch, setPitch] = useRecoilState(pitchAtom);
  const [upperLeft, setUpperLeft] = useRecoilState(upperLeftAtom);
  const [mode, setMode] = useRecoilState(modeAtom);
  const [symbolType, setSymbolType] = useRecoilState(symbolTypeAtom);
  const { setPreview, resetPreview } = usePreview();
  const prevMode = usePrevious(mode);

  const divref = useRef<HTMLDivElement>(null);

  const onWheel = (e: WheelEvent) => {
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
  };

  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
    divref.current?.addEventListener('wheel', onWheel, { passive: false });
    return () => {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
      divref.current?.removeEventListener('wheel', onWheel);
    };
  });

  useEffect(() => {
    resetPreview(prevMode);
    setPreview(mode, { vx: 0, vy: 0 });
  }, [mode]);

  return (
    <div
      ref={divref}
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
      onMouseMove={(e) => {
        const pos: RealPoint = { x: e.clientX, y: e.clientY };
        const vpos = toFixedVirtualGrid(pos, pitch, upperLeft);

        setPreview(mode, vpos);
      }}
      style={{ cursor: modeToCursorStyle(mode) }}
    >
      {children}
    </div>
  );
};

export default Controller;
