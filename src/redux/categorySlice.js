import { createSlice } from "@reduxjs/toolkit";

export const categorySlice = createSlice({
    name: "category",
    initialState: {
        categories: [],
        categoriesCopy: [],
    },
    reducers: {
        getCategoriesReducer: (state, action) => {
            state.categories = action.payload;
            state.categoriesCopy = action.payload;
        },
        postCategoryReducer: (state, action) => {
            state.categories.push(action.payload);
            state.categoriesCopy.push(action.payload);
        }
    }
});

export const { getCategoriesReducer, postCategoryReducer } = categorySlice.actions;

export default categorySlice.reducer;