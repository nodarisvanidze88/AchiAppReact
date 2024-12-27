import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useTable } from 'react-table';
import { URLS } from './urls';
import { INVOICE_ITEMS_TABLE } from './BackFowardTableColumns';
import ImageModal from './imageModal';
import './invoiceDetails.css';
export default function InvoiceDetails() {
    const { invoiceNumber } = useParams();
    const [data, setData] = useState([]);
    const location = useLocation();
    const { status } = location.state || {};
    const [modalImageUrl, setModalImageUrl] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const navigate = useNavigate();
    const { getTableProps, getTableBodyProps, headerGroups, prepareRow, rows } =
        useTable({ columns: INVOICE_ITEMS_TABLE, data: data , className:'centered-table'});
        const get_invoice = async () => {
            const response = await fetch(
                `${URLS[0].invoice_items}?invoice=${invoiceNumber}`
            );
            const data = await response.json();
            console.log(data)
            setData(data);
        };
    useEffect(() => {
        get_invoice();
        console.log('status', status);
    }, [invoiceNumber]);

    const handleNavigate = (value) => {
        navigate(`/another-page/${value}`);
    };
    const deleteHandler = async (value) => {
        const response = await fetch(
            `${URLS[0].invoice_items}?id=${value}`,
            {method: 'DELETE',}
        );
        setData(data.filter((item) => item.id !== value));

    }
    const incrementQuantity = (id) => {
        setData(data.map(item => {
            if (item.id === id && item.quantity < item.qty_in_wh) {
                return { ...item, quantity: item.quantity + 1 };
            }
            return item;
        }));
    };

    const decrementQuantity = (id) => {
        setData(data.map(item => {
            if (item.id === id && item.quantity > 0) {
                return { ...item, quantity: item.quantity - 1 };
            }
            return item;
        }));
    };
    const saveHandler = async (id) => {
        const item = data.find((item) => item.id === id);
        const response = await fetch(
            `${URLS[0].invoice_items}`,
            {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(item),
            }
        );
        const result = await response.json();
        get_invoice()
        console.log(result);
}
const openModal = (imageUrl) => {
    setModalImageUrl(imageUrl);
    setIsModalOpen(true);
};
const closeModal = () => {
    setIsModalOpen(false);
    setModalImageUrl('');
};
    return (
        <div className="invoice-list-container">
            <div className="item_table">
                {data.length > 0 ? (
                    <table
                        {...getTableProps()}
                        className="table table-striped table-dark table-hover"
                    >
                        <thead>
                            {headerGroups.map((headerGroup) => (
                                <tr {...headerGroup.getHeaderGroupProps()}>
                                    {headerGroup.headers.map((column) => (
                                        <th
                                            {...column.getHeaderProps()}
                                            className="table-header"
                                        >
                                            {column.render('Header')}
                                        </th>
                                    ))}
                                    <th className="table-header">Action</th>
                                </tr>
                            ))}
                        </thead>
                        <tbody {...getTableBodyProps()}>
                            {rows.map((row) => {
                                prepareRow(row);
                                return (
                                    <tr
                                        {...row.getRowProps()}
                                        className="table-quantity"
                                    >
                                        {row.cells.map((cell, index) => {
                                            if (cell.column.id === 'quantity') {
                                                return (
                                                    <td
                                                        {...cell.getCellProps()}
                                                    >
                                                        {status === 'Open' ?
                                                        <div className='action-buttons' style={{display:'flex', justifyContent:'center', gap:'10px'}}>
                                                        <button className='action-button' onClick={()=>decrementQuantity(row.original.id)}>-</button>
                                                        <input type="text" value={cell.value} style={{width:'20%', color:'black', textAlign:'center'}} />
                                                        <button className='action-button' onClick={()=>incrementQuantity(row.original.id)}>+</button>
                                                        </div>: cell.render('Cell')}
                                                    </td>
                                                )
                                            }
                                            if (index === 0) {
                                                // Add button in the first column
                                                return (
                                                    <td
                                                        {...cell.getCellProps()}
                                                    >
                                                        <button
                                                            onClick={() =>
                                                                handleNavigate(
                                                                    cell.value
                                                                )
                                                            }
                                                        >
                                                            {cell.value}
                                                        </button>
                                                    </td>
                                                );
                                            }
                                            if (
                                                index ===
                                                row.cells.length - 1
                                            ) {
                                                // Check if it's the last column
                                                if (
                                                    cell.column.id ===
                                                    'image_url'
                                                ) {
                                                    return (
                                                        <td
                                                            {...cell.getCellProps()}
                                                        >
                                                            <img
                                                                src={cell.value}
                                                                alt="image_url"
                                                                style={{
                                                                    width: '50px',
                                                                    height: '50px',
                                                                }}
                                                                onClick={() => openModal(cell.value)}
                                                            />
                                                        </td>
                                                    );
                                                }
                                                return (
                                                    <td
                                                        {...cell.getCellProps()}
                                                    >
                                                        {cell.render('Cell')}
                                                    </td>
                                                );
                                            }
                                            return (
                                                <td {...cell.getCellProps()}>
                                                    {cell.render('Cell')}
                                                </td>
                                            );
                                        })}
                                        <td>
                                            <div className='action-buttons'>
                                                {row.original.quantity * row.original.price !== row.original.total ?
                                                <button className="action-button" onClick={()=>saveHandler(row.original.id)}>
                                                    Save
                                                </button>: null}
                                                <button className='action-button' onClick={()=>deleteHandler(row.original.id)}>Delete</button>
                                                </div>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                ) : (
                    <p>No Data</p>
                )}
            </div>
            {isModalOpen && (
                <ImageModal isOpen = {isModalOpen} imageUrl={modalImageUrl} onRequestClose={()=>closeModal()} />
            )}
        </div>
    );
}
