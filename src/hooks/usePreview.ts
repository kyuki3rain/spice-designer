import { useCallback } from 'react';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import { previewPointAtom, previewSymbolAtom, selectedNodeIdAtom, symbolTypeAtom } from '../atoms';
import { VirtualPoint } from '../helpers/gridhelper';
import { SymbolTypes } from '../symbols';

export const usePreview = () => {
  const setSelectedNodeId = useSetRecoilState(selectedNodeIdAtom);
  const setPreviewPoint = useSetRecoilState(previewPointAtom);
  const setSymbolType = useSetRecoilState(symbolTypeAtom);
  const setPreviewRawSymbol = useSetRecoilState(previewSymbolAtom);
  const symbolType = useRecoilValue(symbolTypeAtom);

  const resetPreviewWire = useCallback(() => {
    setSelectedNodeId(null);
    setPreviewPoint({} as VirtualPoint);
  }, []);

  const resetPreviewSymbol = useCallback(() => {
    setSymbolType(SymbolTypes.CELL);
    setPreviewRawSymbol(null);
  }, []);

  const setPreviewWire = useCallback((point: VirtualPoint) => {
    setPreviewPoint(point);
  }, []);

  const setPreviewSymbol = useCallback(
    (point: VirtualPoint) => {
      setPreviewRawSymbol({ type: symbolType, point, key: `symbol_preview` });
    },
    [symbolType]
  );

  return { setPreviewWire, resetPreviewWire, setPreviewSymbol, resetPreviewSymbol };
};

export default usePreview;
