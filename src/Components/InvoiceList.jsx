import { URLS } from './urls';
import { useState, useEffect } from 'react';
import { GetData } from './funcionality/getcategories';
import { useTable } from 'react-table';
import { INVOICE_TABLE } from './BackFowardTableColumns';
export default function InvoiceList() {
    const [customerInfo, setCustomerInfo] = useState(null);
    const [invoiceInfo, setInvoiceInfo] = useState([]);
    const { getTableProps, getTableBodyProps, headerGroups, prepareRow, rows } =
        useTable({ columns: INVOICE_TABLE, data: invoiceInfo });

    useEffect(() => {
        const storedCustomerInfo = localStorage.getItem('invoiceData');
        if (storedCustomerInfo) {
            setCustomerInfo(JSON.parse(storedCustomerInfo));
        }
    }, []);

    useEffect(() => {
        const fetchInvoiceInfo = async () => {
            if (customerInfo && customerInfo.customer_id) {
                try {
                    const data = await GetData(
                        `${URLS[0].invoices}?customer_info=${customerInfo.customer_id}`
                    );
                    if (data) {
                        setInvoiceInfo(data);
                    }
                } catch (error) {
                    console.error('Error fetching invoice data:', error);
                }
            }
        };
        fetchInvoiceInfo();
    }, [customerInfo]);
    console.log(invoiceInfo);

    return (
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
                                    {row.cells.map((cell) => (
                                        <td {...cell.getCellProps()}>
                                            {cell.render('Cell')}
                                        </td>
                                    ))}
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            ) : (
                <p>No Data</p>
            )}
        </div>
    );
}
