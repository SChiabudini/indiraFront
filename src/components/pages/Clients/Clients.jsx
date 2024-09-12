import React, { useEffect} from 'react';
import { useDispatch } from "react-redux";
import { getClients } from '../../../redux/clientActions.js';
import ClientRegistration from './ClientRegistration/ClientRegistration.jsx';
import FormClient from './FormClient/FormClient.jsx';
import style from './Clients.module.css';


const Clients = () => {

    const dispatch = useDispatch();
    
    useEffect(() => {
        dispatch(getClients());
    }, [dispatch]);

    return(
        <div className="page">
            <div className={style.formClient}><FormClient /></div> 
            <div className={style.clientRegistration}><ClientRegistration /></div>
        </div>
    );
};

export default Clients;