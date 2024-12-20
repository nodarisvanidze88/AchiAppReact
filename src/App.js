// import BackForward from './Components/BackForward';
import CheckUser from './Components/CheckUser';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import AddCustomer from './Components/AddCustomer';
import { UsersOrders } from './Components/UsersOrders';
import GridImages from './Components/GridImages';
import InvoiceList from './Components/InvoiceList';
function App() {
    return (
        <div>
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<CheckUser />} />
                    {/* <Route path='/backforward/:userValue/:selectdID/:customerName/:customerID' element={<BackForward />} /> */}
                    {/* <Route path="/" element={<BackForward />} /> */}
                    <Route path="/newCustomer" element={<AddCustomer />} />
                    <Route path="/orders" element={<UsersOrders />} />
                    <Route path="/grid" element={<GridImages />} />
                    <Route path="/invoiceList" element={<InvoiceList />} />
                </Routes>
            </BrowserRouter>
        </div>
    );
}

export default App;
