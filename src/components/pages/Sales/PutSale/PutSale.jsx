import React, { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { useParams, Link, useNavigate } from 'react-router-dom';
import { getSaleById, clearSaleDetail, putSale } from '../../../../redux/saleActions.js';
import { getProducts, getProductById, reduceStock, increaseStock } from '../../../../redux/productActions.js';
import { putRemovePurchases, putAddProducts } from '../../../../redux/clientActions.js';
import AsyncSelect from 'react-select/async';
import style from "./PutSale.module.css";
import detail from "../../../../assets/img/detail.png";
import x from "./img/x.png";

const DetailSale = () => {
    let { id } = useParams();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const saleDetail = useSelector(state => state.sales.saleDetail);
    const products = useSelector(state => state.products.products);
    const [purchasedProducts, setPurchasedProducts] = useState([]);
    const [deletedPurchasedProducts, setDeletedPurchasedProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedProducts, setSelectedProducts] = useState([{ productId: null, colorId: null, sizeId: null }]);
    const [selectedProductQuantities, setSelectedProductQuantities] = useState({});
    const [subtotal, setSubtotal] = useState(0);
    const [discount, setDiscount] = useState(0);
    const [paymentFee, setPaymentFee] = useState(0);
    const [total, setTotal] = useState(0);
    const [previousTotal, setPreviousTotal] = useState(0);  // Nuevo estado para almacenar el total previo
    const productRefs = useRef([]);

    const transformProductOptions = (products) => {
        let productOptions = [];
        products.forEach(product => {
            product.color.forEach(color => {
                color.size.forEach(size => {
                    if (size.stock > 0) {
                        productOptions.push({
                            productId: product._id,
                            colorId: color._id,
                            sizeId: size._id,
                            label: `${product.name} - ${color.colorName} - Talle ${size.sizeName}`,
                            price: product.price,
                            stock: size.stock,
                        });
                    }
                });
            });
        });
        return productOptions;
    };

    const loadProductOptions = (inputValue, callback) => {
        const productOptions = transformProductOptions(products);
        const filteredOptions = productOptions.filter(product => {
            const key = `${product.productId}_${product.colorId}_${product.sizeId}`;
            const selectedQuantity = selectedProductQuantities[key] || 0;
            const availableStock = product.stock - selectedQuantity;

            return availableStock > 0 && product.label.toLowerCase().includes(inputValue.toLowerCase());
        });
        callback(filteredOptions);
    };

   

    const calculateSubtotal = (products) => {
        return products.reduce((subtotal, product) => {
            return subtotal + (product.price || 0);
        }, 0);
    };

    const formatNumber = (number) => {
        return number.toLocaleString('es-ES', {
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        });
    };

    const handleProductChange = (selectedOption, index) => {
        setSelectedProducts((prevSelectedProducts) => {
            const newSelectedProducts = [...prevSelectedProducts];
            newSelectedProducts[index] = selectedOption ? { ...selectedOption } : { productId: null, colorId: null, sizeId: null };
    
            if (index === newSelectedProducts.length - 1 && selectedOption) {
                newSelectedProducts.push({ productId: null, colorId: null, sizeId: null });
                setTimeout(() => {
                    productRefs.current[index + 1].focus();
                }, 0);
            }
    
            setSelectedProductQuantities((prevQuantities) => {
                const newQuantities = { ...prevQuantities };
                const key = selectedOption ? `${selectedOption.productId}_${selectedOption.colorId}_${selectedOption.sizeId}` : null;
                
                if (selectedOption) {
                    newQuantities[key] = (newQuantities[key] || 0) + 1;
                } else {
                    if (newQuantities[key]) {
                        newQuantities[key]--;
                        if (newQuantities[key] <= 0) delete newQuantities[key];
                    }
                }
                return newQuantities;
            });
    
            const updatedSubtotal = calculateSubtotal([...newSelectedProducts, ...purchasedProducts]);
            setSubtotal(updatedSubtotal);
            setTotal(updatedSubtotal - ((updatedSubtotal * discount) / 100));  // Update total without retention
    
            return newSelectedProducts;
        });
    };

    const handleRemoveProduct = (index, fromPurchased) => {
        if (fromPurchased) {
            setPurchasedProducts((prevPurchasedProducts) => {
                const newPurchasedProducts = [...prevPurchasedProducts];
                const removedProduct = newPurchasedProducts.splice(index, 1)[0];
    
                // Agregar el producto eliminado al estado deletedPurchasedProducts
                setDeletedPurchasedProducts((prevDeleted) => [...prevDeleted, removedProduct]);
    
                const newSubtotal = calculateSubtotal([...newPurchasedProducts, ...selectedProducts]);
                setSubtotal(newSubtotal);
                setTotal(newSubtotal - ((newSubtotal * discount) / 100));  // Update total without retention
                return newPurchasedProducts;
            });
        } else {
            setSelectedProducts((prevSelectedProducts) => {
                const newSelectedProducts = [...prevSelectedProducts];
                newSelectedProducts.splice(index, 1);
                const newSubtotal = calculateSubtotal([...purchasedProducts, ...newSelectedProducts]);
                setSubtotal(newSubtotal);
                setTotal(newSubtotal - ((newSubtotal * discount) / 100));  // Update total without retention
                return newSelectedProducts;
            });
        }
    };

    const DropdownIndicator = (props) => {
        return null;
    };

    const customNoOptionsMessage = () => "Nombre del producto buscado";

    useEffect(() => {
        dispatch(clearSaleDetail());
        setPurchasedProducts([]);
        setLoading(true);
        dispatch(getSaleById(id)).then(() => {
            setLoading(false); // Desactiva la bandera de carga cuando los datos estén listos
            dispatch(getProducts());
            setDiscount(saleDetail.discount || 0);
            setPaymentFee(saleDetail.paymentFee || 0);
        });
    }, [dispatch, id]);

    useEffect(() => {
        if (!loading && saleDetail && saleDetail.products) {
            const updatedProducts = [];
            saleDetail.products.forEach((product) => {
                dispatch(getProductById(product.productId)).then((response) => {
                    if (response.error && response.error.status === 404) {
                        updatedProducts.push({
                            name: 'Producto no disponible',
                            selectedColor: null,
                            selectedSize: null,
                            price: 0,
                        });
                    } else {
                        const productInfo = response;
                        const selectedColor = getColorById(productInfo, product.colorId);
                        const selectedSize = getSizeById(productInfo, product.colorId, product.sizeId);
        
                        updatedProducts.push({ ...productInfo, selectedColor, selectedSize });
                        
                    }
        
                    if (updatedProducts.length === saleDetail.products.length) {
                        setPurchasedProducts(updatedProducts);
                        const initialSubtotal = calculateSubtotal(updatedProducts);
                        setSubtotal(initialSubtotal);
                        setPreviousTotal(initialSubtotal - ((initialSubtotal * saleDetail.discount) / 100)); // Almacenar el total previo
                        setTotal(initialSubtotal - ((initialSubtotal * discount) / 100));  // Initialize total without retention
                    }
                });
            });
        } else {
            setPurchasedProducts([]);
        }
        
    }, [saleDetail, dispatch, loading, discount]);

    const getColorById = (product, colorId) => {
        return product?.color?.find(c => c._id === colorId);
    };

    const getSizeById = (product, colorId, sizeId) => {
        const color = getColorById(product, colorId);
        return color?.size?.find(s => s._id === sizeId);
    };

    const handleDiscountChange = (e) => {
        const newDiscount = parseFloat(e.target.value) || 0;
        setDiscount(newDiscount);
        setTotal(subtotal - ((subtotal * newDiscount) / 100));  // Update total without retention
    };

    const handlePaymentFeeChange = (e) => {
        const newPaymentFee = parseFloat(e.target.value) || 0;
        setPaymentFee(newPaymentFee);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
    
        // Calcular los productos a enviar con la información necesaria
        const productsData = [
            ...purchasedProducts.map(product => ({
                productId: product._id,
                colorId: product.selectedColor._id,
                sizeId: product.selectedSize._id,
            })),
            ...selectedProducts
                .filter(product => product.productId)
                .map(product => ({
                    productId: product.productId,
                    colorId: product.colorId,
                    sizeId: product.sizeId
                }))
        ];
    
        // Construir objeto de venta
        const saleData = {
            _id: id,
            products: productsData,
            discount,
            paymentFee,
        };
        
        
        

        deletedPurchasedProducts.forEach(product => {
            const key = `${product._id}_${product.selectedColor._id}_${product.selectedSize._id}`;

            dispatch(increaseStock({
                _id: product._id,
                idColor: product.selectedColor._id,
                idSize: product.selectedSize._id,
                stockToIncrease: 1
            }))
            .catch(error => {
                console.error("Error incrementando el stock:", error);
            });

            if(saleDetail.client){

                let clientData = {
                    _id: saleDetail.client._id,
                    purchasesToRemove: [
                        {
                            productId: product._id,
                            colorId: product.selectedColor._id,
                            sizeId: product.selectedSize._id
                        }
                    ]
                }
                dispatch(putRemovePurchases(clientData));
            };
            
        });

        selectedProducts.forEach(product => {
            if (product.productId) {
                const key = `${product.productId}_${product.colorId}_${product.sizeId}`;
                const prevProduct = purchasedProducts.find(p => p._id === product.productId && p.selectedColor._id === product.colorId && p.selectedSize._id === product.sizeId);

                if (!prevProduct) {
                    // El producto es nuevo, así que debe reducirse el stock
                    dispatch(reduceStock({
                        _id: product.productId,
                        idColor: product.colorId,
                        idSize: product.sizeId,
                        stockToReduce: 1
                    }))
                    .catch(error => {
                        console.error("Error reduciendo el stock:", error);
                    });

                    if(saleDetail.client){

                        let clientData = {
                            _id: saleDetail.client._id,
                            purchases: [
                                {
                                    productId: product.productId,
                                    colorId: product.colorId,
                                    sizeId: product.sizeId
                                }
                            ]
                        }
                        dispatch(putAddProducts(clientData));
                    };
                }
            }
        });
    
        // Realizar la actualización de la venta
        dispatch(putSale(saleData)).then(() => {
            
    
            // Navegar después de guardar
            navigate(`/main_window/sales/${id}`);
        }).catch(error => {
            console.error("Error actualizando la venta:", error);
        });
    };
    
    return (
        <div className="page">
            <div className="component">
                <div className="title">
                    <h2>Editar venta</h2>
                    <div className="titleButtons">
                        <button><Link to={`/main_window/sales/${id}`}>Atrás</Link></button>
                    </div>
                </div>
                <div className={`container ${style.content}`}>
                    {saleDetail.orderNumber && <div className={style.orderNumber}><span>N° de orden:</span> {saleDetail.orderNumber}</div>}
                    <div className={style.row}>
                        {saleDetail.client
                            ?  <p>
                                    <span>Cliente:&nbsp;</span>{saleDetail.client.dni} - {saleDetail.client.name} {saleDetail.client.lastname}
                                    <Link to={`/main_window/clients/${saleDetail.client._id}`}>
                                        <img src={detail} alt=""/>
                                    </Link>
                                </p>
                            : <p><span>Cliente:&nbsp;</span> Anónimo</p>}
                        {saleDetail.paymentMethod && <p><span>Modo de pago:&nbsp;</span> {saleDetail.paymentMethod}</p>}
                        {saleDetail.soldAt && <p><span>Tipo de venta:&nbsp;</span> {saleDetail.soldAt}</p>}
                    </div>
                    <div className={style.row}>
                        <form onSubmit={handleSubmit}>
                            <div className={style.column}>
                                <div className={style.section}>
                                    <p className={style.products}><span>Productos Comprados:</span></p>
                                    <ul>
                                        {purchasedProducts.map((product, index) => (
                                            <li key={index}>
                                                {`${product.name} - ${product.selectedColor?.colorName} - Talle ${product.selectedSize?.sizeName} - Precio $${formatNumber(product.price)}`}
                                                <button type="button" onClick={() => handleRemoveProduct(index, true)}>
                                                    <img src={x} alt="Eliminar" />
                                                </button>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                                <div className={style.section}>
                                    <p className={style.products}><span>Seleccionar Productos:</span></p>
                                    {selectedProducts.map((product, index) => (
                                        <div key={index} className={style.productSelectorDiv}>
                                            <div className={style.productSelector}>
                                                <AsyncSelect
                                                    ref={(el) => (productRefs.current[index] = el)}
                                                    cacheOptions
                                                    defaultOptions
                                                    loadOptions={loadProductOptions}
                                                    onChange={(option) => handleProductChange(option, index)}
                                                    value={product.productId ? product : null}
                                                    components={{ DropdownIndicator }}
                                                    noOptionsMessage={customNoOptionsMessage}
                                                    
                                                />
                                            </div>
                                            
                                            {selectedProducts.length > 1 && (
                                                <button type="button" onClick={() => handleRemoveProduct(index, false)}>
                                                    <img src={x} alt="Eliminar" />
                                                </button>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div className={style.column}>
                                <div className={style.section}>
                                    <p><span>Subtotal: </span>${formatNumber(subtotal)}</p>
                                </div>
                                <div className={style.section}>
                                    <p>
                                        <label>Descuento (porcentaje):&nbsp;</label>
                                        <input
                                            type="number"
                                            value={discount}
                                            onChange={handleDiscountChange}
                                        />
                                    </p>
                                </div>
                                <div className={style.section}>
                                    <p><span>Descuento (en pesos): </span>- ${formatNumber((subtotal * discount) / 100)}</p>
                                </div>
                                <div className={style.section}>
                                    <p>
                                        <label>Retención (porcentaje):&nbsp;</label>
                                        <input
                                            type="number"
                                            value={paymentFee}
                                            onChange={handlePaymentFeeChange}
                                        />
                                    </p>
                                </div>
                                <div className={style.section}>
                                    <p><span>Retención (en pesos): </span>- ${formatNumber((total * paymentFee) / 100)}</p>
                                </div>
                                <div className={style.section}>
                                    <p><span>Total con Retención: </span>{formatNumber(total - ((total * paymentFee) / 100))}</p>
                                </div>
                                <div className={style.section}>
                                    <p><span>Total: </span>{formatNumber(total)}</p>
                                </div>
                                <div className={style.section}>
                                    <p>{previousTotal > total ?
                                    `Saldo a favor del cliente $${formatNumber(previousTotal - total)}` :
                                    `El cliente debe abonar una diferencia de $${formatNumber(total - previousTotal)}`}</p>
                                </div>
                                <div className={style.section}>
                                    <button type="submit">Guardar</button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
        
    );
};

export default DetailSale;
