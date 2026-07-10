export const ESTADOS_CONCEPTUALES = [
  {
    valor: "TEA",
    etiqueta: "TEA",
    descripcion: "Trayectoria Educativa Avanzada",
    color: "verde",
  },
  {
    valor: "TEP",
    etiqueta: "TEP",
    descripcion: "Trayectoria Educativa en Proceso",
    color: "amarillo",
  },
  {
    valor: "TED",
    etiqueta: "TED",
    descripcion: "Trayectoria Educativa Discontinua",
    color: "rojo",
  },
  {
    valor: "",
    etiqueta: "-",
    descripcion: "Sin cargar",
    color: "gris",
  },
];

export const PERIODOS_SEGUIMIENTO = [
  "Mayo",
  "1° cuatrimestre",
  "Informe octubre",
  "2° cuatrimestre",
  "Diciembre",
  "Febrero",
  "Marzo",
];

export const ASIGNATURAS_1ER_ANIO = [
  "Prácticas del Lenguaje",
  "Matemática",
  "Ciencias Sociales",
  "Ciencias Naturales",
  "Inglés",
  "Educación Artística",
  "Educación Física",
  "Construcción de Ciudadanía",
];
export const ASIGNATURAS_1 = [
  "Prácticas del Lenguaje",
  "Matemática",
  "Ciencias Sociales",
  "Ciencias Naturales",
  "Inglés",
  "Educación Artística",
  "Educación Física",
  "Construcción de Ciudadanía",
];

export const ASIGNATURAS_2_3 = [
  "Prácticas del Lenguaje",
  "Matemática",
  "Historia",
  "Geografía",
  "Biología",
  "Fisicoquímica",
  "Inglés",
  "Educación Artística",
  "Educación Física",
  "Construcción de Ciudadanía",
];

export const ASIGNATURAS_4 = [
  "Literatura",
  "Matemática Ciclo Superior",
  "Historia",
  "Geografía",
  "Biología",
  "Introducción a la Física",
  "Introducción a la Química",
  "NTICX",
  "Salud y Adolescencia",
  "Inglés",
  "Educación Física",
  "Producción y Análisis de Imágenes",
];

export const ASIGNATURAS_5 = [
  "Literatura",
  "Matemática Ciclo Superior",
  "Historia",
  "Geografía",
  "Política y Ciudadanía",
  "Inglés",
  "Educación Física",
  "Imagen y Nuevos Medios",
  "Art. Leng. Danza",
];

export const ASIGNATURAS_6 = [
  "Literatura",
  "Matemática Ciclo Superior",
  "Historia",
  "Geografía",
  "Inglés",
  "Educación Física",
  "Imagen y Procedimientos Constructivos",
  "Art. Leng. Danza",
];

export function obtenerAsignaturasPorCurso(curso) {
  if (curso.startsWith("1°")) return ASIGNATURAS_1;
  if (curso.startsWith("2°") || curso.startsWith("3°")) return ASIGNATURAS_2_3;
  if (curso.startsWith("4°")) return ASIGNATURAS_4;
  if (curso.startsWith("5°")) return ASIGNATURAS_5;
  if (curso.startsWith("6°")) return ASIGNATURAS_6;

  return [];
}