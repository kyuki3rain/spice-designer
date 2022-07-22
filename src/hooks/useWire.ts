import { useCallback } from 'react';
import { useRecoilState, useSetRecoilState } from 'recoil';
import { previewPointAtom, selectedNodeIdAtom } from '../atoms';
import { VirtualPoint } from '../helpers/gridhelper';
import { useEdge } from './useEdge';
import { useNode } from './useNode';

export const useWire = () => {
  const [selectedNodeId, setSelectedNodeId] = useRecoilState(selectedNodeIdAtom);
  const setPreviewPoint = useSetRecoilState(previewPointAtom);
  const { setEdge } = useEdge();
  const { setNode } = useNode();

  const resetSelect = useCallback(() => {
    setSelectedNodeId(null);
    setPreviewPoint({} as VirtualPoint);
  }, []);

  const setWire = useCallback(
    (point: VirtualPoint) => {
      const id = setNode(point);

      if (selectedNodeId !== null) {
        setEdge(id, selectedNodeId);
      }

      setSelectedNodeId(id);
    },
    [selectedNodeId]
  );

  const setPreview = useCallback((point: VirtualPoint) => {
    setPreviewPoint(point);
  }, []);

  return { setWire, setPreview, resetSelect };
};

export default useWire;
