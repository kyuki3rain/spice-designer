import { atom } from 'recoil';
import { ComponentState } from '../components';

export const componentsAtom = atom({
  key: 'components',
  default: [] as ComponentState[],
});
