import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useTable } from 'react-table';
import { URLS } from './urls';
import { INVOICE_ITEMS_TABLE } from './BackFowardTableColumns';

export default function InvoiceDetails() {
    const { invoiceNumber } = useParams();
    const [data, setData] = useState([]);
    const navigate = useNavigate();
    const { getTableProps, getTableBodyProps, headerGroups, prepareRow, rows } =
        useTable({ columns: INVOICE_ITEMS_TABLE, data: data });

    useEffect(() => {
        const get_invoice = async () => {
            const response = await fetch(
                `${URLS[0].invoice_items}?invoice=${invoiceNumber}`
            );
            const data = await response.json();
            setData(data);
        };
        get_invoice();
    }, [invoiceNumber]);

    const handleNavigate = (value) => {
        navigate(`/another-page/${value}`);
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
                                                        <div className='action-buttons' style={{display:'flex', justifyContent:'center', gap:'10px'}}>
                                                        <button className='action-button'>-</button>
                                                        <input type="text" value={cell.value} style={{width:'20%', color:'black', textAlign:'center'}} />
                                                        <button className='action-button'>+</button>
                                                        </div>
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
                                                <button className="action-button">
                                                    Save
                                                </button>
                                                <button className='action-button'>Delete</button>
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
        </div>
    );
}
