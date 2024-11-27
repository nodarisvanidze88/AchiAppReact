import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck, faFloppyDisk } from '@fortawesome/free-solid-svg-icons';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/swiper-bundle.min.css';
import 'swiper/modules/navigation/navigation.min.css';
import 'swiper/modules/pagination/pagination.min.css';
import { Navigation, Pagination } from 'swiper';
import { URLS } from './urls';
import NavigationBar from './navBar';
import './BackForward.css';

export default function BackForward() {
    const [data, setData] = useState([]);
    const [inputValue, setInputValue] = useState(0);
    const [collectedData, setCollectedData] = useState([]);
    const [activeIndex, setActiveIndex] = useState(0); // Track active slide index
    const { userValue, selectdID, customerName, customerID } = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        fetch(URLS[0].All_Items)
            .then((res) => res.json())
            .then((res) => {
                setData(res);
            });
    }, []);

    const handleInputChanges = (e) => {
        setInputValue(e.target.value);
    };

    const handleSave = () => {
        if (inputValue > 0) {
            const itemIndex = collectedData.findIndex(
                (item) => item.product_ID === data[activeIndex].product_id
            );
            if (itemIndex !== -1) {
                const updatedData = [...collectedData];
                updatedData[itemIndex].quantity += parseInt(inputValue, 10);
                setCollectedData(updatedData);
            } else {
                const newItem = {
                    user: selectdID,
                    customer_info: parseInt(customerID, 10),
                    product_ID: data[activeIndex].product_id,
                    item_name: data[activeIndex].item_name,
                    quantity: parseInt(inputValue, 10),
                };
                setCollectedData((prevData) => [...prevData, newItem]);
            }
            setInputValue(0);
        }
    };

    const handleFinish = () => {
        console.log(collectedData);
        fetch(URLS[0].Add_collection_data, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ collected_data: collectedData }),
        }).then((res) => {
            if (res.ok) {
                console.log('Data Saved');
                setCollectedData([]);
            } else {
                console.error('error');
            }
        });
    };

    const backToCustomer = () => {
        navigate(`/`);
    };

    const getQuantityForCurrentItem = () => {
        const currentItem = collectedData.find(
            (item) => item.product_ID === data[activeIndex].product_id
        );
        return currentItem ? currentItem.quantity : 0;
    };

    return (
        <>
            <NavigationBar />
            <div className="container-content">
                <button onClick={backToCustomer}>Back</button>
                {data.length > 0 && (
                    <div className="items-images-buttons">
                        <Swiper
                            modules={[Navigation, Pagination]}
                            navigation
                            pagination={{ clickable: true }}
                            onSlideChange={(swiper) =>
                                setActiveIndex(swiper.activeIndex)
                            }
                            className="swiper-container"
                        >
                            {data.map((item, index) => (
                                <SwiperSlide
                                    key={index}
                                    className="swiper-slide"
                                >
                                    <div className="image-item">
                                        <img
                                            src={item.image_urel}
                                            alt="No"
                                            height={400}
                                            width={400}
                                            className="swiper-image"
                                        />
                                        <div className="item-details">
                                            <span className="item_names">
                                                დასახელება:{' '}
                                                <span className="item_name_content">
                                                    {item.item_name}
                                                </span>
                                            </span>
                                            <span className="item_names">
                                                კატეგორია:{' '}
                                                <span className="item_name_content">
                                                    {item.category_name}
                                                </span>
                                            </span>
                                            <span className="item_names">
                                                რაოდენობა:{' '}
                                                <span className="item_name_content">
                                                    {item.qty_in_wh}{' '}
                                                    {item.dimention}
                                                </span>
                                            </span>
                                            <span className="item_names">
                                                ღირებულება:{' '}
                                                <span className="item_name_content">
                                                    {item.price} ლარი
                                                </span>
                                            </span>
                                        </div>
                                    </div>
                                </SwiperSlide>
                            ))}
                        </Swiper>

                        <div className="produqct-qt">
                            <input
                                type="number"
                                value={inputValue}
                                onChange={handleInputChanges}
                                className="quantity-input"
                            />
                            <button
                                type="submit"
                                onClick={handleSave}
                                className="save-button"
                            >
                                <FontAwesomeIcon icon={faCheck} size="2xl" />
                            </button>
                            <button
                                type="submit"
                                onClick={handleFinish}
                                className="finish-button"
                            >
                                <FontAwesomeIcon
                                    icon={faFloppyDisk}
                                    size="2xl"
                                />
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
}
