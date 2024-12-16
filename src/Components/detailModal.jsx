import { useEffect, useState } from 'react';
import Modal from 'react-modal';
import { URLS } from './urls';
import { GetData } from './funcionality/getcategories';
import { MdArrowBackIos, MdArrowForwardIos } from 'react-icons/md';
import './detailModal.css';

export default function DetailModal({
    isOpen,
    onRequestClose,
    modalData,
    modalDataFunc,
    getNewData,
    currentPage,
    setCurrentPage,
    hasNext,
    details,
    setdetail,
    invoice,
    user_id,
    user,
    customer_id,
}) {
    const [ids, setIds] = useState([]);
    const [filteredIds, setFilteredIds] = useState([]); // For filtering IDs
    const [inputValue, setInputValue] = useState(''); // Input value
    const [isDropdownOpen, setIsDropdownOpen] = useState(false); // Dropdown visibility
    const [quantity, setQuantity] = useState(0);
    const [requestError, setError] = useState('');
    const [itemID, setItemId] = useState(0);
    const [addStatus, setAddStatus] = useState(false);
    const selectedItem = {
        invoice: invoice,
        user: user_id,
        customer_info: customer_id,
        product_ID: details.id,
        quantity: quantity,
        price: details.price,
    };

    useEffect(() => {
        setError('');
        setAddStatus(false);
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
            setItemId(modalData.findIndex((obj) => obj.id === details.id));
            setInputValue('');
            setFilteredIds(ids);
            setIsDropdownOpen(false);
            setQuantity(0);
        }
    }, [isOpen, ids, modalData]);

    const handleInputChange = (event) => {
        const value = event.target.value;
        setInputValue(value);

        // Filter IDs based on input
        if (value) {
            const filtered = ids.filter((id) => id.toString().includes(value));
            setFilteredIds(filtered);
            setIsDropdownOpen(filtered.length > 0); // Open dropdown only if there are filtered items
        } else {
            setFilteredIds([]);
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
    const incrementQuantity = () => {
        setQuantity((prev) => Math.min(prev + 1, details.qty_in_wh));
    };

    const decrementQuantity = () => {
        setQuantity((prev) => Math.max(prev - 1, 0));
    };

    const handleQuantityChange = (event) => {
        const value = parseInt(event.target.value, 10);
        if (!isNaN(value)) {
            setQuantity(Math.min(Math.max(value, 0), details.qty_in_wh));
        }
    };
    const handelSave = async () => {
        setError('');
        try {
            const sendData = await fetch(URLS[0].Add_collection_data, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ collected_data: selectedItem }),
            });
            if (!sendData.ok) {
                throw new Error('Server error');
            }
            setAddStatus(true);
        } catch (error) {
            setError('Out of stock');
            console.error('Can not Create new data in server', error);
        }
    };
    const handleNext = async () => {
        if (itemID < modalData.length - 1) {
            setItemId((prev) => prev + 1);
            setdetail(modalData[itemID + 1]);
        }
        if (itemID === modalData.length - 2 && hasNext) {
            await setCurrentPage((prev) => prev + 1);
            setItemId((prev) => prev + 1);
        }
        setQuantity(0);
        setAddStatus(false);
    };
    const handlePreviouse = () => {
        if (itemID > 0) {
            setItemId((prev) => prev - 1);
            setdetail(modalData[itemID - 1]);
        }
        setQuantity(0);
        setAddStatus(false);
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
                <div className="header-input">
                    <input
                        className="search-input"
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
                    <div className="description-category">
                        <p>
                            <b>დასახელება</b>: {details.item_name}
                        </p>
                    </div>
                    <div className="description-category">
                        <p>
                            <b>კატეგორია</b>: {details.category_name}
                        </p>
                    </div>
                    <div className="grid lg:grid-cols-2 md:grid-cols-1 sm:grid-cols-1 image-detail-container">
                        <div className="my-container">
                            <div>
                                <img
                                    className="image-item"
                                    src={details.image_urel}
                                    alt={details.id}
                                />
                                <div className="back-forward-button">
                                    <MdArrowBackIos onClick={handlePreviouse} />

                                    <MdArrowForwardIos onClick={handleNext} />
                                </div>
                            </div>
                        </div>
                        <div className="detail-container">
                            <div className="detail-items">
                                <span>
                                    ID:
                                    <b> {details.id}</b>
                                </span>
                            </div>

                            <div className="detail-items">
                                <span>
                                    რაოდენობა:
                                    <b>
                                        {' '}
                                        {details.qty_in_wh} {details.dimention}
                                    </b>
                                </span>
                            </div>
                            <div className="detail-items">
                                <span>
                                    ფასი:<b> {details.price} ლ</b>
                                </span>
                            </div>
                            <div className="choose-quantity">
                                <button
                                    className="minus-btn"
                                    onClick={decrementQuantity}
                                >
                                    -
                                </button>
                                <input
                                    type="number"
                                    className="quantity-input"
                                    value={quantity}
                                    onChange={handleQuantityChange}
                                />
                                <button
                                    className="plus-btn"
                                    onClick={incrementQuantity}
                                >
                                    +
                                </button>
                            </div>
                            <div className="save-btn-div">
                                <button
                                    className="save-btn"
                                    onClick={handelSave}
                                >
                                    დამატება
                                </button>
                                {addStatus && (
                                    <div>
                                        <span>Added</span>
                                    </div>
                                )}
                                {requestError && (
                                    <div>
                                        <span>{requestError}</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Modal>
    );
}
