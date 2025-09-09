var base_url = process.env.NEXT_PUBLIC_BASE_URL

export const Token = {

    async buscarToken() {
        try {
            const body = new URLSearchParams({
                grant_type: 'client_credentials',
                client_id: process.env.NEXT_PUBLIC_CLIENT_ID || '',
                client_secret: process.env.NEXT_PUBLIC_CLIENT_SECRET || ''
            }).toString();
            const response = await fetch(base_url + '/oauth2/token', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                body
            });

            if (!response.ok) {
                throw new Error(`Error ${response.status}: ${response.statusText}`);
            }

            const data = await response.json();
            // Guardar el token y el tiempo de expiración en localStorage
            const expiresAt = Date.now() + data.expires_in * 1000; // Calcula la expiración
            localStorage.setItem('accessToken', data.access_token);
            localStorage.setItem('tokenExpiration', expiresAt.toString());
        } catch (error) {
            console.error('Error al obtener el token:', error);
            throw error;
        }
    },
    
    isTokenValid() {
        const token = localStorage.getItem('accessToken');
        const expiration = localStorage.getItem('tokenExpiration');
        if (!token || !expiration) {
            return false;
        }
        return Date.now() < parseInt(expiration, 10); // Verifica si no ha expirado
    },

    // Método para obtener el token
    getToken() {
        return localStorage.getItem('accessToken');
    },
};
