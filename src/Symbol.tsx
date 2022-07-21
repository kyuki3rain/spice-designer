import { Group } from 'react-konva';
import { useRecoilValue } from 'recoil';
import { pitchAtom, symbolsAtom, upperLeftAtom } from './atoms';
import { createSymbol } from './symbols';

export const Symbol: React.FC = () => {
  const pitch = useRecoilValue(pitchAtom);
  const upperLeft = useRecoilValue(upperLeftAtom);
  const symbols = useRecoilValue(symbolsAtom);

  return <Group>{symbols.map((c, i) => createSymbol(c, pitch, upperLeft, `symbol_${i}_${c.type}`))}</Group>;
};

export default Symbol;
