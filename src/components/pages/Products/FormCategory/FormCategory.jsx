import style from './FormCategory.module.css';
import React, { useState, useEffect } from 'react';
import { postCategory, deleteCategoryById } from '../../../../redux/categoryActions.js';
import { useDispatch, useSelector } from 'react-redux';

const FormCategory = ({ onCategoryAdded, onClose, actionType  }) => {
    
    const dispatch = useDispatch();
    const categories = useSelector(state => state.categories.categories);

    const initialCategoryState = {
        name: ''
    };

    const [newCategory, setNewCategory] = useState(initialCategoryState);
    const [deleteCategory, setDeleteCategory] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [isSubmitDisabled, setIsSubmitDisabled] = useState(true);
    // console.log(deleteCategory);

    useEffect(() => {
        validateForm();
    }, [newCategory, deleteCategory]);

    const validateForm = () => {
        const isCategoryNameValid = newCategory.name.trim() !== '';
        const isDeleteCategoryValid = deleteCategory !== '';
        
        if(actionType === 'create') {
            setIsSubmitDisabled(!isCategoryNameValid);
        } else if(actionType === 'delete') {
            setIsSubmitDisabled(!isDeleteCategoryValid);
        };
    };

    const handleInputChange = (event) => {
        setNewCategory({
            ...newCategory,
            name: event.target.value
        });
        setErrorMessage('');
    };

    const handleDeleteCategoryChange = (event) => {
        setDeleteCategory(event.target.value);
        setErrorMessage('');
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (actionType === 'delete') {
            try {            
                await dispatch(deleteCategoryById(deleteCategory));
                onCategoryAdded();  // Indicar que la categoría fue eliminada
                setDeleteCategory('');                
            } catch (error) {
                console.error('Error delete category:', error);
            }
        } else if (actionType === 'create') {
            const categoryExists = categories.some(category => category.name.toLowerCase() === newCategory.name.toLowerCase());
        
            if (categoryExists) {
                setErrorMessage('*Esta categoría ya existe');
                return;
            };

            try {
                const createdCategory = await dispatch(postCategory(newCategory));
                
                onCategoryAdded(createdCategory);
                setNewCategory(initialCategoryState);
            } catch (error) {
                console.error('Error creating category:', error);
            }
        }
    };
    return (
        <div className="component">
            <div className={style.titleForm}>
                <h2 className={actionType === 'create' ? '' : style.titleDeleteForm}>{actionType === 'create' ? 'NUEVA CATEGORÍA' : 'ELIMINAR CATEGORÍA'}</h2>
                <button className={style.buttonOnClose} type='button' onClick={onClose}>X</button>
            </div>
            <div className="container">
                <form onSubmit={handleSubmit}>
                    {actionType === 'create' && (
                        <>
                            <label htmlFor="name" className={style.nameTitle}>Nombre</label>
                            <input
                                type="text"
                                name="name"
                                value={newCategory.name}
                                onChange={handleInputChange}
                                className={style.inputName}
                            />
                        </>
                    )}                    
                    {actionType === 'delete' && (
                        <>
                            <label htmlFor="category" className={style.nameTitle}>Categoría</label>
                            <select name="category" className={style.selectCategory} value={deleteCategory} onChange={handleDeleteCategoryChange}>
                                <option value="" disabled>Seleccionar</option>
                                {categories.map((category) => (
                                    <option key={category._id} value={category._id}>{category.name}</option>
                                ))}
                            </select>
                        </>
                    )}                
                    {errorMessage && <p className={style.errorMessage}>{errorMessage}</p>}
                    <div className={style.containerButton}>
                        <button type="submit" disabled={isSubmitDisabled} className={actionType === 'create' ? '' : 'delete'}>
                            {actionType === 'create' ? 'Agregar' : 'Eliminar'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default FormCategory;