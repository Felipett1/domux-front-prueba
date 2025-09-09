import { Api } from '@/api/api'

export const AutenticarService = {

    async autenticar(usuario: string, clave: string) {
        return Api.post('/usuario/autenticar', { usuario, clave })
    },

    async olvidoClave(usuario: string, correo: string) {
        return Api.post('/usuario/olvido', { usuario, correo })
    },

    async restaurarClave(token: string, clave: string) {
        return Api.post('/usuario/restaurar', { token, clave })
    }
};
