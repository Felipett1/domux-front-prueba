import { Token } from '@/api/token'
import axios from 'axios';
var base_url = process.env.NEXT_PUBLIC_BASE_URL

async function obtenerToken() {
    // Verifica si el token es válido, y renueva si es necesario
    if (!Token.isTokenValid()) {
        await Token.buscarToken();
    }
    // Obtiene el token actual
    return Token.getToken();
}


function obtenerAuditoria() {
    const usuario = JSON.parse(localStorage.getItem('usuario') || '{}');
    return {
        usuario: usuario.usuario || 'Desconocido Front',
        nombre_empresa: usuario.nombre_empresa || 'Desconocida Front'
    }
}



export const Api = {

    async post(contexto: string, mensaje: {}) {
        const token = await obtenerToken();
        try {
            const response = await axios.post(base_url + contexto, mensaje, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                    ...obtenerAuditoria(),
                },
            });

            return response.data;
        } catch (error) {
            if (axios.isAxiosError(error) && error.response?.status === 401) {
                console.log('Token no válido. Intentando renovar el token...');
                await Token.buscarToken();
                const newToken = await obtenerToken();

                const retryResponse = await axios.post(base_url + contexto, mensaje, {
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${newToken}`,
                        ...obtenerAuditoria(),
                    },
                });

                return retryResponse.data;
            } else {
                console.error('Error:', error);
                throw error;
            }
        }
    },

    async get(contexto: string, parametros: {}) {
        try {
            // Construir la cadena de consulta a partir de los parámetros
            const queryString = new URLSearchParams(parametros).toString();

            // Obtener el token
            const token = await obtenerToken();

            // Realizar la solicitud GET con Axios
            const response = await axios.get(`${base_url}${contexto}?${queryString}`, {
                headers: {
                    'Authorization': `Bearer ${token}`, // Incluye el token en las cabeceras
                    ...obtenerAuditoria(), // Agregar otras cabeceras
                },
            });

            // Axios lanza automáticamente errores para respuestas HTTP 4xx/5xx
            return response.data; // Axios maneja automáticamente el JSON de la respuesta
        } catch (error) {
            if (axios.isAxiosError(error) && error.response?.status === 401) {
                const queryString = new URLSearchParams(parametros).toString();
                console.log('Token no válido. Intentando renovar el token...');
                await Token.buscarToken();
                const newToken = await obtenerToken();

                const retryResponse = await axios.get(`${base_url}${contexto}?${queryString}`, {
                    headers: {
                        Authorization: `Bearer ${newToken}`,
                        ...obtenerAuditoria(),
                    },
                });

                return retryResponse.data;
            } else {
                console.error('Error:', error);
                throw error;
            }
        }
    },

    async put(contexto: string, mensaje: {}) {
        const token = await obtenerToken();
        try {
            const response = await axios.put(base_url + contexto, mensaje, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                    ...obtenerAuditoria(),
                },
            });

            return response.data;
        } catch (error) {
            if (axios.isAxiosError(error) && error.response?.status === 401) {
                console.log('Token no válido. Intentando renovar el token...');
                await Token.buscarToken();
                const newToken = await obtenerToken();

                const retryResponse = await axios.put(base_url + contexto, mensaje, {
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${newToken}`,
                        ...obtenerAuditoria(),
                    },
                });

                return retryResponse.data;
            } else {
                console.error('Error:', error);
                throw error;
            }
        }
    },
};
