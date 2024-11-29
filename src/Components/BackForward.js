import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import { FreeMode, Navigation, Thumbs } from 'swiper/modules';
// import NavigationBar from './navBar';
import 'swiper/css';
import 'swiper/css/free-mode';
import 'swiper/css/navigation';
import 'swiper/css/thumbs';
import './BackForward.css';
import { URLS } from './urls';

export default function BackForward() {
    const [data, setData] = useState([]);
    const [inputValue, setInputValue] = useState(0);
    const [collectedData, setCollectedData] = useState([]);
    const [thumbsSwiper, setThumbsSwiper] = useState(null);
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
                (item) =>
                    item.product_ID ===
                    data[thumbsSwiper?.activeIndex]?.product_id
            );
            if (itemIndex !== -1) {
                const updatedData = [...collectedData];
                updatedData[itemIndex].quantity += parseInt(inputValue, 10);
                setCollectedData(updatedData);
            } else {
                const newItem = {
                    user: selectdID,
                    customer_info: parseInt(customerID, 10),
                    product_ID: data[thumbsSwiper?.activeIndex]?.product_id,
                    item_name: data[thumbsSwiper?.activeIndex]?.item_name,
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
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ collected_data: collectedData }),
        }).then((res) => {
            if (res.ok) {
                console.log('Data saved');
                setCollectedData([]);
            } else {
                console.error('Error saving data');
            }
        });
    };

    const backToCustomer = () => {
        navigate(`/`);
    };

    return (
        // <>
        //     <NavigationBar />
        <div className="container-content">
            <button onClick={backToCustomer}>Back</button>
            {data.length > 0 && (
                <>
                    <Swiper
                        style={{
                            '--swiper-navigation-color': '#fff',
                            '--swiper-pagination-color': '#fff',
                        }}
                        loop={true}
                        spaceBetween={10}
                        navigation={true}
                        thumbs={{ swiper: thumbsSwiper }}
                        modules={[FreeMode, Navigation, Thumbs]}
                        className="mainSwiper"
                    >
                        {data.map((item, index) => (
                            <SwiperSlide key={index}>
                                <div className="card">
                                    <img
                                        src={item.image_urel}
                                        alt={item.product_id}
                                        className="card-image"
                                    />
                                    <div className="item-details">
                                        <span className="item_names">
                                            <span>ID: {item.product_id}</span>
                                        </span>
                                        <span className="item_names">
                                            <span>Stock: {item.qty_in_wh}</span>
                                        </span>
                                        <span className="item_names">
                                            <span>
                                                Price: {item.price} ლარი
                                            </span>
                                        </span>
                                    </div>
                                </div>
                            </SwiperSlide>
                        ))}
                    </Swiper>
                    <Swiper
                        onSwiper={setThumbsSwiper}
                        loop={true}
                        spaceBetween={10}
                        slidesPerView={6} /* Default value */
                        breakpoints={{
                            200: {
                                slidesPerView: 2, // Show 2 slides on very small screens
                            },
                            600: {
                                slidesPerView: 4, // Show 4 slides on small screens
                            },
                            800: {
                                slidesPerView: 6, // Show 6 slides on medium to large screens
                            },
                        }}
                        freeMode={true}
                        watchSlidesProgress={true}
                        modules={[FreeMode, Navigation, Thumbs]}
                        className="thumbSwiper"
                    >
                        {data.map((item, index) => (
                            <SwiperSlide key={index}>
                                <img
                                    src={item.image_urel}
                                    alt={item.product_id}
                                    className="thumbnail-image"
                                />
                            </SwiperSlide>
                        ))}
                    </Swiper>
                    <div className="input-section">
                        <input
                            type="number"
                            value={inputValue}
                            onChange={handleInputChanges}
                            className="quantity-input"
                        />
                        <button onClick={handleSave} className="save-button">
                            Save
                        </button>
                        <button
                            onClick={handleFinish}
                            className="finish-button"
                        >
                            Finish
                        </button>
                    </div>
                </>
            )}
        </div>
        // </>
    );
}
