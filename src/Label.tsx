import { Group, Text } from 'react-konva';
import { useRecoilValue } from 'recoil';
import {
  nodeIdToLabelAtom,
  nodeListAtom,
  pitchAtom,
  previewLabelNameAtom,
  previewLabelPositionAtom,
  upperLeftAtom,
} from './atoms';
import { toRealGrid } from './helpers/gridhelper';

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
        return <Text x={rp.x} y={rp.y} fontSize={20} text={label} wrap="char" key={`label_${nodeId}`} />;
      })}
      {prp && <Text x={prp.x} y={prp.y} fontSize={20} text={previewLabelName} wrap="char" />}
    </Group>
  );
};

export default Label;
