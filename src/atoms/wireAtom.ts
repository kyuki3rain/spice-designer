import { atom } from 'recoil';
import { VirtualPoint } from '../helpers/gridhelper';

export type NodeId = number;
export type WireNode = {
  id: NodeId;
  point: VirtualPoint;
};

export type PointToNodeIdMap = Map<string, NodeId>;

export type EdgeId = number;
export type WireEdge = {
  id: EdgeId;
  node1: NodeId;
  node2: NodeId;
};

export type NodeIdToEdgeIdMap = Map<NodeId, [NodeId, EdgeId][]>;

export const nodeListAtom = atom({
  key: 'nodeList',
  default: [] as WireNode[],
});

export const pointToNodeIdAtom = atom({
  key: 'pointToNodeId',
  default: new Map() as PointToNodeIdMap,
});

export const edgeListAtom = atom({
  key: 'edgeList',
  default: [] as WireEdge[],
});

export const nodeIdToEdgeIdAtom = atom({
  key: 'nodeIdToEdgeId',
  default: new Map() as NodeIdToEdgeIdMap,
});
