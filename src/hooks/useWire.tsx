import { useCallback } from 'react';
import { useRecoilState, useSetRecoilState } from 'recoil';
import {
  EdgeId,
  edgeListAtom,
  NodeId,
  nodeIdToEdgeIdAtom,
  nodeListAtom,
  pointToNodeIdAtom,
  previewPointAtom,
  selectedNodeIdAtom,
} from '../atoms';
import { VirtualPoint } from '../helpers/gridhelper';

export const useWire = () => {
  const [nodeList, setNodeList] = useRecoilState(nodeListAtom);
  const [pointToNodeIdMap, setPointToNodeIdMap] = useRecoilState(pointToNodeIdAtom);
  const [edgeList, setEdgeList] = useRecoilState(edgeListAtom);
  const [nodeIdToEdgeIdMap, setNodeIdToEdgeIdMap] = useRecoilState(nodeIdToEdgeIdAtom);
  const [selectedNodeId, setSelectedNodeId] = useRecoilState(selectedNodeIdAtom);
  const setPreviewPoint = useSetRecoilState(previewPointAtom);

  const resetSelect = useCallback(() => {
    setSelectedNodeId(null);
    setPreviewPoint({} as VirtualPoint);
  }, []);

  const setPoint = useCallback(
    (p: VirtualPoint) => {
      const pString = JSON.stringify(p);
      let id = pointToNodeIdMap.get(pString);

      if (id === undefined) {
        id = nodeList.length as NodeId;
        setNodeList([...nodeList, { id, point: p }]);
        setPointToNodeIdMap(new Map(pointToNodeIdMap.set(pString, id)));
      }

      if (selectedNodeId !== null) {
        const edgeId = edgeList.length as EdgeId;
        setEdgeList([...edgeList, { id: edgeId, node1: id, node2: selectedNodeId }]);
        setNodeIdToEdgeIdMap(
          new Map(
            nodeIdToEdgeIdMap
              .set(id, [...(nodeIdToEdgeIdMap.get(id) ?? []), [selectedNodeId, edgeId]])
              .set(selectedNodeId, [...(nodeIdToEdgeIdMap.get(selectedNodeId) ?? []), [id, edgeId]])
          )
        );
      }

      setSelectedNodeId(id);
    },
    [pointToNodeIdMap, nodeList, selectedNodeId, edgeList, nodeIdToEdgeIdMap]
  );

  const setPreview = useCallback((point: VirtualPoint) => {
    setPreviewPoint(point);
  }, []);

  return { setPoint, setPreview, resetSelect };
};

export default useWire;
