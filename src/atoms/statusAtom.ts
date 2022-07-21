import { atom } from 'recoil';
import { SymbolType, SymbolTypes } from '../symbols';
import { Mode, ModeType } from '../helpers/modehelper';

export const modeAtom = atom({
  key: 'mode',
  default: Mode.NONE as ModeType,
});

export const symbolTypeAtom = atom({
  key: 'symbolType',
  default: SymbolTypes.CELL as SymbolType,
});
