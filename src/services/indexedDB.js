import axios from "axios";
import { openDB } from 'idb';

const initDB = async () => {
    try {
        const db = await openDB('indiraGoldDataBase', 1, {
            upgrade(db) {
                //Stores de productos
                if (!db.objectStoreNames.contains('products')) {
                    const productStore = db.createObjectStore('products', {
                        keyPath: '_id',
                        autoIncrement: true,
                    });
                    productStore.createIndex('name', 'name', { unique: false });
                };

                if (!db.objectStoreNames.contains('allProducts')) {
                    const allProductStore = db.createObjectStore('allProducts', {
                        keyPath: '_id',
                        autoIncrement: true,
                    });
                    allProductStore.createIndex('name', 'name', { unique: false });
                };

                if (!db.objectStoreNames.contains('productsID')) {
                    const productsIdStore = db.createObjectStore('productsID', {
                        keyPath: '_id',
                        autoIncrement: true,
                    });
                    productsIdStore.createIndex('name', 'name', { unique: false });
                };

                if (!db.objectStoreNames.contains('productName')) {
                    const productNameStore = db.createObjectStore('productName', {
                        keyPath: '_id',
                        autoIncrement: true,
                    });
                    productNameStore.createIndex('name', 'name', { unique: false });
                };

                //Stores de ventas
                if (!db.objectStoreNames.contains('sales')) {
                    const saleStore = db.createObjectStore('sales', {
                        keyPath: '_id',
                        autoIncrement: true,
                    });
                    saleStore.createIndex('date', 'date', { unique: false });
                };

                if (!db.objectStoreNames.contains('salesID')) {
                    const salesIdStore = db.createObjectStore('salesID', {
                        keyPath: '_id',
                        autoIncrement: true,
                    });
                    salesIdStore.createIndex('date', 'date', { unique: false });
                };

                //Stores de clientes
                if (!db.objectStoreNames.contains('clients')) {
                    const clientStore = db.createObjectStore('clients', {
                        keyPath: '_id',
                        autoIncrement: true,
                    });
                    clientStore.createIndex('name', 'name', { unique: false });
                };
            
                //Stores de categorías
                if (!db.objectStoreNames.contains('category')) {
                    const categoryStore = db.createObjectStore('category', {
                        keyPath: '_id',
                        autoIncrement: true,
                    });
                    categoryStore.createIndex('name', 'name', { unique: false });
                };

                //Stores de solicitudes pendientes
                if (!db.objectStoreNames.contains('pendingRequests')) {
                    db.createObjectStore('pendingRequests', {
                        keyPath: '_id',
                        autoIncrement: true,
                    });
                };
            },
        });
        return db;
    } catch (error) {
        console.error('Error al abrir la base de datos:', error);
    }  
};
export default initDB;

//SAVE
export const saveToIndexedDB = async (storeName, data) => {
    try {
        const db = await initDB();
        const tx = db.transaction(storeName, 'readwrite');
        const store = tx.objectStore(storeName);
        await store.put(data);
        await tx.done;
        console.log(`Datos guardados en IndexedDB en la store ${storeName}`);
        return true;
    } catch (error) {
        console.error(`Error guardando en la store ${storeName}:`, error);
        return false;
    }
};

export const saveProductsToIndexedDB = async (storeName, data) => {
    try {
        const db = await initDB();
        if (!db.objectStoreNames.contains(storeName)) {
            console.error(`La tienda ${storeName} no existe en IndexedDB.`);
            return false;
        }
        const tx = db.transaction(storeName, 'readwrite');
        const store = tx.objectStore(storeName);
        await store.put(data);

        await tx.done;
        console.log(`Datos guardados de productos en IndexedDB en la store ${storeName}`);
        return true;
    } catch (error) {
        console.error(`Error guardando datos de productos en la store ${storeName}:`, error);
        return false;
    }
};

export const saveAllProductsToIndexedDB = async (storeName, data) => {
    try {
        const db = await initDB();
        if (!db.objectStoreNames.contains(storeName)) {
            console.error(`La tienda ${storeName} no existe en IndexedDB.`);
            return false;
        }
        const tx = db.transaction(storeName, 'readwrite');
        const store = tx.objectStore(storeName);
        await store.put(data);

        await tx.done;
        console.log(`Datos guardados de todos los productos en IndexedDB en la store ${storeName}`);
        return true;
    } catch (error) {
        console.error(`Error guardando datos de todos los productos en la store ${storeName}:`, error);
        return false;
    }
};

export const saveSalesToIndexedDB = async (storeName, data) => {
    try {
        const db = await initDB();
        if (!db.objectStoreNames.contains(storeName)) {
            console.error(`La tienda ${storeName} no existe en IndexedDB.`);
            return false;
        }
        const tx = db.transaction(storeName, 'readwrite');
        const store = tx.objectStore(storeName);
        await store.put(data);

        await tx.done;
        console.log(`Datos guardados de ventas en IndexedDB en la store ${storeName}`);
        return true;
    } catch (error) {
        console.error(`Error guardando datos de ventas en la store ${storeName}:`, error);
        return false;
    }
};

export const saveSaleByIdToIndexedDB = async (saleId, data) => {
    try {
        const saleToSave = { ...data, _id: saleId };
        await saveToIndexedDB('salesID', saleToSave);
    } catch (error) {
        console.error("Error saving sale by ID:", error);
    }
};

export const saveClientsToIndexedDB = async (storeName, data) => {
    try {
        const db = await initDB();
        if (!db.objectStoreNames.contains(storeName)) {
            console.error(`La tienda ${storeName} no existe en IndexedDB.`);
            return false;
        }
        const tx = db.transaction(storeName, 'readwrite');
        const store = tx.objectStore(storeName);
        await store.put(data);

        await tx.done;
        console.log(`Datos guardados de clientes en IndexedDB en la store ${storeName}`);
        return true;
    } catch (error) {
        console.error(`Error guardando datos de clientes en la store ${storeName}:`, error);
        return false;
    }
};

export const saveCategoriesToIndexedDB = async (storeName, data) => {
    try {
        const db = await initDB();
        if (!db.objectStoreNames.contains(storeName)) {
            console.error(`La tienda ${storeName} no existe en IndexedDB.`);
            return false;
        }
        const tx = db.transaction(storeName, 'readwrite');
        const store = tx.objectStore(storeName);
        await store.put(data);

        await tx.done;
        console.log(`Datos guardados de categorías en IndexedDB en la store ${storeName}`);
        return true;
    } catch (error) {
        console.error(`Error guardando datos de categorías en la store ${storeName}:`, error);
        return false;
    }
};

// export const saveCategoriesToIndexedDB = async (storeName, data) => {
//     try {
//         const db = await initDB();
//         const tx = db.transaction(storeName, 'readwrite');
//         const store = tx.objectStore(storeName);
//         // await store.put(data);
//         data.forEach(item => store.put(item));  // Guarda cada categoría por separado
//         await tx.done;
//         console.log(`Datos guardados en IndexedDB en la store ${storeName}`);
//         return true;
//     } catch (error) {
//         console.error(`Error guardando en la store ${storeName}:`, error);
//         return false;
//     }
// };



//GET
//Recuperación de todos los datos de una tienda (store)
export const getFromIndexedDB = async (storeName) => {
    try {
        const db = await initDB();
        if (!db.objectStoreNames.contains(storeName)) {
            console.error(`La tienda ${storeName} no existe en IndexedDB.`);
            return { success: false, data: [] };
        };
        const tx = db.transaction(storeName, 'readonly');
        const store = tx.objectStore(storeName);
        const data = await store.getAll();
        if (data.length === 0) {
            console.warn(`No se encontraron datos en IndexedDB para la store ${storeName}.`);
        };
        return { success: true, data };
    } catch (error) {
        console.error(`Error al recuperar datos de la store ${storeName}:`, error);
        return { success: false, data: [] };
    }
};

//Recuperación de un objeto basado en su clave primaria
export const getFromIndexedDBById = async (storeName, id) => {
    try {
        const db = await initDB();

        if (!db.objectStoreNames.contains(storeName)) {
            console.error(`La tienda ${storeName} no existe en IndexedDB.`);
            return null;
        };
        const tx = db.transaction(storeName, 'readonly');
        const store = tx.objectStore(storeName);
        const data = await store.get(id);
        if (!data) {
            console.warn(`No se encontró el dato con ID ${id} en la store ${storeName}.`);
        };
        return data;
    } catch (error) {
        console.error(`Error al recuperar el dato con ID ${id} de la store ${storeName}:`, error);
        return null;
    }
};

export const getProductsFromIndexedDB = async (storeName) => {
    try {
        const db = await initDB();
        if (!db.objectStoreNames.contains(storeName)) {
            console.error(`La tienda ${storeName} no existe en IndexedDB.`);
            return { success: false, data: [] };
        }
        const tx = db.transaction(storeName, 'readonly');
        const store = tx.objectStore(storeName);
        const data = await store.getAll();

        if (data.length === 0) {
            console.warn(`No se encontraron datos de productos en IndexedDB para la store ${storeName}.`);
        }

        // Aseguramos que los datos recuperados estén en el formato adecuado
        const formattedData = data.map(item => formatData(item));

        return { success: true, data: formattedData };
    } catch (error) {
        console.error(`Error al recuperar datos de productos de la store ${storeName}:`, error);
        return { success: false, data: [] };
    }
};

export const getAllProductsFromIndexedDB = async (storeName) => {
    try {
        const db = await initDB();
        if (!db.objectStoreNames.contains(storeName)) {
            console.error(`La tienda ${storeName} no existe en IndexedDB.`);
            return { success: false, data: [] };
        }
        const tx = db.transaction(storeName, 'readonly');
        const store = tx.objectStore(storeName);
        const data = await store.getAll();

        if (data.length === 0) {
            console.warn(`No se encontraron datos de todos los productos en IndexedDB para la store ${storeName}.`);
        }

        // Aseguramos que los datos recuperados estén en el formato adecuado
        const formattedData = data.map(item => formatData(item));

        return { success: true, data: formattedData };
    } catch (error) {
        console.error(`Error al recuperar datos de todos los productos de la store ${storeName}:`, error);
        return { success: false, data: [] };
    }
};

export const getClientsFromIndexedDB = async (storeName) => {
    try {
        const db = await initDB();
        if (!db.objectStoreNames.contains(storeName)) {
            console.error(`La tienda ${storeName} no existe en IndexedDB.`);
            return { success: false, data: [] };
        }
        const tx = db.transaction(storeName, 'readonly');
        const store = tx.objectStore(storeName);
        const data = await store.getAll();

        if (data.length === 0) {
            console.warn(`No se encontraron datos de clientes en IndexedDB para la store ${storeName}.`);
        }

        // Aseguramos que los datos recuperados estén en el formato adecuado
        const formattedData = data.map(item => formatData(item));

        return { success: true, data: formattedData };
    } catch (error) {
        console.error(`Error al recuperar datos de clientes de la store ${storeName}:`, error);
        return { success: false, data: [] };
    }
};

export const getSalesFromIndexedDB = async (storeName) => {
    try {
        const db = await initDB();
        if (!db.objectStoreNames.contains(storeName)) {
            console.error(`La tienda ${storeName} no existe en IndexedDB.`);
            return { success: false, data: [] };
        }
        const tx = db.transaction(storeName, 'readonly');
        const store = tx.objectStore(storeName);
        const data = await store.getAll();

        if (data.length === 0) {
            console.warn(`No se encontraron datos de ventas en IndexedDB para la store ${storeName}.`);
        }

        // Aseguramos que los datos recuperados estén en el formato adecuado
        const formattedData = data.map(item => formatData(item));

        return { success: true, data: formattedData };
    } catch (error) {
        console.error(`Error al recuperar datos de ventas de la store ${storeName}:`, error);
        return { success: false, data: [] };
    }
};

export const getSaleByIdFromIndexedDB = async (saleId) => {    
    const sales = await getFromIndexedDB('salesID');    
    const sale = sales.data.find(sale => sale._id === saleId);    
    return sale ? { success: true, data: sale } : { success: false };
};

export const getCategoriesFromIndexedDB = async (storeName) => {
    try {
        const db = await initDB();
        if (!db.objectStoreNames.contains(storeName)) {
            console.error(`La tienda ${storeName} no existe en IndexedDB.`);
            return { success: false, data: [] };
        }
        const tx = db.transaction(storeName, 'readonly');
        const store = tx.objectStore(storeName);
        const data = await store.getAll();

        if (data.length === 0) {
            console.warn(`No se encontraron datos de categorías en IndexedDB para la store ${storeName}.`);
        }

        // Aseguramos que los datos recuperados estén en el formato adecuado
        const formattedData = data.map(item => formatData(item));

        return { success: true, data: formattedData };
    } catch (error) {
        console.error(`Error al recuperar datos de categorías de la store ${storeName}:`, error);
        return { success: false, data: [] };
    }
};

// Ejemplo de una función para formatear datos
const formatData = (item) => {
    // Realiza aquí el formateo necesario para tus datos
    if (item.date) {
        item.formattedDate = new Date(item.date).toLocaleDateString('es-ES', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        }).replace(',', ' -');
    }
    return item;
};


//REQUEST
export const savePendingRequest = async (request) => {
    try {
        const db = await initDB();
        const tx = db.transaction('pendingRequests', 'readwrite');
        const store = tx.objectStore('pendingRequests');
        await store.put(request);
        await tx.done;
        console.log('Solicitud guardada en pendingRequests:', request);
        return true;
    } catch (error) {
        console.error('Error guardando solicitud en pendingRequests:', error);
        return false;
    }
};

export const processPendingRequests = async () => {
    const db = await initDB();
    const tx = db.transaction('pendingRequests', 'readonly');
    const store = tx.objectStore('pendingRequests');
    const requests = await store.getAll();

    if (requests.length > 0 && navigator.onLine) {
        for (const request of requests) {
            
            try {
                const { method, url, data, headers } = request;
                console.log("Processing request:", request);
                await axios({ method, url, data, headers });
                // Eliminar la solicitud después de que se complete con éxito
                const deleteTx = db.transaction('pendingRequests', 'readwrite');
                const deleteStore = deleteTx.objectStore('pendingRequests');
                await deleteStore.delete(request._id);
                await deleteTx.done;
                console.log('Solicitud procesada y eliminada de pendingRequests:', request);
            } catch (error) {
                console.error('Error al procesar solicitud pendiente:', error);
                // Si falla, podemos decidir si dejamos la solicitud en la lista de pendientes
                // para reintentarla más tarde.
            }
        }
    }
};

export const getPendingRequestsCount = async () => {
    try {
        const db = await initDB();
        const tx = db.transaction('pendingRequests', 'readonly');
        const store = tx.objectStore('pendingRequests');
        const requests = await store.getAll();
        const count = requests.length;
        console.log(`Cantidad de solicitudes pendientes: ${count}`);
        return count;
    } catch (error) {
        console.error('Error al obtener la cantidad de solicitudes pendientes:', error);
        return 0; // O el valor que prefieras en caso de error
    }
};
