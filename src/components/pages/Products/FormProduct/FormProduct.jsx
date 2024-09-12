import style from './FormProduct.module.css';
import x from '../../Sales/FormSales/img/x.png';
import imgProduct from '../../../../assets/img/imgProduct.jpeg';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import FormCategory from '../FormCategory/FormCategory.jsx';
import { getCategories } from '../../../../redux/categoryActions.js';
import { postProduct } from '../../../../redux/productActions.js';

const FormProduct = () => {
    
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const initialProductState = {
        name: '',
        color: [],
        supplier: {
            name: '',
            phone: ''
        },
        price: 0,
        category: [],
        description: ''
    };

    useEffect(() => {
        dispatch(getCategories());
        validateForm();
    }, [dispatch]);

    const categories = useSelector(state => state.categories.categories);
    
    const [newProduct, setNewProduct] = useState(initialProductState);
    const [colors, setColors] = useState([]);
    const [newColor, setNewColor] = useState('');
    const [sizes, setSizes] = useState([]);
    const [newSize, setNewSize] = useState('');
    const [selectedOptionImage, setSelectedOptionImage] = useState('unique');
    const [imageGlobal, setImageGlobal] = useState(null);
    const [imagePreview, setImagePreview] = useState(imgProduct);
    const [showCategoryForm, setShowCategoryForm] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [actionType, setActionType] = useState(null);
    const [isSubmitDisabled, setIsSubmitDisabled] = useState(true);
// console.log(newProduct); 

    const validateForm = () => {
        const isProductNameValid = newProduct.name.trim() !== '';
        const isColorValid = colors.length > 0;
        const isSizeValid = sizes.length > 0;
        const isCategoryValid = newProduct.category.length > 0;
        const isPriceValid = newProduct.price > 0;

        // Validar que al menos una combinación de color y talla tenga stock mayor a 0
        const hasAtLeastOneValidStock = combinations.some(combination => {
            const color = newProduct.color.find(c => c.colorName === combination.color);
            const size = color ? color.size.find(s => s.sizeName === combination.size) : null;
            return size ? size.stock > 0 : false;
        });

        setIsSubmitDisabled(!(isProductNameValid && isColorValid && isSizeValid && isCategoryValid && isPriceValid && hasAtLeastOneValidStock));
    };

    const handleInputChange = (event) => {
        const { name, value } = event.target;

        if(name === 'name'){
            setNewProduct({
                ...newProduct,
                name: value
            });
        };
        if(name === 'price'){
            let priceNumber = Number(value);
            setNewProduct({
                ...newProduct,
                price: priceNumber
            });
            validateForm();
        };
        if(name === 'category'){
            let array = [];
            array.push(value);
            setNewProduct({
                ...newProduct,
                category: array
            });
        };
        if(name === 'description'){
            setNewProduct({
                ...newProduct,
                description: value
            });
        };
        // else{
        //     setNewProduct({
        //         ...newProduct,
        //         [name]: value
        //     });
        // }
        validateForm();
    };

    //-----------COLOR-----------//
    const handleInputColorChange = (event) => {
        setNewColor(event.target.value);
    };

    const addColor = () => {
        if (newColor !== '') {
            setColors([...colors, newColor]);
            setNewColor('');
        };
        validateForm();
    };
    
    const deleteColor = (index) => {
        const updatedColors = [...colors];
        updatedColors.splice(index, 1);
        setColors(updatedColors);
    
        const updatedProductsColor = [...newProduct.color];
    
        // Se busca el color a eliminar basado en el índice de colors
        const colorToDelete = colors[index]; 
        // Y aca filtramos el array color de newProduct para eliminar el objeto correspondiente
        const filteredProductsColor = updatedProductsColor.filter(item => item.colorName !== colorToDelete);
    
        setNewProduct({
            ...newProduct,
            color: filteredProductsColor
        });
        validateForm();
    };

    //-----------SIZE-----------//
    const handleInputSizeChange = (event) => {
        setNewSize(event.target.value);
    };

    const addSize = () => {
        if (newSize !== '') {
            setSizes([...sizes, newSize]);
            setNewSize('');
        };
        validateForm();
    };

    const deleteSize = (index) => {
        const updatedSizes = [...sizes];
        updatedSizes.splice(index, 1);
        setSizes(updatedSizes);
        validateForm();
    };

    //-----------COMBINACION(COLOR/SIZE)-----------//
    const generateCombinations = () => {
        return colors.flatMap(color =>
            sizes.map(size => ({ color, size }))
        );
    };
    const combinations = generateCombinations();

    //-----------STOCK-----------//
    const handleStockChange = (combination, event) => {
        const { name, value } = event.target;
    
        const updatedProduct = { ...newProduct };
    
        //Se encuentra el índice de color existente o se añade uno nuevo si no existe
        let colorIndex = updatedProduct.color.findIndex(item => item.colorName === combination.color);
    
        if (colorIndex === -1) {
            updatedProduct.color.push({
                colorName: combination.color,
                size: [],
                image: ''
            });
    
            //Se reasigna el índice para el color recién añadido
            colorIndex = updatedProduct.color.length - 1;
        };
    
        //idem
        let sizeIndex = updatedProduct.color[colorIndex].size.findIndex(item => item.sizeName === combination.size);
    
        if (sizeIndex === -1) {
            updatedProduct.color[colorIndex].size.push({
                sizeName: combination.size,
                measurements: {
                    width: '',
                    long: '',
                    rise: ''
                },
                code: 'CÓDIGO QR',
                stock: 0
            });    
            //idem
            sizeIndex = updatedProduct.color[colorIndex].size.length - 1;
        };
    
        //Se actualiza las medidas (width, long, rise) y el stock
        if (name === 'width' || name === 'long' || name === 'rise') {
            updatedProduct.color[colorIndex].size[sizeIndex].measurements[name] = value;
        } else if (name === 'stock') {
            if (value > 0) {
                updatedProduct.color[colorIndex].size[sizeIndex].stock = value;
            } else {
                //Si el stock es 0, eliminamos el objeto del array size
                updatedProduct.color[colorIndex].size.splice(sizeIndex, 1);
            }
        };
    
        // i el array size está vacío después de eliminar el objeto, eliminamos el objeto color
        if (updatedProduct.color[colorIndex].size.length === 0) {
            updatedProduct.color.splice(colorIndex, 1);
        };
    
        setNewProduct(updatedProduct);
        validateForm();
    };

    //-----------SUPPLIER-----------//
    const handleSupplierChange = (event) => {
        const { name, value } = event.target;
    
        const updatedProduct = {
            ...newProduct,
            supplier: {
                ...newProduct.supplier, 
                [name]: value
            }
        };
        setNewProduct(updatedProduct);
    };
    
    //-----------IMAGEN-----------//
    const handleCheckboxChange = (option) => {
        setSelectedOptionImage(!option === selectedOptionImage ? 'unique' : option);
    };

    const handleImageChange = (event, colorIndex) => {
        const file = event.target.files[0];

        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                const updatedProduct = { ...newProduct };

                if (colorIndex !== undefined) {
                    // Subir imagen específica por color
                    updatedProduct.color[colorIndex].imageFile = file;
                    updatedProduct.color[colorIndex].image = reader.result;

                    // Eliminar imagen global si hay una
                    if (updatedProduct.imageGlobal) {
                        updatedProduct.imageGlobal = null;
                        updatedProduct.imageGlobalPreview = null;
                        setImageGlobal(null);
                    }

                    setNewProduct(updatedProduct);
                    setImagePreview(reader.result);
                } else {
                    // Subir imagen global
                    updatedProduct.imageGlobal = file;
                    updatedProduct.imageGlobalPreview = reader.result;

                    // Eliminar imágenes específicas de cada color
                    updatedProduct.color = updatedProduct.color.map(color => ({
                        ...color,
                        imageFile: null,
                        image: null
                    }));

                    setNewProduct(updatedProduct);
                    setImageGlobal(reader.result);
                    setImagePreview(reader.result);
                }
            };
            reader.readAsDataURL(file);
        }
    };
    
    const deleteImage = (index) => {
        const updatedProduct = { ...newProduct };

            updatedProduct.imageGlobal = null;
            updatedProduct.imageGlobalPreview = null;
            updatedProduct.color[index].imageFile = null;
            updatedProduct.color[index].image = null;
            setImageGlobal(imgProduct);

        setNewProduct(updatedProduct);
        setImagePreview(imgProduct);
    };

    //-----------CATEGORY-----------//
    const handleShowCategoryForm = (type) => {
        setShowCategoryForm(!showCategoryForm);
        setActionType(type);
    };

    const handleCloseCategoryForm = () => {
        setShowCategoryForm(false);
    };

    const handleCategoryAdded = (newCategory) => {
        setShowCategoryForm(false);
        
        if(newCategory !== undefined){
            setSelectedCategory({ value: newCategory._id, label: newCategory.name });
            setNewProduct((prevNewProduct) => ({
                ...prevNewProduct,
                category: [newCategory._id]
            }));
        };
        dispatch(getCategories());
        validateForm();
    };

    //-----------SUBMIT-----------//
    const handleSubmit = async (event) => {
        event.preventDefault();
        const formData = new FormData();

        // Agregar la imagen global si existe
        if (newProduct.imageGlobal) {
            formData.append('imageGlobal', newProduct.imageGlobal);
        };
        newProduct.color.forEach((color, index) => {
            if (color.imageFile) {
                formData.append('images', color.imageFile);
            }
        });
    
        formData.append("name", newProduct.name);
        formData.append("color", JSON.stringify(newProduct.color));
        formData.append("supplier", JSON.stringify(newProduct.supplier));
        formData.append("price", newProduct.price);
        formData.append("category", JSON.stringify(newProduct.category));
        formData.append("description", newProduct.description);

        try {
            const response = await dispatch(postProduct(formData));
    
            if (response.data) {
                console.log("Product successfully saved");
                setColors([]);
                setSizes([]);
                setImageGlobal(null);
                setNewProduct(initialProductState); // Reset form
                navigate('/main_window/products/succes/post');
            }
        } catch (error) {
            console.error("Error saving product:", error);
        }
    };    

    return (
        <div className="page">
            <div className="component">
                <div className="title">
                    <h2>NUEVO PRODUCTO</h2>
                </div>
                <div className="container">
                    <form onSubmit={handleSubmit} className={style.productForm}>
                        <div className={style.column1}>
                            <div className={style.containerMessage}>
                                <label className={style.mensagge}>Los campos con (*) son obligatorios</label>
                            </div>
                            <div>
                                <label htmlFor="name" className={style.nameTitle}>*Nombre</label>
                                <input type="text" name="name" value={newProduct.name} onChange={handleInputChange} className={style.inputName}/>
                            </div>
                            <div className={style.detailProduct}>
                                <div className={style.colorContainer}>
                                    <label htmlFor="color">*Colores</label>
                                    <div className={style.colorCard}>
                                        <ol>
                                            {colors.map((color, colorIndex) => (
                                                <li key={colorIndex} className={style.list}>
                                                    <span className={style.spanList}>{color}</span>
                                                    <button type="button" className={style.buttonDelete} onClick={() => deleteColor(colorIndex)}>
                                                        <img src={x} alt="x" />
                                                    </button>
                                                </li>
                                            ))}
                                        </ol>
                                        <input className={style.inputAddColor} type="text" name="color" value={newColor} onChange={handleInputColorChange} placeholder='Agregar' />
                                        <button type="button" className={style.buttonAdd} onClick={addColor}>+</button>
                                    </div>
                                </div>
                                <div className={style.sizeContainer}>
                                    <label htmlFor="size">*Talle</label>
                                    <div className={style.sizeCard}>
                                        <ol>
                                            {sizes.map((size, index) => (
                                                <li key={index} className={style.list}>
                                                    <span className={style.spanList}>{size}</span>
                                                    <button type="button" className={style.buttonDelete} onClick={() => deleteSize(index)}>
                                                        <img src={x} alt="x" />
                                                    </button>
                                                </li>
                                            ))}
                                        </ol>
                                        <input className={style.inputAddSize} type="text" name="size" value={newSize} onChange={handleInputSizeChange} placeholder='Agregar' />
                                        <button type="button" className={style.buttonAdd} onClick={addSize}>+</button>
                                    </div>
                                </div>
                            </div>
                            <div className={style.stockContainer}>
                                <label htmlFor="color">Medidas y stock</label>
                                <div className={style.stockCard}>
                                    <ol>
                                        {combinations.map((combination, index) => (
                                            <li key={index} className={style.list}>
                                                <span className={style.spanList}>
                                                    Color {combination.color} - Talle {combination.size}
                                                </span>
                                                <span className={style.spansinMed} htmlFor="width">Ancho:</span>
                                                <input className={style.inputsinMed} type="number" name="width" placeholder='0' onChange={(event) => handleStockChange(combination, event)} />
                                                <span className={style.spansinMed} htmlFor="long">Largo:</span>
                                                <input className={style.inputsinMed} type="number" name="long" placeholder='0' onChange={(event) => handleStockChange(combination, event)} />
                                                <span className={style.spansinMed} htmlFor="rise">Tiro:</span>
                                                <input className={style.inputsinMed} type="number" name="rise" placeholder='0' onChange={(event) => handleStockChange(combination, event)} />
                                                <span className={style.spansinMed} htmlFor="stock">*Stock:</span>
                                                <input className={style.inputsinStock} type="number" name="stock" min='0' placeholder='0' onChange={(event) => handleStockChange(combination, event)} />
                                            </li>
                                        ))}
                                    </ol>
                                </div>
                            </div>
                            <div className={style.supplierContainer}>
                                <label htmlFor="supplier" className={style.supplierTitle}>Proveedor</label>
                                <div className={style.dataSupplierContainer}>
                                    <label htmlFor="name" className={style.nameTitle}>Nombre</label>
                                    <input type="text" name="name" value={newProduct.supplier.name} onChange={handleSupplierChange} className={style.inputName}/>
                                </div>
                                <div className={style.dataSupplierContainer}>
                                    <label htmlFor="phone" className={style.nameTitle}>Teléfono</label>
                                    <input type="text" name="phone" value={newProduct.supplier.phone} onChange={handleSupplierChange} className={style.inputName}/>
                                </div>
                            </div>   
                        </div>
                        <div className={style.column2}>
                            <div className={style.imageContainer}>
                                <div className={style.imageTitleContainer}>
                                    <div className={style.title}>
                                        <label htmlFor="image">Imágenes</label>
                                        {selectedOptionImage === 'unique' && (
                                            <div>
                                                <label htmlFor={'imageUniqueProduct'} className={style.labelImage}>+</label>
                                                <input type="file" accept="image/*" id={'imageUniqueProduct'} onChange={(event) => handleImageChange(event)} className={style.inputImage} />
                                            </div>
                                        )}
                                    </div>
                                    <div>
                                        <input className={style.inputCheckbox} type="checkbox" name="unique" id="unique" checked={selectedOptionImage === 'unique'} onChange={() => handleCheckboxChange('unique')} />
                                        <span className={style.spanImage}>Único</span>
                                        <input className={style.inputCheckbox} type="checkbox" name="byColor" id="byColor" checked={selectedOptionImage === 'byColor'} onChange={() => handleCheckboxChange('byColor')} />
                                        <span className={style.spanImage}>Por color</span>
                                    </div>
                                </div>
                                <div className={style.imageComponent}>  
                                    <ol>
                                        {newProduct.color.map((color, index) => (
                                            <li key={index} className={style.list}>
                                                <span className={style.spanList}>{color.colorName}</span>
                                                {selectedOptionImage === 'byColor' && (
                                                    <div>
                                                        <label className={style.labelImage} htmlFor={`imageProduct-${index}`}>Cargar imagen</label>
                                                        <input 
                                                            className={style.inputImage} 
                                                            type="file" 
                                                            accept="image/*" 
                                                            onChange={(event) => handleImageChange(event, index)} 
                                                            id={`imageProduct-${index}`}
                                                        />
                                                    </div>
                                                )}
                                                <img className={style.imgProduct} src={color.image || imageGlobal || imgProduct} alt="image-product" />
                                                <button type="button" className={style.buttonDelete} onClick={() => deleteImage(index)}>
                                                    <img src={x} alt="x" />
                                                </button>
                                            </li>
                                        ))}
                                    </ol>                                              
                                </div>
                            </div>
                            <div className={style.rigthContainer}>      
                                <div className={style.categoryContainer}>
                                    <label htmlFor="category" className={style.nameTitle}>*Categoría</label>
                                    <select name="category" className={style.selectCategory} value={newProduct.category} onChange={handleInputChange}>
                                        <option value="" disabled>Seleccionar</option>
                                        {categories && categories.length > 0 ? (
                                            categories.map((category) => (
                                                <option key={category._id} value={category._id}>{category.name}</option>
                                            ))
                                        ) : (
                                            <option value="" disabled>No hay categorías disponibles</option>
                                        )}
                                    </select>
                                    <div className={style.containerAddCategory}>
                                        <button className={style.buttonAddCategory} type='button' onClick={() => handleShowCategoryForm('create')}>+</button>
                                        <button className={style.buttonDeleteCategory} type='button' onClick={() => handleShowCategoryForm('delete')}>-</button>
                                    </div>
                                </div>
                                <div className={style.priceContainer}>
                                    <label htmlFor="price" className={style.nameTitle}>*Precio $</label>
                                    <input type="number" name="price" onChange={handleInputChange} placeholder='0' min='0'/>
                                </div>    
                                <div className={style.descriptionContainer}>
                                    <label htmlFor="description" className={style.nameTitle}>Descripción</label>
                                    <textarea type="text" name="description" value={newProduct.description} onChange={handleInputChange}/>
                                </div> 
                            </div>
                            <div>
                                <button type="submit" disabled={isSubmitDisabled}>Agregar</button>                    
                            </div>
                        </div>
                    </form>
                    <div className={`${style.addCategoryComponent} ${showCategoryForm ? style.addCategoryComponentBorder : ''}`}>
                        {showCategoryForm && <FormCategory onCategoryAdded={handleCategoryAdded} onClose={handleCloseCategoryForm} actionType={actionType}/>}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FormProduct;