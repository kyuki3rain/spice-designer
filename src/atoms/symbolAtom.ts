import { atom } from 'recoil';
import { SymbolState } from '../symbols';

export const symbolsAtom = atom({
  key: 'symbols',
  default: [] as SymbolState[],
});
