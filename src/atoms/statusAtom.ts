import { atom } from 'recoil';
import { ComponentType, ComponentTypes } from '../components';
import { Mode, ModeType } from '../helpers/modehelper';

export const modeAtom = atom({
  key: 'mode',
  default: Mode.NONE as ModeType,
});

export const componentTypeAtom = atom({
  key: 'componentType',
  default: ComponentTypes.CELL as ComponentType,
});
