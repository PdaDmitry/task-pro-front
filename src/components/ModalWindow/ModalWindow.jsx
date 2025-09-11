// import Modal from 'react-modal';

import { Modal } from 'antd';

const modalStyles = {
  overlay: {
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    zIndex: 2000,
  },
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
    backgroundColor: 'transparent',
    border: 'none',
    zIndex: 2001,
    padding: '0',
  },
};

const ModalWindow = ({ isOpen, onClose, children }) => {
  return (
    <Modal isOpen={isOpen} onRequestClose={onClose} style={modalStyles}>
      {children}
    </Modal>
  );
};

export default ModalWindow;
