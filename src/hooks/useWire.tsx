import { useState } from 'react';
import { Group, Line } from 'react-konva';
import { toRealGrid, VirtualPoint } from '../helpers/gridhelper';

type WireVertex = {
  id: number;
  point: VirtualPoint;
};

type PointToVertexIndexMap = {
  [key: number]: {
    [key: number]: number;
  };
};
type WireEdge = {
  id: number;
  point1: number;
  point2: number;
};

type VertexToEdgeIndexMap = {
  [key: number]: {
    [key: number]: number;
  };
};

export const useWire = (): [
  (p: VirtualPoint) => void,
  (point: VirtualPoint) => void,
  () => void,
  (pitch: number, upperLeft: VirtualPoint) => JSX.Element
] => {
  const [vertexList, setVertexVertexList] = useState([] as WireVertex[]);
  const [pointMap, setPointMap] = useState({} as PointToVertexIndexMap);
  const [edgeList, setEdgeList] = useState([] as WireEdge[]);
  const [edgeMap, setEdgeMap] = useState({} as VertexToEdgeIndexMap);
  const [selectedVertexIndex, setSelectedVertexIndex] = useState(NaN);
  const [previewPoint, setPreviewPoint] = useState({} as VirtualPoint);

  const resetSelect = () => {
    setSelectedVertexIndex(NaN);
    setPreviewPoint({} as VirtualPoint);
  };

  const setPoint = (p: VirtualPoint) => {
    let id = NaN;
    if (p.vx in pointMap && p.vy in pointMap[p.vx] && Number.isNaN(pointMap[p.vx][p.vy])) {
      id = pointMap[p.vx][p.vy];
    } else {
      id = vertexList.length;
      setVertexVertexList([...vertexList, { id, point: p }]);
      setPointMap({ ...pointMap, [p.vx]: { ...edgeMap[p.vx], [p.vy]: id }, [p.vy]: { ...edgeMap[p.vy], [p.vx]: id } });
    }

    if (!Number.isNaN(selectedVertexIndex)) {
      const edgeId = edgeList.length;
      setEdgeList([...edgeList, { id: edgeId, point1: id, point2: selectedVertexIndex }]);
      setEdgeMap({
        ...edgeMap,
        [id]: { ...edgeMap[id], [selectedVertexIndex]: edgeId },
        [selectedVertexIndex]: { ...edgeMap[selectedVertexIndex], [id]: edgeId },
      });
    }

    setSelectedVertexIndex(id);
  };

  const setPreview = (point: VirtualPoint) => {
    setPreviewPoint(point);
  };

  const createPreviewWire = (pitch: number, upperLeft: VirtualPoint) => {
    if (Number.isNaN(selectedVertexIndex)) return null;

    const selectedPoint = toRealGrid(vertexList[selectedVertexIndex].point, pitch, upperLeft);
    const previewRealPoint = toRealGrid(previewPoint, pitch, upperLeft);

    return (
      <Line
        key="prev_wire"
        x={0}
        y={0}
        points={[selectedPoint.x, selectedPoint.y, previewRealPoint.x, previewRealPoint.y]}
        stroke="black"
        strokeWidth={2}
      />
    );
  };

  const createWires = (pitch: number, upperLeft: VirtualPoint) => {
    const wires = edgeList.map((e) => {
      const point1 = toRealGrid(vertexList[e.point1].point, pitch, upperLeft);
      const point2 = toRealGrid(vertexList[e.point2].point, pitch, upperLeft);
      return (
        <Line
          key={`wire_e${e.id}`}
          x={0}
          y={0}
          points={[point1.x, point1.y, point2.x, point2.y]}
          stroke="black"
          strokeWidth={2}
        />
      );
    });

    return (
      <Group>
        {wires}
        {createPreviewWire(pitch, upperLeft)}
      </Group>
    );
  };

  return [setPoint, setPreview, resetSelect, createWires];
};

export default useWire;