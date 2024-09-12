import { createSlice } from "@reduxjs/toolkit";

export const clientSlice = createSlice({
    name: "client",
    initialState: {
        clients: [],
        clientsCopy: [],
        clientDetail: {},
        clientsName: [],
        clientsLastname: [],
    },
    reducers: {

        getClientsReducer: (state, action) => {
            state.clients = action.payload;
            state.clientsCopy = action.payload;
        },

        getClientByIdReducer: (state, action) => {
            if(typeof action.payload === "string" || typeof action.payload === "number"){
                const clientFound = state.clientsCopy.find((client) => client._id === action.payload);
                state.clientDetail = clientFound;
            }else{
                state.clientDetail = action.payload;
            }
        },

        clearClientDetailReducer: (state, action) => {
            state.clientDetail = {};
        },

        getClientsByDniReducer: (state, action) => {
            const query = action.payload.trim();
            state.clients = state.clientsCopy.filter(client => client.dni.includes(query));
        },

        getClientsByNameReducer: (state, action) => {
            const query = action.payload.trim().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
            const regex = new RegExp(query, 'i');
            state.clients = state.clientsCopy.filter(client => {
                    const name = client.name.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
                    return regex.test(name);
            });
        },

        getClientsByLastnameReducer: (state, action) => {
            const query = action.payload.trim().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
            const regex = new RegExp(query, 'i');
            state.clients = state.clientsCopy.filter(client => {
                    const lastname = client.lastname.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
                    return regex.test(lastname);
            });
        }
    }
});

export const { getClientsReducer, getClientByIdReducer, clearClientDetailReducer, getClientsByDniReducer, getClientsByNameReducer, getClientsByLastnameReducer } = clientSlice.actions;

export default clientSlice.reducer;