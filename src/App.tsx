import React from 'react';
import './App.css';
import { RecoilRoot } from 'recoil';
import Controller from './Controller';
import ButtonArea from './ButtonArea';
import DrawArea from './DrawArea';
import LabelModal from './LabelModal';

const App: React.FC = () => (
  <React.StrictMode>
    <RecoilRoot>
      <Controller>
        <ButtonArea />
        <DrawArea />
        <LabelModal />
      </Controller>
    </RecoilRoot>
  </React.StrictMode>
);

export default App;
