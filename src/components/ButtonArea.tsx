/* eslint-disable no-console */
import { Fab, Tooltip } from '@mui/material';
import React from 'react';
import { useRecoilCallback, useSetRecoilState } from 'recoil';
import { Add, Description, HorizontalRule, Label, Save } from '@mui/icons-material';
import {
  edgeListAtom,
  labelModalAtom,
  modeAtom,
  modeSelector,
  nodeIdToEdgeIdAtom,
  nodeListAtom,
  pointToNodeIdAtom,
} from '../atoms';
import { Mode } from '../helpers/modehelper';
import { netListSelector } from '../atoms/netListAtom';

const ButtonArea: React.FC = () => {
  const setMode = useSetRecoilState(modeSelector);
  const setLabelModal = useSetRecoilState(labelModalAtom);
  const showNetList = useRecoilCallback(
    ({ snapshot }) =>
      () => {
        const netlist = snapshot.getLoadable(netListSelector).getValue();
        console.log(netlist);

        (async () => {
          const opts = {
            suggestedName: 'example',
            types: [
              {
                description: 'Text file',
                accept: { 'text/plain': ['.net'] },
              },
            ],
          };
          const handle = await window.showSaveFilePicker(opts);
          const writable = await handle.createWritable();
          await writable.write(netlist);
          await writable.close();
        })()
          .then(() => {})
          .catch(() => {});
      },
    []
  );
  const showInfo = useRecoilCallback(
    ({ snapshot }) =>
      () => {
        const nodeList = snapshot.getLoadable(nodeListAtom).getValue();
        const nodeMap = snapshot.getLoadable(pointToNodeIdAtom).getValue();
        const edgeList = snapshot.getLoadable(edgeListAtom).getValue();
        const edgeMap = snapshot.getLoadable(nodeIdToEdgeIdAtom).getValue();
        const mode = snapshot.getLoadable(modeAtom).getValue();
        const netlist = snapshot.getLoadable(netListSelector).getValue();
        console.log('mode: ', mode);
        console.log('nodeList: ', nodeList);
        console.log('nodeMap: ', nodeMap);
        console.log('edgeList: ', edgeList);
        console.log('edgeMap: ', edgeMap);
        console.log(netlist);
      },
    []
  );

  return (
    <div style={{ float: 'left', marginTop: 5 }}>
      <Tooltip title="wire" style={{ marginLeft: 5 }}>
        <Fab aria-label="wire" color="primary" onClick={() => setMode(Mode.WIRE)}>
          <HorizontalRule />
        </Fab>
      </Tooltip>
      <Tooltip title="symbol" style={{ marginLeft: 10 }}>
        <Fab aria-label="symbol" color="primary" onClick={() => setMode(Mode.SYMBOL)}>
          <Add />
        </Fab>
      </Tooltip>
      <Tooltip title="label" style={{ marginLeft: 10 }}>
        <Fab
          color="primary"
          aria-label="add label"
          onClick={() => {
            setMode(Mode.LABEL);
            setLabelModal(true);
          }}
        >
          <Label />
        </Fab>
      </Tooltip>
      <Tooltip title="save as netlist" style={{ marginLeft: 10 }}>
        <Fab aria-label="netlist" onClick={showNetList}>
          <Save />
        </Fab>
      </Tooltip>
      <Tooltip title="console log" style={{ marginLeft: 10 }}>
        <Fab aria-label="get log" onClick={showInfo}>
          <Description />
        </Fab>
      </Tooltip>
    </div>
  );
};

export default ButtonArea;
