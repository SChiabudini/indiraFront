import style from './PutProduct.module.css';
import x from '../../Sales/FormSales/img/x.png';
import imgProduct from '../../../../assets/img/imgProduct.jpeg';
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import FormCategory from '../FormCategory/FormCategory.jsx';
import { getCategories } from '../../../../redux/categoryActions.js';
import { getProducts, getProductById, putProduct } from '../../../../redux/productActions.js';

const PutProduct = () => {

    const { id } = useParams();
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const productDetail = useSelector(state => state.products.productDetail);    
    const categories = useSelector(state => state.categories.categories);
    
    useEffect(() => {
        dispatch(getProductById(id));
    }, [dispatch, id]);
    
    useEffect(() => {
        dispatch(getCategories());
    
        if (productDetail && productDetail._id === id) {
            setColors(productDetail.color.map(color => color.colorName));
    
            const allSizes = productDetail.color.flatMap(color => 
                color.size.map(size => size.sizeName)
            );
            const uniqueSizes = [...new Set(allSizes)];
            setSizes(uniqueSizes);
    
            const updatedEditProduct = {
                _id: productDetail._id,
                name: productDetail.name,
                color: productDetail.color?.map(color => ({
                    colorName: color.colorName,
                    size: color.size?.map(size => ({
                        sizeName: size.sizeName,
                        measurements: {
                            width: size.measurements[0]?.width || '',
                            long: size.measurements[0]?.long || '',
                            rise: size.measurements[0]?.rise || ''
                        },
                        stock: size.stock || 0
                    })),
                    image: color.image || ''
                })),
                supplier: productDetail.supplier,
                imageGlobal: productDetail.imageGlobal,
                price: productDetail.price,
                category: productDetail.category,
                description: productDetail.description,
                active: productDetail.active
            };
            setEditProduct(updatedEditProduct);
    
            // Inicializa selectedCategory con la categoría del producto
            const categoryId = productDetail.category?.[0]?._id || '';
            setSelectedCategory(categoryId);
        }
    }, [dispatch, id, productDetail]);

    const [editProduct, setEditProduct] = useState({});  
    console.log(editProduct);

    const [colors, setColors] = useState([]);
    const [newColor, setNewColor] = useState('');
    const [sizes, setSizes] = useState([]);
    const [newSize, setNewSize] = useState('');
    const [selectedOptionImage, setSelectedOptionImage] = useState('unique');
    const [imageGlobal, setImageGlobal] = useState(null);
    const [imagePreview, setImagePreview] = useState(imgProduct);
    const [showCategoryForm, setShowCategoryForm] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState(editProduct.category ? editProduct.category[0]._id : null);
    const [actionType, setActionType] = useState(null);
    // const [isSubmitDisabled, setIsSubmitDisabled] = useState(true);
    // console.log('Colors ' + colors);
    // console.log('Sizes ' + sizes);    
    

    // const validateForm = () => {
    //     const isProductNameValid = editProduct.name.trim() !== '';
    //     const isColorValid = colors.length > 0;
    //     const isSizeValid = sizes.length > 0;
    //     const isSupplierValid = Object.keys(editProduct.supplier).length > 0;
    //     // Verificar que exista una imagen global o que cada color tenga su imagen específica
    //     const isImageGlobalValid = !!editProduct.imageGlobal || !!editProduct.imageGlobalPreview;
    //     const isColorImagesValid = editProduct.color.every(color => color.image || color.imageFile);
    //     const isImagesValid = isImageGlobalValid || isColorImagesValid;
    //     const isCategoryValid = editProduct.category.length > 0;
    //     const isPriceValid = editProduct.price > 0;

    //     // Validar que al menos una combinación de color y talla tenga stock mayor a 0
    //     const hasAtLeastOneValidStock = combinations.some(combination => {
    //         const color = editProduct.color.find(c => c.colorName === combination.color);
    //         const size = color ? color.size.find(s => s.sizeName === combination.size) : null;
    //         return size ? size.stock > 0 : false;
    //     });

    //     setIsSubmitDisabled(!(isProductNameValid && isColorValid && isSizeValid && isSupplierValid && isImagesValid && isCategoryValid && isPriceValid && hasAtLeastOneValidStock));
    // };

    const handleInputChange = (event) => {
        const { name, value } = event.target;
    
        if(name === 'name'){
            setEditProduct({
                ...editProduct,
                name: value
            });
        };
        if(name === 'price'){
            let priceNumber = Number(value);
            setEditProduct({
                ...editProduct,
                price: priceNumber
            });

            // validateForm();
        };
        if (name === 'category') {
            setSelectedCategory(value);
    
            const selectedCategory = categories.find(category => category._id === value);
            setEditProduct(prevEditProduct => ({
                ...prevEditProduct,
                category: [{ _id: selectedCategory._id, name: selectedCategory.name }]
            }));
        };
        if(name === 'description'){
            setEditProduct({
                ...editProduct,
                description: value
            });
        };
    
        // validateForm();
    };  

    //-----------COLOR-----------//
    const handleInputColorChange = (event) => {
        setNewColor(event.target.value);
    };

    // const addColor = () => {
    //     if (newColor !== '') {
    //         setColors([...colors, newColor]);
    //         setNewColor('');
    //     };
    //     // validateForm();
    // };

    const addColor = () => {
        if (newColor !== '') {
            setColors([...colors, newColor]);
    
            // Combina el nuevo color con los tamaños existentes
            const updatedEditProduct = {
                ...editProduct,
                color: [
                    ...editProduct.color,
                    {
                        colorName: newColor,
                        size: sizes.map(size => ({
                            sizeName: size,
                            measurements: { width: '', long: '', rise: '' },
                            stock: 0
                        }))
                    }
                ]
            };
            setEditProduct(updatedEditProduct);
    
            setNewColor('');
        }
        // validateForm();
    };
    
    // const deleteColor = (index) => {
    //     const updatedColors = [...colors];
    //     updatedColors.splice(index, 1);
    //     setColors(updatedColors);
    
    //     const updatedProductsColor = [...editProduct.color];
    
    //     // Se busca el color a eliminar basado en el índice de colors
    //     const colorToDelete = colors[index]; 
    //     // Y aca filtramos el array color de newProduct para eliminar el objeto correspondiente
    //     const filteredProductsColor = updatedProductsColor.filter(item => item.colorName !== colorToDelete);

    //     setEditProduct({
    //         ...editProduct,
    //         color: filteredProductsColor
    //     });
    //     // validateForm();
    // };

    const deleteColor = (index) => {
        const updatedColors = [...colors];
        const colorToDelete = updatedColors.splice(index, 1)[0];
        
        setColors(updatedColors);
        
        // Filtra los colores en el estado editProduct para eliminar el color correspondiente
        const filteredProductColors = editProduct.color.filter(color => color.colorName !== colorToDelete);
        
        setEditProduct(prevState => ({
            ...prevState,
            color: filteredProductColors
        }));
    };
    //-----------SIZE-----------//
    const handleInputSizeChange = (event) => {
        setNewSize(event.target.value);
    };

    // const addSize = () => {
    //     if (newSize !== '') {
    //         setSizes([...sizes, newSize]);
    //         setNewSize('');
    //     };
    //     // validateForm();
    // };

    const addSize = () => {
        if (newSize !== '') {
            setSizes([...sizes, newSize]);
    
            // Combina el nuevo tamaño con los colores existentes
            const updatedEditProduct = {
                ...editProduct,
                color: editProduct.color.map(color => ({
                    ...color,
                    size: [
                        ...color.size,
                        {
                            sizeName: newSize,
                            measurements: { width: '', long: '', rise: '' },
                            stock: 0
                        }
                    ]
                }))
            };
            setEditProduct(updatedEditProduct);
    
            setNewSize('');
        }
        // validateForm();
    };
    

    const deleteSize = (index) => {
        const updatedSizes = [...sizes];
        const sizeToDelete = updatedSizes.splice(index, 1)[0];
    
        setSizes(updatedSizes);
    
        // Actualiza el estado editProduct para reflejar la eliminación del talle
        const updatedProductColors = editProduct.color.map(color => {
            return {
                ...color,
                size: color.size.filter(size => size.sizeName !== sizeToDelete)
            };
        });
    
        setEditProduct(prevState => ({
            ...prevState,
            color: updatedProductColors
        }));
    
        // validateForm();
    };

    //-----------COMBINACION(COLOR/SIZE)-----------//
    const generateCombinations = () => {
        return colors?.flatMap(color =>
            sizes.map(size => ({ color, size }))
        );
    };

    const combinations = generateCombinations();

    //-----------STOCK-----------//
    // const handleStockChange = (combination, event) => {
    //     const { name, value } = event.target;
    //     const updatedProduct = { ...editProduct };
    
    //     let colorIndex = updatedProduct.color.findIndex(item => item.colorName === combination.color);
    //     if (colorIndex === -1) {
    //         // Agregar un nuevo color si no existe
    //         updatedProduct.color.push({
    //             colorName: combination.color,
    //             size: [],
    //             image: ''
    //         });
    //         colorIndex = updatedProduct.color.length - 1; // Actualizar colorIndex al nuevo color
    //     }
    
    //     let sizeIndex = updatedProduct.color[colorIndex].size.findIndex(item => item.sizeName === combination.size);
    //     if (sizeIndex === -1) {
    //         // Agregar un nuevo talle si no existe
    //         updatedProduct.color[colorIndex].size.push({
    //             sizeName: combination.size,
    //             measurements: { width: '', long: '', rise: '' },
    //             code: 'CÓDIGO QR',
    //             stock: 0
    //         });
    //         sizeIndex = updatedProduct.color[colorIndex].size.length - 1; // Actualizar sizeIndex al nuevo tamaño
    //     }
    
    //     // Actualización de medidas y stock
    //     if (['width', 'long', 'rise'].includes(name)) {
    //         updatedProduct.color[colorIndex].size[sizeIndex].measurements[name] = value;
    //     } else if (name === 'stock') {
    //         if (value > 0) {
    //             updatedProduct.color[colorIndex].size[sizeIndex].stock = value;
    //         } else {
    //             updatedProduct.color[colorIndex].size.splice(sizeIndex, 1);
    //         }
    //     }
    
    //     // Verificar si se debe eliminar el objeto `color` si todos los `size` tienen stock 0
    //     if (updatedProduct.color[colorIndex].size.length === 0) {
    //         updatedProduct.color.splice(colorIndex, 1);
    //     }
    
    //     setEditProduct(updatedProduct);
    //     // validateForm();
    // };   

    const handleStockChange = (combination, event) => {
        const { name, value } = event.target;
        const updatedEditProduct = { ...editProduct };
    
        const colorIndex = updatedEditProduct.color.findIndex(c => c.colorName === combination.color);
        if (colorIndex === -1) {
            console.error(`Color ${combination.color} no encontrado`);
            return;
        }
    
        const sizeIndex = updatedEditProduct.color[colorIndex].size.findIndex(s => s.sizeName === combination.size);
        if (sizeIndex === -1) {
            console.error(`Talle ${combination.size} no encontrado para el color ${combination.color}`);
            return;
        }
    
        updatedEditProduct.color[colorIndex].size[sizeIndex].measurements = {
            ...updatedEditProduct.color[colorIndex].size[sizeIndex].measurements,
            [name]: value
        };
    
        if (name === 'stock') {
            updatedEditProduct.color[colorIndex].size[sizeIndex].stock = value;
        }
    
        setEditProduct(updatedEditProduct);
    };

    // const handleStockChange = (combination, event) => {
    //     const { name, value } = event.target;
    //     const updatedEditProduct = { ...editProduct };
    
    //     const colorIndex = updatedEditProduct.color.findIndex(c => c.colorName === combination.color);
    //     const sizeIndex = updatedEditProduct.color[colorIndex].size.findIndex(s => s.sizeName === combination.size);
    
    //     if (colorIndex >= 0 && sizeIndex >= 0) {
    //         updatedEditProduct.color[colorIndex].size[sizeIndex].measurements = {
    //             ...updatedEditProduct.color[colorIndex].size[sizeIndex].measurements,
    //             [name]: value
    //         };
    
    //         if (name === 'stock') {
    //             updatedEditProduct.color[colorIndex].size[sizeIndex].stock = value;
    //         }
    //     }
    
    //     setEditProduct(updatedEditProduct);
    // };
    

    //-----------SUPPLIER-----------//
    const handleSupplierChange = (event) => {
        const { name, value } = event.target;
    
        const updatedProduct = {
            ...editProduct,
            supplier: {
                ...editProduct.supplier, 
                [name]: value
            }
        };
        setEditProduct(updatedProduct);
        // validateForm();
    };
    
    //-----------IMAGEN-----------//
    const getImageUrl = (imagePath) => {
        if (!imagePath) return '';
        // URL base para los archivos estáticos
        const baseUrl = 'http://localhost:3001/';
        return `${baseUrl}${imagePath}`;
    };

    const handleCheckboxChange = (option) => {
        setSelectedOptionImage(!option === selectedOptionImage ? 'unique' : option);
    };

    const handleImageChange = (event, colorIndex) => {
        const file = event.target.files[0];
    
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                const updatedProduct = { ...editProduct };
    
                if (colorIndex !== undefined) {
                    // Subir imagen específica por color
                    updatedProduct.color[colorIndex].imageFile = file;
                    updatedProduct.color[colorIndex].image = reader.result;
    
                    // Eliminar imagen global si hay una
                    if (updatedProduct.imageGlobal) {
                        updatedProduct.imageGlobal = null;
                        updatedProduct.imageGlobalPreview = null;
                        setImageGlobal(null);
                    };
    
                    setEditProduct(updatedProduct);
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
    
                    setEditProduct(updatedProduct);
                    setImageGlobal(reader.result);
                    setImagePreview(reader.result);
                };
                // validateForm();
            };
            reader.readAsDataURL(file);
        } 
        // else {
        //     validateForm();
        // };
    };
    
    const deleteImage = (index) => {
        const updatedProduct = { ...editProduct };

            updatedProduct.imageGlobal = null;
            updatedProduct.imageGlobalPreview = null;
            updatedProduct.color[index].imageFile = null;
            updatedProduct.color[index].image = null;
            setImageGlobal(imgProduct);

        setEditProduct(updatedProduct);
        setImagePreview(imgProduct);

        // validateForm();
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
            setEditProduct((prevEditProduct) => ({
                ...prevEditProduct,
                category: [newCategory._id]
            }));
        };
        dispatch(getCategories());
        // validateForm();
    };    

    //-----------SUBMIT-----------//

    // const handleSubmit = async (event) => {
    //     event.preventDefault();
    //     const formData = new FormData();
    
    //     // Verificar y preservar la imagen global si no fue modificada
    //     if (editProduct.imageGlobal) {
    //         formData.append('imageGlobal', editProduct.imageGlobal);
    //     } else if (productDetail.imageGlobal) {
    //         formData.append('imageGlobal', productDetail.imageGlobal);
    //     }
    
    //     // Verificar y preservar las imágenes de cada color si no fueron modificadas
    //     editProduct.color.forEach((color) => {
    //         // Busca el color original en productDetail
    //         const originalColor = productDetail.color.find(c => c._id === color._id);
            
    //         if (color.imageFile) {
    //             formData.append('images', color.imageFile);
    //         } else if (originalColor && originalColor.image) {
    //             formData.append('images', originalColor.image);
    //         }
    //     });
    
    //     // Agregar los demás campos al formData
    //     formData.append("_id", editProduct._id);
    //     formData.append("name", editProduct.name);
    //     formData.append("color", JSON.stringify(editProduct.color));
    //     formData.append("supplier", JSON.stringify(editProduct.supplier));
    //     formData.append("price", editProduct.price);
    //     formData.append("category", JSON.stringify(editProduct.category));
    //     formData.append("description", editProduct.description);
    //     formData.append("active", editProduct.active);
    
    //     // Revisión final para asegurarte de que todo esté en el formData
    //     console.log([...formData.entries()]);
    
    //     try {
    //         const response = await dispatch(putProduct(formData));
    
    //         if (response.data) {
    //             console.log("Successfully edited product");
    //             dispatch(getProducts());
    //             // dispatch(getProductById(id));
    //             dispatch(getCategories());
    //             navigate('/main_window/products/succes/put');
    //         };
    //     } catch (error) {
    //         console.error("Error editing product:", error);
    //     };
    // };
    
    const handleSubmit = async (event) => {
        event.preventDefault();
        const formData = new FormData();
        
        // Verificar y preservar la imagen global si no fue modificada
        if (editProduct.imageGlobal) {
            formData.append('imageGlobal', editProduct.imageGlobal);
        } else if (productDetail.imageGlobal) {
            formData.append('imageGlobal', productDetail.imageGlobal);
        }
    
        // Verificar y preservar las imágenes de cada color si no fueron modificadas
        editProduct.color.forEach((color) => {
            // Busca el color original en productDetail
            const originalColor = productDetail.color.find(c => c._id === color._id);
    
            if (color.imageFile) {
                formData.append('images', color.imageFile);
            } else if (originalColor && originalColor.image) {
                // Preservar imagen existente si no se ha modificado
                formData.append('images', originalColor.image);
            }
        });
    
        // Agregar los demás campos al formData
        formData.append("_id", editProduct._id);
        formData.append("name", editProduct.name);
        formData.append("color", JSON.stringify(editProduct.color));
        formData.append("supplier", JSON.stringify(editProduct.supplier));
        formData.append("price", editProduct.price);
        formData.append("category", JSON.stringify(editProduct.category));
        formData.append("description", editProduct.description);
        formData.append("active", editProduct.active);
    
        // Revisión final para asegurarte de que todo esté en el formData
        console.log([...formData.entries()]);
    
        try {
            const response = await dispatch(putProduct(formData));
    
            if (response.data) {
                console.log("Successfully edited product");
                dispatch(getProducts());
                // dispatch(getProductById(id));
                dispatch(getCategories());
                navigate('/main_window/products/succes/put');
            };
        } catch (error) {
            console.error("Error editing product:", error);
        };
    };
    
    
    
    // const handleSubmit = async (event) => {
    //     event.preventDefault();
    //     const formData = new FormData();
    
    //     // Agregar la imagen global si existe
    //     if (editProduct.imageGlobal) {
    //         formData.append('imageGlobal', editProduct.imageGlobal);
    //     };
        
    //     editProduct.color.forEach((color, index) => {
    //         if (color.imageFile) {
    //             formData.append('images', color.imageFile);
    //         };
    //     });
    
    //     formData.append("_id", editProduct._id);
    //     formData.append("name", editProduct.name);
    //     formData.append("color", JSON.stringify(editProduct.color));
    //     formData.append("supplier", JSON.stringify(editProduct.supplier));
    //     formData.append("price", editProduct.price);
    //     formData.append("category", JSON.stringify(editProduct.category));
    //     formData.append("description", editProduct.description);
    //     formData.append("active", editProduct.active);
    // // console.log(formData);
    
    //     try {
    //         const response = await dispatch(putProduct(formData));
    
    //         if (response.data) {
    //             console.log("Successfully edited product");
    //             // setColors([]);
    //             // setSizes([]);
    //             // setImageGlobal(null);
    //             dispatch(getProducts());
    //             dispatch(getProductById(id));
    //             dispatch(getCategories());
    //             // setEditProduct(initialEditProductState); // Reset form
    //             // setEditProduct({}); 
    //             navigate('/main_window/products/succes/put');
    //         };
    //     } catch (error) {
    //         console.error("Error editing product:", error);
    //     };
    // };
    
    return (
        <div className="page">
            <div className="component">
                <div className="title">
                    <h2>EDITAR PRODUCTO</h2>
                    <div className="titleButtons">
                        <button><Link to={`/main_window/products/${id}`}>Atrás</Link></button>
                    </div>
                </div>
                <div className="container">
                    <form onSubmit={handleSubmit} className={style.productForm}>
                        <div className={style.column1}>
                            <div>
                                <label htmlFor="name" className={style.nameTitle}>Nombre</label>
                                <input type="text" name="name" value={editProduct.name} onChange={handleInputChange} className={style.inputName}/>
                            </div>
                            <div className={style.detailProduct}>
                                <div className={style.colorContainer}>
                                    <label htmlFor="color">Colores</label>
                                    <div className={style.colorCard}>
                                        <ol>
                                            {colors?.map((color, colorIndex) => (
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
                                    <label htmlFor="size">Talle</label>
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
                                    {combinations?.map((combination, index) => {
                                        // Encontrar el color y el talle correspondientes en el estado editProduct
                                        const colorState = editProduct.color?.find(c => c.colorName === combination.color);
                                        const sizeState = colorState?.size?.find(s => s.sizeName === combination.size);
                                        return (
                                            <li key={index} className={style.list}>
                                                <span className={style.spanList}>
                                                    Color {combination.color} - Talle {combination.size}
                                                </span>
                                                {sizeState ? (
                                                    <>
                                                        <span className={style.spansinMed} htmlFor="width">Ancho:</span>
                                                        <input 
                                                            className={style.inputsinMed} 
                                                            type="number" 
                                                            name="width" 
                                                            placeholder='0' 
                                                            value={sizeState?.measurements.width || ''}
                                                            onChange={(event) => handleStockChange(combination, event)} 
                                                        />
                                                        <span className={style.spansinMed} htmlFor="long">Largo:</span>
                                                        <input 
                                                            className={style.inputsinMed} 
                                                            type="number" 
                                                            name="long" 
                                                            placeholder='0' 
                                                            value={sizeState?.measurements.long || ''}
                                                            onChange={(event) => handleStockChange(combination, event)} 
                                                        />
                                                        <span className={style.spansinMed} htmlFor="rise">Tiro:</span>
                                                        <input 
                                                            className={style.inputsinMed} 
                                                            type="number" 
                                                            name="rise" 
                                                            placeholder='0' 
                                                            value={sizeState?.measurements.rise || ''}
                                                            onChange={(event) => handleStockChange(combination, event)} 
                                                        />
                                                        <span className={style.spansinMed} htmlFor="stock">Stock:</span>
                                                        <input 
                                                            className={style.inputsinStock} 
                                                            type="number" 
                                                            name="stock" 
                                                            min='0' 
                                                            placeholder='0' 
                                                            value={sizeState?.stock || ''}
                                                            onChange={(event) => handleStockChange(combination, event)} 
                                                        />
                                                    </>
                                                ) : (
                                                    <span>Combinación de color y talle no encontrada.</span>
                                                )}
                                            </li>
                                        );
                                    })}
                                    </ol>
                                </div>
                            </div>
                            <div className={style.supplierContainer}>
                                <label htmlFor="supplier" className={style.supplierTitle}>Proveedor</label>
                                <div className={style.dataSupplierContainer}>
                                    <label htmlFor="name" className={style.nameTitle}>Nombre</label>
                                    <input type="text" name="name" value={editProduct.supplier?.name} onChange={handleSupplierChange} className={style.inputName}/>
                                </div>
                                <div className={style.dataSupplierContainer}>
                                    <label htmlFor="phone" className={style.nameTitle}>Teléfono</label>
                                    <input type="text" name="phone" value={editProduct.supplier?.phone} onChange={handleSupplierChange} className={style.inputName}/>
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
                                        {editProduct.color?.map((color, index) => (
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
                                                {color.image && !color.imageFile ? (
                                                    <img className={style.imgProduct} src={getImageUrl(color.image)} alt="Product Image" />
                                                ) : color.image ? (
                                                    <img className={style.imgProduct} src={color.image} alt="Product Image" />
                                                ) : editProduct.imageGlobal && !editProduct.imageGlobalPreview ? (
                                                    <img className={style.imgProduct} src={getImageUrl(editProduct.imageGlobal)} alt="Product Image" />
                                                ) : editProduct.imageGlobalPreview ? (
                                                    <img className={style.imgProduct} src={editProduct.imageGlobalPreview} alt="Product Image" />
                                                ) : (
                                                    <img src={imgProduct} alt="Product Image" className={style.imgProduct} />
                                                )}
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
                                    <label htmlFor="category" className={style.nameTitle}>Categoría</label>
                                    <select 
                                        name="category" 
                                        className={style.selectCategory} 
                                        value={selectedCategory}
                                        onChange={handleInputChange}
                                    >
                                        <option value="" disabled>Seleccionar</option>
                                        {categories.map((category) => (
                                            <option key={category._id} value={category._id}>{category.name}</option>
                                        ))}
                                    </select>
                                    <div className={style.containerAddCategory}>
                                        <button className={style.buttonAddCategory} type='button' onClick={() => handleShowCategoryForm('create')}>+</button>
                                        <button className={style.buttonDeleteCategory} type='button' onClick={() => handleShowCategoryForm('delete')}>-</button>
                                    </div>
                                </div>
                                <div className={style.priceContainer}>
                                    <label htmlFor="price" className={style.nameTitle}>Precio $</label>
                                    <input type="number" name="price" onChange={handleInputChange} value={editProduct.price} min='0'/>
                                </div>    
                                <div className={style.descriptionContainer}>
                                    <label htmlFor="description" className={style.nameTitle}>Descripción</label>
                                    <textarea type="text" name="description" value={editProduct.description} onChange={handleInputChange}/>
                                </div>  
                            </div>
                            <div>
                                {/* <button type="submit" disabled={isSubmitDisabled}>Editar</button> */}
                                <button type="submit">Editar</button>
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

export default PutProduct;