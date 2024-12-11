import React, { createContext, useState } from 'react';

export const InvoiceContext = createContext();
export const InvoiceProvider = ({ children }) => {
    const [invoiceDate, setInvoiceDate] = useState({
        invoiceNumber: '',
        customeri_id: '',
        identification: '',
        customer: '',
        user: '',
    });
    return (
        <InvoiceContext.Provider value={{ invoiceDate, setInvoiceDate }}>
            {children}
        </InvoiceContext.Provider>
    );
};
