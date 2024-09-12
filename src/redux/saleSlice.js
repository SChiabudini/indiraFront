import { createSlice } from "@reduxjs/toolkit";

export const saleSlice = createSlice({
    name: "sale",
    initialState: {
        sales: [],
        salesCopy: [],
        saleDetail: {},
        salesOnline: [],
        salesLocal: [],
        salesBalance: {}
    },
    reducers: {
        getSalesReducer: (state, action) => {
            state.sales = action.payload;
            state.salesCopy = action.payload;
        },
        getSaleByIdReducer: (state, action) => {
            if(typeof action.payload === "string" || typeof action.payload === "number"){
                const saleFound = state.salesCopy.find((sale) => sale._id === action.payload);
                state.saleDetail = saleFound;
            }else{
                state.saleDetail = action.payload;
            }
        },
        getSalesByOrderNumberReducer: (state, action) => {
            const query = action.payload.trim();
            state.sales = state.salesCopy.filter(sale => sale.orderNumber.includes(query));
        },
        getSalesByClientReducer: (state, action) => {
            const query = action.payload.trim().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
            const regex = new RegExp(query, 'i');
            state.sales = state.salesCopy.filter(sale => {
                if (sale.client) {
                    const name = sale.client.name.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
                    const lastname = sale.client.lastname.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
                    return regex.test(name) || regex.test(lastname);
                }
                return false;
            });
        },
        clearSaleDetailReducer: (state, action) => {
            state.saleDetail = {};
        },
        getSalesOnlineReducer: (state, action) => {
            state.salesOnline = action.payload;
        },
        getSalesOnlineLocalReducer: (state, action) => {
            state.salesOnline = state.salesCopy.filter(sale => sale.soldAt.includes('Online'));
        },
        getSalesLocalReducer: (state, action) => {
            state.salesLocal = action.payload;
        },
        getSalesLocalLocalReducer: (state, action) => {
            state.salesLocal = state.salesCopy.filter(sale => sale.soldAt.includes('Local'));
        },
        getSalesBalanceReducer: (state, action) => {
            state.salesBalance = action.payload;
        },
        getSalesBalanceLocalReducer: (state, action) => {
            state.salesBalance = state.salesBalance;
        },
        deleteSaleReducer: (state, action) => {
            const saleIdToDelete = action.payload;
            state.sales = state.sales.filter(sale => sale._id !== saleIdToDelete);
            state.salesCopy = state.salesCopy.filter(sale => sale._id !== saleIdToDelete);
        }
    }
});

export const { getSalesReducer, getSaleByIdReducer, clearSaleDetailReducer, getSalesOnlineReducer, getSalesOnlineLocalReducer, getSalesLocalReducer, getSalesLocalLocalReducer, getSalesBalanceReducer, getSalesBalanceLocalReducer, getSalesByClientReducer, getSalesByOrderNumberReducer, deleteSaleReducer } = saleSlice.actions;

export default saleSlice.reducer;