import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faAnglesUp, faCheck,faFloppyDisk} from '@fortawesome/free-solid-svg-icons'
import {BackForwardTable}from './BackForwardTable'
import {URLS} from "./urls"
import './BackForward.css'
export default function BackForward() {
    const [data, setData] = useState([])
    const [currentIndex, setCurrentIndex] = useState(0)
    const [inputValue, setInputValue] = useState(0)
    const [collectedData, setCollectedData] = useState([])
    const { userValue, selectdID,customerName,customerID  } = useParams()
    const navigate = useNavigate();
    useEffect(() => {
        fetch(URLS[0].All_Items)
            .then(res => res.json())
            .then(res => {
                setData(res)
            })
    }, [])
    const handelNext = () => {
        setCurrentIndex(previousIndex => {
            if (previousIndex <= data.length - 1) {
                return previousIndex + 1
            } else {
                return previousIndex
            }
        })
        setInputValue(0)
    }
    const handeBack = () => {
        setCurrentIndex(previousIndex => {
            if (previousIndex > 0) {
                return previousIndex - 1
            } else {
                return previousIndex
            }
        })
        setInputValue(0)
    }
    const handleInputChanges = (e) => {
        setInputValue(e.target.value)
    }
    const handleSave = () => {
        if (inputValue > 0) {
            const itemIndex = collectedData.findIndex(item => item.product_ID === data[currentIndex].product_id)
            if (itemIndex !== -1) {
                const updatedData = [...collectedData]
                updatedData[itemIndex].quantity += parseInt(inputValue, 10)
                setCollectedData(updatedData)
            } else {
                const newItem = {
                    user: selectdID,
                    customer_info: parseInt(customerID,10),
                    product_ID: data[currentIndex].product_id,
                    item_name: data[currentIndex].item_name,
                    quantity: parseInt(inputValue, 10),
                }
                setCollectedData((prevData) => [...prevData, newItem])
            }
            setInputValue(0)
        }
    }
    const handleFinish = () => {
        console.log(collectedData)
        fetch(URLS[0].Add_collection_data, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ collected_data: collectedData })
        })
            .then(res => {
                if (res.ok) {
                    console.log('Data Saved')
                    setCollectedData([])
                } else {
                    console.error('error')
                }
            })
    }
    
    const getQuantityForCurrentItem = () => {
        const currentItem = collectedData.find(item => item.product_ID === data[currentIndex].product_id)
        return currentItem ? currentItem.quantity : 0
    }
    const backTocustomer = ()=> {navigate(`/`)}
    return (
        <div className="container-content">
            <button onClick={backTocustomer}>Back</button>
            {data.length > 0 && (
                <div className="items-images-buttons">
                    <div className="image-item">
                        <div className="image-div">
                            <img height={400} width={400} src={data[currentIndex].image_urel} alt="No" />
                        </div>
                        <div className="div-buttons">
                            <button onClick={handeBack} disabled={currentIndex === 0} className="button-Back"><FontAwesomeIcon icon={faAnglesUp} size="2xl" /></button>
                            <button onClick={handelNext} disabled={currentIndex === data.length - 1} className="button-next"><FontAwesomeIcon icon={faAnglesUp} rotation={180} size="2xl" /></button>
                        </div>
                        <div className="items">
                            <input type="text" value={userValue} disabled className="user-div" />
                            <input type="text" value={customerName} disabled className="user-div" />
                            <span className="item_names">შტრიხკოდი: <span className="item_name_content">{data[currentIndex].code}</span></span>
                            <span className="item_names">კოდი: <span className="item_name_content">{data[currentIndex].product_id}</span></span>
                            <span className="item_names">დასახელება: <span className="item_name_content">{data[currentIndex].item_name}</span></span>
                            <span className="item_names">კატეგორია: <span className="item_name_content">{data[currentIndex].category_name}</span></span>
                            <span className="item_names">რაოდენობა: <span className="item_name_content"> {data[currentIndex].qty_in_wh} {data[currentIndex].dimention}</span></span>
                            <span className="item_names">ღირებულება:<span className="item_name_content"> {data[currentIndex].price} ლარი</span></span>
                            <span className="item_names">შეკვეთილი:<span className="item_name_content"> {getQuantityForCurrentItem()}</span></span>
                            <div className="produqct-qt">
                                <input type="number" value={inputValue} onChange={handleInputChanges} className="quantity-input"/>
                                <button type="submit" onClick={handleSave} className="save-button"><FontAwesomeIcon icon={faCheck} size="2xl"/></button>
                                <button type="submit" onClick={handleFinish} className="finish-button"><FontAwesomeIcon icon={faFloppyDisk} size="2xl" /></button>
                            </div>

                        </div>
                    </div>
                </div>
                
            )}
            {collectedData.length > 0 && (
                <BackForwardTable data={collectedData} />
            )}
            
        </div>
    )
}