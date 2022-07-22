import React from 'react';
import './App.css';
import { RecoilRoot } from 'recoil';
import Controller from './Controller';
import ButtonArea from './ButtonArea';
import DrawArea from './DrawArea';

const App: React.FC = () => (
  <React.StrictMode>
    <RecoilRoot>
      <Controller>
        <ButtonArea />
        <DrawArea />
      </Controller>
    </RecoilRoot>
  </React.StrictMode>
);

export default App;
