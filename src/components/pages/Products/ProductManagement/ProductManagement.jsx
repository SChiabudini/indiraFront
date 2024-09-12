import style from "./ProductManagement.module.css";
import detail from '../../../../assets/img/detail.png';
import imgProduct from '../../../../assets/img/imgProduct.jpeg';
import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from "react-redux";
import { Link } from 'react-router-dom';
import { getAllProducts, getProductByName } from "../../../../redux/productActions.js";


const ProductManagement = () => {
    
    const dispatch = useDispatch();
    // const products = useSelector(state => state.products.products);
    const allProducts = useSelector(state => state.products.allProducts);

    const [name, setName] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [loading, setLoading] = useState(true); // Indicador de carga

    const itemsPerPage = 20;

    // const paginatedProducts = allProducts.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
    const paginatedProducts = Array.isArray(allProducts) ? allProducts.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage) : [];
    const totalPages = Math.ceil(allProducts.length / itemsPerPage);
    // const paginatedProducts = products.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
    // const totalPages = Math.ceil(products.length / itemsPerPage);

    const handlePageChange = (newPage) => {
        if (newPage > 0 && newPage <= totalPages) {
            setCurrentPage(newPage);
        };
    };

    const getPageButtons = () => {
        const buttons = [];
        let startPage, endPage;

        if (totalPages <= 5) {
            startPage = 1;
            endPage = totalPages;
        } else {
            if (currentPage <= 3) {
                startPage = 1;
                endPage = 5;
            } else if (currentPage + 2 >= totalPages) {
                startPage = totalPages - 4;
                endPage = totalPages;
            } else {
                startPage = currentPage - 2;
                endPage = currentPage + 2;
            }
        }

        for (let i = startPage; i <= endPage; i++) {
            buttons.push(
                <button
                    key={i}
                    className={`pageButton ${currentPage === i ? 'currentPage' : ''}`}
                    onClick={() => handlePageChange(i)}
                >
                    {i}
                </button>
            );
        }

        return buttons;
    };
    
    const handleChangeName = (event) => {
        setName(event.target.value);
    };

    const getImageUrl = (imagePath) => {
        if (!imagePath) return '';
        
        // Reemplazar barras invertidas por barras inclinadas
        const correctedPath = imagePath.replace(/\\/g, '/');
        
        // URL base para los archivos estáticos
        const baseUrl = 'http://localhost:3001/';
        
        return `${baseUrl}${correctedPath}`;
    };

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                await dispatch(getAllProducts());
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, [dispatch]);

    useEffect(() => {
        // dispatch(getAllProducts());
        if (name) {
            dispatch(getProductByName(name));
        } else {
            dispatch(getProductByName('')); 
        }
    }, [name, dispatch]);
    
    useEffect(() => {
        dispatch(getAllProducts());
    }, [dispatch]);
    

    return (
        <div className="page">
            <div className="component">
                <div className="title">
                    <h2>GESTIÓN DE PRODUCTOS</h2>
                    <div className="pagination">
                        <button onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1}>
                            ◂
                        </button>
                        {getPageButtons()}
                        <button onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages}>
                            ▸
                        </button>
                    </div>
                </div>
                <div className="container">
                    <div className="tableContainer">
                        <table>
                            <thead>
                                <tr>
                                    <th>
                                        <div className="withFilter">
                                            <span>Nombre</span>
                                            <input type="search" name="searchProduct" onChange={handleChangeName} value={name} placeholder="Buscar" autoComplete="off" className="filterSearch" 
                                            />
                                        </div>
                                    </th>
                                    <th>Color</th>
                                    <th>Imagen</th>
                                    <th>Talle</th>
                                    <th>Stock</th>
                                    <th>Precio</th>
                                    <th>Categoría</th>
                                    <th>Detalle</th>
                                </tr>
                            </thead>
                            <tbody>
                                {paginatedProducts?.map((product) => (
                                    product.color.map((color, colorIndex) => (
                                        <React.Fragment key={`${product._id}-${colorIndex}`}>
                                            <tr className={!product.active ? style.inactive : ''}>
                                                {/* <td>{colorIndex === 0 ? product.name : ''}</td> */}
                                                <td className={style.tdInside}>
                                                    <div className={style.containerInfoGral}>
                                                        <span className={style.nameProduct}>{colorIndex === 0 ? product.name : ''}</span>
                                                    </div>
                                                </td>
                                                <td className={style.tdInside}>
                                                    <div className={style.containerColor}>
                                                        <span>{color.colorName}</span>
                                                    </div>
                                                </td>
                                                <td className={style.tdContainerImage}>
                                                    {product.imageGlobal ? (
                                                        <div>
                                                            <img className={style.imageProduct} src={getImageUrl(product.imageGlobal)} alt="Product Image" />
                                                        </div>
                                                    ) : (
                                                        <div className={style.containerSize}>
                                                            <img src={getImageUrl(color.image) || imgProduct} alt="Product Image" className={style.imageProduct} />
                                                        </div>
                                                    )}
                                                </td>
                                                <td className={style.tdInside}>
                                                    {color.size.map((size, sizeIndex) => (
                                                        <div key={sizeIndex} className={style.containerSizeName}>
                                                            <span>{size.sizeName}</span>
                                                        </div>
                                                    ))}
                                                </td>
                                                <td className={style.tdInside}>
                                                    {color.size.map((size, sizeIndex) => (
                                                        <div key={sizeIndex} className={style.containerSizeName}>
                                                            <span>{size.stock}</span>
                                                        </div>
                                                    ))}
                                                </td>
                                                <td className={style.tdInside}>
                                                    <div className={style.containerInfoGral}>
                                                        <span>{colorIndex === 0 ? `$ ${product.price}` : ''}</span>
                                                    </div>
                                                </td>
                                                <td className={style.tdInside}>
                                                    {product.category.length > 0 
                                                        ? <div className={style.containerInfoGral}><span>{colorIndex === 0 && product.category[0].name}</span></div>
                                                        : <div className={style.containerInfoGral}><span>Sin categoría</span></div>
                                                    }
                                                </td>
                                                <td className={style.tdInside}>
                                                    <Link to={`/main_window/products/${product._id}`}>
                                                        <img src={detail} alt="" className='detailImg' />
                                                    </Link>
                                                </td>
                                            </tr>
                                        </React.Fragment>
                                    ))
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductManagement;