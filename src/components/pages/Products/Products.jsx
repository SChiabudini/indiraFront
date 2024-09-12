import React, { useEffect} from 'react';
import { useDispatch } from "react-redux";
import FormProduct from './FormProduct/FormProduct.jsx';
import { getProducts, getAllProducts } from '../../../redux/productActions.js';
import { getCategories } from '../../../redux/categoryActions.js';


const Products = () => {
    
    const dispatch = useDispatch();
    
    useEffect(() => {
        dispatch(getProducts());
        dispatch(getAllProducts());
        dispatch(getCategories());
    }, [dispatch]);
    
    return (
        <div>
            <FormProduct />
        </div>
    );
};

export default Products;