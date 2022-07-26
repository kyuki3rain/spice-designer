import { useCallback } from 'react';
import { useRecoilState, useRecoilValue } from 'recoil';
import { nodeIdToLabelAtom, previewLabelNameAtom } from '../atoms';
import { VirtualPoint } from '../helpers/gridhelper';
import { useNode } from './useNode';

export const useLabel = () => {
  const [labelList, setLabelList] = useRecoilState(nodeIdToLabelAtom);
  const labelName = useRecoilValue(previewLabelNameAtom);
  const { setNode } = useNode();

  const setLabel = useCallback(
    (point: VirtualPoint) => {
      const { id } = setNode(point);
      setLabelList(labelList.set(id, labelName));
    },
    [labelName, labelList]
  );

  return { setLabel };
};

export default useLabel;
