import { Group, Line, Text } from 'react-konva';
import { useRecoilValue } from 'recoil';
import {
  nodeIdToLabelAtom,
  nodeListAtom,
  pitchAtom,
  previewLabelNameAtom,
  previewLabelPositionAtom,
  upperLeftAtom,
} from './atoms';
import { RealPoint, toRealGrid } from './helpers/gridhelper';

const createLabel = (rp: RealPoint, label: string, key: string, pitch: number) => {
  if (label === 'gnd') {
    return (
      <Line
        points={[rp.x + 1 * pitch, rp.y, rp.x - 1 * pitch, rp.y, rp.x, rp.y + 1 * pitch, rp.x + 1 * pitch, rp.y]}
        stroke="black"
        strokeWidth={2}
        key={key}
      />
    );
  }

  return <Text x={rp.x} y={rp.y} fontSize={20} text={label} wrap="char" key={key} />;
};

const Label: React.FC = () => {
  const nodeIdToLabel = useRecoilValue(nodeIdToLabelAtom);
  const previewLabelName = useRecoilValue(previewLabelNameAtom);
  const previewLabelPosition = useRecoilValue(previewLabelPositionAtom);
  const nodeList = useRecoilValue(nodeListAtom);
  const pitch = useRecoilValue(pitchAtom);
  const upperLeft = useRecoilValue(upperLeftAtom);

  const prp = previewLabelPosition && toRealGrid(previewLabelPosition, pitch, upperLeft);

  return (
    <Group>
      {Array.from(nodeIdToLabel.entries()).map(([nodeId, label]) => {
        const node = nodeList.get(nodeId);
        if (!node) return null;

        const rp = toRealGrid(node.point, pitch, upperLeft);
        return createLabel(rp, label, `label_${nodeId}`, pitch);
      })}
      {prp && createLabel(prp, previewLabelName, `label_preview`, pitch)}
    </Group>
  );
};

export default Label;
