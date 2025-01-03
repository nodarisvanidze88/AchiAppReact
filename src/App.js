import CheckUser from './Components/CheckUser';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import AddCustomer from './Components/AddCustomer';
import { UsersOrders } from './Components/UsersOrders';
import GridImages from './Components/GridImages';
import InvoiceList from './Components/InvoiceList';
import InvoiceDetails from './Components/invoiceDetails';
function App() {
    return (
        <div>
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<CheckUser />} />
                    <Route path="/newCustomer" element={<AddCustomer />} />
                    <Route path="/orders" element={<UsersOrders />} />
                    <Route path="/grid" element={<GridImages />} />
                    <Route path="/invoiceList" element={<InvoiceList />} />
                    <Route
                        path="/invoice-details/:invoiceNumber"
                        element={<InvoiceDetails />}
                    />
                </Routes>
            </BrowserRouter>
        </div>
    );
}

export default App;
