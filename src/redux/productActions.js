import axios from "axios";
import { saveToIndexedDB, saveProductsToIndexedDB, saveAllProductsToIndexedDB, getFromIndexedDB, getAllProductsFromIndexedDB, getProductsFromIndexedDB } from '../services/indexedDB.js';
import { getProductsReducer, getAllProductsReducer, getProductByIdReducer, getProductsByNameReducer, getSoldProductsReducer, getSoldProductsLocalReducer, getTopFiveProductsReducer, getTopFiveProductsLocalReducer } from "./productSlice.js";

// export const getProducts = () => {
//     return async (dispatch) => {
//         const { data } = await axios.get("/products");
//         dispatch(getProductsReducer(data));
//     };
// };

export const getProducts = () => {
    return async (dispatch) => {
        try {
            const { data } = await axios.get("/products");
            
            if (data) {
                dispatch(getProductsReducer(data));
                const key = 0;
                await saveProductsToIndexedDB('products', data, key);
            } else {
                console.log("No llegó data de GetProducts");
            };

        } catch (error) {
            // Intentar obtener los datos locales de IndexedDB como un respaldo
            const { success, data: products } = await getProductsFromIndexedDB('products');
            if (success && Array.isArray(products) && products.length > 0) {
                // Obtener la última posición del array
                const lastProducts = products[products.length - 1];
                dispatch(getProductsReducer(lastProducts)); // Despachar solo el último elemento
                return true;
            } else {
                console.error("Error retrieving sales from server:", error.message);
            };
            
            // console.error("Error retrieving sales from server:", error.message);
        }
    };
};

export const getAllProducts = () => {
    return async (dispatch) => {
        try {
            const { data } = await axios.get("/products/all");
            
            if (data) {
                dispatch(getAllProductsReducer(data));
                const key = 0;
                await saveAllProductsToIndexedDB('allProducts', data, key);
            } else {
                console.log("No llegó data de GetAllProducts");
            };

        } catch (error) {
            // Intentar obtener los datos locales de IndexedDB como un respaldo
            const { success, data: allProducts } = await getAllProductsFromIndexedDB('allProducts');
            if (success && Array.isArray(allProducts) && allProducts.length > 0) {
                // Obtener la última posición del array
                const lastAllProducts = allProducts[allProducts.length - 1];
                dispatch(getAllProductsReducer(lastAllProducts)); // Despachar solo el último elemento
                return true;
            } else {
                console.error("Error retrieving sales from server:", error.message);
            };
            
            // console.error("Error retrieving sales from server:", error.message);
        }
    };
};

// export const getAllProducts = () => {
//     return async (dispatch) => {
//         const { data } = await axios.get("/products/all");        
//         dispatch(getAllProductsReducer(data));
//     };
// };

export const getProductById = (productId) => {
    return async (dispatch) => {
        try {
            const { data } = await axios.get(`/products/${productId}`);
            if(data){
                console.log("hay data");
                dispatch(getProductByIdReducer(data));
                return data;
            } else {
                console.log("no hay");
                return Promise.reject("No data received");
            }
            
        } catch (error) {
            console.log(error.message);
            return Promise.reject(error);
        }
    };
};

export const getProductByName = (productName) => {
    return async (dispatch) => {
        try {
            const { data } = await axios.get(`/products/all?name=${productName}&`);
            dispatch(getAllProductsReducer(data));
        } catch (error) {
            dispatch(getProductsByNameReducer(productName));
        }
        
    };
};

export const getSoldProducts = () => {
    return async (dispatch) => {
        const { data } = await axios.get("/products/sold");
        dispatch(getSoldProductsReducer(data));
    };
};

export const getSoldProductsLocal = () => {
    return async (dispatch) => {
        dispatch(getSoldProductsLocalReducer());
    };
};

export const getTopFiveProducts = () => {
    return async (dispatch) => {
        const { data } = await axios.get("/products/rating");
        dispatch(getTopFiveProductsReducer(data));
    };
};

export const getTopFiveProductsLocal = () => {
    return async (dispatch) => {
        dispatch(getTopFiveProductsLocalReducer());
    };
};

export const postProduct = (productData) => {
    return async (dispatch) => {     
        const response = await axios.post('/products', productData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
        return response;
    };
};

export const putProduct = (productData) => {    
    return async (dispatch) => {     
        const response = await axios.put('/products', productData);
        return response;
    };
};

export const putProductStatus = (productId) => {    
    return async (dispatch) => {     
        const response = await axios.put(`/products/${productId}`);
        return response;
    };
};

export const putIncreasePrice = (productData) => {    
    return async (dispatch) => {     
        const response = await axios.put('/products/increasePrice', productData);
        return response;
    };
};

export const reduceStock = (productData) => {
    return async () => {
        try {
            const { data } = await axios.put('/products/reduce', productData);
            return data;
        } catch (error) {
            return error.message;
        }
        
    };
};

export const increaseStock = (productData) => {
    return async () => {
        try {
            const { data } = await axios.put('/products/increase', productData);
            return data;
        } catch (error) {
            return error.message;
        }
        
    };
};

export const deleteProductById = (productId) => {
    return async (dispatch) =>{
        const { data } = await axios.put(`/products/deactive/${productId}`);
    };
};