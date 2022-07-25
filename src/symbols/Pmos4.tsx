import { Group, Line } from 'react-konva';
import { toRealGrid, VirtualPoint } from '../helpers/gridhelper';

type Props = {
  upperLeft: VirtualPoint;
  point: VirtualPoint;
  pitch: number;
};

const Pmos4: React.FC<Props> = ({ upperLeft, point, pitch }) => {
  const center = toRealGrid(point, pitch, upperLeft);
  return (
    <Group>
      <Line
        points={[
          center.x + 2 * pitch,
          center.y - 3 * pitch,
          center.x + 2 * pitch,
          center.y - 2 * pitch,
          center.x,
          center.y - 2 * pitch,
        ]}
        stroke="black"
        strokeWidth={2}
      />
      <Line points={[center.x, center.y, center.x + 0.5 * pitch, center.y]} stroke="black" strokeWidth={2} />
      <Line
        points={[
          center.x + 2 * pitch,
          center.y,
          center.x + 0.5 * pitch,
          center.y + 0.25 * pitch,
          center.x + 0.5 * pitch,
          center.y - 0.25 * pitch,
          center.x + 2 * pitch,
          center.y,
        ]}
        stroke="black"
        strokeWidth={2}
      />
      <Line
        points={[
          center.x + 2 * pitch,
          center.y + 3 * pitch,
          center.x + 2 * pitch,
          center.y + 2 * pitch,
          center.x,
          center.y + 2 * pitch,
        ]}
        stroke="black"
        strokeWidth={2}
      />
      <Line
        points={[center.x, center.y - 2.5 * pitch, center.x, center.y - 1.5 * pitch]}
        stroke="black"
        strokeWidth={2}
      />
      <Line
        points={[center.x, center.y - 0.5 * pitch, center.x, center.y + 0.5 * pitch]}
        stroke="black"
        strokeWidth={2}
      />
      <Line
        points={[center.x, center.y + 1.5 * pitch, center.x, center.y + 2.5 * pitch]}
        stroke="black"
        strokeWidth={2}
      />
      <Line
        points={[
          center.x - pitch,
          center.y + 2 * pitch,
          center.x - 0.5 * pitch,
          center.y + 2 * pitch,
          center.x - 0.5 * pitch,
          center.y - 2 * pitch,
        ]}
        stroke="black"
        strokeWidth={2}
      />
    </Group>
  );
};

export default Pmos4;
