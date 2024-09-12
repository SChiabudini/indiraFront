import style from './SuccesProduct.module.css';
import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { getProducts } from '../../../../redux/productActions.js';

const SuccesPutProduct = () => {
    
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleBackClick = () => {
        navigate('/main_window/products/management');
    };

    useEffect(() => {
        dispatch(getProducts());
    }, []);

    return (
        <div className="page">
            <div className="component">
                <div className="title">
                    <h2>EDITAR PRODUCTO</h2>
                </div>
                <div className="container">
                    <p className={style.paragraph}>¡Producto editado con éxito!</p>
                    <div className={style.containerButton}>
                        <button type='button' onClick={handleBackClick}>Volver</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SuccesPutProduct;