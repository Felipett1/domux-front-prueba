import { Api } from '@/api/api'

export const AdministrarService = {

    /** Funciones pagina de empresa */
    async consultarEmpresa() {
        return Api.get('/empresa', {})
    },

    async crearEmpresa(empresa: any) {
        return Api.post('/empresa', empresa)
    },

    async modificarEstadoEmpresa(empresa: any) {
        return Api.put('/empresa/estado', empresa)
    },

    async modificarNombreEmpresa(empresa: any) {
        return Api.put('/empresa/nombre', empresa)
    },

    /** Funciones pagina de responsable */
    async consultarResponsable(empresa: any) {
        if (empresa) {
            return Api.get('/responsable', { empresa })
        } else {
            return Api.get('/responsable', {})
        }
    },

    async crearResponsable(responsable: any) {
        return Api.post('/responsable', responsable)
    },

    async modificarResponsable(empresa: any) {
        return Api.put('/responsable', empresa)
    },

    async modificarEstadoResponsable(empresa: any) {
        return Api.put('/responsable/estado', empresa)
    },

    /** Funciones pagina de usuario */
    async consultarUsuario(empresa: any) {
        if (empresa) {
            return Api.get('/usuario', { empresa })
        } else {
            return Api.get('/usuario', {})
        }
    },

    async crearUsuario(usuario: any) {
        return Api.post('/usuario', usuario)
    },

    async modificarUsuario(usuario: any) {
        return Api.put('/usuario', usuario)
    },

    async consultarResponsableSinAsignar(empresa: any) {
        return Api.get('/responsable/sinAsignar', { empresa })
    },

    async consultarRol(admin: any) {
        return Api.get('/rol', { admin })
    },

    async consultarEmpresaActiva() {
        return Api.get('/empresa/activa', {})
    },

    async cambiarClaveUsuario(usuario: any) {
        return Api.put('/usuario/clave', usuario)
    },
};    
