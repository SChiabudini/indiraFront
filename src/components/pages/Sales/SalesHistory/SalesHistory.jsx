import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from "react-redux";
import { Link } from 'react-router-dom';
import { getSales, searchSales, getSalesByOrderNumber, getSalesByClient } from '../../../../redux/saleActions.js';
import detail from '../../../../assets/img/detail.png';

const SalesHistory = () => {
    const sales = useSelector(state => state.sales.sales);
    const dispatch = useDispatch();

    const [orderNumber, setOrderNumber] = useState('');
    const [client, setClient] = useState('');
    const [sortByDate, setSortByDate] = useState('desc');
    const [currentPage, setCurrentPage] = useState(1);

    const itemsPerPage = 20;

    useEffect(() => {
        dispatch(searchSales(orderNumber, client))
        .catch(() => {
            if(orderNumber){
                dispatch(getSalesByOrderNumber(orderNumber));
            }
            else if(client){
                dispatch(getSalesByClient(client));
            }
            else { dispatch(getSales()); }
        });
    }, [orderNumber, client, dispatch]);

    const handleChangeOrderNumber = (event) => {
        setOrderNumber(event.target.value);
        setCurrentPage(1);
    };

    const handleChangeClient = (event) => {
        setClient(event.target.value);
        setCurrentPage(1);
    };

    const formatDate = (date) => {
        const options = { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' };
        const formattedDate = new Date(date).toLocaleDateString('es-ES', options).replace(',', ' -');
        return formattedDate;
    };

    const toggleSortOrder = () => {
        setSortByDate(sortByDate === 'asc' ? 'desc' : 'asc');
    };

    const sortedSales = [...sales].sort((a, b) => {
        const dateA = new Date(a.date);
        const dateB = new Date(b.date);
        return sortByDate === 'asc' ? dateA - dateB : dateB - dateA;
    });

    const paginatedSales = sortedSales.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
    const totalPages = Math.ceil(sortedSales.length / itemsPerPage);

    const handlePageChange = (newPage) => {
        if (newPage > 0 && newPage <= totalPages) {
            setCurrentPage(newPage);
        }
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

    const formatNumber = (number) => {
        return number.toLocaleString('es-ES', {
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        });
    };

    return (
        <div className="component">
            <div className="title">
                <h2>HISTORIAL DE VENTAS</h2>
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
                                        <span>Fecha y hora</span>
                                        <button className="sort" onClick={toggleSortOrder}>{sortByDate === 'asc' ? '▴' : '▾'}</button>
                                    </div>
                                </th>
                                <th>
                                    <div className="withFilter">
                                        <span>Orden</span>
                                        <input
                                            type="search"
                                            name="searchOrder"
                                            onChange={handleChangeOrderNumber}
                                            value={orderNumber}
                                            placeholder="Buscar"
                                            autoComplete="off"
                                            className="filterSearch"
                                        />
                                    </div>
                                </th>
                                <th>
                                    <div className="withFilter">
                                        <span>Cliente</span>
                                        <input
                                            type="search"
                                            name="searchClient"
                                            onChange={handleChangeClient}
                                            value={client}
                                            placeholder="Buscar"
                                            autoComplete="off"
                                            className="filterSearch"
                                        />
                                    </div>
                                </th>
                                <th>Productos</th>
                                <th>Medio de pago</th>
                                <th>Descuento</th>
                                <th>Total</th>
                                <th>Detalle</th>
                            </tr>
                        </thead>
                        <tbody>
                            {paginatedSales.map(sale => (
                                <tr key={sale._id}>
                                    <td>{formatDate(sale.date)}</td>
                                    <td className="center">{sale.orderNumber}</td>
                                    <td>{sale.client ? `${sale.client.name} ${sale.client.lastname}` : 'Anónimo'}</td>
                                    <td className="center">{sale.products.length}</td>
                                    <td>{sale.paymentMethod}</td>
                                    <td className="center">{sale.discount ? `${sale.discount}%` : '-'}</td>
                                    <td className="center">$ {formatNumber(sale.totalPrice)}</td>
                                    <td>
                                        <Link to={`/main_window/sales/${sale._id}`}>
                                            <img src={detail} alt="" className="detailImg" />
                                        </Link>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default SalesHistory;
