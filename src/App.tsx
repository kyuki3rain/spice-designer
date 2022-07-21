import React from 'react';
import './App.css';
import { RecoilRoot } from 'recoil';
import DrawArea from './DrawArea';

const App: React.FC = () => (
  <React.StrictMode>
    <RecoilRoot>
      <DrawArea />
    </RecoilRoot>
  </React.StrictMode>
);

export default App;
