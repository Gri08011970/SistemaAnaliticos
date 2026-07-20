/*
 * ============================================================
 * EQUIVALENCIAS, ÁREAS Y TRAYECTORIAS DISCIPLINARES
 * ============================================================
 *
 * Este archivo describe las relaciones pedagógicas existentes
 * entre las asignaturas del plan de estudios.
 *
 * NO determina riesgo.
 * NO genera diagnósticos.
 * NO clasifica estudiantes.
 *
 * Su responsabilidad es responder:
 *
 * - ¿A qué área general pertenece una asignatura?
 * - ¿A qué trayectoria específica pertenece?
 * - ¿Dos asignaturas representan una continuidad directa?
 * - ¿Una asignatura actual hereda antecedentes de otra anterior?
 * - ¿Qué tipo de relación existe entre dos asignaturas?
 *
 * TIPOS DE RELACIÓN
 *
 * 1. EXACTA
 *    Mismo nombre de asignatura.
 *
 * 2. DIRECTA
 *    Distinto nombre, pero misma trayectoria disciplinar.
 *
 *    Ejemplo:
 *    Matemática ↔ Matemática Ciclo Superior.
 *
 * 3. HEREDADA
 *    La asignatura actual continúa un espacio más general
 *    o integrado cursado en años anteriores.
 *
 *    Ejemplo:
 *    Historia actual ← Ciencias Sociales pendiente.
 *
 * 4. MISMA_AREA
 *    Pertenecen a la misma área general, pero no existe evidencia
 *    suficiente para afirmar que representan la misma dificultad.
 *
 *    Ejemplo:
 *    Historia actual y Geografía pendiente.
 *
 * ============================================================
 */

import {
  compararTextos,
  normalizarTexto,
} from "./utilsTexto";

/*
 * ============================================================
 * TIPOS DE RELACIÓN
 * ============================================================
 */

export const TIPOS_RELACION_ASIGNATURAS = {
  EXACTA: "exacta",
  DIRECTA: "directa",
  HEREDADA: "heredada",
  MISMA_AREA: "misma_area",
  NINGUNA: "ninguna",
};

/*
 * ============================================================
 * ÁREAS GENERALES
 * ============================================================
 *
 * Las áreas generales agrupan espacios pertenecientes a un mismo
 * campo de conocimiento.
 *
 * Compartir un área general NO significa automáticamente que dos
 * asignaturas representen la misma dificultad específica.
 *
 * Ejemplo:
 *
 * Historia y Geografía pertenecen a Ciencias Sociales,
 * pero un TEP en Historia y una previa de Geografía no deben
 * considerarse automáticamente una persistencia en Historia.
 */

export const AREAS_GENERALES = {
  MATEMATICA: [
    "Matemática",
    "Matemática Ciclo Superior",
  ],

  LENGUA_Y_LITERATURA: [
    "Prácticas del Lenguaje",
    "Literatura",
  ],

  CIENCIAS_SOCIALES: [
    "Ciencias Sociales",
    "Historia",
    "Geografía",
  ],

  CIENCIAS_NATURALES: [
    "Ciencias Naturales",
    "Biología",
    "Fisicoquímica",
    "Introducción a la Física",
    "Introducción a la Química",
  ],

  LENGUAS_EXTRANJERAS: [
    "Inglés",
  ],

  EDUCACION_FISICA: [
    "Educación Física",
  ],

  CIUDADANIA: [
    "Construcción de Ciudadanía",
    "Política y Ciudadanía",
    "Trabajo y Ciudadanía",
  ],

  ARTE: [
    "Educación Artística",
    "Producción y análisis de la imagen",
    "Imagen y nuevos medios",
    "Imagen y procedimientos constructivos",
    "Proyecto de producción en artes visuales",
    "Arte-Leng. Danza",
    "Lenguaje Complementario",
  ],

  SALUD: [
    "Salud y Adolescencia",
  ],

  TECNOLOGIA: [
    "NTICX",
  ],

  FILOSOFIA: [
    "Filosofía",
  ],
};

/*
 * ============================================================
 * TRAYECTORIAS DISCIPLINARES ESPECÍFICAS
 * ============================================================
 *
 * Cada trayectoria contiene:
 *
 * - areaGeneral:
 *   Campo amplio al que pertenece.
 *
 * - asignaturas:
 *   Espacios considerados continuidad directa entre sí.
 *
 * - antecedentesComunes:
 *   Espacios anteriores o más generales cuya deuda puede indicar
 *   una dificultad heredada en la asignatura actual.
 *
 * IMPORTANTE:
 *
 * Los antecedentes comunes se interpretan de forma direccional.
 *
 * Ejemplo:
 *
 * Asignatura actual: Historia
 * Pendiente anterior: Ciencias Sociales
 *
 * Resultado: coincidencia heredada.
 *
 * En cambio:
 *
 * Asignatura actual: Historia
 * Pendiente anterior: Geografía
 *
 * Resultado: misma área general, pero no persistencia específica.
 */

export const TRAYECTORIAS_DISCIPLINARES = {
  MATEMATICA: {
    areaGeneral: "MATEMATICA",

    asignaturas: [
      "Matemática",
      "Matemática Ciclo Superior",
    ],

    antecedentesComunes: [],
  },

  LENGUA_Y_LITERATURA: {
    areaGeneral: "LENGUA_Y_LITERATURA",

    asignaturas: [
      "Prácticas del Lenguaje",
      "Literatura",
    ],

    antecedentesComunes: [],
  },

  HISTORIA: {
    areaGeneral: "CIENCIAS_SOCIALES",

    asignaturas: [
      "Historia",
    ],

    antecedentesComunes: [
      "Ciencias Sociales",
    ],
  },

  GEOGRAFIA: {
    areaGeneral: "CIENCIAS_SOCIALES",

    asignaturas: [
      "Geografía",
    ],

    antecedentesComunes: [
      "Ciencias Sociales",
    ],
  },

  BIOLOGIA: {
    areaGeneral: "CIENCIAS_NATURALES",

    asignaturas: [
      "Biología",
    ],

    antecedentesComunes: [
      "Ciencias Naturales",
    ],
  },

  FISICOQUIMICA: {
    areaGeneral: "CIENCIAS_NATURALES",

    asignaturas: [
      "Fisicoquímica",
    ],

    antecedentesComunes: [
      "Ciencias Naturales",
    ],
  },

  FISICA: {
    areaGeneral: "CIENCIAS_NATURALES",

    asignaturas: [
      "Introducción a la Física",
    ],

    antecedentesComunes: [
      "Ciencias Naturales",
      "Fisicoquímica",
    ],
  },

  QUIMICA: {
    areaGeneral: "CIENCIAS_NATURALES",

    asignaturas: [
      "Introducción a la Química",
    ],

    antecedentesComunes: [
      "Ciencias Naturales",
      "Fisicoquímica",
    ],
  },

  INGLES: {
    areaGeneral: "LENGUAS_EXTRANJERAS",

    asignaturas: [
      "Inglés",
    ],

    antecedentesComunes: [],
  },

  EDUCACION_FISICA: {
    areaGeneral: "EDUCACION_FISICA",

    asignaturas: [
      "Educación Física",
    ],

    antecedentesComunes: [],
  },

  CIUDADANIA: {
    areaGeneral: "CIUDADANIA",

    asignaturas: [
      "Construcción de Ciudadanía",
      "Política y Ciudadanía",
      "Trabajo y Ciudadanía",
    ],

    antecedentesComunes: [],
  },

  SALUD_Y_ADOLESCENCIA: {
    areaGeneral: "SALUD",

    asignaturas: [
      "Salud y Adolescencia",
    ],

    antecedentesComunes: [],
  },

  NTICX: {
    areaGeneral: "TECNOLOGIA",

    asignaturas: [
      "NTICX",
    ],

    antecedentesComunes: [],
  },

  FILOSOFIA: {
    areaGeneral: "FILOSOFIA",

    asignaturas: [
      "Filosofía",
    ],

    antecedentesComunes: [],
  },

  ARTES_VISUALES: {
    areaGeneral: "ARTE",

    asignaturas: [
      "Producción y análisis de la imagen",
      "Imagen y nuevos medios",
      "Imagen y procedimientos constructivos",
      "Proyecto de producción en artes visuales",
    ],

    antecedentesComunes: [
      "Educación Artística",
    ],
  },

  DANZA: {
    areaGeneral: "ARTE",

    asignaturas: [
      "Arte-Leng. Danza",
    ],

    antecedentesComunes: [
      "Educación Artística",
    ],
  },

  LENGUAJE_COMPLEMENTARIO: {
    areaGeneral: "ARTE",

    asignaturas: [
      "Lenguaje Complementario",
    ],

    antecedentesComunes: [
      "Educación Artística",
    ],
  },

  EDUCACION_ARTISTICA_GENERAL: {
    areaGeneral: "ARTE",

    asignaturas: [
      "Educación Artística",
    ],

    antecedentesComunes: [],
  },
};

/*
 * ============================================================
 * FUNCIONES DE BÚSQUEDA
 * ============================================================
 */

/**
 * Devuelve el código del área general de una asignatura.
 *
 * Ejemplos:
 *
 * "Historia"
 * → "CIENCIAS_SOCIALES"
 *
 * "Introducción a la Física"
 * → "CIENCIAS_NATURALES"
 */
export function obtenerAreaGeneral(asignatura = "") {
  const buscada = normalizarTexto(asignatura);

  if (!buscada) {
    return null;
  }

  for (const [area, asignaturas] of Object.entries(
    AREAS_GENERALES,
  )) {
    const encontrada = asignaturas.some(
      (materia) =>
        normalizarTexto(materia) === buscada,
    );

    if (encontrada) {
      return area;
    }
  }

  return null;
}

/**
 * Devuelve el código de la trayectoria disciplinar específica.
 *
 * Ejemplos:
 *
 * "Matemática Ciclo Superior"
 * → "MATEMATICA"
 *
 * "Historia"
 * → "HISTORIA"
 */
export function obtenerTrayectoriaDisciplinar(
  asignatura = "",
) {
  const buscada = normalizarTexto(asignatura);

  if (!buscada) {
    return null;
  }

  for (const [trayectoria, configuracion] of Object.entries(
    TRAYECTORIAS_DISCIPLINARES,
  )) {
    const encontrada = configuracion.asignaturas.some(
      (materia) =>
        normalizarTexto(materia) === buscada,
    );

    if (encontrada) {
      return trayectoria;
    }
  }

  return null;
}

/**
 * Devuelve la configuración completa de una trayectoria.
 */
export function obtenerConfiguracionTrayectoria(
  trayectoria,
) {
  return (
    TRAYECTORIAS_DISCIPLINARES[trayectoria] ||
    null
  );
}

/**
 * Devuelve todas las asignaturas pertenecientes
 * a un área general.
 */
export function obtenerAsignaturasDelAreaGeneral(
  area,
) {
  return AREAS_GENERALES[area] || [];
}

/**
 * Devuelve las asignaturas consideradas continuidad directa
 * dentro de una trayectoria específica.
 */
export function obtenerAsignaturasDeTrayectoria(
  trayectoria,
) {
  return (
    TRAYECTORIAS_DISCIPLINARES[trayectoria]
      ?.asignaturas || []
  );
}

/**
 * Devuelve los antecedentes comunes configurados
 * para una trayectoria específica.
 */
export function obtenerAntecedentesComunes(
  trayectoria,
) {
  return (
    TRAYECTORIAS_DISCIPLINARES[trayectoria]
      ?.antecedentesComunes || []
  );
}

/*
 * ============================================================
 * COMPARACIONES
 * ============================================================
 */

/**
 * Indica si los nombres de las asignaturas coinciden exactamente
 * después de ser normalizados.
 *
 * Ejemplo:
 *
 * "Matemática"
 * "matematica"
 *
 * → true
 */
export function existeCoincidenciaExacta(
  asignaturaActual,
  asignaturaPendiente,
) {
  return compararTextos(
    asignaturaActual,
    asignaturaPendiente,
  );
}

/**
 * Indica si dos asignaturas pertenecen a la misma trayectoria
 * disciplinar específica.
 *
 * Incluye las coincidencias exactas.
 *
 * Ejemplo:
 *
 * "Matemática Ciclo Superior"
 * "Matemática"
 *
 * → true
 */
export function existeCoincidenciaDirecta(
  asignaturaActual,
  asignaturaPendiente,
) {
  const trayectoriaActual =
    obtenerTrayectoriaDisciplinar(
      asignaturaActual,
    );

  const trayectoriaPendiente =
    obtenerTrayectoriaDisciplinar(
      asignaturaPendiente,
    );

  if (
    !trayectoriaActual ||
    !trayectoriaPendiente
  ) {
    return false;
  }

  return (
    trayectoriaActual ===
    trayectoriaPendiente
  );
}

/**
 * Indica si una asignatura pendiente representa un antecedente
 * común de la trayectoria actual.
 *
 * Esta comparación es DIRECCIONAL.
 *
 * Ejemplo:
 *
 * Actual: Historia
 * Pendiente: Ciencias Sociales
 *
 * → true
 *
 * Actual: Historia
 * Pendiente: Geografía
 *
 * → false
 */
export function existeCoincidenciaHeredada(
  asignaturaActual,
  asignaturaPendiente,
) {
  const trayectoriaActual =
    obtenerTrayectoriaDisciplinar(
      asignaturaActual,
    );

  if (!trayectoriaActual) {
    return false;
  }

  const antecedentes =
    obtenerAntecedentesComunes(
      trayectoriaActual,
    );

  return antecedentes.some((antecedente) =>
    compararTextos(
      antecedente,
      asignaturaPendiente,
    ),
  );
}

/**
 * Indica si dos asignaturas pertenecen a la misma área general.
 *
 * Esta relación por sí sola NO debe utilizarse para declarar
 * persistencia disciplinar.
 */
export function pertenecenMismaAreaGeneral(
  asignaturaA,
  asignaturaB,
) {
  const areaA =
    obtenerAreaGeneral(asignaturaA);

  const areaB =
    obtenerAreaGeneral(asignaturaB);

  if (!areaA || !areaB) {
    return false;
  }

  return areaA === areaB;
}

/**
 * Indica si una asignatura pertenece a un área general.
 */
export function perteneceAlAreaGeneral(
  asignatura,
  area,
) {
  return (
    obtenerAreaGeneral(asignatura) === area
  );
}

/*
 * ============================================================
 * ANÁLISIS COMPLETO DE LA RELACIÓN
 * ============================================================
 */

/**
 * Analiza qué relación existe entre una asignatura actual
 * y una asignatura pendiente de años anteriores.
 *
 * Orden de prioridad:
 *
 * 1. Coincidencia exacta.
 * 2. Coincidencia directa.
 * 3. Coincidencia heredada.
 * 4. Misma área general.
 * 5. Ninguna relación.
 */
export function analizarRelacionAsignaturas({
  asignaturaActual,
  asignaturaPendiente,
}) {
  const areaActual =
    obtenerAreaGeneral(asignaturaActual);

  const areaPendiente =
    obtenerAreaGeneral(
      asignaturaPendiente,
    );

  const trayectoriaActual =
    obtenerTrayectoriaDisciplinar(
      asignaturaActual,
    );

  const trayectoriaPendiente =
    obtenerTrayectoriaDisciplinar(
      asignaturaPendiente,
    );

  if (
    existeCoincidenciaExacta(
      asignaturaActual,
      asignaturaPendiente,
    )
  ) {
    return {
      coincide: true,
      tipo:
        TIPOS_RELACION_ASIGNATURAS.EXACTA,
      esPersistencia: true,
      asignaturaActual,
      asignaturaPendiente,
      areaActual,
      areaPendiente,
      trayectoriaActual,
      trayectoriaPendiente,
      descripcion:
        "La asignatura actual coincide exactamente con la asignatura pendiente.",
    };
  }

  if (
    existeCoincidenciaDirecta(
      asignaturaActual,
      asignaturaPendiente,
    )
  ) {
    return {
      coincide: true,
      tipo:
        TIPOS_RELACION_ASIGNATURAS.DIRECTA,
      esPersistencia: true,
      asignaturaActual,
      asignaturaPendiente,
      areaActual,
      areaPendiente,
      trayectoriaActual,
      trayectoriaPendiente,
      descripcion:
        "La asignatura actual y la pendiente pertenecen a la misma trayectoria disciplinar.",
    };
  }

  if (
    existeCoincidenciaHeredada(
      asignaturaActual,
      asignaturaPendiente,
    )
  ) {
    return {
      coincide: true,
      tipo:
        TIPOS_RELACION_ASIGNATURAS.HEREDADA,
      esPersistencia: true,
      asignaturaActual,
      asignaturaPendiente,
      areaActual,
      areaPendiente,
      trayectoriaActual,
      trayectoriaPendiente,
      descripcion:
        "La asignatura pendiente constituye un antecedente común de la trayectoria actual.",
    };
  }

  if (
    pertenecenMismaAreaGeneral(
      asignaturaActual,
      asignaturaPendiente,
    )
  ) {
    return {
      coincide: true,
      tipo:
        TIPOS_RELACION_ASIGNATURAS.MISMA_AREA,
      esPersistencia: false,
      asignaturaActual,
      asignaturaPendiente,
      areaActual,
      areaPendiente,
      trayectoriaActual,
      trayectoriaPendiente,
      descripcion:
        "Las asignaturas pertenecen a la misma área general, pero no representan necesariamente la misma dificultad específica.",
    };
  }

  return {
    coincide: false,
    tipo:
      TIPOS_RELACION_ASIGNATURAS.NINGUNA,
    esPersistencia: false,
    asignaturaActual,
    asignaturaPendiente,
    areaActual,
    areaPendiente,
    trayectoriaActual,
    trayectoriaPendiente,
    descripcion:
      "No se encontró una relación disciplinar configurada entre las asignaturas.",
  };
}

/*
 * ============================================================
 * FUNCIONES DE COMPATIBILIDAD
 * ============================================================
 *
 * Conservamos estos nombres para evitar problemas si algún
 * componente futuro utiliza la versión anterior del archivo.
 */

/**
 * Alias compatible con el nombre utilizado anteriormente.
 */
export function obtenerAreaDisciplinar(
  asignatura = "",
) {
  return obtenerAreaGeneral(asignatura);
}

/**
 * Alias compatible con el nombre utilizado anteriormente.
 */
export function obtenerAsignaturasDelArea(
  area,
) {
  return obtenerAsignaturasDelAreaGeneral(
    area,
  );
}

/**
 * En la versión anterior significaba compartir área.
 * Se conserva ese comportamiento.
 */
export function pertenecenMismaArea(
  asignaturaA,
  asignaturaB,
) {
  return pertenecenMismaAreaGeneral(
    asignaturaA,
    asignaturaB,
  );
}

/**
 * Alias compatible con el nombre utilizado anteriormente.
 */
export function perteneceAlArea(
  asignatura,
  area,
) {
  return perteneceAlAreaGeneral(
    asignatura,
    area,
  );
}

/**
 * Alias temporal para mantener compatibilidad con el nombre
 * anterior de la constante.
 */
export const AREAS_DISCIPLINARES =
  AREAS_GENERALES;