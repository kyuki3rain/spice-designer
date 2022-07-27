import React from 'react';
import './App.css';
import { RecoilRoot } from 'recoil';
import Controller from './Controller';
import ButtonArea from './components/ButtonArea';
import DrawArea from './components/DrawArea';
import LabelModal from './components/LabelModal';

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
