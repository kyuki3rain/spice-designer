import { Group, Line } from 'react-konva';
import { useRecoilValue } from 'recoil';
import { edgeListAtom, nodeListAtom, pitchAtom, previewPointAtom, selectedNodeIdAtom, upperLeftAtom } from './atoms';
import { RealPoint, toRealGrid } from './helpers/gridhelper';

export const createLine = (a: RealPoint, b: RealPoint, key: string) => (
  <Line key={key} x={0} y={0} points={[a.x, a.y, b.x, b.y]} stroke="black" strokeWidth={2} />
);

const Wire: React.FC = () => {
  const pitch = useRecoilValue(pitchAtom);
  const upperLeft = useRecoilValue(upperLeftAtom);
  const edgeList = useRecoilValue(edgeListAtom);
  const nodeList = useRecoilValue(nodeListAtom);
  const selectedNodeId = useRecoilValue(selectedNodeIdAtom);
  const previewPoint = useRecoilValue(previewPointAtom);

  const selectedNode = selectedNodeId && nodeList.get(selectedNodeId);

  return (
    <Group>
      {Array.from(edgeList).map(([id, edge]) => {
        const node1 = nodeList.get(edge.node1);
        const node2 = nodeList.get(edge.node2);
        if (!node1 || !node2) return null;

        return createLine(
          toRealGrid(node1.point, pitch, upperLeft),
          toRealGrid(node2.point, pitch, upperLeft),
          `wire_${id}`
        );
      })}
      {selectedNode
        ? createLine(
            toRealGrid(selectedNode.point, pitch, upperLeft),
            toRealGrid(previewPoint, pitch, upperLeft),
            'prev_wire'
          )
        : null}
    </Group>
  );
};

export default Wire;
