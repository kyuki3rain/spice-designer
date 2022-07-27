import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import { useRecoilState, useSetRecoilState } from 'recoil';
import { Button, TextField } from '@mui/material';
import { labelModalAtom, modeAtom, previewLabelNameAtom } from '../atoms';
import { Mode } from '../helpers/modehelper';

const style = {
  position: 'absolute' as const,
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

const LabelModal = () => {
  const [open, setOpen] = useRecoilState(labelModalAtom);
  const [labelName, setLabelName] = useRecoilState(previewLabelNameAtom);
  const setMode = useSetRecoilState(modeAtom);
  const handleClose = () => {
    setOpen(false);
    if (labelName === '') setMode(Mode.NONE);
  };

  return (
    <div>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <TextField
            placeholder="Placeholder"
            id="standard-basic"
            label="Standard"
            variant="standard"
            value={labelName}
            onChange={(e) => setLabelName(e.target.value)}
          />
          <Button onClick={handleClose}>enter</Button>
        </Box>
      </Modal>
    </div>
  );
};

export default LabelModal;
