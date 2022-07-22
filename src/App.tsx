import React from 'react';
import './App.css';
import { RecoilRoot } from 'recoil';
import DrawArea from './DrawArea';
import ButtonArea from './ButtonArea';

const App: React.FC = () => (
  <React.StrictMode>
    <RecoilRoot>
      <ButtonArea />
      <DrawArea />
    </RecoilRoot>
  </React.StrictMode>
);

export default App;
