import { useState, useEffect, useCallback } from 'react';
import { MoodleService, MoodleCourse, MoodleUser, MoodleConfig } from '@/service/MoodleService';

export interface UseMoodleProps {
    config?: MoodleConfig;
    enabled?: boolean;
}

export interface UseMoodleReturn {
    courses: MoodleCourse[];
    loading: boolean;
    error: string | null;
    refreshCourses: () => Promise<void>;
    createOrUpdateUser: (userData: Omit<MoodleUser, 'id'>) => Promise<MoodleUser | null>;
    enrollUserInCourse: (userId: number, courseId: number) => Promise<boolean>;
    clearError: () => void;
    retryCount: number;
}

/**
 * Hook personalizado para manejar la integración con Moodle
 * Proporciona funcionalidades para gestionar cursos, usuarios y inscripciones
 */
export const useMoodle = ({ config, enabled = false }: UseMoodleProps): UseMoodleReturn => {
    const [courses, setCourses] = useState<MoodleCourse[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [retryCount, setRetryCount] = useState(0);

    /**
     * Carga los cursos disponibles desde Moodle con reintento automático
     */
    const loadCourses = useCallback(async (currentRetry = 0) => {
        if (!enabled || !config) {
            setCourses([]);
            setRetryCount(0);
            return;
        }

        setLoading(true);
        if (currentRetry === 0) {
            setError(null);
            setRetryCount(0);
        }

        try {
            const moodleCourses = await MoodleService.getCourses(config);
            setCourses(moodleCourses);
            setError(null);
            setRetryCount(0);
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Error al cargar cursos de Moodle';
            setError(errorMessage);
            console.error('Error loading Moodle courses:', err);
            
            // Reintento automático hasta 2 veces con delay incremental
            if (currentRetry < 2) {
                const delay = (currentRetry + 1) * 2000; // 2s, 4s
                console.log(`Reintentando carga de cursos en ${delay}ms (intento ${currentRetry + 1}/2)`);
                
                setRetryCount(currentRetry + 1);
                setTimeout(() => {
                    loadCourses(currentRetry + 1);
                }, delay);
            }
        } finally {
            setLoading(false);
        }
    }, [config, enabled]);

    /**
     * Limpia el estado de error y reintenta cargar cursos
     */
    const clearError = useCallback(() => {
        setError(null);
        if (enabled && config) {
            loadCourses(0);
        }
    }, [enabled, config, loadCourses]);

    /**
     * Refresca la lista de cursos
     */
    const refreshCourses = useCallback(async () => {
        await loadCourses(0);
    }, [loadCourses]);

    /**
     * Crea o actualiza un usuario en Moodle con validaciones estrictas
     * El documento (username) debe ser único y el email también
     */
    const createOrUpdateUser = useCallback(async (userData: Omit<MoodleUser, 'id'>): Promise<MoodleUser | null> => {
        if (!enabled || !config) {
            throw new Error('Moodle integration is not enabled or configured');
        }

        setError(null);

        try {
            // Usar la nueva función con validaciones estrictas
            const userDataWithUsername: MoodleUser = {
                ...userData,
                username: userData.username // El username debe ser el documento
            };
            
            return await MoodleService.createOrUpdateUserWithValidation(config, userDataWithUsername);
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Error al gestionar usuario en Moodle';
            setError(errorMessage);
            console.error('Error managing Moodle user:', err);
            throw err; // Re-lanzar el error para manejo en el componente padre
        }
    }, [config, enabled]);

    /**
     * Inscribe un usuario en un curso específico
     */
    const enrollUserInCourse = useCallback(async (userId: number, courseId: number): Promise<boolean> => {
        if (!enabled || !config) {
            throw new Error('Moodle integration is not enabled or configured');
        }

        setError(null);

        try {
            return await MoodleService.enrollUserInCourse(config, {
                roleid: 5, // Rol de estudiante por defecto
                userid: userId,
                courseid: courseId
            });
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Error al inscribir usuario en curso';
            setError(errorMessage);
            console.error('Error enrolling user in course:', err);
            return false;
        }
    }, [config, enabled]);

    // Cargar cursos cuando se habilita la integración o cambia la configuración
    useEffect(() => {
        if (enabled && config) {
            loadCourses(0);
        } else {
            setCourses([]);
            setError(null);
            setRetryCount(0);
        }
    }, [enabled, config, loadCourses]);

    return {
        courses,
        loading,
        error,
        refreshCourses,
        createOrUpdateUser,
        enrollUserInCourse,
        clearError,
        retryCount
    };
};

export default useMoodle;