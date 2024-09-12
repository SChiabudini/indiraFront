import './App.css';
import 'react-toastify/dist/ReactToastify.css';
import React, { useEffect, useState } from 'react';
import { Routes, Route, NavLink } from 'react-router-dom';
import SideBar from "./components/common/SideBar.jsx"; 
import Stats from "./components/pages/Stats/Stats.jsx";
import Sales from "./components/pages/Sales/Sales.jsx";
import DetailSale from "./components/pages/Sales/DetailSale/DetailSale.jsx";
import PutSale from "./components/pages/Sales/PutSale/PutSale.jsx";
import Products from "./components/pages/Products/Products.jsx";
import DetailProduct from "./components/pages/Products/DetailProduct/DetailProduct.jsx";
import FormProduct from "./components/pages/Products/FormProduct/FormProduct.jsx";
import SuccesPostProduct from './components/pages/Products/SuccesProduct/SuccesPostProduct.jsx';
import SuccesPutProduct from './components/pages/Products/SuccesProduct/SuccesPutProduct.jsx';
import ProductManagement from "./components/pages/Products/ProductManagement/ProductManagement.jsx";
import PutProduct from "./components/pages/Products/PutProduct/PutProduct.jsx";
import PutPriceProducts from "./components/pages/Products/PutPriceProduct/PutPriceProducts.jsx";
import Clients from "./components/pages/Clients/Clients.jsx";
import DetailClient from "./components/pages/Clients/DetailClient/DetailClient.jsx";
import PutClient from "./components/pages/Clients/PutClient/PutClient.jsx";
import { ToastContainer, toast } from 'react-toastify';
import { initializeAppData , syncData } from './services/syncService.js';
import initDB, { processPendingRequests } from './services/indexedDB.js';


const App = () => {
  const [isOnline, setIsOnline] = useState(window.navigator.onLine);

  useEffect(() => {
    const initializeDB = async () => {
      await initDB();
    };
    initializeDB();
    
    initializeAppData();

    const handleOnline = () => {
        setIsOnline(true);
        syncData(); // Sincroniza cuando la conexión se restaura
        processPendingRequests();
        toast.success('Conexión restablecida');
    };

    const handleOffline = () => {
        setIsOnline(false);
        toast.error('Estás sin conexión');
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
        window.removeEventListener('online', handleOnline);
        window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return (
    <div className="App">
      <div className="SideBar"><SideBar /></div>
      <div className="content">
        <Routes>
          <Route path='/main_window/stats' element={<Stats />}/>
          <Route path='/' element={<Sales />}/>
          <Route path='/main_window/sales/:id' element={<DetailSale />}/>
          <Route path='/main_window/sales/edit/:id' element={<PutSale/>}/>
          <Route path='/main_window/products' element={<Products />}/>
          <Route path='/main_window/products/:id' element={<DetailProduct />}/>
          <Route path='/main_window/products/form' element={<FormProduct />}/>
          <Route path='/main_window/products/succes/post' element={<SuccesPostProduct />}/>
          <Route path='/main_window/products/succes/put' element={<SuccesPutProduct />}/>
          <Route path='/main_window/products/management' element={<ProductManagement/>}/>
          <Route path='/main_window/products/edit/:id' element={<PutProduct />}/>
          <Route path='/main_window/products/edit/price' element={<PutPriceProducts />}/>
          <Route path='/main_window/clients' element={<Clients />}/>
          <Route path='/main_window/clients/:id' element={<DetailClient />}/>
          <Route path='/main_window/clients/edit/:id' element={<PutClient />}/>
        </Routes>
      </div>
      <ToastContainer />
      {/* {!isOnline && <div className="offline-banner">Estás sin conexión</div>} */}
    </div>
  );
};

export default App;


//     useEffect(() => {
//       const handleOnline = () => {
//           setIsOnline(true);
//           syncData(); // Sincroniza cuando la conexión se restaura
//       };

//     const handleOffline = () => {
//         setIsOnline(false);
//         console.log('La aplicación está sin conexión');
//     };

//     window.addEventListener('online', handleOnline);
//     window.addEventListener('offline', handleOffline);

//     return () => {
//         window.removeEventListener('online', handleOnline);
//         window.removeEventListener('offline', handleOffline);
//     };
// }, []);

//   useEffect(() => {
//     const handleOnline = () => {
//         console.log('Conexión a Internet restaurada');
//         syncData(); // Llamar a la función de sincronización
//     };

//     window.addEventListener('online', handleOnline);

//     return () => {
//         window.removeEventListener('online', handleOnline);
//     };
// }, []);