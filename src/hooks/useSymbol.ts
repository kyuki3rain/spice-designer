import { useCallback } from 'react';
import { useRecoilState, useRecoilValue } from 'recoil';
import { symbolsAtom, symbolTypeAtom } from '../atoms';
import { add, VirtualPoint } from '../helpers/gridhelper';
import { defaultConfig, elementType, symbolNodes } from '../symbols';
import { useNode } from './useNode';

export const useSymbol = () => {
  const [symbols, setSymbols] = useRecoilState(symbolsAtom);
  const symbolType = useRecoilValue(symbolTypeAtom);
  const { setNode } = useNode();

  const setSymbol = useCallback(
    (point: VirtualPoint) => {
      const sarr = symbols.get(elementType(symbolType)) ?? [];
      setSymbols(
        symbols.set(
          elementType(symbolType),
          sarr.concat({
            type: symbolType,
            point,
            key: `symbol_${elementType(symbolType)}${sarr.length}`,
            config: defaultConfig(symbolType),
          })
        )
      );
      symbolNodes(symbolType).map((rp) => setNode(add(rp, point)));
    },
    [symbols, symbolType]
  );

  return { setSymbol };
};

export default useSymbol;
