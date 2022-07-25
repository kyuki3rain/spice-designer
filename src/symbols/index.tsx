import { VirtualPoint } from '../helpers/gridhelper';
import Signal from './Signal';
import Cell from './Cell';
import Nmos4 from './Nmos4';
import Pmos4 from './Pmos4';

export type SymbolState = {
  type: string;
  point: VirtualPoint;
  key: string;
};

export const SymbolTypes = {
  CELL: 'cell',
  SIGNAL: 'signal',
  NMOS4: 'nmos4',
  PMOS4: 'pmos4',
  ERROR: 'error',
} as const;

export type SymbolType = typeof SymbolTypes[keyof typeof SymbolTypes];

export const nextType = (ct: SymbolType): SymbolType => {
  switch (ct) {
    case SymbolTypes.CELL:
      return SymbolTypes.SIGNAL;
    case SymbolTypes.SIGNAL:
      return SymbolTypes.NMOS4;
    case SymbolTypes.NMOS4:
      return SymbolTypes.PMOS4;
    case SymbolTypes.PMOS4:
      return SymbolTypes.CELL;
    default:
      return SymbolTypes.ERROR;
  }
};

export const createSymbol = (c: SymbolState, pitch: number, upperLeft: VirtualPoint, key: string) => {
  switch (c.type) {
    case SymbolTypes.CELL:
      return <Cell key={key} upperLeft={upperLeft} point={c.point} pitch={pitch} />;
    case SymbolTypes.SIGNAL:
      return <Signal key={key} upperLeft={upperLeft} point={c.point} pitch={pitch} />;
    case SymbolTypes.NMOS4:
      return <Nmos4 key={key} upperLeft={upperLeft} point={c.point} pitch={pitch} />;
    case SymbolTypes.PMOS4:
      return <Pmos4 key={key} upperLeft={upperLeft} point={c.point} pitch={pitch} />;
    default:
      return null;
  }
};

export const symbolNodes = (s: SymbolType) => {
  switch (s) {
    case SymbolTypes.CELL:
      return [
        { vx: 0, vy: 2 },
        { vx: 0, vy: -2 },
      ];
    case SymbolTypes.SIGNAL:
      return [
        { vx: 0, vy: -2 },
        { vx: 0, vy: 3 },
      ];
    case SymbolTypes.NMOS4:
      return [
        { vx: -1, vy: 2 },
        { vx: 2, vy: 0 },
        { vx: 2, vy: -3 },
        { vx: 2, vy: 3 },
      ];
    case SymbolTypes.PMOS4:
      return [
        { vx: -1, vy: 2 },
        { vx: 2, vy: 0 },
        { vx: 2, vy: -3 },
        { vx: 2, vy: 3 },
      ];
    default:
      return [];
  }
};
