import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

export default function BackForward() {
    const [data, setData] = useState([])
    const [currentIndex, setCurrentIndex] = useState(0)
    const [inputValue, setInputValue] = useState(0)
    const [collectedData, setCollectedData] = useState([])
    const { userValue,selectdID } = useParams()
    console.log(selectdID)
    useEffect(() => {
        fetch('http://192.168.100.2:8000/fi/allItems')
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
            const productIDExists = collectedData.some(item => item.product_ID === data[currentIndex].product_id)
            if (!productIDExists) {
                const newItem = {
                    user: selectdID,
                    product_ID: data[currentIndex].product_id,
                    quantity: inputValue,
                }
                setCollectedData((prevData) => [...prevData, newItem])
                setInputValue(0)
            }
        }
    }
    console.log(collectedData)
    const handleFinish = () => {
        fetch("http://192.168.100.2:8000/fi/add_collection_data", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({collected_data: collectedData})
        })
        .then(res => {
            if(res.ok){
                console.log('Data Saved')
                setCollectedData([])
            }else {
                console.error('error')
            }
        })
    }
    return (
        <div className="container-content">
            <div className="div-buttons">
                <button onClick={handeBack} disabled={currentIndex === 0}>Back</button>
                <button onClick={handelNext} disabled={currentIndex === data.length - 1}>Forward</button>
            </div>
            {data.length > 0 && (
                <div className="items_images">
                    <div className="items">
                        <input type="text" value={userValue} disabled />
                        <p className="item_names">{data[currentIndex].code}</p>
                        <p className="item_names">{data[currentIndex].product_id}</p>
                        <p className="item_names">{data[currentIndex].item_name}</p>
                        <p className="item_names">{data[currentIndex].category_name}</p>
                        <p className="item_names">{data[currentIndex].qty_in_wh} {data[currentIndex].dimention}</p>
                        <p className="item_names">{data[currentIndex].price} ლარი</p>
                    </div>
                    <div className="something">
                        <img height={300} width={300} src={data[currentIndex].image_urel} alt="No" />
                    </div>
                    <div className="produqct-qt">
                        <input type="number" value={inputValue} onChange={handleInputChanges} />
                        <button type="submit" onClick={handleSave}>Save</button>
                        <button type="submit" onClick={handleFinish}>Finish</button>
                    </div>
                </div>
            )}
        </div>
    )
}