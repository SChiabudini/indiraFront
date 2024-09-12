import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { useParams, Link, useNavigate } from 'react-router-dom';
import { putRemovePurchases } from '../../../../redux/clientActions.js';
import { getSales, getSaleById, getSaleByIdLocal, clearSaleDetail, deleteSale } from '../../../../redux/saleActions.js';
import { getProductById, increaseStock } from '../../../../redux/productActions.js';
import print from "../../../../assets/img/print.png";
import detail from "../../../../assets/img/detail.png";
import jsPDF from 'jspdf';
import style from "./DetailSale.module.css";


const DetailSale = () => {

    let { id } = useParams();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const sales = useSelector(state => state.sales.sales);
    const saleDetail = useSelector(state => state.sales.saleDetail);
    const products = useSelector(state => state.products.products);
    const [purchasedProducts, setPurchasedProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [productsLoading, setProductsLoading] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);

    useEffect(() => {
        dispatch(clearSaleDetail());
        setPurchasedProducts([]);
        setLoading(true);
        setProductsLoading(true);
        dispatch(getSaleById(id))
        .then(() => {
            setLoading(false); // Desactiva la bandera de carga cuando los datos estén listos
        })
        .catch(() => {
            // Si la solicitud falla, intenta obtener los datos localmente
            dispatch(getSaleByIdLocal(id));
            setLoading(false);
        });
    }, [dispatch, id]);

    useEffect(() => {
        if (!loading && saleDetail && saleDetail.products) {
            const updatedProducts = [];
            saleDetail.products.forEach((product) => {
                dispatch(getProductById(product.productId)).then((response) => {
                    if (response.error && response.error.status === 404) {
                        // Producto no encontrado, agregar producto como no disponible
                        updatedProducts.push({
                            name: 'Producto no disponible',
                            selectedColor: null,
                            selectedSize: null,
                            price: null,
                        });
                    } else {
                        const productInfo = response;
                        const selectedColor = getColorById(productInfo, product.colorId);
                        const selectedSize = getSizeById(productInfo, product.colorId, product.sizeId);

                        updatedProducts.push({ ...productInfo, selectedColor, selectedSize });
                    
                    }
                    // Solo actualiza purchasedProducts después de que todos los productos hayan sido cargados
                    if (updatedProducts.length === saleDetail.products.length) {
                        setPurchasedProducts(updatedProducts);
                        setProductsLoading(false);
                    }
                })
                .catch(() => {
                        const filteredProduct = products.find(p => p._id === product.productId);
                        if (filteredProduct) {
                            const selectedColor = getColorById(filteredProduct, product.colorId);
                            const selectedSize = getSizeById(filteredProduct, product.colorId, product.sizeId);

                            updatedProducts.push({ ...filteredProduct, selectedColor, selectedSize });
                        } 
                        if (updatedProducts.length === saleDetail.products.length) {
                            setPurchasedProducts(updatedProducts);
                            setProductsLoading(false);
                        }
                });
            });
        } else {
            setPurchasedProducts([]);
        }
    }, [saleDetail, dispatch, loading]);

    const getColorById = (product, colorId) => {
        return product?.color?.find(c => c._id === colorId);
    };

    const getSizeById = (product, colorId, sizeId) => {
        const color = getColorById(product, colorId);
        return color?.size?.find(s => s._id === sizeId);
    };

    const formatNumber = (number) => {
        return number.toLocaleString('es-ES', {
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        });
    };

    const toggleShowDeleteModal = () => {
        setShowDeleteModal(!showDeleteModal);
    }

    const generatePDF = () => {
        // Variables para el ancho del papel de ticket (58 mm) y la altura mínima
        const pageWidth = 58;
        const minPageHeight = 100; // Altura mínima en mm (ajústala según sea necesario)
        const lineHeight = 6; // Altura de cada línea de texto en mm
        const maxLineWidth = pageWidth - 8; // Deja un margen de 4 mm en cada lado
    
        // Crear el PDF inicialmente sin la altura dinámica
        const doc = new jsPDF({
            orientation: 'portrait',
            unit: 'mm',
            format: [pageWidth, minPageHeight] // Se ajustará más adelante
        });
    
        // Función para ajustar texto al ancho del ticket
        const calculateLines = (text) => {
            const lines = doc.splitTextToSize(text, maxLineWidth);
            return lines.length;
        };
    
        // Función para calcular la altura del contenido
        const calculateContentHeight = () => {
            let totalHeight = 20; // Margen superior inicial
            totalHeight += 60; // Título
    
            // Información general de la venta
            totalHeight += calculateLines(`N° de orden: ${saleDetail.orderNumber || 'N/A'}`) * lineHeight;
            totalHeight += calculateLines(`Cliente: ${saleDetail.client ? `${saleDetail.client.name} ${saleDetail.client.lastname}` : 'Anónimo'}`) * lineHeight;
            totalHeight += calculateLines(`Modo de pago: ${saleDetail.paymentMethod || 'N/A'}`) * lineHeight;
            totalHeight += calculateLines(`Subtotal: $${formatNumber(saleDetail.subTotal) || '0.00'}`) * lineHeight;
            totalHeight += calculateLines(`Descuento: ${saleDetail.discount}% (- $${formatNumber(saleDetail.discountApplied) || '0.00'})`) * lineHeight;
            totalHeight += calculateLines(`Total: $${formatNumber(saleDetail.totalPrice) || '0.00'}`) * lineHeight;
            totalHeight += 6; // Espacio adicional entre secciones
    
            // Calcular espacio para los productos de la venta
            if (purchasedProducts?.length) {
                totalHeight += lineHeight; // Título de productos
                purchasedProducts.forEach(product => {
                    totalHeight += calculateLines(`${product.name || 'Producto desconocido'}`) * lineHeight;
                    totalHeight += calculateLines(`Color: ${product.selectedColor?.colorName || 'N/A'}`) * lineHeight;
                    totalHeight += calculateLines(`Talle: ${product.selectedSize?.sizeName || 'N/A'}`) * lineHeight;
                    totalHeight += calculateLines(`Precio: $${formatNumber(product.price) || '0.00'}`) * lineHeight;
                });
            }
    
            // Ajusta la altura de la página al contenido o un mínimo
            return Math.max(totalHeight, minPageHeight);
        };
    
        // Recalcular la altura de la página en función del contenido
        const pageHeight = calculateContentHeight();
        doc.setPage(1); // Asegura que estamos trabajando en la primera página
        doc.internal.pageSize.setHeight(pageHeight); // Ajusta la altura del documento
    
        const charSpace = 0.5; // Ajusta el espaciado entre caracteres en mm
        doc.setCharSpace(charSpace);

        let yPos = 20;

        // Definir el texto y su alineación
        const text = 'INDIRA GOLD';
        const x = (doc.internal.pageSize.getWidth() / 2) - 3; // Posición X centrada
        const textWidth = doc.getTextWidth(text);

        // Agregar el texto al PDF, centrado horizontalmente
        doc.text(text, x - (textWidth / 2), yPos);

        doc.setCharSpace(0);

        yPos = 40;
        // Añade título
        doc.setFontSize(16);
        doc.text('Ticket de cambio', 4, yPos);
    
        // Información general de la venta
        yPos = 50;
        doc.setFontSize(12);
    
        // Función para ajustar texto al ancho del ticket y añadirlo al documento
        const addWrappedText = (text, x, y) => {
            const lines = doc.splitTextToSize(text, maxLineWidth);
            lines.forEach(line => {
                doc.text(line, x, y);
                y += lineHeight;
            });
            return y;
        };
    
        yPos = addWrappedText(`N° de orden: ${saleDetail.orderNumber || 'N/A'}`, 4, yPos);
        yPos = addWrappedText(`Cliente: ${saleDetail.client ? `${saleDetail.client.name} ${saleDetail.client.lastname}` : 'Anónimo'}`, 4, yPos);
        yPos = addWrappedText(`Modo de pago: ${saleDetail.paymentMethod || 'N/A'}`, 4, yPos);
        yPos = addWrappedText(`Subtotal: $${formatNumber(saleDetail.subTotal) || '0.00'}`, 4, yPos);
        yPos = addWrappedText(`Descuento: ${saleDetail.discount}% (- $${formatNumber(saleDetail.discountApplied) || '0.00'})`, 4, yPos);
        yPos = addWrappedText(`Total: $${formatNumber(saleDetail.totalPrice) || '0.00'}`, 4, yPos);
        yPos += 6;
    
        // Productos de la venta
        if (purchasedProducts?.length) {
            yPos = addWrappedText('Productos:', 4, yPos);
            yPos += 6;

            purchasedProducts.forEach(product => {
                yPos = addWrappedText(`${product.name || 'Producto desconocido'}`, 4, yPos);
                yPos = addWrappedText(`Color: ${product.selectedColor?.colorName || 'N/A'}`, 4, yPos);
                yPos = addWrappedText(`Talle: ${product.selectedSize?.sizeName || 'N/A'}`, 4, yPos);
                yPos = addWrappedText(`Precio: $${formatNumber(product.price) || '0.00'}`, 4, yPos);
                yPos += 6;
            });
        }
    
        // Abre el PDF en una nueva pestaña/ventana y activa el diálogo de impresión
        const pdfBlob = doc.output('blob'); // Crea un Blob del PDF
        const pdfUrl = URL.createObjectURL(pdfBlob); // Crea una URL del Blob
        const printWindow = window.open(pdfUrl); // Abre una nueva ventana con el PDF
    
        if (printWindow) {
            printWindow.onload = function () {
                printWindow.print(); // Llama a la función de impresión de la nueva ventana
            };
        } else {
            alert("Por favor, permite las ventanas emergentes para imprimir el ticket.");
        }
    };
    
    
    const handleDelete = () => {

        purchasedProducts.forEach((product) => {
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
        })

        dispatch(deleteSale(id)).then(
            dispatch(getSales()).then(
                navigate('/main_window/')
            )
        )
        .catch(
            dispatch(getSales()).then(
                navigate('/main_window/')
        ));
    }

    return(
        <div className="page">
            {loading ? (
                <div>Cargando</div>
            ) : (
                    <div className="component">
                        <div className="title">
                            <h2>Detalle de la venta</h2>
                            <div className="titleButtons">
                                <button onClick={generatePDF}><img src={print} alt=""/></button>
                                <button><Link to={`/main_window/sales/edit/${id}`}>Cambio</Link></button>
                                <button className="delete" onClick={toggleShowDeleteModal}>Eliminar</button>
                                <button><Link to={`/main_window/`}>Atrás</Link></button>
                            </div>
                        </div>
                        <div className={`container ${style.content}`}>
                            {saleDetail.orderNumber && <div className={style.orderNumber}><span>N° de orden:</span> {saleDetail.orderNumber}</div>}
                            
                            <div className={style.column}>
                                {saleDetail.client
                                ?  <p>
                                        <span>Cliente:&nbsp;</span>{saleDetail.client.dni} - {saleDetail.client.name} {saleDetail.client.lastname}
                                        <Link to={`/main_window/clients/${saleDetail.client._id}`}>
                                            <img src={detail} alt=""/>
                                        </Link>
                                    </p>
                                : <p><span>Cliente:&nbsp;</span> Anónimo</p>}
                                {saleDetail.paymentMethod && <p><span>Modo de pago:&nbsp;</span> {saleDetail.paymentMethod}</p>}
                                {/* {saleDetail.paymentMethod && <p>Modo de pago: {saleDetail.paymentMethod.join(', ')}</p>} */}
                                {saleDetail.soldAt && <p><span>Tipo de venta:&nbsp;</span> {saleDetail.soldAt}</p>}
                                {saleDetail.subTotal && <p><span>Subtotal:&nbsp;</span> ${formatNumber(saleDetail.subTotal)}.</p>}
                                {<p><span>Descuento:&nbsp;</span> {saleDetail.discount}% {`(- $${saleDetail.discountApplied})`}</p>}
                                {saleDetail.totalPrice && <p><span>Total:&nbsp;</span> ${formatNumber(saleDetail.totalPrice)}.</p>}
                            </div>
                            <div className={style.column}>
                                <p><span>Productos:&nbsp;</span></p>
                                {productsLoading ? (
                                    <div>Cargando productos...</div> 
                                ) : purchasedProducts?.length ? (
                                    <ul>
                                        {purchasedProducts.length > 0 ? (
                                            purchasedProducts.map((product, index) => (
                                                <li key={index}>
                                                    <p><span>{product.name}</span></p>
                                                    <ul className={style.productList}>
                                                        {product.selectedColor && <li><span>Color:&nbsp;</span>{product.selectedColor?.colorName || 'Desconocido'}</li>}
                                                        {product.selectedSize && <li><span>Talle:&nbsp;</span>{product.selectedSize?.sizeName || 'Desconocido'}</li>}
                                                        {product.price &&<li><span>Precio:&nbsp;</span>${formatNumber(product.price)}</li>}
                                                    </ul>
                                                </li>
                                            ))
                                        ) : (
                                            <div>No hay compras registradas</div>
                                        )}
                                    </ul>
                                ) : (
                                    <p>No hay productos vendidos disponibles.</p>
                                )}
                            </div>
                        </div>          
                    </div>
            )}
            <div className={`${style.deleteModal} ${showDeleteModal ? style.deleteModalShow : ''}`}>
                <div className={style.deleteContent}>
                    <p>¿Está seguro que desea eliminar esta venta?</p>
                    <div className={style.deleteButtons}>
                        <button onClick={toggleShowDeleteModal}>Cancelar</button>
                        <button onClick={handleDelete} className="delete">Eliminar</button>
                    </div>
                </div>
            </div>
        </div>
        
    );
};

export default DetailSale;