import { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom'
import "./CheckUser.css"
import { URLS } from "./urls"
import AddNewCustomerModal from "./AddCustomer";

export default function CheckUser() {
    const [user, setUser] = useState('')
    const [isModalOpen, setModalOpen] = useState(false)
    const [customer, setCustomer] = useState([])
    const [customerName, setCustomerName] = useState('')
    const [customerID, setCustomerID] = useState('')
    const [customerIdentifer, setCustomerIdentifer] = useState('')
    const [userValue, setUserValue] = useState('')
    const [selectdID, setSelectedID] = useState('')
    const navigate = useNavigate()

    useEffect(() => {
        const GetAllUsers = () => {
            fetch(URLS[0].GetUsers)
                .then(res => res.json())
                .then(data => {
                    setUser(data)
                })
            fetch(URLS[0].All_Customers)
                .then(result => result.json())
                .then(customerData => {
                    setCustomer(customerData)
                })
        }
        GetAllUsers()
    }, [])

    const GetAllUsers = () => {
        fetch(URLS[0].All_Customers)
            .then(result => result.json())
            .then(customerData => {
                setCustomer(customerData)
            })
    }


    useEffect(() => {
        if (customerID === "New") {
            setModalOpen(true)
            setCustomerID('')
        }
        if (customer.some((item) => item.id === parseInt(customerID, 10)) &&
            customer.some((item) => item.identification === customerIdentifer) &&
            user.some((item) => item.user === userValue) && selectdID !== "") {
            navigate(`/backforward/${userValue}/${selectdID}/${customerName}/${customerID}`)
        }
    }, [selectdID, navigate, userValue, customerID, customer, customerIdentifer, user, customerName])
    return (
        <div className="checkUser-div">
            <form className="checkUser-form">
                <input list="Customerlist" onChange={(e) => {
                    const splitedData = e.target.value.split(" ")
                    const slicedData = splitedData.slice(2)
                    setCustomerID(splitedData[0])
                    setCustomerName(slicedData.join(" "))
                    setCustomerIdentifer(splitedData[1])
                }
                } className="checkUser-input customer-input" placeholder="მომხმარებელი" />
                <datalist id="Customerlist">
                    <option>New</option>
                    {customer.map((items, i) =>
                        <option key={i}>{items.id}{` `}{items.identification}{` `}{items.customer_name}</option>
                    )}
                </datalist>
                <input onChange={(e) => {
                    for (let i = 0; i < user.length; i++) {
                        if (user[i].user === e.target.value) {
                            setUserValue(e.target.value)
                            setSelectedID(user[i].id)
                        }
                    }
                }
                } className="checkUser-input user-input" placeholder="სუპერვაიზერი" />
                <button onClick={()=>{
                    navigate("/orders")
                }}>შეკვეთები</button>
            </form>
            <AddNewCustomerModal
                isOpen={isModalOpen}
                onRequestClose={() => setModalOpen(false)}
                refresh={GetAllUsers} />
        </div>
    )
}