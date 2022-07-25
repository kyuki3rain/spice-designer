import { useCallback } from 'react';
import { useRecoilState } from 'recoil';
import { EdgeId, edgeListAtom, NodeId, nodeIdToEdgeIdAtom, WireEdge } from '../atoms';
import { getRandomId } from '../helpers/createIdHelper';

export const useEdge = () => {
  const [edgeList, setEdgeList] = useRecoilState(edgeListAtom);
  const [nodeIdToEdgeIdMap, setNodeIdToEdgeIdMap] = useRecoilState(nodeIdToEdgeIdAtom);

  const setEdge = useCallback(
    (node1: NodeId, node2: NodeId) => {
      const edgeId = getRandomId() as EdgeId;
      setEdgeList(edgeList.set(edgeId, { id: edgeId, node1, node2 }));
      setNodeIdToEdgeIdMap(
        new Map(
          nodeIdToEdgeIdMap
            .set(node1, (nodeIdToEdgeIdMap.get(node1) ?? (new Map() as Map<NodeId, EdgeId>)).set(node2, edgeId))
            .set(node2, (nodeIdToEdgeIdMap.get(node2) ?? (new Map() as Map<NodeId, EdgeId>)).set(node1, edgeId))
        )
      );

      return edgeId;
    },
    [edgeList, nodeIdToEdgeIdMap]
  );

  const separateEdge = useCallback(
    (id: NodeId, edge: WireEdge) => {
      edgeList.set(edge.id, { id: edge.id, node1: edge.node1, node2: id });
      const newEdgeId = setEdge(id, edge.node2);
      const node1List = nodeIdToEdgeIdMap.get(edge.node1);
      const node2List = nodeIdToEdgeIdMap.get(edge.node2);
      if (!node1List || !node2List) return false;

      node1List.delete(edge.node2);
      node2List.delete(edge.node1);

      setNodeIdToEdgeIdMap(
        new Map(
          nodeIdToEdgeIdMap.set(edge.node1, node1List.set(id, edge.id)).set(edge.node2, node2List.set(id, newEdgeId))
        )
      );

      return true;
    },
    [edgeList, nodeIdToEdgeIdMap]
  );

  return { edgeList, setEdge, separateEdge };
};

export default useEdge;
