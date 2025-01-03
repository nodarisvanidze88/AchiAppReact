import { URLS } from './urls';
import { useState, useEffect } from 'react';
import { GetData } from './funcionality/getcategories';
import { useTable } from 'react-table';
import { INVOICE_TABLE } from './BackFowardTableColumns';
import { useNavigate } from 'react-router-dom';
import { IoMdExit } from 'react-icons/io';
import './InvoiceList.css';
export default function InvoiceList() {
    const [customerInfo, setCustomerInfo] = useState(null);
    const [invoiceInfo, setInvoiceInfo] = useState([]);
    const { getTableProps, getTableBodyProps, headerGroups, prepareRow, rows } =
        useTable({ columns: INVOICE_TABLE, data: invoiceInfo });
    const [updatedStatus, setUpdatedStatus] = useState('');
    const [invoiceMode, setInvoiceMode] = useState('All');
    const navigate = useNavigate();
    const fetchInvoiceInfo = async () => {
        if (customerInfo && customerInfo.customer_id) {
            try {
                const data = await GetData(
                    `${URLS[0].invoices}?customer_info=${customerInfo.customer_id}&mode=${invoiceMode}`
                );
                if (data) {
                    setInvoiceInfo(data);
                }
            } catch (error) {
                console.error('Error fetching invoice data:', error);
            }
        }
    };
    useEffect(() => {
        const storedCustomerInfo = localStorage.getItem('invoiceData');
        if (storedCustomerInfo) {
            setCustomerInfo(JSON.parse(storedCustomerInfo));
        }
    }, []);

    useEffect(() => {
        fetchInvoiceInfo();
    }, [customerInfo, invoiceMode]);
    const handleButtonClick = (invoice) => {
        const requestData = {
            invoice: invoice.invoice,
            status: updatedStatus,
        };

        fetch(
            `${URLS[0].invoices}?invoice=${requestData.invoice}&status=${requestData.status}`,
            {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
            }
        )
            .then((response) => response.json())
            .then((data) => {
                console.log('Success:', data);
                fetchInvoiceInfo();
            })
            .catch((error) => {
                console.error('Error:', error);
            });
    };
    const toggleDropdown = () => {
        navigate('/grid');
    };
    const handleNavigate = (value, status) => {
        navigate(`/invoice-details/${value}`,{ state: { status } });
    };
    return (
        <div className="invoice-list-container">
            {customerInfo && (
                <div className="invoice-list-page">
                    <div className='customer-name'>{customerInfo.customer}</div>
                    <div className="filter-buttons">
                        <div>
                            <button
                                className="filter-button"
                                value="All"
                                onClick={(e) => {
                                    setInvoiceMode(e.target.value);
                                }}
                            >
                                All
                            </button>
                        </div>
                        <div>
                            <button
                                className="filter-button"
                                value="Open"
                                onClick={(e) => {
                                    setInvoiceMode(e.target.value);
                                }}
                            >
                                Open
                            </button>
                        </div>
                        <div>
                            <button
                                className="filter-button"
                                value="Confirmed"
                                onClick={(e) => {
                                    setInvoiceMode(e.target.value);
                                }}
                            >
                                Confirmed
                            </button>
                        </div>
                        <div>
                            <button
                                className="filter-button"
                                value="Canceled"
                                onClick={(e) => {
                                    setInvoiceMode(e.target.value);
                                }}
                            >
                                Canceled
                            </button>
                        </div>
                        <div>
                            <button
                                className="filter-button"
                                onClick={toggleDropdown}
                            >
                                <IoMdExit />
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <div className="item_table">
                {invoiceInfo.length > 0 ? (
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
                                    <th className="table-header">Action</th>{' '}
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
                                            if (index === 0) {
                                                // Add button in the first column
                                                return (
                                                    <td
                                                        {...cell.getCellProps()}
                                                    >
                                                        <button className='action-button'
                                                            onClick={() =>
                                                                handleNavigate(
                                                                    cell.value, cell.row.original.status
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
                                                return (
                                                    <td
                                                        {...cell.getCellProps()}
                                                    >
                                                        {cell.value !==
                                                        'Open' ? (
                                                            cell.value
                                                        ) : (
                                                            <select
                                                                className="status-select"
                                                                defaultValue={
                                                                    cell.value
                                                                }
                                                                onChange={(
                                                                    e
                                                                ) => {
                                                                    setUpdatedStatus(
                                                                        e.target
                                                                            .value
                                                                    );
                                                                }}
                                                            >
                                                                <option value="open">
                                                                    Open
                                                                </option>
                                                                <option value="Confirmed">
                                                                    Confirmed
                                                                </option>
                                                                <option value="Canceled">
                                                                    Canceled
                                                                </option>
                                                            </select>
                                                        )}
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
                                            {row.original.status === 'Open' && (
                                                <button
                                                    className="action-button"
                                                    onClick={() =>
                                                        handleButtonClick(
                                                            row.original
                                                        )
                                                    }
                                                >
                                                    Action
                                                </button>
                                            )}
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
        </div>
    );
}
