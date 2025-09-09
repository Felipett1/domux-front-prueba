/* eslint-disable @next/next/no-img-element */

import Link from 'next/link';
import { classNames } from 'primereact/utils';
import React, { forwardRef, useContext, useImperativeHandle, useRef, useEffect, useState } from 'react';
import { AppTopbarRef } from '@/types';
import { LayoutContext } from '../context/layoutcontext';
import { useRouter } from 'next/navigation';
import { OverlayPanel } from 'primereact/overlaypanel';
import { Button } from 'primereact/button';
import useAuth from "@/hook/useAuth";
import useWindowSize from "@/hook/useWindowSize";

const AppTopbar = forwardRef<AppTopbarRef>((props, ref) => {
    const { layoutConfig, layoutState, onMenuToggle, showProfileSidebar } = useContext(LayoutContext);
    const menubuttonRef = useRef(null);
    const topbarmenuRef = useRef(null);
    const topbarmenubuttonRef = useRef(null);
    const router = useRouter();
    const [nombreEmpresa, setNombreEmpresa] = useState('');
    const [responsable, setResponsable] = useState('');
    const [isClient, setIsClient] = useState(false);
    const overlayPanelRef = useRef<OverlayPanel>(null);
    const { usuario, clearUsuario } = useAuth();
    const { width } = useWindowSize();

    useImperativeHandle(ref, () => ({
        menubutton: menubuttonRef.current,
        topbarmenu: topbarmenuRef.current,
        topbarmenubutton: topbarmenubuttonRef.current
    }));

    useEffect(() => {
        setIsClient(true);
    }, []);

    useEffect(() => {
        if (isClient && usuario) {
            setNombreEmpresa(usuario.nombre_empresa || '');
            setResponsable(usuario.responsable || 'Usuario');
        }
    }, [isClient, usuario]);

    const handleLogout = () => {
        clearUsuario()
        document.cookie = `login=false; path=/; max-age=0;`;
        router.push('/autenticar');
    };

    return (
        <div className="layout-topbar">
            <Link href="/inicio" className="layout-topbar-logo">
                {nombreEmpresa != '' ? (<img src={`https://fenix.coboy.com.co/logos/${nombreEmpresa}-${layoutConfig.colorScheme === "light" ? "dark" : "white"
                    }.svg`} alt="logo" />) : null}
            </Link>

            <button ref={menubuttonRef} type="button" className="p-link layout-menu-button layout-topbar-button" onClick={onMenuToggle}>
                <i className="pi pi-bars" />
            </button>

            <button ref={topbarmenubuttonRef} type="button" className="p-link layout-topbar-menu-button layout-topbar-button" onClick={showProfileSidebar}>
                <i className="pi pi-ellipsis-v" />
            </button>
            {width > 768 ? (<div className="text-900 text-xl font-medium ml-3">{nombreEmpresa}</div>) : null}
            <div
                ref={topbarmenuRef}
                className={classNames('layout-topbar-menu', { 'layout-topbar-menu-mobile-active': layoutState.profileSidebarVisible })}
                style={{ alignItems: 'center' }} // Flexbox para alineación
            >
                {isClient && responsable && <span>{responsable}</span>}
                <button type="button" className="p-link layout-topbar-button" onClick={(e) => overlayPanelRef.current?.toggle(e)}
                >
                    <i className="pi pi-user"></i>
                    {isClient && <span>Perfil</span>}
                </button>
                <OverlayPanel ref={overlayPanelRef} className="p-overlaypanel">
                    <div className="p-d-flex p-ai-center p-jc-start">
                        <Button
                            type="button"
                            label="Cerrar Sesión"
                            icon="pi pi-power-off"
                            className="p-button-danger p-button-text"
                            onClick={handleLogout}
                        />
                    </div>
                </OverlayPanel>
            </div>

        </div>
    );
});

AppTopbar.displayName = 'AppTopbar';

export default AppTopbar;
