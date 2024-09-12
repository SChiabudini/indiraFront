import style from './Stats.module.css';
import React, { useEffect } from 'react';
import { useDispatch } from "react-redux";
import BarChart from './BarChart/BarChart.jsx'
import Metrics from './Metrics/Metrics.jsx'
import Rating from './Rating/Rating.jsx';
import Piechart from './PieChart/PieChart.jsx'
import { getCategories } from '../../../redux/categoryActions.js';
import { getSalesBalance, getSalesBalanceLocal, getSalesOnline, getSalesLocal, getSalesOnlineLocal, getSalesLocalLocal } from '../../../redux/saleActions.js';
import { getSoldProducts, getSoldProductsLocal, getTopFiveProducts, getTopFiveProductsLocal } from '../../../redux/productActions.js';


const Stats = () => {

    const dispatch = useDispatch();
    
    useEffect(() => {
        dispatch(getSalesBalance()).catch(() => {dispatch(getSalesBalanceLocal())});
        dispatch(getCategories());
        dispatch(getSalesOnline()).catch(() => {dispatch(getSalesOnlineLocal())});
        dispatch(getSalesLocal()).catch(() => {dispatch(getSalesLocalLocal())});
        dispatch(getSoldProducts()).catch(() => {dispatch(getSoldProductsLocal())});
        dispatch(getTopFiveProducts()).catch(() => {dispatch(getTopFiveProductsLocal())});
    }, [dispatch]);

    return(
        <div className="page">
            <div className={style.metrics}>
                <Metrics/>  
            </div>
            <div className={style.stats}>
                <div className={style.component}><Rating/></div>
                <div className={style.middleComponent}><Piechart/></div>
                <div className={style.component}><BarChart /></div>
            </div>
        </div>
    );
};

export default Stats;