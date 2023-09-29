import React, { useState } from "react";
import Modal from "react-modal"
import { URLS } from './urls'
Modal.setAppElement('#root')

const customStyles = {
    content: {
        width: "800px",
        height: "600px",
        margin: "auto",
    },
};
export default function AddNewCustomerModal({ isOpen, onRequestClose, refresh }) {
    const [formData, setFormData] = useState({
        identification: "",
        customer_name: "",
        customer_address: "",
    })
    const [formError, setFormError] = useState({
        identification: "",
        customer_name: "",
    })
    const [isValidFiled, setValidField] = useState(true)

    const handeChanges = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        })
    }
    const handelFormValid = () => {
        const newErrors = {}
        let isValid = true

        if (!formData.identification) {
            newErrors.identification = "აუცილებელია ორგანიზაციის საიდენტიფიკაციო კოდის შეყვანა"
            isValid = false
        }
        if (!formData.customer_name) {
            newErrors.customer_name = "აუცილებელია ორგანიზაციის სახელის შეყვანა"
            isValid = false
        }
        setFormError(newErrors)
        setValidField(isValid)
        return isValid
    }

    const handelSave = async () => {
        console.log(formData)
        if (handelFormValid()) {
            try {
                const sendData = await fetch(URLS[0].All_Customers, {
                    method: "POST",
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(formData),
                })
                if (!sendData.ok) {
                    throw new Error("Server error")
                }
                const data = await sendData.json()
                console.log("Successfully Created New Data: ", data)
            } catch (error) {
                console.error("Can not Create new data in server", error)
            };
            await refresh()
            onRequestClose(false)
        }
    }
    return (
        <Modal
            isOpen={isOpen}
            onRequestClose={onRequestClose}
            contentLabel="Add New Customer Modal"
            style={customStyles}
        >
            <div className="add-modal-container">
                <h2>ორგანიზაციის დამატება</h2>
                <div className="field-containers">
                    <input type="text"
                        name="identification"
                        value={formData.identification}
                        onChange={handeChanges}
                        placeholder="საიდენტიფიკაციო კოდი"
                        required />
                    {!isValidFiled &&
                        (<span className="newCustomerError">{formError.identification}</span>)}

                    <input type="text"
                        name="customer_name"
                        value={formData.customer_name}
                        onChange={handeChanges}
                        placeholder="ორგანიზაციის სახელი"
                        required />
                    {!isValidFiled &&
                        (<span className="newCustomerError">{formError.customer_name}</span>)}

                    <input type="text"
                        name="customer_address"
                        value={formData.customer_address}
                        onChange={handeChanges}
                        placeholder="ორგანიზაციის მისამართი"
                        required />
                    {!isValidFiled &&
                        (<span className="newCustomerError">{formError.customer_address}</span>)}

                    <div className="add-customer-modal-butons">
                        <div className="modal-yes-button">
                            <button onClick={handelSave} className="btn btn-danger">Save</button>
                        </div>
                        <div className="modal-no-button">
                            <button onClick={onRequestClose} className="btn btn-primary">Cancel</button>
                        </div>
                    </div>
                </div>
            </div>
        </Modal>
    )
}