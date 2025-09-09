/* eslint-disable @next/next/no-img-element */
'use client';
import React, { useState, useRef } from 'react';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import { Calendar } from 'primereact/calendar';
import { Button } from 'primereact/button';
import { Card } from 'primereact/card';
import { Toast } from 'primereact/toast';
import { classNames } from 'primereact/utils';
import './registro.scss';

interface FormData {
    nombrePropiedad: string;
    tipoPropiedad: string;
    numeroMatricula: string;
    nit: string;
    fechaConstitucion: Date | null;
    nombreAdministrador: string;
    documento: string;
    telefono: string;
    correo: string;
}

const RegistroPage = () => {
    const toast = useRef<Toast>(null);
    const [formData, setFormData] = useState<FormData>({
        nombrePropiedad: '',
        tipoPropiedad: '',
        numeroMatricula: '',
        nit: '',
        fechaConstitucion: null,
        nombreAdministrador: '',
        documento: '',
        telefono: '',
        correo: ''
    });

    const tiposPropiedad = [
        { label: 'Seleccione...', value: '' },
        { label: 'Conjunto Residencial', value: 'conjunto_residencial' },
        { label: 'Edificio', value: 'edificio' },
        { label: 'Condominio', value: 'condominio' },
        { label: 'Urbanización', value: 'urbanizacion' }
    ];

    const handleInputChange = (field: keyof FormData, value: any) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handleSubmit = () => {
        // Aquí iría la lógica de envío del formulario
        // Por ahora solo mostramos un mensaje
        if (toast.current) {
            toast.current.show({
                severity: 'info',
                summary: 'Información',
                detail: 'Funcionalidad no implementada aún',
                life: 3000
            });
        }
    };

    return (
        <div className="registro-container">
            <Toast ref={toast} />
            
            {/* Header con título y decoración */}
            <div className="registro-header">
                <div className="header-content">
                    <h1 className="header-title">Gestión de Propiedad Horizontal</h1>
                </div>
            </div>

            {/* Contenido principal */}
            <div className="registro-content">
                <div className="registro-form-container">
                    {/* Título del formulario */}
                    <div className="form-title-section">
                        <h2 className="form-title">Registrar Propiedad Horizontal</h2>
                        <div className="building-illustration">
                            <div className="building">
                                <div className="building-base"></div>
                                <div className="building-floors">
                                    <div className="floor floor-1"></div>
                                    <div className="floor floor-2"></div>
                                    <div className="floor floor-3"></div>
                                </div>
                                <div className="building-roof"></div>
                            </div>
                            <div className="tree"></div>
                        </div>
                    </div>

                    {/* Sección Datos Generales */}
                    <Card className="form-section">
                        <h3 className="section-title">Datos Generales</h3>
                        <div className="form-grid">
                            <div className="form-group">
                                <label htmlFor="nombrePropiedad" className="form-label">
                                    Nombre de la Propiedad
                                </label>
                                <InputText
                                    id="nombrePropiedad"
                                    value={formData.nombrePropiedad}
                                    onChange={(e) => handleInputChange('nombrePropiedad', e.target.value)}
                                    placeholder="Ej: Conjunto Residencial Los Rosales"
                                    className="form-input"
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="tipoPropiedad" className="form-label">
                                    Tipo de Propiedad
                                </label>
                                <Dropdown
                                    id="tipoPropiedad"
                                    value={formData.tipoPropiedad}
                                    options={tiposPropiedad}
                                    onChange={(e) => handleInputChange('tipoPropiedad', e.value)}
                                    placeholder="Seleccione..."
                                    className="form-input"
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="numeroMatricula" className="form-label">
                                    Número de Matrícula inmobiliaria
                                </label>
                                <InputText
                                    id="numeroMatricula"
                                    value={formData.numeroMatricula}
                                    onChange={(e) => handleInputChange('numeroMatricula', e.target.value)}
                                    placeholder="Ej: 123456789"
                                    className="form-input"
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="fechaConstitucion" className="form-label">
                                    Fecha de Constitución
                                </label>
                                <Calendar
                                    id="fechaConstitucion"
                                    value={formData.fechaConstitucion}
                                    onChange={(e) => handleInputChange('fechaConstitucion', e.value)}
                                    placeholder="Seleccione fecha"
                                    className="form-input"
                                    showIcon
                                    dateFormat="dd/mm/yy"
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="nit" className="form-label">
                                    NIT
                                </label>
                                <InputText
                                    id="nit"
                                    value={formData.nit}
                                    onChange={(e) => handleInputChange('nit', e.target.value)}
                                    placeholder="Ej: 900123456-7"
                                    className="form-input"
                                />
                            </div>
                        </div>
                    </Card>

                    {/* Sección Administrador */}
                    <Card className="form-section">
                        <h3 className="section-title">Administrador</h3>
                        <div className="form-grid">
                            <div className="form-group">
                                <label htmlFor="nombreAdministrador" className="form-label">
                                    Nombre del Administrador
                                </label>
                                <InputText
                                    id="nombreAdministrador"
                                    value={formData.nombreAdministrador}
                                    onChange={(e) => handleInputChange('nombreAdministrador', e.target.value)}
                                    placeholder="Ej: Juan Perez"
                                    className="form-input"
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="documento" className="form-label">
                                    Documento
                                </label>
                                <InputText
                                    id="documento"
                                    value={formData.documento}
                                    onChange={(e) => handleInputChange('documento', e.target.value)}
                                    placeholder="Ej: CC 123456789"
                                    className="form-input"
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="telefono" className="form-label">
                                    Teléfono
                                </label>
                                <InputText
                                    id="telefono"
                                    value={formData.telefono}
                                    onChange={(e) => handleInputChange('telefono', e.target.value)}
                                    placeholder="Ej: 3001234567"
                                    className="form-input"
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="correo" className="form-label">
                                    Correo
                                </label>
                                <InputText
                                    id="correo"
                                    value={formData.correo}
                                    onChange={(e) => handleInputChange('correo', e.target.value)}
                                    placeholder="Ej: admin@propiedad.com"
                                    className="form-input"
                                    type="email"
                                />
                            </div>
                        </div>
                    </Card>

                    {/* Botón de registro */}
                    <div className="form-actions">
                        <Button
                            label="Registrar Propiedad"
                            onClick={handleSubmit}
                            className="register-button"
                            size="large"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RegistroPage;