import React, { createContext, useState } from 'react';

export const InvoiceContext = createContext();
export const InvoiceProvider = ({ children }) => {
    const [invoiceDate, setInvoiceDate] = useState({
        invoiceNumber: '',
        customer_id: '',
        identification: '',
        customer: '',
        user_id: '',
        user: '',
    });
    return (
        <InvoiceContext.Provider value={{ invoiceDate, setInvoiceDate }}>
            {children}
        </InvoiceContext.Provider>
    );
};
