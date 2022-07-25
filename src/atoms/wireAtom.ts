import { atom } from 'recoil';
import { VirtualPoint } from '../helpers/gridhelper';

export type NodeId = string & { _brand: 'NodeId' };
export type WireNode = {
  id: NodeId;
  point: VirtualPoint;
};

export type NodeList = Map<NodeId, WireNode>;

export type PointToNodeIdMap = Map<string, NodeId>;

export type EdgeId = string & { _brand: 'EdgeId' };
export type WireEdge = {
  id: EdgeId;
  node1: NodeId;
  node2: NodeId;
};

export type EdgeList = Map<EdgeId, WireEdge>;

export type NodeIdToEdgeIdMap = Map<NodeId, Map<NodeId, EdgeId>>;

export const nodeListAtom = atom({
  key: 'nodeList',
  default: new Map() as NodeList,
});

export const pointToNodeIdAtom = atom({
  key: 'pointToNodeId',
  default: new Map() as PointToNodeIdMap,
});

export const edgeListAtom = atom({
  key: 'edgeList',
  default: new Map() as EdgeList,
});

export const nodeIdToEdgeIdAtom = atom({
  key: 'nodeIdToEdgeId',
  default: new Map() as NodeIdToEdgeIdMap,
});
