import { useCallback } from 'react';
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';
import { previewSymbolAtom, symbolsAtom, symbolTypeAtom } from '../atoms';
import { VirtualPoint } from '../helpers/gridhelper';
import { SymbolTypes } from '../symbols';

export const useSymbol = () => {
  const [symbols, setSymbols] = useRecoilState(symbolsAtom);
  const setSymbolType = useSetRecoilState(symbolTypeAtom);
  const setPreviewSymbol = useSetRecoilState(previewSymbolAtom);
  const symbolType = useRecoilValue(symbolTypeAtom);

  const resetPreview = useCallback(() => {
    setSymbolType(SymbolTypes.CELL);
    setPreviewSymbol(null);
  }, []);

  const setSymbol = useCallback(
    (point: VirtualPoint) => {
      setSymbols(symbols.concat({ type: symbolType, point, key: `symbol_${symbols.length}` }));
    },
    [symbols, symbolType]
  );

  const setPreview = useCallback(
    (point: VirtualPoint) => {
      setPreviewSymbol({ type: symbolType, point, key: `symbol_preview` });
    },
    [symbolType]
  );

  return { setSymbol, setPreview, resetPreview };
};

export default useSymbol;
