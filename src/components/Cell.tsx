import { Arc, Circle, Group, Line, Rect } from "react-konva";
import { add, toRealGrid, VirtualPoint } from "../helpers/gridhelper";

type Props = {
    upperLeft: VirtualPoint,
    point: VirtualPoint,
    pitch: number,
}

const Cell: React.FC<Props> = ({ upperLeft, point, pitch }) => {
    let center = toRealGrid(point, pitch, upperLeft);
    return <Group>
        <Rect x={center.x - 1 * pitch} y={center.y} width={2 * pitch} height={0.5 * pitch} stroke="black" />
        <Line points={[center.x, center.y - 0.5 * pitch, center.x, center.y - 2 * pitch]} stroke="black" strokeWidth={2} />
        <Line points={[center.x, center.y + 0.5 * pitch, center.x, center.y + 2 * pitch]} stroke="black" strokeWidth={2} />
        <Line points={[center.x - 2 * pitch, center.y - 0.5 * pitch, center.x + 2 * pitch, center.y - 0.5 * pitch]} stroke="black" strokeWidth={2} />
    </Group>;
}

export default Cell;
