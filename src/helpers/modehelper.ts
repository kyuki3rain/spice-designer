export const Mode = {
  LINE: 'line',
  COMPONENT: 'component',
  HAND: 'hand',
  MOVE: 'move',
  COPY: 'copy',
  PARAM: 'param',
  NONE: 'none',
  ERR: 'err',
} as const;

export type ModeType = typeof Mode[keyof typeof Mode];

export const modeToCursorStyle = (mode: ModeType) => {
  switch (mode) {
    case Mode.LINE:
      return 'crosshair';
    default:
      return 'default';
  }
};
