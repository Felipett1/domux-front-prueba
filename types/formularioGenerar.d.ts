
export interface FormData {
    [key: string]: string | { name: string; code: string } | undefined;
}

export interface MoodleConfig {
    baseUrl: string;
    token: string;
    serviceName?: string;
}

export interface Config {
    title: string;
    subtitle: string;
    duration: number;
    context: string;
    contextMobile?: string;
    order: number;
    fields: Field[];
    buttons: ButtonConfig[];
    moodle?: MoodleConfig;
    enableMoodleIntegration?: boolean;
}

export interface Field {
    type: string;
    id: string;
    label: string;
    placeholder?: string;
    validation?: string;
    required?: boolean;
    onBlur?: string;
    options?: { name: string; code: string }[];
    group?: string;
}

export type Severity = "secondary" | "success" | "info" | "warning" | "danger" | "help" | undefined;

export interface ButtonConfig {
    type: string;
    label: string;
    action: string;
    severity: Severity;
}

export interface ComponentMapperProps {
    config: Config;
    formData: FormData;
    setFormData: React.Dispatch<React.SetStateAction<FormData>>;
    handlers: {
        consultarCliente: () => void;
        handleGenerate: () => void;
        handleClear: () => void;
        handleMoodleRegister?: () => void;
    };
    isLoading?: boolean;
    moodleError?: string | null;
}
