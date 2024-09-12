import React, { useState, useEffect } from "react";
import style from "./SideBar.module.css";
import { NavLink, useLocation } from "react-router-dom";
import logo from "./img/logo.png";
import bg from "./img/sideBarBg.jpg";
import item from "./img/item.png";
import itemSelected from "./img/itemSelected.png";

const SideBar = () => {
    const location = useLocation();
    const [subMenuVisible, setSubMenuVisible] = useState(false);

    const handleClick = (name) => {
        if (name !== 'products') {
            setSubMenuVisible(false);
        }
    };

    const toggleSubMenu = (event) => {
        setSubMenuVisible(!subMenuVisible);
    };

    return (
        <div className={style.div}>
            <div className={style.bg}><img src={bg} alt=""/></div>
            <div className={style.content}>
                <h1><img src={logo} alt="Indira Gold"/></h1>
                <div className={style.nav}>
                    <ul>                                
                        <NavLink className={`${style.NavLink} ${location.pathname === '/' ? style.selected : ''}`} to="/" onClick={() => handleClick('sales')}>
                            <li>
                                <div className={style.icon}></div>
                                <div className={style.text}>
                                    <div>
                                        <p>Ventas</p>
                                    </div>
                                </div>
                            </li>
                        </NavLink>
                        <li className={`${style.NavLink} ${subMenuVisible ? style.selected : ''}`} onClick={toggleSubMenu}>
                            <div className={style.icon}><img src={`${subMenuVisible ? itemSelected : item}`} alt=""/></div>
                            <div className={style.text}>
                                <NavLink
                                    className={`${style.NavLink} ${location.pathname.includes('/main_window/products/form') ? style.selected : ''}` } to="/main_window/products/form"
                                >
                                    <div>
                                        <p>Productos</p>
                                    </div>
                                </NavLink>
                            </div>
                        </li>
                        {subMenuVisible && (
                            <div className={`${style.subMenu} ${subMenuVisible ? style.subMenuVisible : ''}`}>
                                <ul>
                                    <li>
                                        <NavLink
                                            className={`${style.NavLink} ${location.pathname === '/main_window/products/form' ? style.selected : ''}`}
                                            to="/main_window/products/form"
                                        >
                                            <div>
                                                <p>Nuevo Producto</p>
                                            </div>
                                        </NavLink>
                                    </li>
                                    <li>
                                        <NavLink
                                            className={`${style.NavLink} ${location.pathname === '/main_window/products/management' ? style.selected : ''}`}
                                            to="/main_window/products/management"
                                        >
                                            <div>
                                                <p>Gestión de Productos</p>
                                            </div>
                                        </NavLink>
                                    </li>
                                    <li>
                                        <NavLink
                                            className={`${style.NavLink} ${location.pathname === '/main_window/products/edit/price' ? style.selected : ''}`}
                                            to="/main_window/products/edit/price"
                                        >
                                            <div>
                                                <p>Gestión de Precios</p>
                                            </div>
                                        </NavLink>
                                    </li>
                                </ul>
                            </div>
                        )}
                        <NavLink className={`${style.NavLink} ${location.pathname === '/main_window/clients' ? style.selected : ''}`} to="/main_window/clients" onClick={() => handleClick('clients')}>
                            <li>
                                <div className={style.icon}></div>
                                <div className={style.text}>
                                    <div>
                                        <p>Clientes</p>
                                    </div>
                                </div>
                            </li>
                        </NavLink>
                        <NavLink className={`${style.NavLink} ${location.pathname === '/main_window/stats' ? style.selected : ''}`} to="/main_window/stats" onClick={() => handleClick('stats')}>
                            <li>
                                <div className={style.icon}></div>
                                <div className={style.text}>
                                    <div>
                                        <p>Estadísticas</p>
                                    </div>
                                </div>
                            </li>
                        </NavLink>
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default SideBar;