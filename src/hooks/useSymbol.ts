import { useCallback } from 'react';
import { useRecoilState, useRecoilValue } from 'recoil';
import { symbolsAtom, symbolTypeAtom } from '../atoms';
import { VirtualPoint } from '../helpers/gridhelper';

export const useSymbol = () => {
  const [symbols, setSymbols] = useRecoilState(symbolsAtom);
  const symbolType = useRecoilValue(symbolTypeAtom);

  const setSymbol = useCallback(
    (point: VirtualPoint) => {
      setSymbols(symbols.concat({ type: symbolType, point, key: `symbol_${symbols.length}` }));
    },
    [symbols, symbolType]
  );

  return { setSymbol };
};

export default useSymbol;
