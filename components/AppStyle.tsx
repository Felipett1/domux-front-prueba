import React, { useContext, useEffect, useState } from 'react';
import { LayoutContext } from '../context/layoutcontext';
import { PrimeReactContext } from 'primereact/api';
import { LayoutConfig } from '@/types';

const AppStyle = () => {
    const { layoutConfig, setLayoutConfig } = useContext(LayoutContext);
    const [modo, setModo] = useState(true);
    const { changeTheme } = useContext(PrimeReactContext);

    useEffect(() => {
        var modo = localStorage.getItem('modo');
        setModo(modo == 'dark' ? true : false)
    }, []);

    const cambiarModo = () => {
        var theme = ''
        var colorScheme = ''
        if (!modo) {
            theme = 'lara-dark-blue'
            colorScheme = 'dark'
        } else {
            theme = 'lara-light-blue'
            colorScheme = 'light'
        }
        changeTheme?.(layoutConfig.theme, theme, 'theme-css', () => {
            setLayoutConfig((prevState: LayoutConfig) => ({ ...prevState, theme, colorScheme }));
        });
        localStorage.setItem('modo', !modo ? 'dark' : 'light');
        setModo(!modo)
    }

    return (
        <div>
            <button
                onClick={cambiarModo}
                style={{
                    position: 'fixed',
                    bottom: '20px',
                    right: '20px',
                    zIndex: 1000,
                    backgroundColor: modo ? '#121212' : '#f1f1f1',
                    color: modo ? '#ffffff' : '#000000',
                    border: 'none',
                    borderRadius: '50%',
                    width: '50px',
                    height: '50px',
                    boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                }}
            >
                {modo ? (
                    <i className="pi pi-sun" style={{ fontSize: '20px' }}></i>
                ) : (
                    <i className="pi pi-moon" style={{ fontSize: '20px' }}></i>
                )}
            </button>

        </div>
    );
};

AppStyle.displayName = 'AppStyle';

export default AppStyle;
