import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import { Button } from 'primereact/button';
import { Calendar } from 'primereact/calendar';
import { PrimeReactProvider, addLocale } from 'primereact/api';
import { FieldReport, ButtonConfig, ReporteDinamicoProps } from '@/types/reporteDinamico';

const ReporteDinamico = ({ config, formData, setFormData, handlers, dropdownOptions }: ReporteDinamicoProps) => {

    const localeSettings = {
        firstDayOfWeek: 1, // Lunes como primer día de la semana
        dayNames: ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"],
        dayNamesShort: ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"],
        dayNamesMin: ["Do", "Lu", "Ma", "Mi", "Ju", "Vi", "Sa"],
        monthNames: ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"],
        monthNamesShort: ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"],
        today: "Hoy",
        clear: "Limpiar"
    };

    addLocale('es', localeSettings)

    const handleChange = (value: any, field: FieldReport) => {
        if (!value) return;
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
        return config?.fields.every((field) => {
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

    const renderField = (field: FieldReport) => {
        switch (field.type) {
            case 'input':
                return (
                    <div className="field col-12 md:col" key={field.id}>
                        <label htmlFor={field.id}>{field.label}</label>
                        <InputText
                            id={field.id}
                            value={(formData[field.id] as string) || ''}
                            onChange={(e) => handleChange(e.target.value, field)}
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
                return (
                    <div className="field col-12 md:col" key={field.id}>
                        <label htmlFor={field.id}>{field.label}</label>
                        <Dropdown
                            id={field.id}
                            value={formData[field.id] as { name: string; code: string } | undefined}
                            onChange={(e) => setFormData((prev: FormData) => ({ ...prev, [field.id]: e.value }))}
                            options={(dropdownOptions && field.source === 'api') ? (dropdownOptions[field.id] || []) : field.options || []}
                            optionLabel="name"
                            placeholder="Seleccione una opción"
                        />
                    </div>
                );
            case 'calendar':
                return (
                    <div className="field col-12 md:col" key={field.id}>
                        <label htmlFor={field.id}>{field.label}</label>
                        <Calendar
                            id={field.id}
                            value={formData[field.id] as Date | null}
                            onChange={(e) => handleChange(e.value, field)}
                            dateFormat="dd/mm/yy"
                            showIcon
                            className="w-full"
                            locale="es"
                        />
                    </div>
                );
            default:
                return null;
        }
    };

    const renderButton = (button: ButtonConfig) => (
        <Button
            className="w-full lg:w-3"
            key={button.label}
            label={button.label}
            onClick={handlers[button.action as keyof typeof handlers]}
            severity={button.severity}
            disabled={button.validation && !isFormValid()}
        />
    );

    return (
        <div>
            <h3 className="text-center">{config.title}</h3>
            <h4 className="text-center">{config.subtitle}</h4>

            {/* Dividir los campos en grupos de 3 */}
            {config.fields.reduce((acc, field, index) => {
                // Cada 3 campos, crea un nuevo grupo
                if (index % 3 === 0) {
                    acc.push(config.fields.slice(index, index + 3));
                }
                return acc;
            }, [] as FieldReport[][]).map((group, groupIndex) => (
                // Renderizar un div con la clase "formgrid grid" para cada grupo
                <div className="formgrid grid" key={groupIndex}>
                    {group.map((field) => renderField(field))}
                </div>
            ))}

            <div className="flex justify-content-center gap-3">
                {config.buttons.map((button) => renderButton(button))}
            </div>
        </div>
    );
};

export default ReporteDinamico;