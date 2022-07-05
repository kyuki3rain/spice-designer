import { Arc, Circle, Group, Line } from "react-konva";
import { add, toRealGrid, VirtualPoint } from "../helpers/gridhelper";

type Props = {
    upperLeft: VirtualPoint,
    point: VirtualPoint,
    pitch: number,
}

const Signal: React.FC<Props> = ({ upperLeft, point, pitch }) => {
    let circle_center = toRealGrid(add(point, { vx: 0, vy: 0.5 }), pitch, upperLeft);
    return <Group>
        <Circle x={circle_center.x} y={circle_center.y} radius={2 * pitch} stroke="black" />
        <Arc rotation={180} angle={180} innerRadius={0.75 * pitch} outerRadius={0.75 * pitch} x={circle_center.x - 0.75 * pitch} y={circle_center.y} stroke="black" />
        <Arc angle={180} innerRadius={0.75 * pitch} outerRadius={0.75 * pitch} x={circle_center.x + 0.75 * pitch} y={circle_center.y} stroke="black" />
        <Line points={[circle_center.x, circle_center.y - 2 * pitch, circle_center.x, circle_center.y - 2.5 * pitch]} stroke="black" strokeWidth={2} />
        <Line points={[circle_center.x, circle_center.y + 2 * pitch, circle_center.x, circle_center.y + 2.5 * pitch]} stroke="black" strokeWidth={2} />
    </Group>;
}

export default Signal;
