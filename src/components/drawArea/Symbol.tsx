import { Group } from 'react-konva';
import { useRecoilValue } from 'recoil';
import { pitchAtom, previewSymbolAtom, symbolsAtom, upperLeftAtom } from '../../atoms';
import { createSymbol } from '../../symbols';

export const Symbol: React.FC = () => {
  const pitch = useRecoilValue(pitchAtom);
  const upperLeft = useRecoilValue(upperLeftAtom);
  const symbols = useRecoilValue(symbolsAtom);
  const previewSymbol = useRecoilValue(previewSymbolAtom);

  return (
    <Group>
      {symbols.map((c, i) => createSymbol(c, pitch, upperLeft, `symbol_${i}_${c.type}`))}
      {previewSymbol && createSymbol(previewSymbol, pitch, upperLeft, `symbol_preview`)}
    </Group>
  );
};

export default Symbol;
