import { atom } from 'recoil';
import { VirtualPoint } from '../helpers/gridhelper';

export const pitchAtom = atom({
  key: 'pitch',
  default: 20,
});

export const upperLeftAtom = atom({
  key: 'upperLeft',
  default: { vx: 0, vy: 0 } as VirtualPoint,
});
