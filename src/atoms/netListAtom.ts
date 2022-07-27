import { selector } from 'recoil';
import { add } from '../helpers/gridhelper';
import { symbolNodes } from '../symbols';
import { nodeIdToLabelAtom } from './labelAtom';
import { symbolsAtom } from './symbolAtom';
import { NodeId, nodeIdToEdgeIdAtom, nodeListAtom, pointToNodeIdAtom } from './wireAtom';

export const netListSelector = selector({
  key: 'netList',
  get: ({ get }) => {
    const symbols = get(symbolsAtom);
    const pointToNodeIdMap = get(pointToNodeIdAtom);
    const nodeIdToEdgeIdMap = get(nodeIdToEdgeIdAtom);
    const nodeIdToLabelMap = get(nodeIdToLabelAtom);
    const nodeList = get(nodeListAtom);

    const allMap = new Map() as Map<NodeId, string>;
    const labelDict = new Map() as Map<string, string>;
    let defaultLabelId = 1;

    const checkNodeLabel = (checkId: NodeId, defaultLabel: string) => {
      allMap.set(checkId, defaultLabel);

      const idArray = Array.from(nodeIdToEdgeIdMap.get(checkId)?.keys() ?? []);
      const needCheck = idArray.filter((id) => !allMap.has(id));

      let label = defaultLabel;
      needCheck.map((id) => {
        const newLabel = checkNodeLabel(id, defaultLabel);
        label = label === defaultLabel ? newLabel : label;
        return label;
      });

      return nodeIdToLabelMap.get(checkId) ?? label;
    };

    nodeList.forEach((_, id) => {
      const defaultLabel = `N${`000${defaultLabelId}`.slice(-3)}`;
      if (!allMap.has(id)) {
        const label = checkNodeLabel(id, defaultLabel);
        labelDict.set(defaultLabel, label);
        defaultLabelId += 1;
      }
    });

    const netList: string[] = [];

    symbols.forEach((sarr, k) => {
      sarr.every((s, si) => {
        const points = symbolNodes(s.type);
        const labels = points.map((p) => {
          const nodeId = pointToNodeIdMap.get(JSON.stringify(add(p, s.point)));
          const dl = nodeId && allMap.get(nodeId);
          const label = dl && (labelDict.get(dl) || dl);
          return label === 'gnd' ? '0' : label;
        });

        const net = `${k}${si + 1} ${labels.join(' ')} ${s.config}`;

        netList.push(net);

        return true;
      });
    });

    return netList.join('\n');
  },
});
