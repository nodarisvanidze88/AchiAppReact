import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './CheckUser.css';
import { URLS } from './urls';
import AddNewCustomerModal from './AddCustomer';
import { useContext } from 'react';
import { InvoiceContext } from './InvoiceContext';
import { createTheme, ThemeProvider } from '@mui/material';
import { TextField } from '@mui/material';
import { Autocomplete, MenuItem } from '@mui/material';
import CustomModal from './NewAddCustomer';

const theme = createTheme({
    components: {
        MuiInputLabel: {
            styleOverrides: {
                root: {
                    color: 'gray', // Default placeholder color
                    fontSize: '1rem', // Adjust font size
                },
            },
        },
        MuiInputBase: {
            styleOverrides: {
                input: {
                color:'#fff'
                },
                
            },
        },
        MuiOutlinedInput:{
            styleOverrides:{
                notchedOutline:{
                    border:"2px solid white"
                },
                root:{
                    '&:hover .MuiOutlinedInput-notchedOutline': {
                        borderColor: 'blue', // Outline color on hover
                    },
                }

            }
        },
        MuiAutocomplete:{
            styleOverrides:{
                popupIndicator:{
                    color:'white'
                },
                clearIndicator: {
                    color: 'white', // Clear button color
                    '&:hover': {
                        color: 'blue', // Clear button color on hover
                    },
                },
            }
        }

    },
});
export default function CheckUser() {
    const [user, setUser] = useState('');
    const [isModalOpen, setModalOpen] = useState(false);
    const [customer, setCustomer] = useState([]);
    const [customerName, setCustomerName] = useState('');
    const [customerID, setCustomerID] = useState('');
    const [customerIdentifer, setCustomerIdentifer] = useState('');
    const [userValue, setUserValue] = useState('');
    const [selectdID, setSelectedID] = useState('');
    const { setInvoiceDate } = useContext(InvoiceContext);
    const navigate = useNavigate();

    useEffect(() => {
        const GetAllUsers = () => {
            fetch(URLS[0].GetUsers)
                .then((res) => res.json())
                .then((data) => {
                    setUser(data);
                });
            fetch(URLS[0].All_Customers)
                .then((result) => result.json())
                .then((customerData) => {
                    setCustomer(customerData.results);
                });
        };
        GetAllUsers();
    }, []);

    const GetAllUsers = () => {
        fetch(URLS[0].All_Customers)
            .then((result) => result.json())
            .then((customerData) => {
                setCustomer(customerData.results);
            });
    };
    const generateInvoiceNumber = () => {
        const now = new Date();
        return `${now.getFullYear()}${String(now.getMonth() + 1).padStart(
            2,
            '0'
        )}${String(now.getDate()).padStart(2, '0')}${String(
            now.getHours()
        ).padStart(2, '0')}${String(now.getMinutes()).padStart(2, '0')}${String(
            now.getSeconds()
        ).padStart(2, '0')}${String(now.getMilliseconds()).padStart(3, '0')}`;
    };
    useEffect(() => {
        if (customerID === 'New') {
            setModalOpen(true);
            setCustomerID('');
        }
        if (
            customer.some((item) => item.id === parseInt(customerID, 10)) &&
            customer.some(
                (item) => item.identification === customerIdentifer
            ) &&
            user.some((item) => item.user === userValue) &&
            selectdID !== ''
        ) {
            const invoiceNumber = generateInvoiceNumber();
            const invoiceData = {
                invoiceNumber,
                customer_id: customerID,
                identification: customerIdentifer,
                customer: customerName,
                user_id: selectdID,
                user: userValue,
            };

            // Store in localStorage
            localStorage.setItem('invoiceData', JSON.stringify(invoiceData));

            setInvoiceDate(invoiceData);
            navigate(`/grid`);
        }
    }, [
        selectdID,
        navigate,
        userValue,
        customerID,
        customer,
        customerIdentifer,
        user,
        customerName,
        setInvoiceDate,
    ]);
    return (
        <div className="checkUser-div">
            <form className="checkUser-form">
                <ThemeProvider theme={theme}>
                    <Autocomplete
                        disablePortal
                        options={[
                            {
                                id: 'New',
                                customer_name: 'Add New Customer',
                                identification: '',
                            },
                            ...customer,
                        ]}
                        getOptionLabel={(option) => option.customer_name || ''}
                        sx={{
                            display:'flex',
                            width:'80%',
                            minWidth:'150px',
                            marginBottom: '1rem',                            
                        }}
                        renderInput={(params) => (
                            <TextField {...params} label="მომხმარებელი" />
                        )}
                        onChange={(event, newValue) => {
                            if (newValue) {
                                setCustomerID(
                                    newValue.id === 'New' ? '' : newValue.id
                                );
                                setCustomerName(newValue.customer_name);
                                setCustomerIdentifer(newValue.identification);
                                if (newValue.id === 'New') {
                                    setModalOpen(true);
                                }
                            } else {
                                setCustomerID('');
                                setCustomerName('');
                                setCustomerIdentifer('');
                            }
                        }}
                        isOptionEqualToValue={(option, value) =>
                            option.id === value.id
                        } 
                    />
                    <TextField label="ვაიზერი"  sx={{
                            display:'flex',
                            width:'80%',
                            minWidth:'150px',
                            marginBottom: '1rem', 
                        }}
                        onChange={(e) => {
                            for (let i = 0; i < user.length; i++) {
                                if (user[i].user === e.target.value) {
                                    setUserValue(e.target.value);
                                    setSelectedID(user[i].id);
                                }
                            }
                        }}/>
                </ThemeProvider>
            </form>
            <CustomModal
                isOpen={isModalOpen}
                onRequestClose={() => setModalOpen(false)}
                refresh={GetAllUsers}
            />
        </div>
    );
}
