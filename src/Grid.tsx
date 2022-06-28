import { Line } from "react-konva";

const createGrid = (points: number[], key: string) => {
    return <Line
        key={key}
        x={0}
        y={0}
        points={points}
        stroke="lightgray"
        strokeWidth={1}
    />
}

export const VerticalGrids = (pitch: number, width: number, height: number, upperLeftX: number) => {
    let hosei = (Math.ceil(upperLeftX) - upperLeftX);
    return [...Array(Math.ceil(width / pitch))].map((_, i) =>
        createGrid([(i + hosei) * pitch, 0, (i + hosei) * pitch, height], `vertical_grid_${i}`)
    );
}
export const HorizontalGrids = (pitch: number, width: number, height: number, upperLeftY: number) => {
    let hosei = (Math.ceil(upperLeftY) - upperLeftY);
    return [...Array(Math.floor(height / pitch))].map((_, i) =>
        createGrid([0, (i + hosei) * pitch, width, (i + hosei) * pitch], `horizontal_grid_${i}`)
    );
}