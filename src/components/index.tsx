import { VirtualPoint } from '../helpers/gridhelper';
import Signal from './Signal';
import Cell from './Cell';
import Nmos4 from './Nmos4';
import Pmos4 from './Pmos4';

export type ComponentState = {
  type: string;
  point: VirtualPoint;
  key: string;
};

export const ComponentTypes = {
  CELL: 'cell',
  SIGNAL: 'signal',
  NMOS4: 'nmos4',
  PMOS4: 'pmos4',
  ERROR: 'error',
} as const;

export type ComponentType = typeof ComponentTypes[keyof typeof ComponentTypes];

export const nextType = (ct: ComponentType): ComponentType => {
  switch (ct) {
    case ComponentTypes.CELL:
      return ComponentTypes.SIGNAL;
    case ComponentTypes.SIGNAL:
      return ComponentTypes.NMOS4;
    case ComponentTypes.NMOS4:
      return ComponentTypes.PMOS4;
    case ComponentTypes.PMOS4:
      return ComponentTypes.CELL;
    default:
      return ComponentTypes.ERROR;
  }
};

export const createComponent = (c: ComponentState, pitch: number, upperLeft: VirtualPoint, key: string) => {
  switch (c.type) {
    case 'cell':
      return <Cell key={key} upperLeft={upperLeft} point={c.point} pitch={pitch} />;
    case 'signal':
      return <Signal key={key} upperLeft={upperLeft} point={c.point} pitch={pitch} />;
    case 'nmos4':
      return <Nmos4 key={key} upperLeft={upperLeft} point={c.point} pitch={pitch} />;
    case 'pmos4':
      return <Pmos4 key={key} upperLeft={upperLeft} point={c.point} pitch={pitch} />;
    default:
      return null;
  }
};
