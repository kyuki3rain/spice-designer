import { useCallback } from 'react';
import { useRecoilState } from 'recoil';
import { NodeId, nodeListAtom, pointToNodeIdAtom } from '../atoms';
import { VirtualPoint } from '../helpers/gridhelper';

export const useNode = () => {
  const [nodeList, setNodeList] = useRecoilState(nodeListAtom);
  const [pointToNodeIdMap, setPointToNodeIdMap] = useRecoilState(pointToNodeIdAtom);

  const setNode = useCallback(
    (p: VirtualPoint) => {
      const pString = JSON.stringify(p);
      let id = pointToNodeIdMap.get(pString);

      if (id === undefined) {
        id = nodeList.length as NodeId;
        setNodeList([...nodeList, { id, point: p }]);
        setPointToNodeIdMap(new Map(pointToNodeIdMap.set(pString, id)));
      }

      return id;
    },
    [nodeList, pointToNodeIdAtom]
  );

  return { setNode };
};

export default useNode;
