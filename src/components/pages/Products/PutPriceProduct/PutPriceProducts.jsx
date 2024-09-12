import style from './PutPriceProducts.module.css';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Select from 'react-select';
import { getProducts, putIncreasePrice } from '../../../../redux/productActions.js';
import { getCategories } from '../../../../redux/categoryActions.js';

const PutPriceProducts = () => {
    const dispatch = useDispatch();
    const products = useSelector(state => state.products.products);
    const categories = useSelector(state => state.categories.categories);
    // console.log(products);
    

    useEffect(() => {
        dispatch(getProducts());
        dispatch(getCategories());
    }, [dispatch]);

    const initialPriceState = {
        porcentage: '',
        products: [],
        category: []
    };

    const [newPrice, setNewPrice] = useState(initialPriceState)
    const [selectedOption, setSelectedOption] = useState('byProducts');
    const [isSubmitDisabled, setIsSubmitDisabled] = useState(true);
// console.log(newPrice);

    const validateForm = () => {
        const isPorcentageValid = (newPrice.porcentage !== '') && (newPrice.porcentage !== 0);
        const isCategoryValid = selectedOption === 'allProducts' || (selectedOption === 'byCategory' && newPrice.category.length > 0);
        const isProductValid = selectedOption === 'allProducts' || (selectedOption === 'byProducts' && newPrice.products.length > 0);

        const shouldEnableSubmit = 
            (isProductValid || isCategoryValid || selectedOption === 'allProducts') && isPorcentageValid;

        setIsSubmitDisabled(!shouldEnableSubmit);
    };

    useEffect(() => {
        validateForm();
    }, [newPrice.porcentage, newPrice.products, newPrice.category, selectedOption]);

    // Convert categories to the format needed for react-select
    const categoryOptions = categories.map(category => ({
        value: category._id, // or another unique identifier
        label: category.name
    }));

    const productOptions = products.map(product => ({
        value: product._id,
        label: product.name
    }));

    const handleInputChange = (event) => {
        const { value } = event.target;
    
        // Si el campo está vacío, establece el porcentaje como una cadena vacía
        const porcentageValue = value === '' ? '' : Number(value);
    
        setNewPrice({
            ...newPrice,
            porcentage: porcentageValue
        });
    
        validateForm();
    };

    const handleProductsChange = (selectedProducts) => {
        setNewPrice({
            ...newPrice,
            products: selectedProducts || []
        });
        validateForm();
    };

    // const deleteProduct = (index) => {
    //     setNewPrice(prevState => {
    //         const updatedProducts = prevState.products.filter((_, i) => i !== index);
    //         return { ...prevState, products: updatedProducts };
    //     });
    // };

    const handleCategoryChange = (selectedCategory) => {
        const array = selectedCategory ? [selectedCategory] : [];
        setNewPrice({
            ...newPrice,
            category: array
        });
        validateForm();
    };

    const handleCheckboxChange = (option) => {
        setSelectedOption(option);
        setNewPrice({
            ...newPrice,
            products: [],
            category: []
        });
        validateForm();
    };

    const categoryInputStyles = {
        control: (provided, state) => ({
            ...provided,
            minHeight: '20px',
            fontSize: '0.75rem',
            borderColor: state.isFocused ? '#e4b61a' : provided.borderColor,
            boxShadow: state.isFocused ? '0 0 0 1px #e4b61a' : provided.boxShadow,
            '&:hover': {
                borderColor: state.isFocused ? '#e4b61a' : provided.borderColor,
            }
        }),
        input: (provided) => ({
            ...provided,
            color: '#3c3c3b',
        }),
        placeholder: (provided) => ({
            ...provided,
            color: '#797979',
            fontStyle: 'italic'
        }),
        dropdownIndicator: (provided) => ({
            ...provided,
            color: '#3c3c3b',
            padding: 0
        }),
        option: (provided, state) => ({
            ...provided,
            color: state.isSelected ? '#000' : '#555',
            padding: '10px',
            fontSize: '0.75rem'
        }),
    };

    const handleSubmit = async (event) => {
        event.preventDefault();       
        dispatch(putIncreasePrice(newPrice));
        setNewPrice(initialPriceState);
    };

    return (
        <div className="page">
            <div className="component">
                <div className="title">
                    <h2>GESTIÓN DE PRECIOS</h2>
                </div>
                <div className="container">
                    <form onSubmit={handleSubmit}>
                        <div className={style.containerCheckbox}>
                            <div className={style.containerInputCheckbox}>
                                <input className={style.inputCheckbox} type="checkbox" name="byProducts" id="byProducts" checked={selectedOption === 'byProducts'} onChange={() => handleCheckboxChange('byProducts')} />
                                <span className={style.spanCheckbox}>Por producto</span>
                            </div>
                            <div className={style.containerInputCheckbox}>
                                <input className={style.inputCheckbox} type="checkbox" name="byCategory" id="byCategory" checked={selectedOption === 'byCategory'} onChange={() => handleCheckboxChange('byCategory')} />
                                <span className={style.spanCheckbox}>Por categoría</span>   
                            </div>
                            <div className={style.containerInputCheckbox}>
                                <input className={style.inputCheckbox} type="checkbox" name="allProducts" id="allProducts" checked={selectedOption === 'allProducts'} onChange={() => handleCheckboxChange('allProducts')} />
                                <span className={style.spanCheckbox}>Todos los productos</span>
                            </div>                                                
                        </div>
                        <div className={style.labelInput}>
                            <div className={style.left}>
                                <label htmlFor="products">Listado de productos</label>
                            </div>
                            <div className={style.right}>
                                <Select
                                    name="products"
                                    value={newPrice.products}
                                    onChange={handleProductsChange}
                                    options={productOptions}
                                    isMulti
                                    placeholder="Seleccionar"
                                    menuPortalTarget={document.body}
                                    styles={{
                                        menuPortal: base => ({ ...base, zIndex: 9999 }),
                                        ...categoryInputStyles
                                    }}
                                    isDisabled={selectedOption === 'allProducts' || selectedOption === 'byCategory'}
                                />
                            </div>
                        </div>
                        <div className={style.labelInput}>
                            <div className={style.left}>
                                <label htmlFor="category">Categorías</label>
                            </div>
                            <div className={style.right}>
                                <Select
                                    name="category"
                                    value={newPrice.category}
                                    onChange={handleCategoryChange}
                                    options={categoryOptions}
                                    placeholder="Seleccionar"
                                    menuPortalTarget={document.body}
                                    styles={{
                                        menuPortal: base => ({ ...base, zIndex: 9999 }),
                                        ...categoryInputStyles
                                    }}
                                    isDisabled={selectedOption === 'allProducts' || selectedOption === 'byProducts'}
                                />
                            </div>
                        </div>
                        <div className={style.labelInput}>
                            <div className={style.left}>
                                <label htmlFor="porcentage">Aumento %</label>
                            </div>
                            <div className={style.right}>
                                <input 
                                    name="porcentage"
                                    placeholder='0'
                                    min='0'
                                    value={newPrice.porcentage}
                                    onChange={handleInputChange}
                                    className={style.inputPorcentage}
                                    type='number'
                                />
                            </div>
                        </div>
                        <div className={style.containerButtonSubmit}>
                            <button type='submit' disabled={isSubmitDisabled}>Actualizar</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default PutPriceProducts;
