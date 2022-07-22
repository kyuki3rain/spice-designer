/* eslint-disable no-console */
import { Fab } from '@mui/material';
import React from 'react';
import { useRecoilCallback, useSetRecoilState } from 'recoil';
import { Add, Description, HorizontalRule } from '@mui/icons-material';
import { edgeListAtom, modeSelector, nodeListAtom } from './atoms';
import { Mode } from './helpers/modehelper';

const ButtonArea: React.FC = () => {
  const setMode = useSetRecoilState(modeSelector);
  const showInfo = useRecoilCallback(
    ({ snapshot }) =>
      () => {
        const nodeList = snapshot.getLoadable(nodeListAtom).getValue();
        const edgeList = snapshot.getLoadable(edgeListAtom).getValue();
        console.log('nodeList: ', nodeList);
        console.log('edgeList: ', edgeList);
      },
    []
  );

  return (
    <div style={{ float: 'left' }}>
      <Fab aria-label="wire" onClick={() => setMode(Mode.WIRE)}>
        <HorizontalRule />
      </Fab>
      <Fab
        aria-label="symbol"
        color="primary"
        onClick={() => {
          setMode(Mode.SYMBOL);
        }}
      >
        <Add />
      </Fab>
      <Fab color="primary" aria-label="get log" onClick={showInfo}>
        <Description />
      </Fab>
    </div>
  );
};

export default ButtonArea;
