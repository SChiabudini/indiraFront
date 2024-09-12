import React, { useEffect } from 'react';
import { useDispatch, useSelector } from "react-redux";
import FormSales from './FormSales/FormSales.jsx';
import SalesHistory from './SalesHistory/SalesHistory.jsx';
import { getSales } from '../../../redux/saleActions.js';
import style from './Sales.module.css';

const Sales = () => {
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(getSales());
    }, [dispatch]);
    
    return(
        <div className="page">
            <div className={style.form}>
                <FormSales />
            </div>
            <div className={style.history
                
            }>
                <SalesHistory />
            </div>      
        </div>
    );
};

export default Sales;