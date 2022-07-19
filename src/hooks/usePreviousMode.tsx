import { useEffect, useRef } from 'react';
import { Mode, ModeType } from '../helpers/modehelper';

export const usePreviousMode = (mode: ModeType) => {
  const ref = useRef(Mode.NONE as ModeType);
  useEffect(() => {
    ref.current = mode;
  });
  return ref.current;
};
