import { selector } from 'recoil';
import { Mode } from '../helpers/modehelper';
import { modeAtom, previewLabelPositionAtom, previewSymbolAtom } from '.';
import { symbolNodes } from '../symbols';
import { add } from '../helpers/gridhelper';

export const previewPositionSelector = selector({
  key: 'previewPosition',
  get: ({ get }) => {
    const symbol = get(previewSymbolAtom);

    switch (get(modeAtom)) {
      case Mode.SYMBOL:
        if (symbol === null) return null;
        return symbolNodes(symbol.type).map((p) => add(p, symbol.point));
      case Mode.LABEL:
        return [get(previewLabelPositionAtom)];
      default:
        return null;
    }
  },
});
