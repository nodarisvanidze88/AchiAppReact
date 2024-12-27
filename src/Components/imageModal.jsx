
import Modal from 'react-modal';

import './detailModal.css';
export default function ImageModal({
    isOpen,
    onRequestClose,
    imageUrl
}) {
    
    return (
        <Modal
            isOpen={isOpen}
            onRequestClose={onRequestClose}
            contentLabel="Product Image"
            style={{
                overlay: {
                    backgroundColor: 'rgba(0, 0, 0, 0.5)',
                },
                content: {
                    backgroundColor: 'rgba(0, 0, 0, 0.9)',
                    border: null,
                    borderRadius: '10px',
                    width: '80vw',
                    height: '80vh',
                    padding: 0,
                    margin: 'auto',
                },
            }}
        >
            <div className="detail-modal-container">      
                <img src={imageUrl} alt="Product_image" style={{ maxWidth: '100%', maxHeight: '80vh' }} />                
            </div>
        </Modal>
    );
}
