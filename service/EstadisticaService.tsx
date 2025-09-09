import { Api } from '@/api/api'

export const EstadisticaService = {

    async certificadosDiaUsuario(usuario: string) {
        return Api.get('/kpi/certificadosDiaUsuario', { usuario })
    },
    async certificadosDiaEmpresa(empresa: string) {
        return Api.get('/kpi/certificadosDiaEmpresa', { empresa })
    },
    async totalTipoDiaUsuario(usuario: string) {
        return Api.get('/kpi/totalTipoDiaUsuario', { usuario })
    },
    async totalTipoDiaEmpresa(empresa: string) {
        return Api.get('/kpi/totalTipoDiaEmpresa', { empresa })
    },
    async mediosPagoDiaUsuario(usuario: string) {
        return Api.get('/kpi/mediosPagoDiaUsuario', { usuario })
    },
    async mediosPagoDiaEmpresa(empresa: string) {
        return Api.get('/kpi/mediosPagoDiaEmpresa', { empresa })
    },
    async historicoSemanaUsuario(usuario: string) {
        return Api.get('/kpi/historicoSemanaUsuario', { usuario })
    },
    async historicoSemanaEmpresa(empresa: string) {
        return Api.get('/kpi/historicoSemanaEmpresa', { empresa })
    },
    async ultimosCertificadosUsuario(usuario: string) {
        return Api.get('/kpi/ultimosCertificadosUsuario', { usuario })
    },
    async ultimosCertificadosEmpresa(empresa: string) {
        return Api.get('/kpi/ultimosCertificadosEmpresa', { empresa })
    },
    async consultarEmpresaActiva() {
        return Api.get('/empresa/activa', {})
    },
    async obtenerOpciones(empresa: string) {
        return Api.get('/tipo_evento/opcion', { empresa })
    },
};    
