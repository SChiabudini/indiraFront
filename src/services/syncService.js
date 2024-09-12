import axios from "axios";
import { toast } from 'react-toastify';
import { saveToIndexedDB, getFromIndexedDB, processPendingRequests, savePendingRequest } from './indexedDB.js';
import { getAllProducts, postProduct, putProduct } from '../redux/productActions.js';
import store from '../redux/store.js';


export const initializeAppData = async () => {
    try {
        const executeRequest = async (method, url, data = {}, headers = {}) => {
            if (navigator.onLine) {
                // Procesar solicitudes pendientes antes de realizar una nueva solicitud
                await processPendingRequests();
                // Ejecutar la solicitud actual
                return await axios({ method, url, data, headers });
            } else {
                // Guardar la solicitud pendiente en IndexedDB
                await savePendingRequest({ method, url, data, headers });
                toast.warn('No hay conexión. La solicitud se procesará cuando la conexión esté disponible.');
                return null;  // Retornar null o manejar según tus necesidades
            }
        };

        // Acá realizamos todas las solicitudes necesarias para cargar los datos iniciales
        const productsResponse = await executeRequest('get', '/products');
        if (productsResponse) {
            await saveToIndexedDB('products', productsResponse.data);
        };

        const allProductsResponse = await executeRequest('get', '/products/all');
        if (allProductsResponse) {
            await saveToIndexedDB('allProducts', allProductsResponse.data);
        };

        const salesResponse = await executeRequest('get', '/sale');
        if (salesResponse) {
            await saveToIndexedDB('sales', salesResponse.data);
        };

        const clientsResponse = await executeRequest('get', '/clients');
        if (clientsResponse) {
            await saveToIndexedDB('clients', clientsResponse.data);
        };

        const categoriesResponse = await executeRequest('get', '/category');
        if (categoriesResponse) {
            await saveToIndexedDB('category', categoriesResponse.data);
        };

        // Se puede añadir más solicitudes si es necesario pero usarlo con criterio ya que puede ralentizar el inicio de la aplicación xq serían más datos los que se cargan en el inicio

        console.log('Datos iniciales cargados en IndexedDB');
    } catch (error) {
        console.error('Error al cargar datos iniciales:', error);
    }
};

export const syncData = async () => {
    try {
        // Paso 1: Obtener datos locales
        const localProducts = await getFromIndexedDB('products');

        // Paso 2: Obtener datos del servidor
        await store.dispatch(getAllProducts());  // Obtener los productos del servidor
        const serverProducts = store.getState().products.allProducts;

        // Paso 3: Sincronizar datos locales con el servidor
        for (const localProduct of localProducts) {
            const serverProduct = serverProducts.find(p => p.id === localProduct.id);

            if (!serverProduct) {
                // Si no existe en el servidor, se crea
                await store.dispatch(postProduct(localProduct));
            } else if (new Date(localProduct.updatedAt) > new Date(serverProduct.updatedAt)) {
                // Si existe pero está desactualizado, se actualiza en el servidor
                await store.dispatch(putProduct(localProduct));
            }
        }

        // Paso 4: Guardar cambios del servidor en IndexedDB
        await saveToIndexedDB('products', serverProducts);

        console.log('Sincronización completada');
    } catch (error) {
        console.error('Error durante la sincronización:', error);
    }
};