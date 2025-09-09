import { FormData, Field } from '@/types/formularioGenerar';
import { FormDataReport, FieldReport } from '@/types/reporteDinamico';

export const transformFormData = (formData: FormData | FormDataReport, fields: Field[]) => {
  const groupedData: Record<string, Record<string, any>> = {}; // Objeto para almacenar los datos agrupados

  fields.forEach((field) => {
    const value = formData[field.id];

    // Transformar campos de tipo "dropdown"
    if (field.type === 'dropdown' && value && typeof value === 'object' && 'code' in value) {
      formData[field.id] = value.code; // Extraer solo el valor de "code"
    }

    // Transformar campos de tipo "currency"
    if (field.validation === 'currency' && typeof value === 'string') {
      formData[field.id] = value.replace(/\D/g, ''); // Eliminar el formato de moneda
    }

    // Transformar campos de tipo "currency"
    if (field.type === 'calendar' && value) {
      formData[field.id] = formatoFecha(value as Date); // Eliminar el formato de moneda
    }

    // Agrupar los campos según la propiedad "group"
    if (field.group) {
      if (!groupedData[field.group]) {
        groupedData[field.group] = {}; // Crear el grupo si no existe
      }
      groupedData[field.group][field.id] = formData[field.id]; // Agregar el campo al grupo
    }
  });

  return groupedData;
};

export const concatFields = (formData: FormData | FormDataReport, fields: FieldReport[]) => {
  var concat = ''
  fields.forEach((field) => {
    const value = formData[field.id];
    if (field.concat) {
      concat != '' ? concat += '_' : null
      // Transformar campos de tipo "fecha"
      if (field.type === 'calendar' && value) {
        if (typeof value === 'string') {
          concat += value
        } else {
          concat += formatoFecha(value as Date)
        }

      } else {
        concat += value
      }
    }
  });

  return concat;
};

function formatoFecha(fecha: any) {
  if (!(fecha instanceof Date)) {
    fecha = new Date(fecha); // Convertir a Date si no lo es
  }
  // Obtener los componentes de la fecha (año, mes y día)
  var año = fecha.getFullYear();
  var mes = ('0' + (fecha.getMonth() + 1)).slice(-2); // Agregar cero inicial si el mes es menor a 10
  var día = ('0' + fecha.getDate()).slice(-2); // Agregar cero inicial si el día es menor a 10
  // Formatear la fecha en el formato "yyyy-MM-dd"
  var fechaFormateada = año + '-' + mes + '-' + día;
  return fechaFormateada;
}