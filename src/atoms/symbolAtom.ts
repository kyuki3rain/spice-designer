import { atom } from 'recoil';
import { SymbolState } from '../symbols';

export const symbolsAtom = atom({
  key: 'symbols',
  default: new Map() as Map<string, SymbolState[]>,
});

export const previewSymbolAtom = atom({
  key: 'previewSymbol',
  default: null as SymbolState | null,
});
