import { Api } from '@/api/api'

export const ReporteService = {

    /** Funciones pagina de consula */
    async consultarTipoServicio(empresa: number) {
        return Api.get('/tipo_evento/lov', {empresa})
    },

    async consultarEmpresas() {
        return Api.get('/empresa/activa', {})
    },

    async generarReporte(parametros: any) {
        return Api.post('/reporte', parametros)
    },

    /*Obtener configuración reporte dinamica*/
    async obtenerConfiguracion(secuencia: number) {
        return Api.get('/tipo_evento/configuracion', { secuencia })
    },
};    
