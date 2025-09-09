/* eslint-disable @next/next/no-img-element */
'use client';
import { useRouter } from 'next/navigation';
import React, { useContext, useState, useRef, useEffect } from 'react';
import { Checkbox } from 'primereact/checkbox';
import { Button } from 'primereact/button';
import { Password } from 'primereact/password';
import { LayoutContext } from '@/context/layoutcontext';
import { InputText } from 'primereact/inputtext';
import { Dialog } from 'primereact/dialog';
import { classNames } from 'primereact/utils';
import { AutenticarService } from '@/service/AutenticarService';
import { Toast } from 'primereact/toast';
import useAuth from "@/hook/useAuth";
import './login.scss';


const LoginPage = () => {
    const [usuario, setUsuario] = useState(''); // Estado para el usuario
    const [password, setPassword] = useState(''); // Estado para la contraseña
    const [checked, setChecked] = useState(false);
    const { layoutConfig } = useContext(LayoutContext);
    const toast = useRef<Toast>(null);
    const { setUsuarioData } = useAuth();
    // Validar si el botón debe estar habilitado
    const isButtonDisabled = !usuario || !password; // El botón estará deshabilitado si usuario o contraseña están vacíos
    // Estados para el modal "Olvidó su contraseña"
    const [verOldivoPsw, setVerOldivoPsw] = useState(false);
    const [usuarioOlvido, setUsuarioOlvido] = useState('');
    const [correoOlvido, setCorreoOlvido] = useState('');
    const [correoValido, setCorreoValido] = useState(true);
    const router = useRouter();

    // Clase del contenedor
    const containerClassName = classNames(
        'login-container',
        { 'p-input-filled': layoutConfig.inputStyle === 'filled' }
    );

    const applyScale = () => {
        document.documentElement.style.fontSize = layoutConfig.scale + 'px';
    };

    useEffect(() => {
        applyScale();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [layoutConfig.scale]);

    useEffect(() => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // Expresión regular para correos válidos
        if (correoOlvido.trim() === "") {
            setCorreoValido(true);
        } else {
            setCorreoValido(emailRegex.test(correoOlvido));
        }
    }, [correoOlvido]);

    // Función para manejar el clic del botón
    const handleLogin = async () => {
        try {
            let respuesta = await AutenticarService.autenticar(usuario, password);
            if (respuesta.autenticar) {
                exitoso('Validación realizada', 'Usuario ingreso exitosamente');
                /*if (respuesta.usuario.estado) {
                    // Guardar datos en localStorage si el checkbox está marcado
                    if (checked) {
                        localStorage.setItem('usuarioLogin', usuario);
                        localStorage.setItem('checked', 'true');
                    } else {
                        localStorage.removeItem('usuarioLogin');
                        localStorage.removeItem('checked');
                    }
                    setUsuarioData(respuesta.usuario);
                    // Guardar la cookie de autenticación
                    document.cookie = `login=true; path=/; samesite=strict; max-age=43200`; // 12 horas
                    //Activar en producción!!
                    //document.cookie = `login=true; path=/; secure; samesite=strict; max-age=43200`; // 1 hora
                    router.push('/inicio');
                } else {
                    error('¡El usuario se encuentra inactivo!');
                }*/
            } else {
                error('¡Usuario y/o contraseña invalida!');
            }
        } catch (e) {
            error('Presentamos problemas técnicos, por favor intente más tarde.');
        }

    };

    // Manejo del submit del modal de "olvidó su contraseña"
    const enviarOlvidoPsw = async () => {
        try {
            const respuesta = await AutenticarService.olvidoClave(usuarioOlvido, correoOlvido);
            if (respuesta.codigo == 0) {
                exitoso(respuesta.mensaje, `${respuesta.detalle} \nPor favor valide su correo y siga las instrucciones.`);
                setVerOldivoPsw(false);
                limpiarCamposOlvido();
            } else {
                error(respuesta.detalle)
            }
        } catch (e) {
            error('Problemas técnicos, por favor intente más tarde.')
        }
    };

    const limpiarCamposOlvido = () => {
        //limpiar los campos del modal
        setUsuarioOlvido('');
        setCorreoOlvido('');
        setCorreoValido(true);
    }

    const abriOlvido = () => {
        if (usuario && usuario != '') {
            setUsuarioOlvido(usuario)
        }
        setVerOldivoPsw(true)
    }

    useEffect(() => {
        const storedUsuario = localStorage.getItem('usuarioLogin');
        const storedChecked = localStorage.getItem('checked') === 'true';
        if (storedChecked && storedUsuario) {
            setUsuario(storedUsuario);
            setChecked(storedChecked);
        }
    }, []);

    const exitoso = (mensaje: string, detalle: string) => {
        toast.current?.show({
            severity: 'success',
            summary: mensaje,
            detail: detalle,
            life: 4500,
        });
    };

    const error = (mensaje: string) => {
        toast.current?.show({
            severity: 'error',
            summary: 'Error',
            detail: mensaje,
            life: 3000
        });
    };

    return (
        <div className={containerClassName}>
            <Toast ref={toast} />
            <div className="login-wrapper">
                {/* Header con título */}
                <div className="login-header">
                    <h1 className="header-title">Gestión de Propiedad Horizontal</h1>
                </div>

                {/* Card de login */}
                <div className="login-card">
                    <h2 className="login-title">Login</h2>

                    <div className="form-group input-with-icon">
                        <i className="pi pi-user input-icon"></i>
                        <label htmlFor="usuario" className="form-label">
                            Usuario
                        </label>
                        <InputText
                            id="usuario"
                            type="text"
                            placeholder=""
                            value={usuario}
                            onChange={(e) => setUsuario(e.target.value)}
                            className="form-input"
                        />
                    </div>

                    <div className="form-group input-with-icon">
                        <i className="pi pi-lock input-icon"></i>
                        <label htmlFor="clave" className="form-label">
                            Contraseña
                        </label>
                        <Password
                            inputId="clave"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder=""
                            toggleMask
                            className="form-input"
                            feedback={false}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                    !isButtonDisabled ? handleLogin() : null;
                                }
                            }}
                        />
                    </div>

                    <div className="remember-forgot">
                        <div className="remember-me">
                            <Checkbox
                                inputId="rememberme1"
                                checked={checked}
                                onChange={(e) => setChecked(e.checked ?? false)}
                            />
                            <label htmlFor="rememberme1">Recordarme</label>
                        </div>
                    </div>

                    <Button
                        label="Ingresar"
                        className="login-button"
                        disabled={isButtonDisabled}
                        onClick={handleLogin}
                    />

                    <div className="forgot-password-link">
                        <a onClick={() => abriOlvido()}>
                            ¿Olvidaste tu contraseña?
                        </a>
                    </div>
                </div>
            </div>

            {/* Modal para "Olvidó su contraseña" */}
            <Dialog
                header="Recuperar Contraseña"
                visible={verOldivoPsw}
                onHide={() => { setVerOldivoPsw(false); limpiarCamposOlvido(); }}
            >
                <div className="form-group">
                    <label htmlFor="forgotUsername">
                        Nombre de usuario
                    </label>
                    <InputText
                        id="forgotUsername"
                        type="text"
                        placeholder="Ingrese su usuario"
                        value={usuarioOlvido}
                        onChange={(e) => setUsuarioOlvido(e.target.value)}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="forgotEmail">
                        Correo Electrónico
                    </label>
                    <InputText
                        id="forgotEmail"
                        type="email"
                        placeholder="Ingrese su correo"
                        value={correoOlvido}
                        onChange={(e) => setCorreoOlvido(e.target.value)}
                        className={correoValido ? '' : 'p-invalid'}
                        required
                    />
                    {!correoValido && <small className="p-error">Ingrese un correo electrónico válido</small>}
                </div>
                <div className="flex justify-content-end gap-2">
                    <Button label="Cancelar" onClick={() => { setVerOldivoPsw(false); limpiarCamposOlvido(); }} className="p-button-text" />
                    <Button type="submit" label="Enviar correo"
                        onClick={() => enviarOlvidoPsw()}
                        disabled={
                            !correoOlvido.trim() ||
                            !correoValido ||
                            !usuarioOlvido.trim()
                        } />
                </div>
            </Dialog>
        </div>
    );
};

export default LoginPage;
