import { Api } from '@/api/api'

export const CertificadoService = {

    /** Funciones pagina de consula */
    async consultar(documento: string, empresa: any) {
        return Api.get('/carnet/cliente', { documento, empresa })
    },

    async generarCertificado(parametros: any) {
        return Api.post('/reporte', parametros)
    },

    /** Funciones pagina de consula */

    async consultaCliente(documento: string, empresa: any) {
        return Api.get('/cliente', { documento, empresa })
    },

    async crearCliente(cliente: any) {
        return Api.post('/cliente', cliente)
    },

    async modificarCliente(cliente: any) {
        return Api.post('/cliente/modificar', cliente)
    },

    async crearEvento(evento: any) {
        return Api.post('/evento', evento)
    },

    async crearCarnet(carnet: any) {
        return Api.post('/carnet', carnet)
    },

    /*Obtener configuración dinamica*/
    async obtenerConfiguracion(secuencia: number) {
        return Api.get('/tipo_evento/configuracion', { secuencia })
    },

    /*Obtener configuración dinamica*/
    async obtenerConfiguracionMoodle(empresa: number) {
        return Api.get('/moodle/configuracion', { empresa })

    },

    /*Enviar correo de bienvenida de Moodle*/
    async enviarCorreoBienvenidaMoodle(datos: any) {
        return Api.post('/moodle/bienvenida', { datos })
    },

    /*Consultar eventos de Moodle*/
    async consultarEventosMoodle(cliente: string, empresa: number, curso?: string) {
        const params: any = { cliente, empresa };
        if (curso) {
            params.curso = curso;
        }
        return Api.get('/moodle/evento', params)
    },
};
