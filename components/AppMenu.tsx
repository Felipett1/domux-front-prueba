/* eslint-disable @next/next/no-img-element */

import React, { useContext, useEffect, useState } from 'react';
import AppMenuitem from './AppMenuitem';
import { MenuProvider } from '../context/menucontext';
import { AppMenuItem } from '@/types';
import useWindowSize from "@/hook/useWindowSize";
import useAuth from "@/hook/useAuth";
import { EstadisticaService } from '@/service/EstadisticaService';

const AppMenu = () => {
    const { width } = useWindowSize();
    const { usuario, esSuperAdmin } = useAuth();
    const [model, setModel] = useState<AppMenuItem[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            // Definir el modelo base del menú
            const newModel: AppMenuItem[] = [
                {
                    label: 'Inicio',
                    items: [{ label: 'Panel principal', icon: 'pi pi-fw pi-home', to: '/inicio' }]
                },
                {
                    label: 'Consulta',
                    items: [
                        { label: 'Verificar certificado', icon: 'pi pi-fw pi-search', to: '/certificado/consultar', badge: 'NEW' },
                        { label: 'Validar progreso', icon: 'pi pi-fw pi-chart-line', to: '/certificado/progreso' },
                    ]
                },
            ];
            try {
                const respuesta = await EstadisticaService.obtenerOpciones(usuario.empresa);
                // Obtener las opciones dinámicas de la API
                const certItems: any = [];
                const reportItems: any = [];
                respuesta.resultados.forEach((e: any) => {
                    if (e.tipo == 'certificado') {
                        certItems.push({
                            label: e.descripcion,
                            icon: 'pi pi-fw pi-id-card',
                            to: `/certificado/generar?tipo=${e.secuencia}`
                        });
                    } else if (e.tipo == 'reporte') {
                        const esAdministrador = usuario?.rol === 'Administrador';
                        const esSuperUsuario = esSuperAdmin();
                        const esAdminReporte = e.admin === "true";

                        if ((esAdminReporte && (esAdministrador || esSuperUsuario)) ||
                            (!esAdminReporte && !esAdministrador && !esSuperUsuario)) {
                            reportItems.push({
                                label: e.descripcion,
                                icon: `pi pi-fw ${e.icon}`,
                                to: `/reporte?reporte=${e.secuencia}`
                            });
                        }
                    }
                });
                if (certItems.length > 0) {
                    newModel.push({
                        label: 'Certificados',
                        items: certItems
                    });
                }
                if (reportItems.length > 0) {
                    newModel.push({
                        label: 'Reportes',
                        items: reportItems
                    });
                }

            } catch (error) {
                console.error('Error al obtener opciones de certificados:', error);
            }

            // Agregar opciones de administración si el ancho de la pantalla es mayor a 992px
            if (width > 992 && (usuario?.rol === 'Administrador' || esSuperAdmin())) {
                const adminItems = [];

                if (esSuperAdmin()) {
                    adminItems.push({ label: 'Empresas', icon: 'pi pi-fw pi-briefcase', to: '/administrar/empresa' });
                }

                adminItems.push(
                    { label: 'Responsables', icon: 'pi pi-fw pi-users', to: '/administrar/responsable' },
                    { label: 'Usuarios', icon: 'pi pi-fw pi-user-edit', to: '/administrar/usuario' }
                );

                newModel.push({
                    label: 'Administración',
                    items: adminItems
                });
            }

            // Actualizar el estado del modelo
            setModel(newModel);
        };

        fetchData();
    }, []);

    return (
        <MenuProvider>
            <ul className="layout-menu">
                {model.map((item, i) => {
                    return !item?.seperator ? (
                        <AppMenuitem item={item} root={true} index={i} key={item.label} />
                    ) : (
                        <li className="menu-separator" key={`separator-${i}`}></li>
                    );
                })}
            </ul>
        </MenuProvider>
    );
};

export default AppMenu;