import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { InvoiceProvider } from './Components/InvoiceContext';
import { StyledEngineProvider } from '@mui/material';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <StyledEngineProvider>
        <InvoiceProvider>
            <App />
        </InvoiceProvider>
    </StyledEngineProvider>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
