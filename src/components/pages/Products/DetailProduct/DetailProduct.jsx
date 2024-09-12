import style from './DetailProduct.module.css';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { useParams, Link, useNavigate } from 'react-router-dom';
import imgProduct from '../../../../assets/img/imgProduct.jpeg';
import { getProductById, putProductStatus } from '../../../../redux/productActions.js';


const DetailProduct = () => {

    let { id } = useParams();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const productDetail = useSelector(state => state.products.productDetail);

    const [showDeleteModal, setShowDeleteModal] = useState(false);

    const toggleShowDeleteModal = () => {
        setShowDeleteModal(!showDeleteModal);
    };

    const handleModifyStatus = () => {
        dispatch(putProductStatus(id));
        navigate('/main_window/products/management');
    };

    const getImageUrl = (imagePath) => {
        if (!imagePath) return '';
        // URL base para los archivos estáticos
        const baseUrl = 'http://localhost:3001/';
        return `${baseUrl}${imagePath}`;
    };

    useEffect(() => {
        dispatch(getProductById(id));
    }, [dispatch, id]);

    return(
        <div className="page">
            <div className="component">
                <div className="title">
                    <h2>Detalle del producto</h2>
                    <div className="titleButtons">
                        {productDetail.active ? <button><Link to={`/main_window/products/edit/${id}`}>Editar</Link></button> : ''}
                        {!productDetail.active ? <button className="add" onClick={toggleShowDeleteModal}>Añadir</button> : <button className="delete" onClick={toggleShowDeleteModal}>Eliminar</button>}
                        <button><Link to={`/main_window/products/management`}>Atrás</Link></button>
                    </div>
                </div>
                <div className="container">
                    {!productDetail.active && <div className={style.productInactive}><span>Este producto ha sido eliminado</span></div>}
                    {productDetail.name && <div className={!productDetail.active ? style.nameProductInactive : style.nameProduct}><span>{productDetail.name}</span></div>}
                    <div className={!productDetail.active ? style.columnInactive : style.column}>
                        <div className={style.containerImgProduct}>
                            {productDetail.imageGlobal 
                            ? <img className={style.imgProduct} src={getImageUrl(productDetail.imageGlobal) || imgProduct} alt="Product Image"/> 
                            : productDetail.color?.map(color => (
                                color.image 
                                ? (<img key={color.image} className={style.imgProduct} src={getImageUrl(color.image)} alt="Product Image" />) 
                                : <img src={imgProduct} className={style.imgProduct} alt="Product Image" />
                            ))}                          
                        </div>                      
                        <p><span>Precio:&nbsp;</span>${productDetail.price}</p>
                        <p><span>Categoría:&nbsp;</span>{(productDetail.category && productDetail.category.length > 0) ? productDetail.category[0].name : 'No tiene categoría'}</p>
                        {/* <p><span>Código QR:</span></p> */}
                        {productDetail.color?.map(color => (
                            <div className={style.colorSection}>
                                <p><span>Color:&nbsp;</span>{color.colorName}</p>
                                <div className={style.containerColor}>                  
                                    {color.size.map(size => (
                                        <div key={size.sizeName} className={style.sizeBlock}>
                                            <p><span>Talle:&nbsp;</span>{size.sizeName}</p>   
                                            <p><span>Stock:&nbsp;</span>{size.stock}</p>                                           
                                            <p><span>Medidas:</span></p>
                                            <li><span>Ancho:&nbsp;</span>{size.measurements[0].width ? size.measurements[0].width : '-'}</li>
                                            <li><span>Largo:&nbsp;</span>{size.measurements[0].long ? size.measurements[0].long : '-'}</li>
                                            <li><span>Tiro:&nbsp;</span>{size.measurements[0].rise ? size.measurements[0].rise : '-'}</li>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                        {productDetail.description ? <p><span>Descripción:&nbsp;</span>{productDetail.description}</p> : ''}
                        {productDetail.supplier && productDetail.supplier.name.trim() !== '' || productDetail.supplier && productDetail.supplier.phone.trim() !== ''  
                        ? (
                            <div className={style.containerSupplier}>
                                <p><span>Proveedor:</span></p>
                                <li><span>Nombre:&nbsp;</span>{productDetail.supplier.name}</li>
                                <li><span>Teléfono:&nbsp;</span>{productDetail.supplier.phone}</li>
                            </div> 
                        ) : <span className={style.messageSupplier}>No hay información del proveedor.</span>}
                    </div>
                </div>
            </div>
            {!productDetail.active 
            ? (
            <div className={`${style.deleteModal} ${showDeleteModal ? style.deleteModalShow : ''}`}>
                <div className={style.deleteContent}>
                    <p>¿Está seguro que desea añadir este producto?</p>
                    <div className={style.deleteButtons}>
                        <button onClick={toggleShowDeleteModal}>Cancelar</button>
                        <button onClick={handleModifyStatus} className="add">Añadir</button>
                    </div>
                </div>
            </div>
            ) : (
            <div className={`${style.deleteModal} ${showDeleteModal ? style.deleteModalShow : ''}`}>
                <div className={style.deleteContent}>
                    <p>¿Está seguro que desea eliminar este producto?</p>
                    <div className={style.deleteButtons}>
                        <button onClick={toggleShowDeleteModal}>Cancelar</button>
                        <button onClick={handleModifyStatus} className="delete">Eliminar</button>
                    </div>
                </div>
            </div>)}            
        </div>
    );
};

export default DetailProduct;