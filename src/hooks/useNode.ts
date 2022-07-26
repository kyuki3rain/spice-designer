import { useCallback } from 'react';
import { useRecoilState } from 'recoil';
import { NodeId, nodeListAtom, pointToNodeIdAtom } from '../atoms';
import { getRandomId } from '../helpers/createIdHelper';
import { VirtualPoint } from '../helpers/gridhelper';
import { useEdge } from './useEdge';

const isOnEdge = (a: VirtualPoint, b: VirtualPoint, c: VirtualPoint) => {
  if (a === c || b === c) return true;

  if (b.vx === a.vx) return c.vx === a.vx && (c.vy - a.vy) / (b.vy - a.vy) > 0 && (c.vy - a.vy) / (b.vy - a.vy) < 1;
  if (b.vy === a.vy) return c.vy === a.vy && (c.vx - a.vx) / (b.vx - a.vx) > 0 && (c.vx - a.vx) / (b.vx - a.vx) < 1;

  return (
    (c.vx - a.vx) / (b.vx - a.vx) > 0 &&
    (c.vx - a.vx) / (b.vx - a.vx) < 1 &&
    (c.vx - a.vx) / (b.vx - a.vx) === (c.vy - a.vy) / (b.vy - a.vy)
  );
};

export const useNode = () => {
  const [nodeList, setNodeList] = useRecoilState(nodeListAtom);
  const { edgeList, separateEdge } = useEdge();
  const [pointToNodeIdMap, setPointToNodeIdMap] = useRecoilState(pointToNodeIdAtom);

  const setNode = useCallback(
    (point: VirtualPoint) => {
      const pString = JSON.stringify(point);
      const id = pointToNodeIdMap.get(pString);
      if (id) return { id };

      const newId = getRandomId() as NodeId;
      setNodeList(nodeList.set(newId, { id: newId, point }));
      setPointToNodeIdMap(new Map(pointToNodeIdMap.set(pString, newId)));

      const edge = Array.from(edgeList.values()).find((e) => {
        const point1 = nodeList.get(e.node1)?.point;
        const point2 = nodeList.get(e.node2)?.point;
        if (point1 && point2) return isOnEdge(point1, point2, point);
        return false;
      });
      if (edge) {
        const map = separateEdge(newId, edge);
        return { id: newId, map };
      }

      return { id: newId };
    },
    [nodeList, pointToNodeIdAtom, edgeList]
  );

  return { setNode };
};

export default useNode;
