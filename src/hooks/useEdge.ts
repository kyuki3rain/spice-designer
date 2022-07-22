import { useCallback } from 'react';
import { useRecoilState } from 'recoil';
import { EdgeId, edgeListAtom, NodeId, nodeIdToEdgeIdAtom } from '../atoms';

export const useEdge = () => {
  const [edgeList, setEdgeList] = useRecoilState(edgeListAtom);
  const [nodeIdToEdgeIdMap, setNodeIdToEdgeIdMap] = useRecoilState(nodeIdToEdgeIdAtom);

  const setEdge = useCallback(
    (node1: NodeId, node2: NodeId) => {
      const edgeId = edgeList.length as EdgeId;
      setEdgeList([...edgeList, { id: edgeId, node1, node2 }]);
      setNodeIdToEdgeIdMap(
        new Map(
          nodeIdToEdgeIdMap
            .set(node1, [...(nodeIdToEdgeIdMap.get(node1) ?? []), [node2, edgeId]])
            .set(node2, [...(nodeIdToEdgeIdMap.get(node2) ?? []), [node1, edgeId]])
        )
      );
    },
    [edgeList, nodeIdToEdgeIdMap]
  );

  return { setEdge };
};

export default useEdge;
