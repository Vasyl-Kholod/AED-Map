import React from 'react';
import ModalWrapper from 'shared/ui/ModalWrapper';
import ResetSendmailModal from './components/ResetSendmailModal';
import ButtonResetSendmail from './components/ButtonResetSendmail';

const ResetSendmail = () => (
  <ModalWrapper
    ButtonOpen={ButtonResetSendmail}
    ModalContent={ResetSendmailModal}
  />
);

export default ResetSendmail;
