import axios from 'axios';

export interface MoodleConfig {
    baseUrl: string;
    token: string;
    serviceName?: string;
}

export interface MoodleCourse {
    id: number;
    fullname: string;
    shortname: string;
    categoryid: number;
    visible: number;
    startdate: number;
    enddate: number;
}

export interface MoodleUser {
    id?: number;
    username: string;
    password?: string; // Password generado para el usuario
    firstname: string;
    lastname: string;
    email: string;
    phone1?: string;
    city?: string;
}

export interface MoodleEnrollment {
    roleid: number; // 5 = student role by default
    userid: number;
    courseid: number;
}

export const MoodleService = {
    /**
     * Obtiene la lista de cursos activos de Moodle
     */
    async getCourses(moodleConfig: MoodleConfig): Promise<MoodleCourse[]> {
        try {
            const response = await axios.post(
                `${moodleConfig.baseUrl}/webservice/rest/server.php`,
                new URLSearchParams({
                    wstoken: moodleConfig.token,
                    wsfunction: 'core_course_get_courses',
                    moodlewsrestformat: 'json'
                }),
                {
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded'
                    }
                }
            );

            if (response.data.exception) {
                throw new Error(`Error de Moodle: ${response.data.message}`);
            }

            // Filtrar solo cursos visibles y activos
            const currentTime = Math.floor(Date.now() / 1000);
            return response.data.filter((course: MoodleCourse) =>
                course.visible === 1 &&
                (course.enddate === 0 || course.enddate > currentTime)
            );
        } catch (error) {
            console.error('Error al obtener cursos de Moodle:', error);
            throw new Error('No se pudieron obtener los cursos de Moodle');
        }
    },

    /**
     * Busca un usuario en Moodle por username (documento)
     */
    async getUserByUsername(moodleConfig: MoodleConfig, username: string): Promise<MoodleUser | null> {
        try {
            const response = await axios.post(
                `${moodleConfig.baseUrl}/webservice/rest/server.php`,
                new URLSearchParams({
                    wstoken: moodleConfig.token,
                    wsfunction: 'core_user_get_users',
                    moodlewsrestformat: 'json',
                    'criteria[0][key]': 'username',
                    'criteria[0][value]': username
                }),
                {
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded'
                    }
                }
            );

            if (response.data.exception) {
                throw new Error(`Error de Moodle: ${response.data.message}`);
            }

            return response.data.users && response.data.users.length > 0
                ? response.data.users[0]
                : null;
        } catch (error) {
            console.error('Error al buscar usuario por username en Moodle:', error);
            return null;
        }
    },

    /**
     * Busca un usuario en Moodle por email
     */
    async getUserByEmail(moodleConfig: MoodleConfig, email: string): Promise<MoodleUser | null> {
        try {
            const response = await axios.post(
                `${moodleConfig.baseUrl}/webservice/rest/server.php`,
                new URLSearchParams({
                    wstoken: moodleConfig.token,
                    wsfunction: 'core_user_get_users',
                    moodlewsrestformat: 'json',
                    'criteria[0][key]': 'email',
                    'criteria[0][value]': email
                }),
                {
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded'
                    }
                }
            );

            if (response.data.exception) {
                throw new Error(`Error de Moodle: ${response.data.message}`);
            }

            return response.data.users && response.data.users.length > 0
                ? response.data.users[0]
                : null;
        } catch (error) {
            console.error('Error al buscar usuario por email en Moodle:', error);
            return null;
        }
    },

    /**
     * Crea un nuevo usuario en Moodle
     */
    async createUser(moodleConfig: MoodleConfig, userData: MoodleUser): Promise<MoodleUser> {
        try {
            const params = new URLSearchParams({
                wstoken: moodleConfig.token,
                wsfunction: 'core_user_create_users',
                moodlewsrestformat: 'json',
                'users[0][username]': userData.username,
                'users[0][password]': userData.password || this.generatePassword(),
                'users[0][firstname]': userData.firstname,
                'users[0][lastname]': userData.lastname,
                'users[0][email]': userData.email
            });

            if (userData.phone1) {
                params.append('users[0][phone1]', userData.phone1);
            }
            if (userData.city) {
                params.append('users[0][city]', userData.city);
            }

            const response = await axios.post(
                `${moodleConfig.baseUrl}/webservice/rest/server.php`,
                params,
                {
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded'
                    }
                }
            );

            if (response.data.exception) {
                throw new Error(`Error al crear usuario en Moodle: ${response.data.message}`);
            }

            if (response.data[0] && response.data[0].id) {
                const createdUser = {
                    ...userData,
                    id: response.data[0].id
                };

                // Configurar preferencias de notificación después de crear el usuario
                await this.setUserNotificationPreferences(moodleConfig, response.data[0].id);

                return createdUser;
            }

            throw new Error('No se pudo crear el usuario en Moodle');
        } catch (error) {
            console.error('Error al crear usuario en Moodle:', error);
            throw new Error('No se pudo crear el usuario en Moodle');
        }
    },

    /**
     * Actualiza un usuario existente en Moodle
     */
    async updateUser(moodleConfig: MoodleConfig, userData: MoodleUser): Promise<MoodleUser> {
        try {
            const params = new URLSearchParams({
                wstoken: moodleConfig.token,
                wsfunction: 'core_user_update_users',
                moodlewsrestformat: 'json',
                'users[0][id]': userData.id!.toString(),
                'users[0][firstname]': userData.firstname,
                'users[0][lastname]': userData.lastname,
                'users[0][email]': userData.email
            });

            if (userData.phone1) {
                params.append('users[0][phone1]', userData.phone1);
            }
            if (userData.city) {
                params.append('users[0][city]', userData.city);
            }

            const response = await axios.post(
                `${moodleConfig.baseUrl}/webservice/rest/server.php`,
                params,
                {
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded'
                    }
                }
            );

            if (response.data.exception) {
                throw new Error(`Error al actualizar usuario en Moodle: ${response.data.message}`);
            }

            // Configurar preferencias de notificación después de actualizar el usuario
            await this.setUserNotificationPreferences(moodleConfig, userData.id!);

            return userData;
        } catch (error) {
            console.error('Error al actualizar usuario en Moodle:', error);
            throw new Error('No se pudo actualizar el usuario en Moodle');
        }
    },

    /**
     * NOTA: Las preferencias de notificación (maildigest, autosubscribe, trackforums) 
     * no pueden configurarse a través de la API de Moodle core_user_create_users o core_user_update_users.
     * 
     * Estas preferencias se establecen con los valores por defecto del sistema Moodle:
     * - maildigest: Configurado según el valor por defecto del sitio
     * - autosubscribe: Configurado según el valor por defecto del sitio  
     * - trackforums: Configurado según el valor por defecto del sitio
     * 
     * Para modificar estas preferencias, el usuario debe hacerlo manualmente desde su perfil
     * en Moodle o el administrador debe configurar los valores por defecto en la base de datos.
     */
    async setUserNotificationPreferences(moodleConfig: MoodleConfig, userId: number): Promise<boolean> {
        try {
            const response = await axios.post(
                `${moodleConfig.baseUrl}/webservice/rest/server.php`,
                new URLSearchParams({
                    wstoken: moodleConfig.token,
                    wsfunction: 'core_user_update_user_preferences',
                    moodlewsrestformat: 'json',
                    'userid': userId.toString(),
                    'emailstop': '1' //Incia que deshabilita todas las notificaciones del usuario
                }),
                {
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded'
                    }
                }
            );

            // Verificar si hay una excepción en la respuesta
            if (response.data && response.data.exception) {
                throw new Error(`Error al desactivar las notificaciones del usuario: ${response.data.message}`);
            }

            // Verificar el código de estado HTTP
            if (response.status !== 200) {
                throw new Error(`Error HTTP ${response.status}: No se pudo completar la desactivación de notificaciones`);
            }

            // La API retorna null cuando es exitosa, esto es comportamiento normal
            // Solo verificamos que no haya excepciones y que el status sea 200
            return true;
        } catch (error) {
            console.error('Error al desactivar las notificaciones del usuario:', error);
            if (error instanceof Error) {
                throw error;
            }
            throw new Error('No se pudo desactivar las notificaciones del usuario');
        }
    },

    /**
     * Registra un usuario en un curso de Moodle
     * La API enrol_manual_enrol_users retorna null cuando es exitosa
     * y solo devuelve un valor cuando hay errores
     */
    async enrollUserInCourse(moodleConfig: MoodleConfig, enrollment: MoodleEnrollment): Promise<boolean> {
        try {
            const response = await axios.post(
                `${moodleConfig.baseUrl}/webservice/rest/server.php`,
                new URLSearchParams({
                    wstoken: moodleConfig.token,
                    wsfunction: 'enrol_manual_enrol_users',
                    moodlewsrestformat: 'json',
                    'enrolments[0][roleid]': enrollment.roleid.toString(),
                    'enrolments[0][userid]': enrollment.userid.toString(),
                    'enrolments[0][courseid]': enrollment.courseid.toString()
                }),
                {
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded'
                    }
                }
            );

            // Verificar si hay una excepción en la respuesta
            if (response.data && response.data.exception) {
                throw new Error(`Error al registrar usuario en curso: ${response.data.message}`);
            }

            // Verificar el código de estado HTTP
            if (response.status !== 200) {
                throw new Error(`Error HTTP ${response.status}: No se pudo completar la inscripción`);
            }

            // La API retorna null cuando es exitosa, esto es comportamiento normal
            // Solo verificamos que no haya excepciones y que el status sea 200
            return true;
        } catch (error) {
            console.error('Error al registrar usuario en curso de Moodle:', error);
            if (error instanceof Error) {
                throw error;
            }
            throw new Error('No se pudo registrar el usuario en el curso');
        }
    },

    /**
     * Genera una contraseña segura que cumple con los requisitos de Moodle:
     * - Al menos 8 caracteres
     * - Al menos 1 dígito
     * - Al menos 1 minúscula
     * - Al menos 1 mayúscula
     * - Al menos 1 carácter especial (*, -, #)
     */
    generatePassword(): string {
        const lowercase = 'abcdefghijklmnopqrstuvwxyz';
        const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        const digits = '0123456789';
        const specialChars = '*-#';

        // Garantizar al menos un carácter de cada tipo requerido
        let password = '';
        password += lowercase.charAt(Math.floor(Math.random() * lowercase.length));
        password += uppercase.charAt(Math.floor(Math.random() * uppercase.length));
        password += digits.charAt(Math.floor(Math.random() * digits.length));
        password += specialChars.charAt(Math.floor(Math.random() * specialChars.length));

        // Completar hasta 8 caracteres con caracteres aleatorios
        const allChars = lowercase + uppercase + digits + specialChars;
        for (let i = password.length; i < 8; i++) {
            password += allChars.charAt(Math.floor(Math.random() * allChars.length));
        }

        // Mezclar los caracteres para evitar patrones predecibles
        return password.split('').sort(() => Math.random() - 0.5).join('');
    },

    /**
     * Función principal para crear o actualizar usuario con validaciones estrictas
     * El documento es el username único en Moodle
     * Valida unicidad de email y documento
     */
    async createOrUpdateUserWithValidation(moodleConfig: MoodleConfig, userData: MoodleUser): Promise<MoodleUser> {
        try {
            // 1. Buscar usuario existente por username (documento)
            const existingUserByUsername = await this.getUserByUsername(moodleConfig, userData.username);

            // 2. Buscar usuario existente por email
            const existingUserByEmail = await this.getUserByEmail(moodleConfig, userData.email);

            // 3. Validaciones de unicidad
            if (!existingUserByUsername && existingUserByEmail) {
                // El documento no existe pero el email sí está registrado por otro usuario
                throw new Error(`El correo electrónico ${userData.email} ya está registrado por otro usuario en Moodle`);
            }

            if (existingUserByUsername && existingUserByEmail && existingUserByUsername.id !== existingUserByEmail.id) {
                // El documento existe pero el email pertenece a otro usuario diferente
                throw new Error(`El correo electrónico ${userData.email} ya está registrado por otro usuario en Moodle`);
            }

            // 4. Crear o actualizar usuario
            if (existingUserByUsername) {
                // Usuario existe, actualizar datos
                const updatedUserData = {
                    ...userData,
                    id: existingUserByUsername.id
                };
                return await this.updateUser(moodleConfig, updatedUserData);
            } else {
                // Usuario no existe, crear nuevo
                const newUserData = {
                    ...userData,
                    password: userData.password || this.generatePassword() // Generar password para el correo
                };
                return await this.createUser(moodleConfig, newUserData);
            }

        } catch (error) {
            console.error('Error en createOrUpdateUserWithValidation:', error);
            throw error;
        }
    },

    /**
     * Genera un username único basado en el email
     */
    generateUsername(email: string, documento: string): string {
        const emailPrefix = email.split('@')[0];
        return `${emailPrefix}_${documento}`.toLowerCase().replace(/[^a-z0-9_]/g, '');
    },

    /**
     * Obtiene el progreso de un usuario en un curso específico
     */
    /**
     * Obtiene todos los cursos matriculados de un usuario con su progreso
     * Usa la API core_enrol_get_users_courses que es la correcta para obtener cursos de un usuario específico
     */
    async getUserEnrolledCoursesWithProgress(moodleConfig: MoodleConfig, userId: number): Promise<any[]> {
        try {
            const params = {
                wstoken: moodleConfig.token,
                wsfunction: 'core_enrol_get_users_courses',
                moodlewsrestformat: 'json',
                userid: userId
            };

            const response = await axios.get(`${moodleConfig.baseUrl}/webservice/rest/server.php`, {
                params,
                timeout: 15000
            });

            if (response.data.exception) {
                console.warn(`Error obteniendo cursos matriculados para usuario ${userId}:`, response.data.message);
                return [];
            }

            // La API core_enrol_get_users_courses retorna directamente un array de cursos
            if (Array.isArray(response.data)) {
                // Enriquecer cada curso con información de progreso usando completion API
                const cursosConProgreso = await Promise.all(
                    response.data.map(async (curso: any) => {
                        try {
                            // Obtener el progreso del curso usando la API de completion
                            const progressData = await this.getCourseCompletionStatus(moodleConfig, userId, curso.id);
                            
                            return {
                                ...curso,
                                progress: progressData.progress || 0,
                                hasprogress: true,
                                completed: progressData.completed || false,
                                viewurl: `${moodleConfig.baseUrl}/course/view.php?id=${curso.id}`,
                                coursecategory: curso.categoryname || 'Sin categoría'
                            };
                        } catch (progressError) {
                            console.warn(`Error obteniendo progreso para curso ${curso.id}:`, progressError);
                            return {
                                ...curso,
                                progress: 0,
                                hasprogreso: false,
                                completed: false,
                                viewurl: `${moodleConfig.baseUrl}/course/view.php?id=${curso.id}`,
                                coursecategory: curso.categoryname || 'Sin categoría'
                            };
                        }
                    })
                );
                
                return cursosConProgreso;
            }

            return [];

        } catch (error) {
            console.error(`Error obteniendo cursos matriculados para usuario ${userId}:`, error);
            return [];
        }
    },

    /**
     * Obtiene el estado de completado de un curso específico para un usuario
     */
    async getCourseCompletionStatus(moodleConfig: MoodleConfig, userId: number, courseId: number): Promise<{ progress: number; completed: boolean }> {
        try {
            const params = {
                wstoken: moodleConfig.token,
                wsfunction: 'core_completion_get_course_completion_status',
                moodlewsrestformat: 'json',
                courseid: courseId,
                userid: userId
            };

            const response = await axios.get(`${moodleConfig.baseUrl}/webservice/rest/server.php`, {
                params,
                timeout: 10000
            });

            if (response.data.exception) {
                return { progress: 0, completed: false };
            }

            const completionData = response.data.completionstatus;
            if (completionData) {
                const completed = completionData.completed || false;
                
                // Si está completado, progreso es 100%, sino intentamos calcular
                if (completed) {
                    return { progress: 100, completed: true };
                }
                
                // Intentar obtener progreso detallado de actividades
                try {
                    const activitiesProgress = await this.getActivitiesCompletionStatus(moodleConfig, userId, courseId);
                    return activitiesProgress;
                } catch {
                    return { progress: 0, completed: false };
                }
            }

            return { progress: 0, completed: false };

        } catch (error) {
            console.warn(`Error obteniendo estado de completado para curso ${courseId}:`, error);
            return { progress: 0, completed: false };
        }
    },

    /**
     * Obtiene el progreso detallado de las actividades de un curso
     */
    async getActivitiesCompletionStatus(moodleConfig: MoodleConfig, userId: number, courseId: number): Promise<{ progress: number; completed: boolean }> {
        try {
            const params = {
                wstoken: moodleConfig.token,
                wsfunction: 'core_completion_get_activities_completion_status',
                moodlewsrestformat: 'json',
                courseid: courseId,
                userid: userId
            };

            const response = await axios.get(`${moodleConfig.baseUrl}/webservice/rest/server.php`, {
                params,
                timeout: 10000
            });

            if (response.data.exception || !response.data.statuses) {
                return { progress: 0, completed: false };
            }

            const activities = response.data.statuses;
            if (!Array.isArray(activities) || activities.length === 0) {
                return { progress: 0, completed: false };
            }

            const completedActivities = activities.filter((activity: any) => activity.state === 1 || activity.state === 2);
            const progress = Math.round((completedActivities.length / activities.length) * 100);
            const completed = progress >= 100;

            return { progress, completed };

        } catch (error) {
            console.warn(`Error obteniendo progreso de actividades para curso ${courseId}:`, error);
            return { progress: 0, completed: false };
        }
    },

    /**
     * Obtiene el progreso específico de un usuario en un curso
     * Método optimizado que usa la nueva API
     */
    async getUserCourseProgress(moodleConfig: MoodleConfig, userId: number, courseId: number): Promise<{ progress: number; completed: boolean; courseName?: string }> {
        try {
            const enrolledCourses = await this.getUserEnrolledCoursesWithProgress(moodleConfig, userId);
            
            // Buscar el curso específico en la lista de cursos matriculados
            const course = enrolledCourses.find((course: any) => course.id === courseId);
            
            if (course) {
                const progress = course.progress || 0;
                const completed = progress >= 100;
                
                return {
                    progress,
                    completed,
                    courseName: course.fullname || course.shortname
                };
            }

            // Si no se encuentra el curso, el usuario no está matriculado
            return { progress: 0, completed: false };

        } catch (error) {
            console.error(`Error obteniendo progreso del curso ${courseId} para usuario ${userId}:`, error);
            return { progress: 0, completed: false };
        }
    }
};