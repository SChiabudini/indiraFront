import axios from "axios";
import { saveToIndexedDB, saveCategoriesToIndexedDB, getFromIndexedDB, getCategoriesFromIndexedDB } from '../services/indexedDB.js';
import { getCategoriesReducer, postCategoryReducer } from "./categorySlice";


export const getCategories = () => {
    return async (dispatch) => {
        try {
            const { data } = await axios.get("/category");
            
            if (data) {
                dispatch(getCategoriesReducer(data));
                const key = 0;
                await saveCategoriesToIndexedDB('category', data, key);
            } else {
                console.log("No llegó data de GetSales");
            };

        } catch (error) {
            // Intentar obtener los datos locales de IndexedDB como un respaldo
            const { success, data: category } = await getCategoriesFromIndexedDB('category');
            if (success && Array.isArray(category) && category.length > 0) {
                // Obtener la última posición del array
                const lastCategory = category[category.length - 1];
                dispatch(getCategoriesReducer(lastCategory)); // Despachar solo el último elemento
                return true;
            } else {
                console.error("Error retrieving category from IndexedDB.");
            };

            console.error("Error retrieving sales from server:", error.message);
        }
    };
};

// export const getCategories = () => {
//     return async (dispatch) => {
//         const { data } = await axios.get("/category");
//         dispatch(getCategoriesReducer(data));
//     };
// };

export const postCategory = (categoryData) => {
    return async (dispatch) => {
        const { data } = await axios.post('/category', categoryData);
        dispatch(postCategoryReducer(data));
        return data;
    };
};

export const deleteCategoryById = (categoryId) => {
    return async (dispatch) =>{
        const { data } = await axios.put(`/category/deactive/${categoryId}`);
    };
};