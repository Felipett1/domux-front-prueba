import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import { Button } from 'primereact/button';
import { FormData, Field, ButtonConfig, ComponentMapperProps } from '@/types/formularioGenerar';
import { useState, useEffect } from 'react';
import { useMoodle } from '@/hook/useMoodle';
import { Message } from 'primereact/message';

const ComponentMapper = ({ 
    config, 
    formData, 
    setFormData, 
    handlers, 
    isLoading = false, 
    moodleError 
}: ComponentMapperProps) => {
    
    // Estado local para el config que se actualiza reactivamente
    const [localConfig, setLocalConfig] = useState(config);
    
    // Hook de Moodle para gestionar cursos
    const {
        courses,
        loading: loadingCourses,
        error: moodleHookError,
        clearError
    } = useMoodle({
        config: config?.moodle,
        enabled: config?.enableMoodleIntegration
    });

    // Sincronizar config inicial
    useEffect(() => {
        setLocalConfig(config);
    }, [config]);
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>, field: Field) => {
        const { value } = e.target;
        // Aplicar validación según el tipo de campo
        if (field.validation === 'numeric' && !isNumeric(value)) {
            return; // No actualizar el estado si la validación falla
        }

        if (field.validation === 'currency') {
            const formattedValue = formatCurrency(value);
            setFormData((prev: FormData) => ({ ...prev, [field.id]: formattedValue }));
            return;
        }

        if (field.id) {
            setFormData((prev: FormData) => ({ ...prev, [field.id]: value }));
        }
    };

    // Validar si un valor es numérico
    const isNumeric = (value: string) => {
        return /^[0-9]*$/.test(value);
    }

    // Validar correo electrónico
    const validateEmail = (email: string) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    const formatCurrency = (value: string): string => {
        // Eliminar todos los caracteres que no sean números
        const numericValue = value.replace(/\D/g, '');

        // Formatear como moneda (ej: 50000 -> $50,000)
        return new Intl.NumberFormat('es-CO', {
            style: 'currency',
            currency: 'COP', // Cambia a la moneda que necesites
            minimumFractionDigits: 0, // Sin decimales
        }).format(Number(numericValue));
    };

    const isFormValid = () => {
        return localConfig?.fields.every((field) => {
            const value = formData[field.id] as string;

            // Validación para campos de tipo dropdown
            if (field.type === 'dropdown') {
                return formData[field.id] !== undefined;
            }

            // Validación para campos numéricos
            if (field.validation === 'numeric' && !isNumeric(value)) {
                return false;
            }

            // Validación para campos de correo electrónico
            if (field.validation === 'email' && !validateEmail(value)) {
                return false;
            }

            // Verificar si el campo es requerido
            if (field.required && !value) {
                return false;
            }

            return true;
        }) || false;
    };

    const renderField = (field: Field) => {
        switch (field.type) {
            case 'input':
                return (
                    <div className="field col-12 md:col" key={field.id}>
                        <label htmlFor={field.id}>{field.label}</label>
                        <InputText
                            id={field.id}
                            value={(formData[field.id] as string) || ''}
                            onChange={(e) => handleChange(e, field)}
                            onBlur={handlers[field.onBlur as keyof typeof handlers]}
                            className={
                                field.validation === 'email' && formData[field.id] && !validateEmail(formData[field.id] as string)
                                    ? 'p-invalid'
                                    : ''
                            }
                        />
                        {field.validation === 'email' && formData[field.id] && !validateEmail(formData[field.id] as string) && (
                            <small className="p-error">Correo inválido</small>
                        )}
                    </div>
                );
            case 'dropdown':
                const isMoodleCourse = field.id === 'moodle_course';
                const isDropdownDisabled = isMoodleCourse && (loadingCourses || !field.options || field.options.length === 0);
                const dropdownPlaceholder = isMoodleCourse && loadingCourses 
                    ? "Cargando cursos..." 
                    : isMoodleCourse && (!field.options || field.options.length === 0)
                    ? "No hay cursos disponibles"
                    : "Seleccione uno";
                
                return (
                    <div className={`field col-12 md:col ${isMoodleCourse ? 'moodle-dropdown' : ''}`} key={field.id}>
                        <label htmlFor={field.id}>{field.label}</label>
                        <Dropdown
                            id={field.id}
                            value={formData[field.id] as { name: string; code: string } | undefined}
                            onChange={(e) => setFormData((prev: FormData) => ({ ...prev, [field.id]: e.value }))}
                            options={field.options || []}
                            optionLabel="name"
                            placeholder={dropdownPlaceholder}
                            disabled={isDropdownDisabled}
                            style={{ minHeight: '42px' }}
                            panelStyle={{ minWidth: '100%' }}
                            className={isMoodleCourse && loadingCourses ? 'p-dropdown-loading' : ''}
                        />
                        {isMoodleCourse && moodleHookError && (
                            <small className="p-error dropdown-error">
                                <i className="pi pi-exclamation-triangle mr-1"></i>
                                Error al cargar cursos. 
                                <span 
                                    className="retry-link"
                                    onClick={clearError}
                                >
                                    Reintentar
                                </span>
                            </small>
                        )}
                        {isMoodleCourse && !loadingCourses && !moodleHookError && (!field.options || field.options.length === 0) && (
                            <small className="text-muted mt-1 block">
                                <i className="pi pi-info-circle mr-1"></i>
                                No hay cursos disponibles en este momento.
                            </small>
                        )}
                    </div>
                );
            default:
                return null;
        }
    };

    // Agregar campo de curso dinámicamente cuando se cargan los cursos
    useEffect(() => {
        if (localConfig?.enableMoodleIntegration) {
            const hasCourseField = localConfig.fields.some(field => field.id === 'moodle_course');
            
            if (!hasCourseField) {
                // Siempre agregar el campo, incluso si no hay cursos aún
                let courseOptions: { code: string; name: string }[] = [];
                if (courses.length > 0) {
                    // Filtrar cursos: excluir el curso con id 1 (curso inicial/sitio)
                    const filteredCourses = courses.filter(course => course.id !== 1);
                    
                    courseOptions = filteredCourses.map(course => ({
                        code: course.id.toString(),
                        name: course.fullname
                    }));
                }
                
                // Crear nueva configuración con el campo de curso agregado
                setLocalConfig(prevConfig => ({
                    ...prevConfig!,
                    fields: [
                        ...prevConfig!.fields,
                        {
                            id: 'moodle_course',
                            type: 'dropdown',
                            group: 'moodle',
                            label: 'Curso de Moodle*',
                            required: true,
                            options: courseOptions
                        }
                    ]
                }));
            } else if (courses.length > 0) {
                // Si el campo ya existe, actualizar las opciones
                const courseField = localConfig.fields.find(field => field.id === 'moodle_course');
                if (courseField && (!courseField.options || courseField.options.length === 0)) {
                    const filteredCourses = courses.filter(course => course.id !== 1);
                    const newOptions = filteredCourses.map(course => ({
                        code: course.id.toString(),
                        name: course.fullname
                    }));
                    
                    // Actualizar las opciones del campo existente
                    setLocalConfig(prevConfig => ({
                        ...prevConfig!,
                        fields: prevConfig!.fields.map(field => 
                            field.id === 'moodle_course' 
                                ? { ...field, options: newOptions }
                                : field
                        )
                    }));
                }
            }
        }
    }, [localConfig, courses]);

    const renderButton = (button: ButtonConfig) => {
        const isMoodleMode = localConfig?.enableMoodleIntegration && button.action === 'handleGenerate';
        const buttonLabel = isMoodleMode ? 'Registrar' : button.label;
        const buttonAction = isMoodleMode ? 'handleMoodleRegister' : button.action;
        const isButtonDisabled = isLoading || (isMoodleMode && (loadingCourses || !!moodleHookError)) || ((buttonAction === 'handleGenerate' || buttonAction === 'handleMoodleRegister') && !isFormValid());
        
        return (
            <Button
                className="w-full lg:w-3"
                key={button.label}
                label={buttonLabel}
                onClick={handlers[buttonAction as keyof typeof handlers]}
                severity={button.severity}
                disabled={isButtonDisabled}
                loading={(isLoading && isMoodleMode) || (buttonAction === 'handleMoodleRegister' && loadingCourses)}
            />
        );
    };

    return (
        <div>
            <h3 className="text-center">{localConfig?.title}</h3>
            <h4 className="text-center">{localConfig?.subtitle}</h4>

            {/* Mostrar errores de Moodle si existen */}
              {(moodleHookError || moodleError) && (
                  <Message 
                      severity="error" 
                      text={moodleHookError ? `Error al cargar cursos: ${moodleHookError}` : moodleError}
                      className="mb-3"
                 />
            )}

            {/* Mostrar mensaje de carga de cursos */}
            {localConfig?.enableMoodleIntegration && loadingCourses && (
                <Message 
                    severity="info" 
                    text="Cargando cursos de Moodle..."
                    className="mb-3"
                />
            )}

            {/* Dividir los campos en grupos de 3 */}
            {localConfig?.fields.reduce((acc, field, index) => {
                // Cada 3 campos, crea un nuevo grupo
                if (index % 3 === 0) {
                    acc.push(localConfig.fields.slice(index, index + 3));
                }
                return acc;
            }, [] as Field[][]).map((group, groupIndex) => (
                // Renderizar un div con la clase "formgrid grid" para cada grupo
                <div className="formgrid grid" key={groupIndex}>
                    {group.map((field) => renderField(field))}
                </div>
            ))}

            <div className="flex justify-content-center gap-3">
                {localConfig?.buttons.map((button) => renderButton(button))}
            </div>
        </div>
    );
};

export default ComponentMapper;