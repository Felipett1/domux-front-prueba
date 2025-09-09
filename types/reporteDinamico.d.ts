
export interface FormDataReport {
    [key: string]: string | date | { name: string; code: string } | undefined;
}

export interface Config {
    title: string;
    subtitle: string;
    name: string;
    type: string;
    context: string;
    icon:string;
    admin:boolean;
    order:number;
    fields: FieldReport[];
    buttons: ButtonConfig[];
}

export interface FieldReport {
    type: string;
    id: string;
    label: string;
    placeholder?: string;
    validation?: string;
    required?: boolean;
    onBlur?: string;
    options?: { name: string; code: string }[];
    group?: string;
    concat?: boolean;
    source?:string;
}

export type Severity = "secondary" | "success" | "info" | "warning" | "danger" | "help" | undefined;

export interface ButtonConfig {
    type: string;
    label: string;
    action: string;
    severity: Severity;
    validation: boolean;
}

interface Servicio {
    secuencia: string;
    descripcion: string;
}

interface Empresa {
    secuencia: string;
    nombre: string;
    estado: boolean;
}

interface Parametros {
    reporte: number;
    fecha_inicio: string;
    fecha_final: string;
    servicio?: string;
    empresa?: string;
}

export interface ReporteDinamicoProps {
    config: Config;
    formData: FormDataReport;
    setFormData: React.Dispatch<React.SetStateAction<FormData>>;
    handlers: {
        solicitarReporte: () => void;
        handleClear: () => void;
    };
    dropdownOptions?: { [key: string]: { name: string; code: string }[] };
}
