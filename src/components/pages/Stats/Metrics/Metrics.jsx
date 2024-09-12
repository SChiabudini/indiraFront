import style from './Metrics.module.css';
import React, { useEffect } from 'react';
import { useDispatch } from "react-redux";
import DailyMetric from './DailyMetric/DailyMetric.jsx';
import WeeklyMetric from './WeeklyMetric/WeeklyMetric.jsx';
import MonthMetric from './MonthlyMetric/MonthlyMetric.jsx';
import AnnualMetric from './AnnualMetric/AnnualMetric.jsx';


const Metrics = () => {

    return(
        <div className="component">
            <div className="title">
                <h2>MÉTRICAS</h2>
            </div>
            <div className="container">
                <div className={style.metrics}>
                    <div className={style.component}><DailyMetric /></div>
                    <div className={style.component}><WeeklyMetric /></div>
                    <div className={style.component}><MonthMetric /></div>
                    <div className={style.component}><AnnualMetric /></div>
                </div>
            </div>
        </div>
    );
};

export default Metrics;