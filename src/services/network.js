export const detectConnectionType = (callback) => {
    if ('connection' in navigator) {
        const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;

        // Ejecutar callback con el tipo de conexión actual
        callback(connection.effectiveType);

        const updateConnectionStatus = () => {
            // Ejecutar callback cuando el tipo de conexión cambie
            callback(connection.effectiveType);
        };

        connection.addEventListener('change', updateConnectionStatus);

        // Retornar una función de limpieza para remover el listener
        return () => {
            connection.removeEventListener('change', updateConnectionStatus);
        };
    } else {
        console.log('Network Information API no está soportada en este entorno.');
    }
};