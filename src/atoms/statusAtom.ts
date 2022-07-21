import { atom } from 'recoil';
import { SymbolType, SymbolTypes } from '../symbols';
import { Mode, ModeType } from '../helpers/modehelper';
import { VirtualPoint } from '../helpers/gridhelper';
import { NodeId } from './wireAtom';

export const modeAtom = atom({
  key: 'mode',
  default: Mode.NONE as ModeType,
});

export const symbolTypeAtom = atom({
  key: 'symbolType',
  default: SymbolTypes.CELL as SymbolType,
});

export const selectedNodeIdAtom = atom({
  key: 'selectedNodeId',
  default: null as NodeId | null,
});

export const previewPointAtom = atom({
  key: 'previewPoint',
  default: {} as VirtualPoint,
});
