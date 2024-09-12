import style from './DailyMetric.module.css';
import iconClothes from '../img/icons-camiseta.png';
import iconMoney from '../img/icons-monedas.png';
import React from 'react';
import { useSelector } from "react-redux";


const DailyMetric = () => {

    const salesBalance = useSelector(state => state.sales.salesBalance);
    const totalRevenue = salesBalance.daily?.totalRevenue ?? 0;  //Si el valor obtenido es null o undefined mostramos '0'.
    // const totalRevenue = ~~salesBalance.daily?.totalRevenue; //Con el operador de doble tilde "~~" obtenemos el número entero.

    let displayRevenue = totalRevenue;
    let suffix = '';
    if (totalRevenue >= 1000 && totalRevenue < 1000000) {
        displayRevenue = Math.floor(totalRevenue / 1000);
        suffix = 'k';
    } else if (totalRevenue >= 1000000) {
        displayRevenue = Math.floor(totalRevenue / 1000000);
        suffix = 'M';
    };

    return(
        <div>
            <div className={style.card}>
                <div className={style.titleBalance}>
                    <p>Diario</p>
                </div>
                <div className={style.cardContent}>
                    <div className={style.labels}>
                        <p className={style.pp}><img className={style.icon} src={iconClothes} alt="icon"/></p>
                        <div className={style.numberCard}>{salesBalance.daily?.soldProducts}</div>
                        <span className={style.cardName}>productos</span>
                    </div>
                    <div className={style.labels}>
                        <p className={style.pp}><img className={style.icon} src={iconMoney} alt="icon"/></p>
                        <div className={style.numberCard}>{displayRevenue.toLocaleString()}{suffix}</div>
                        <span className={style.cardName}>ganancias</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DailyMetric;