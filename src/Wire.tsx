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

  return (
    <Group>
      {edgeList.map((e) =>
        createLine(
          toRealGrid(nodeList[e.node1].point, pitch, upperLeft),
          toRealGrid(nodeList[e.node2].point, pitch, upperLeft),
          `wire_e${e.id}`
        )
      )}
      {selectedNodeId === null
        ? null
        : createLine(
            toRealGrid(nodeList[selectedNodeId].point, pitch, upperLeft),
            toRealGrid(previewPoint, pitch, upperLeft),
            'prev_wire'
          )}
    </Group>
  );
};

export default Wire;
