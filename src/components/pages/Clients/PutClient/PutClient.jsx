import style from './PutClient.module.css';
import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useDispatch, useSelector } from "react-redux";
import { getClients, getClientById, putClient } from '../../../../redux/clientActions';

const PutClient = ({ onClientAdded = () => {}}) => {

    const { id } = useParams();
    const dispatch = useDispatch();
    const clientDetail = useSelector(state => state.clients.clientDetail);

    useEffect(() => {
    dispatch(getClientById(id));
    }, [dispatch, id]);

    useEffect(() => {    
        if (clientDetail && clientDetail._id === id) {        
            const updatedEditClient = {
                _id: clientDetail._id,
                dni: clientDetail.dni,
                name: clientDetail.name,
                lastname: clientDetail.lastname,
                email: clientDetail.email,
                phone: clientDetail.phone,
                active: clientDetail.active
            };
            setEditClient(updatedEditClient);
        }
    }, [dispatch, id, clientDetail]);

    const [editClient, setEditClient] = useState({});  

    //-----------CHANGE-----------//
    const handleChange = (event) => {
        const { name, value } = event.target;

        setEditClient((prevClient) => ({
            ...prevClient,
            [name]: value
        }));
    };

    //-----------SUBMIT-----------//
    const handleSubmit = (e) => {
        e.preventDefault();
        dispatch(putClient(editClient)).then((response) => {
            onClientAdded(response);
            dispatch(getClients());   
            dispatch(getClientById(id));   
            setEditClient({}); // Reset form
        });
        
        if (onClientAdded) {
            onClientAdded();
        };
    };

    return (
        <div className="page">
            <div className="component">
                <div className="title">
                    <h2>EDITAR CLIENTE</h2>
                    <div className="titleButtons">
                        <button><Link to={`/main_window/clients/${id}`}>Atrás</Link></button>
                    </div>
                </div>
                <div className="container">
                    <form onSubmit={handleSubmit} className={style.clientForm}>
                        <div className={style.column}>
                            <div className={style.labelInput}>
                                <label htmlFor="dni">DNI</label>
                                <input 
                                    type="number" 
                                    id="dni" 
                                    name="dni" 
                                    value={editClient.dni} 
                                    onChange={handleChange} 
                                    required 
                                />
                            </div>
                            <div className={style.labelInput}>
                                <label htmlFor="name">Nombre(s)</label>
                                <input 
                                    type="text" 
                                    id="name" 
                                    name="name" 
                                    value={editClient.name} 
                                    onChange={handleChange} 
                                    required 
                                />
                            </div>
                            <div className={style.labelInput}>
                                <label htmlFor="lastname">Apellido(s)</label>
                                <input 
                                    type="text" 
                                    id="lastname" 
                                    name="lastname" 
                                    value={editClient.lastname} 
                                    onChange={handleChange} 
                                    required 
                                />
                            </div>
                        </div>
                        <div className={style.column}>
                            <div className={style.labelInput}>
                                <label htmlFor="email">Email</label>
                                <input 
                                    type="email" 
                                    id="email" 
                                    name="email" 
                                    value={editClient.email} 
                                    onChange={handleChange} 
                                    required 
                                />
                            </div>
                            <div className={style.labelInput}>
                                <label htmlFor="phone">Teléfono</label>
                                <input 
                                    type="number" 
                                    id="phone" 
                                    name="phone" 
                                    value={editClient.phone} 
                                    onChange={handleChange} 
                                    required 
                                />
                            </div>
                            <div className={style.containerSubmit}>
                                <button type="submit">Editar</button>
                            </div>
                        </div>                       
                        {/* <button type="submit"><Link to={`/main_window/clients/${id}`}>Editar</Link></button> */}
                    </form>
                </div>
            </div>
        </div>
    );
};

export default PutClient;