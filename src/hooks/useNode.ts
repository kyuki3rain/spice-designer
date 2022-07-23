import { useCallback } from 'react';
import { useRecoilState } from 'recoil';
import { NodeId, nodeListAtom, pointToNodeIdAtom } from '../atoms';
import { getRandomId } from '../helpers/createIdHelper';
import { VirtualPoint } from '../helpers/gridhelper';

export const useNode = () => {
  const [nodeList, setNodeList] = useRecoilState(nodeListAtom);
  const [pointToNodeIdMap, setPointToNodeIdMap] = useRecoilState(pointToNodeIdAtom);

  const setNode = useCallback(
    (point: VirtualPoint) => {
      const pString = JSON.stringify(point);
      let id = pointToNodeIdMap.get(pString);

      if (id === undefined) {
        id = getRandomId() as NodeId;
        setNodeList(nodeList.set(id, { id, point }));
        setPointToNodeIdMap(new Map(pointToNodeIdMap.set(pString, id)));
      }

      return id;
    },
    [nodeList, pointToNodeIdAtom]
  );

  return { setNode };
};

export default useNode;
