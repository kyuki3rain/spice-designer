export const Mode = {
  WIRE: 'wire',
  SYMBOL: 'symbol',
  HAND: 'hand',
  MOVE: 'move',
  COPY: 'copy',
  LABEL: 'label',
  PARAM: 'param',
  NONE: 'none',
  ERR: 'err',
} as const;

export type ModeType = typeof Mode[keyof typeof Mode];

export const modeToCursorStyle = (mode: ModeType) => {
  switch (mode) {
    case Mode.WIRE:
      return 'crosshair';
    default:
      return 'default';
  }
};
