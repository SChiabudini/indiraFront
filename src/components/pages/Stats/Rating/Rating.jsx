import style from './Rating.module.css';
import React from 'react';
import { useSelector } from "react-redux";


const Rating = () => {

    const topFiveProducts = useSelector(state => state.products.topFiveProducts.topFiveProducts);
    
    return(
        <div className="component">
            <div className="title">
                <h2>MÁS VENDIDOS</h2>
            </div>
            {topFiveProducts?.map((product, index) => (
                <div key={index} className={style.containerTopFive}>
                    <div className={style.ratingNumber}>{index + 1}</div>
                    <div className={style.productDetails}>
                        <p className={style.productName}>{product.productName}</p>
                        <p>{product.colorName} - Talle {product.sizeName}</p>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default Rating;