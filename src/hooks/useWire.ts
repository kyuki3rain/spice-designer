import { useCallback } from 'react';
import { useRecoilState } from 'recoil';
import { selectedNodeIdAtom } from '../atoms';
import { VirtualPoint } from '../helpers/gridhelper';
import { useEdge } from './useEdge';
import { useNode } from './useNode';

export const useWire = () => {
  const [selectedNodeId, setSelectedNodeId] = useRecoilState(selectedNodeIdAtom);
  const { setEdge } = useEdge();
  const { setNode } = useNode();

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

  return { setWire };
};

export default useWire;
