
import BackForward from './Components/BackForward';
import CheckUser from './Components/CheckUser';
import { BrowserRouter, Route, Routes } from 'react-router-dom';

function App() {
  return (
   <div>
    <BrowserRouter>
    <Routes>
      <Route path='/' element={<CheckUser />}/>
      <Route path='/backforward/:userValue/:selectdID' element={<BackForward />} />
      </Routes>
    </BrowserRouter>
   </div>
  );
}

export default App;
