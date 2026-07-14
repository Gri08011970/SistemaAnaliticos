export const ESTADOS_CONCEPTUALES = [
  {
    valor: "TEA",
    etiqueta: "TEA",
    descripcion: "Trayectoria Educativa Avanzada",
    color: "azul",
  },
  {
    valor: "TEP",
    etiqueta: "TEP",
    descripcion: "Trayectoria Educativa en Proceso",
    color: "verde",
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

export const COLORES_SEGUIMIENTO = {
  "-": {
    fondo: "#ececec",
    fondoClaro: "#f3f4f6",
    texto: "#666666",
  },

  TEA: {
    fondo: "#4DA3FF",
    fondoClaro: "#B9DCFF",
    texto: "#0B3D91",
  },

  TEP: {
    fondo: "#6DDC6D",
    fondoClaro: "#C9F3C9",
    texto: "#1B5E20",
  },

  TED: {
    fondo: "#FF6B6B",
    fondoClaro: "#FFD0D0",
    texto: "#8B0000",
  },
};

export const PERIODOS_SEGUIMIENTO = [
  "Mayo",
  "1° cuatrimestre",
  "Informe octubre",
  "2° cuatrimestre",
  "Diciembre",
  "Febrero",
  "Marzo",
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
  "Matemática Ciclo Superior",
  "Literatura",
  "Educación Física",
  "Inglés",
  "Salud y Adolescencia",
  "Introducción a la Física",
  "Historia",
  "Geografía",
  "Biología",
  "NTICX",
  "Producción y análisis de la imagen",
];

export const ASIGNATURAS_5 = [
  "Matemática Ciclo Superior",
  "Literatura",
  "Educación Física",
  "Inglés",
  "Política y Ciudadanía",
  "Introducción a la Química",
  "Historia",
  "Geografía",
  "Imagen y nuevos medios",
  "Imagen y procedimientos constructivos",
  "Lenguaje Complementario",
];

export const ASIGNATURAS_6 = [
  "Matemática Ciclo Superior",
  "Literatura",
  "Educación Física",
  "Inglés",
  "Trabajo y Ciudadanía",
  "Historia",
  "Filosofía",
  "Proyecto de producción en artes visuales",
  "Arte-Leng. Danza",
];

export function obtenerAsignaturasPorCurso(curso = "") {
  if (curso.startsWith("1°")) {
    return ASIGNATURAS_1;
  }

  if (curso.startsWith("2°") || curso.startsWith("3°")) {
    return ASIGNATURAS_2_3;
  }

  if (curso.startsWith("4°")) {
    return ASIGNATURAS_4;
  }

  if (curso.startsWith("5°")) {
    return ASIGNATURAS_5;
  }

  if (curso.startsWith("6°")) {
    return ASIGNATURAS_6;
  }

  return [];
}