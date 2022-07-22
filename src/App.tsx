import React from 'react';
import './App.css';
import { RecoilRoot } from 'recoil';
import Main from './Main';

const App: React.FC = () => (
  <React.StrictMode>
    <RecoilRoot>
      <Main />
    </RecoilRoot>
  </React.StrictMode>
);

export default App;
