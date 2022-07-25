import { atom } from 'recoil';
import { VirtualPoint } from '../helpers/gridhelper';
import { NodeId } from './wireAtom';

export const nodeIdToLabelAtom = atom({
  key: 'nodeIdToLabel',
  default: new Map() as Map<NodeId, string>,
});

export const labelModalAtom = atom({
  key: 'labelModal',
  default: false,
});

export const previewLabelNameAtom = atom({
  key: 'previewLabelName',
  default: '',
});
export const previewLabelPositionAtom = atom({
  key: 'previewLabelPosition',
  default: null as VirtualPoint | null,
});
