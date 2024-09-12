import { createSlice } from "@reduxjs/toolkit";

export const productSlice = createSlice({
    name: "product",
    initialState: {
        products: [],
        productsCopy: [],
        allProducts: [],
        allProductsCopy: [],
        productDetail: {},
        selectedProduct: [],
        soldProducts: [],
        topFiveProducts: [],
    },
    reducers: {
        getProductsReducer: (state, action) => {
            state.products = action.payload;
            state.productsCopy = action.payload;
        },
        getAllProductsReducer: (state, action) => {
            state.allProducts = action.payload;
            state.allProductsCopy = action.payload;
        },
        getProductByIdReducer: (state, action) => {
            if(typeof action.payload === "string" || typeof action.payload === "number"){
                const productFound = state.allProducts.find((product) => product._id === action.payload);
                state.productDetail = productFound;
            } else {
                state.productDetail = action.payload; 
            }           
        },
        getProductsByNameReducer: (state, action) => {
            const query = action.payload.trim().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
            const regex = new RegExp(query, 'i');
            state.allProducts = state.allProductsCopy.filter(product => {
                    const name = product.name.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
                    return regex.test(name);
            });
        },
        getSoldProductsReducer: (state, action) => {
            state.soldProducts = action.payload;
        },
        getSoldProductsLocalReducer: (state, action) => {
            state.soldProducts = state.soldProducts;
        },
        getTopFiveProductsReducer: (state, action) => {
            state.topFiveProducts = action.payload;
        },
        getTopFiveProductsLocalReducer: (state, action) => {
            state.topFiveProducts = state.topFiveProducts;
        },
    }
});

export const { getProductsReducer, getAllProductsReducer, getProductByIdReducer, getProductsByNameReducer, getSoldProductsReducer, getSoldProductsLocalReducer, getTopFiveProductsReducer, getTopFiveProductsLocalReducer } = productSlice.actions;

export default productSlice.reducer;