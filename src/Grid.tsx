import { Group, Line } from 'react-konva';
import { useRecoilValue } from 'recoil';
import { pitchAtom, upperLeftAtom } from './atoms';
import { useWindowSize } from './hooks/useWindowSize';

const createGrid = (points: number[], key: string) => (
  <Line key={key} x={0} y={0} points={points} stroke="lightgray" strokeWidth={1} />
);

const Grid: React.FC = () => {
  const { height, width } = useWindowSize();
  const pitch = useRecoilValue(pitchAtom);
  const upperLeft = useRecoilValue(upperLeftAtom);

  const verticalCorrection = Math.ceil(upperLeft.vx) - upperLeft.vx;
  const horizontalCorrection = Math.ceil(upperLeft.vy) - upperLeft.vy;

  return (
    <Group>
      {[...(Array(Math.ceil(width / pitch)) as number[])].map((_, i) =>
        createGrid(
          [(i + verticalCorrection) * pitch, 0, (i + verticalCorrection) * pitch, height],
          `vertical_grid_${i}`
        )
      )}
      {[...(Array(Math.floor(height / pitch)) as number[])].map((_, i) =>
        createGrid(
          [0, (i + horizontalCorrection) * pitch, width, (i + horizontalCorrection) * pitch],
          `horizontal_grid_${i}`
        )
      )}
    </Group>
  );
};

export default Grid;
