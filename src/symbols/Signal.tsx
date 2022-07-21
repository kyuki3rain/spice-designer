import { Arc, Circle, Group, Line } from 'react-konva';
import { add, toRealGrid, VirtualPoint } from '../helpers/gridhelper';

type Props = {
  upperLeft: VirtualPoint;
  point: VirtualPoint;
  pitch: number;
};

const Signal: React.FC<Props> = ({ upperLeft, point, pitch }) => {
  const circleCenter = toRealGrid(add(point, { vx: 0, vy: 0.5 }), pitch, upperLeft);
  return (
    <Group>
      <Circle x={circleCenter.x} y={circleCenter.y} radius={2 * pitch} stroke="black" />
      <Arc
        rotation={180}
        angle={180}
        innerRadius={0.75 * pitch}
        outerRadius={0.75 * pitch}
        x={circleCenter.x - 0.75 * pitch}
        y={circleCenter.y}
        stroke="black"
      />
      <Arc
        angle={180}
        innerRadius={0.75 * pitch}
        outerRadius={0.75 * pitch}
        x={circleCenter.x + 0.75 * pitch}
        y={circleCenter.y}
        stroke="black"
      />
      <Line
        points={[circleCenter.x, circleCenter.y - 2 * pitch, circleCenter.x, circleCenter.y - 2.5 * pitch]}
        stroke="black"
        strokeWidth={2}
      />
      <Line
        points={[circleCenter.x, circleCenter.y + 2 * pitch, circleCenter.x, circleCenter.y + 2.5 * pitch]}
        stroke="black"
        strokeWidth={2}
      />
    </Group>
  );
};

export default Signal;
