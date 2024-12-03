import { useEffect, useState } from 'react';
import Modal from 'react-modal';
import { URLS } from './urls';
import { GetData } from './funcionality/getcategories';

export default function DetailModal({
    isOpen,
    onRequestClose,
    details,
    setdetail,
    selected,
    selectfunc,
}) {
    const [ids, setIds] = useState([]);
    const [filteredIds, setFilteredIds] = useState([]); // For filtering IDs
    const [inputValue, setInputValue] = useState(''); // Input value
    const [isDropdownOpen, setIsDropdownOpen] = useState(false); // Dropdown visibility

    useEffect(() => {
        const fetchIds = async () => {
            try {
                const data = await GetData(URLS[0].ids); // Await the Promise
                if (data) {
                    setIds(data);
                    setFilteredIds(data);
                }
            } catch (error) {
                console.error('Error fetching IDs:', error);
            }
        };

        if (isOpen && ids.length === 0) {
            fetchIds();
        }
    }, [isOpen, ids.length]);

    useEffect(() => {
        // Clear input and dropdown when modal opens
        if (isOpen) {
            setInputValue('');
            setFilteredIds(ids);
            setIsDropdownOpen(false);
        }
    }, [isOpen, ids]);

    const handleInputChange = (event) => {
        const value = event.target.value;
        setInputValue(value);

        // Filter IDs based on input
        if (value) {
            const filtered = ids.filter((id) => id.toString().includes(value));
            setFilteredIds(filtered);
            setIsDropdownOpen(true);
        } else {
            setFilteredIds(ids);
            setIsDropdownOpen(false);
        }
    };

    const handleSelect = async (id) => {
        setInputValue(id.toString());
        setIsDropdownOpen(false);

        // Fetch new data for the selected ID
        try {
            const url = `${URLS[0].oneItem}?id=${id}`; // Adjust the endpoint as needed
            const data = await GetData(url);
            setdetail(data); // Call the parent function to handle new data
        } catch (error) {
            console.error('Error fetching item details:', error);
        }
    };

    return (
        <Modal
            isOpen={isOpen}
            onRequestClose={onRequestClose}
            contentLabel="Product Details"
            style={{
                overlay: {
                    backgroundColor: 'rgba(0, 0, 0, 0.5)',
                },
                content: {
                    top: '50%',
                    left: '50%',
                    right: 'auto',
                    bottom: 'auto',
                    marginRight: '-50%',
                    transform: 'translate(-50%, -50%)',
                    width: '80vw',
                    height: '80vh',
                },
            }}
        >
            <div className="detail-modal-container">
                <div className="header-input">
                    <input
                        type="text"
                        value={inputValue}
                        onChange={handleInputChange}
                        placeholder="Search or select ID"
                    />
                    {isDropdownOpen && (
                        <div className="dropdown">
                            {filteredIds.map((id) => (
                                <div
                                    key={id}
                                    className="dropdown-item"
                                    onClick={() => handleSelect(id)}
                                >
                                    {id}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
                <div className="detail-body-container">
                    <div className="image-container">
                        <img src={details.image_urel} alt={details.id} />
                    </div>
                    <div className="detail-container">
                        <p>ID: {details.id}</p>
                        <p>დასახელება: {details.item_name}</p>
                        <p>კატეგორია: {details.category_name}</p>
                        <p>რაოდენობა: {details.qty_in_wh}</p>
                        <p>ფასი: {details.price}</p>
                    </div>
                </div>
            </div>
        </Modal>
    );
}
