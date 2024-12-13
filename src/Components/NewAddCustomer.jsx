import React, { useState } from 'react';
import {
    Modal,
    Box,
    Typography,
    TextField,
    Button,
} from '@mui/material';
import { URLS } from './urls';

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '80%',
    height: '80%',
    bgcolor: 'gray',
    boxShadow: 24,
    p: 4,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    color: '#f5f5f5', 
};
const inputStyle = {
    '& .MuiInputBase-root': {
        backgroundColor: 'gray', // Input background color
        color: '#fff', // Input text color
    },
    '& .MuiInputLabel-root': {
        backgroundColor: 'gray', // Input label background color
        color: '#fff', // Input label text color
    },
    '& .MuiOutlinedInput-notchedOutline': {
        borderColor: 'black', // Default border color
    },
    '&:hover .MuiOutlinedInput-notchedOutline': {
        borderColor: 'white', // Border color on hover
    },
    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
        borderColor: 'white', // Border color when focused
    },
};
const errorStyle = {
    color: '#ff6b6b', // Red color for error messages
    fontSize: '0.9rem',

};
export default function CustomModal({ isOpen, onRequestClose, refresh }) {
    const initialFormData = {
        identification: "",
        customer_name: "",
        customer_address: "",
      };

    const [serverErrorMessage, setServerErrorMessage] = useState('')
    const [formError, setFormError] = useState(initialFormData)
    const [isValidFiled, setValidField] = useState(true)
    const [formData, setFormData] = useState(initialFormData)

    const resetForm = () => {
        setFormData(initialFormData)
        setFormError(initialFormData)
        setValidField(true);
        setServerErrorMessage('')
      };

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
        if (formData.identification.length !== 9 && formData.identification.length !== 11) {
            newErrors.identification = "საიდენტიფიკაციო კოდი ან 9ნიშნა უნდა იყოს ან 11 ნიშნა"
            isValid = false
        }
        if (!formData.customer_name) {
            newErrors.customer_name = "აუცილებელია ორგანიზაციის სახელის შეყვანა"
            isValid = false
        }
        if (!formData.customer_address) {
            newErrors.customer_address= "აუცილებელია ორგანიზაციის მისამართის შეყვანა"
            isValid = false
        }
        setFormError(newErrors)
        setValidField(isValid)
        return isValid
    }
    const handelSave = async () => {
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
                resetForm()
                onRequestClose()
            } catch (error) {
                console.error("Can not Create new data in server", error)
                setServerErrorMessage(error.message)
            };
            await refresh()
        }
    }
    return (
        <div>

            <Modal open={isOpen} onClose={ onRequestClose} aria-labelledby="modal-title">
                <Box sx={style}>
                    <Typography id="modal-title" variant="h6" component="h2" mb={2}>
                        ახალი მომხმარებელი
                    </Typography>
                    <TextField
                        label="საიდენტიფიკაციო"
                        variant="outlined"
                        fullWidth
                        margin="normal"
                        name="identification"
                        value={formData.identification}
                        onChange={handeChanges}
                        sx={inputStyle}
                    />
                    {!isValidFiled && (<Typography sx={errorStyle}>{formError.identification}</Typography>)}
                    <TextField
                        label="სახლი"
                        variant="outlined"
                        fullWidth
                        margin="normal"
                        name="customer_name"
                        value={formData.customer_name}
                        onChange={handeChanges}
                        sx={inputStyle}
                    />
                    {!isValidFiled && (<Typography sx={errorStyle}>{formError.customer_name}</Typography>)}
                    <TextField
                        label="მისამართი"
                        variant="outlined"
                        fullWidth
                        margin="normal"
                        name="customer_address"
                        value={formData.customer_address}
                        onChange={handeChanges}
                        sx={inputStyle}
                    />
                    {!isValidFiled && (<Typography sx={errorStyle}>{formError.customer_address}</Typography>)}
                    <Box mt={4} display="flex" justifyContent="flex-end" gap={2}>
                        <Button variant="contained" color="secondary" onClick={onRequestClose}>
                            Cancel
                        </Button>
                        <Button variant="contained" color="primary" onClick={handelSave}>
                            დამატება
                        </Button>
                        {serverErrorMessage && <span>{serverErrorMessage}</span>}
                    </Box>
                </Box>
            </Modal>
        </div>
    );
}
