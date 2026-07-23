/*
 * ============================================================
 * MODELO INSTITUCIONAL DE ANÁLISIS DE TRAYECTORIAS
 * ============================================================
 *
 * Este archivo concentra los criterios utilizados para:
 *
 * - analizar la situación actual de cada estudiante;
 * - considerar asignaturas pendientes de años anteriores;
 * - detectar dificultades persistentes;
 * - diferenciar persistencia exacta, directa y heredada;
 * - reconocer relaciones amplias dentro de una misma área;
 * - incorporar factores como sobreedad y recursancia;
 * - preparar el futuro diagnóstico institucional;
 * - generar factores explicativos y recomendaciones.
 *
 * IMPORTANTE:
 *
 * Este archivo todavía NO establece las reglas definitivas para
 * clasificar a un estudiante como Favorable, Seguimiento o
 * Prioritario.
 *
 * Esas reglas se incorporarán después de analizar casos reales
 * junto con el equipo de conducción y los docentes.
 * ============================================================
 */

import {
  analizarRelacionAsignaturas,
  TIPOS_RELACION_ASIGNATURAS,
} from "./equivalenciasAsignaturas";

import {
  normalizarTexto,
} from "./utilsTexto";

/*
 * Reexportamos normalizarTexto para mantener compatibilidad
 * con cualquier importación futura que pudiera realizarse desde
 * trayectoriaInstitucional.js.
 */
export { normalizarTexto };

/*
 * ============================================================
 * CATEGORÍAS GENERALES
 * ============================================================
 */

export const CATEGORIAS_TRAYECTORIA = {
  PRIORITARIO: "prioritario",
  SEGUIMIENTO: "seguimiento",
  FAVORABLE: "favorable",
  SIN_REGISTROS: "sinRegistros",
};

export const NIVELES_INSTITUCIONALES = {
  CRITICO: "critico", 
  ALTO: "alto",
  MEDIO: "medio",
  BAJO: "bajo",
  SIN_EVALUACION: "sinEvaluacion",
};

/*
 * ============================================================
 * TIPOS DE PERSISTENCIA
 * ============================================================
 */

export const TIPOS_PERSISTENCIA = {
  EXACTA: TIPOS_RELACION_ASIGNATURAS.EXACTA,
  DIRECTA: TIPOS_RELACION_ASIGNATURAS.DIRECTA,
  HEREDADA: TIPOS_RELACION_ASIGNATURAS.HEREDADA,
};

/*
 * ============================================================
 * FUNCIONES AUXILIARES
 * ============================================================
 */

/**
 * Obtiene el nombre de una asignatura pendiente.
 *
 * Las asignaturas pendientes pueden llegar como texto:
 *
 * "Matemática"
 *
 * o como objeto:
 *
 * {
 *   asignatura: "Matemática",
 *   anio: "4°"
 * }
 *
 * También contempla posibles nombres de propiedades utilizados
 * en otros sectores del sistema.
 */
export function obtenerNombreAsignaturaPendiente(
  pendiente,
) {
  if (typeof pendiente === "string") {
    return pendiente.trim();
  }

  if (!pendiente || typeof pendiente !== "object") {
    return "";
  }

  return String(
    pendiente.asignatura ||
      pendiente.nombre ||
      pendiente.materia ||
      pendiente.nombreAsignatura ||
      pendiente.espacioCurricular ||
      "",
  ).trim();
}

/**
 * Devuelve el conceptual normalizado.
 *
 * Permite trabajar aunque el valor llegue con minúsculas,
 * espacios adicionales u otra variación de escritura.
 */
export function normalizarConceptual(
  conceptual = "",
) {
  return String(conceptual)
    .trim()
    .toUpperCase();
}

/**
 * Determina si un estado conceptual actual requiere analizar
 * posibles antecedentes y persistencias.
 *
 * Solamente TEP y TED requieren esta comprobación.
 */
export function requiereAcompanamientoConceptual(
  conceptual = "",
) {
  const valor =
    normalizarConceptual(conceptual);

  return valor === "TEP" || valor === "TED";
}

/**
 * Función de compatibilidad.
 *
 * Determina si dos asignaturas representan una persistencia
 * válida según el mapa institucional.
 *
 * Devuelve true para:
 *
 * - coincidencia exacta;
 * - coincidencia directa;
 * - coincidencia heredada.
 *
 * Devuelve false cuando solamente pertenecen a una misma área
 * general o cuando no existe relación.
 */
export function coincidenAsignaturas(
  asignaturaActual,
  asignaturaPendiente,
) {
  const relacion =
    analizarRelacionAsignaturas({
      asignaturaActual,
      asignaturaPendiente,
    });

  return relacion.esPersistencia;
}

/*
 * ============================================================
 * ANÁLISIS DE ASIGNATURAS PENDIENTES
 * ============================================================
 */

/**
 * Analiza todas las asignaturas pendientes respecto de una
 * asignatura actual.
 *
 * A diferencia de la versión anterior, no devuelve solamente
 * coincidencias. Conserva también las relaciones de misma área
 * general para poder utilizarlas en diagnósticos futuros.
 */
export function analizarPendientesDeAsignatura({
  asignaturaActual,
  asignaturasPendientes = [],
}) {
  return asignaturasPendientes.map(
    (pendiente) => {
      const nombrePendiente =
        obtenerNombreAsignaturaPendiente(
          pendiente,
        );

      const relacion =
        analizarRelacionAsignaturas({
          asignaturaActual,
          asignaturaPendiente:
            nombrePendiente,
        });

      return {
        pendienteOriginal: pendiente,
        nombrePendiente,
        ...relacion,
      };
    },
  );
}

/**
 * Busca solamente las asignaturas pendientes que constituyen
 * una persistencia válida respecto de la asignatura actual.
 *
 * Incluye:
 *
 * - coincidencia exacta;
 * - coincidencia directa;
 * - coincidencia heredada.
 *
 * No incluye una relación de mera pertenencia al mismo área.
 */
export function obtenerPendientesCoincidentes({
  asignaturaActual,
  asignaturasPendientes = [],
}) {
  return analizarPendientesDeAsignatura({
    asignaturaActual,
    asignaturasPendientes,
  }).filter(
    (analisis) =>
      analisis.esPersistencia,
  );
}

/**
 * Busca asignaturas pendientes que pertenecen al mismo campo
 * general, pero que no constituyen persistencia específica.
 *
 * Ejemplo:
 *
 * Asignatura actual: Historia
 * Pendiente: Geografía
 *
 * Ambas pertenecen a Ciencias Sociales, pero el sistema no debe
 * afirmar automáticamente que representan la misma dificultad.
 */
export function obtenerPendientesMismaArea({
  asignaturaActual,
  asignaturasPendientes = [],
}) {
  return analizarPendientesDeAsignatura({
    asignaturaActual,
    asignaturasPendientes,
  }).filter(
    (analisis) =>
      analisis.tipo ===
      TIPOS_RELACION_ASIGNATURAS.MISMA_AREA,
  );
}

/*
 * ============================================================
 * DETECCIÓN DE PERSISTENCIA
 * ============================================================
 */

/**
 * Detecta persistencia de la dificultad en una asignatura.
 *
 * Existe persistencia cuando:
 *
 * - el estudiante presenta TEP o TED actualmente; y
 * - registra una pendiente con relación exacta, directa
 *   o heredada respecto de esa asignatura.
 *
 * También conserva, por separado, las materias pendientes del
 * mismo área que no deben considerarse persistencia específica.
 */
export function detectarPersistenciaAsignatura({
  asignaturaActual,
  conceptualActual,
  asignaturasPendientes = [],
}) {
  const conceptual =
    normalizarConceptual(
      conceptualActual,
    );

  const requiereAcompanamiento =
    requiereAcompanamientoConceptual(
      conceptual,
    );

  if (!requiereAcompanamiento) {
    return {
      existe: false,
      conceptualActual: conceptual,
      cantidadPendientesCoincidentes: 0,
      pendientesCoincidentes: [],
      cantidadRelacionesMismaArea: 0,
      relacionesMismaArea: [],
      tiposPersistencia: [],
      tienePersistenciaExacta: false,
      tienePersistenciaDirecta: false,
      tienePersistenciaHeredada: false,
    };
  }

  const analisisPendientes =
    analizarPendientesDeAsignatura({
      asignaturaActual,
      asignaturasPendientes,
    });

  const pendientesCoincidentes =
    analisisPendientes.filter(
      (analisis) =>
        analisis.esPersistencia,
    );

  const relacionesMismaArea =
    analisisPendientes.filter(
      (analisis) =>
        analisis.tipo ===
        TIPOS_RELACION_ASIGNATURAS.MISMA_AREA,
    );

  const tiposPersistencia = [
    ...new Set(
      pendientesCoincidentes.map(
        (pendiente) => pendiente.tipo,
      ),
    ),
  ];

  return {
    existe:
      pendientesCoincidentes.length > 0,

    conceptualActual: conceptual,

    cantidadPendientesCoincidentes:
      pendientesCoincidentes.length,

    pendientesCoincidentes,

    cantidadRelacionesMismaArea:
      relacionesMismaArea.length,

    relacionesMismaArea,

    tiposPersistencia,

    tienePersistenciaExacta:
      tiposPersistencia.includes(
        TIPOS_RELACION_ASIGNATURAS.EXACTA,
      ),

    tienePersistenciaDirecta:
      tiposPersistencia.includes(
        TIPOS_RELACION_ASIGNATURAS.DIRECTA,
      ),

    tienePersistenciaHeredada:
      tiposPersistencia.includes(
        TIPOS_RELACION_ASIGNATURAS.HEREDADA,
      ),
  };
}

/*
 * ============================================================
 * RESÚMENES DE PERSISTENCIA
 * ============================================================
 */

/**
 * Resume las persistencias encontradas en el conjunto de
 * asignaturas actuales del estudiante.
 */
export function resumirPersistencias(
  persistencias = [],
) {
  const detectadas =
    persistencias.filter(
      (persistencia) =>
        persistencia.existe,
    );

  const exactas = detectadas.filter(
    (persistencia) =>
      persistencia.tienePersistenciaExacta,
  );

  const directas = detectadas.filter(
    (persistencia) =>
      persistencia.tienePersistenciaDirecta,
  );

  const heredadas = detectadas.filter(
    (persistencia) =>
      persistencia.tienePersistenciaHeredada,
  );

  const asignaturasConPersistencia = [
    ...new Set(
      detectadas
        .map(
          (persistencia) =>
            persistencia.asignatura,
        )
        .filter(Boolean),
    ),
  ];

  return {
    existe: detectadas.length > 0,

    cantidadAsignaturasConPersistencia:
      asignaturasConPersistencia.length,

    asignaturasConPersistencia,

    cantidadPersistenciasExactas:
      exactas.length,

    cantidadPersistenciasDirectas:
      directas.length,

    cantidadPersistenciasHeredadas:
      heredadas.length,

    detalle: detectadas,

    persistenciasDetalladas:
        detectadas,
  };
}

/*
 * ============================================================
 * FACTORES INSTITUCIONALES
 * ============================================================
 */

/**
 * Analiza los factores institucionales conocidos del estudiante.
 *
 * Todavía no asigna puntajes ni modifica automáticamente la
 * categoría final.
 *
 * Primero estamos construyendo el mapa completo y confiable
 * de información.
 */
export function obtenerFactoresInstitucionales({
  asignaturasPendientes = [],
  sobreedad = false,
  recursante = false,
  persistencias = [],
}) {
  const factores = [];

  const cantidadPendientes =
    asignaturasPendientes.length;

  if (cantidadPendientes > 0) {
    factores.push({
      codigo:
        "ASIGNATURAS_PENDIENTES",

      tipo: "antecedente",

      importancia: "a_definir",

      cantidad: cantidadPendientes,

      descripcion: `Registra ${cantidadPendientes} asignatura${
        cantidadPendientes === 1
          ? ""
          : "s"
      } pendiente${
        cantidadPendientes === 1
          ? ""
          : "s"
      } de años anteriores.`,

      detalle: asignaturasPendientes,
    });
  }

  if (sobreedad) {
    factores.push({
      codigo: "SOBREEDAD",
      tipo: "antecedente",
      importancia: "a_definir",
      descripcion:
        "Presenta sobreedad.",
    });
  }

  if (recursante) {
    factores.push({
      codigo: "RECURSANCIA",
      tipo: "antecedente",
      importancia: "a_definir",
      descripcion:
        "Registra condición de recursante.",
    });
  }

  const resumenPersistencias =
    resumirPersistencias(
      persistencias,
    );

  if (resumenPersistencias.existe) {
    factores.push({
      codigo:
        "PERSISTENCIA_DISCIPLINAR",

      tipo: "persistencia",

      importancia: "alta",

      cantidad:
        resumenPersistencias
          .cantidadAsignaturasConPersistencia,

      asignaturas:
        resumenPersistencias
          .asignaturasConPersistencia,

      descripcion:
        resumenPersistencias
          .cantidadAsignaturasConPersistencia ===
        1
          ? `Presenta una dificultad actual vinculada con una asignatura pendiente de años anteriores.`
          : `Presenta dificultades actuales vinculadas con asignaturas pendientes de años anteriores.`,

      detalle:
        resumenPersistencias.detalle,
    });
  }

  if (
    resumenPersistencias
      .cantidadPersistenciasHeredadas > 0
  ) {
    factores.push({
      codigo:
        "PERSISTENCIA_HEREDADA",

      tipo: "persistencia",

      importancia: "alta",

      descripcion:
        "Se detectaron dificultades actuales vinculadas con antecedentes de espacios curriculares generales cursados en años anteriores.",

      detalle:
        persistencias.filter(
          (persistencia) =>
            persistencia
              .tienePersistenciaHeredada,
        ),
    });
  }

  const relacionesMismaArea =
    persistencias.filter(
      (persistencia) =>
        persistencia
          .cantidadRelacionesMismaArea > 0,
    );

  if (relacionesMismaArea.length > 0) {
    factores.push({
      codigo:
        "ANTECEDENTES_MISMA_AREA",

      tipo:
        "antecedente_relacionado",

      importancia:
        "informativa",

      descripcion:
        "Registra asignaturas pendientes pertenecientes al mismo campo de conocimiento, aunque no constituyen una persistencia específica.",

      detalle:
        relacionesMismaArea,
    });
  }

  return factores;
}

/*
 * ============================================================
 * EVALUACIÓN INTEGRAL DEL ESTUDIANTE
 * ============================================================
 */

/**
 * Estructura principal del futuro diagnóstico institucional.
 *
 * Actualmente:
 *
 * - recibe la información disponible;
 * - calcula los estados TEA, TEP y TED;
 * - identifica asignaturas pendientes;
 * - detecta persistencias;
 * - diferencia coincidencias exactas, directas y heredadas;
 * - reconoce antecedentes relacionados por área;
 * - incorpora sobreedad y recursancia;
 * - devuelve una estructura uniforme.
 *
 * Las reglas definitivas de clasificación se incorporarán
 * después de validar casos reales.
 */
export function evaluarTrayectoriaAlumno({
  alumno,
  desempenoActual = [],
  asignaturasPendientes = [],
  sobreedad = false,
  recursante = false,
}) {
  const desempenosNormalizados =
    desempenoActual.map((item) => ({
      ...item,

      conceptual:
        normalizarConceptual(
          item.conceptual,
        ),

      asignatura:
        String(
          item.asignatura || "",
        ).trim(),
    }));

  const tea =
    desempenosNormalizados.filter(
      (item) =>
        item.conceptual === "TEA",
    ).length;

  const tep =
    desempenosNormalizados.filter(
      (item) =>
        item.conceptual === "TEP",
    ).length;

  const ted =
    desempenosNormalizados.filter(
      (item) =>
        item.conceptual === "TED",
    ).length;

  const totalCargados =
    tea + tep + ted;

  const totalSinCargar =
    desempenosNormalizados.filter(
      (item) => !item.conceptual,
    ).length;

  const persistencias =
    desempenosNormalizados.map(
      (item) => ({
        asignatura:
          item.asignatura,

        conceptual:
          item.conceptual,

        ...detectarPersistenciaAsignatura({
          asignaturaActual:
            item.asignatura,

          conceptualActual:
            item.conceptual,

          asignaturasPendientes,
        }),
      }),
    );

  const resumenPersistencias =
    resumirPersistencias(
      persistencias,
    );

  const factores =
    obtenerFactoresInstitucionales({
      asignaturasPendientes,
      sobreedad,
      recursante,
      persistencias,
    });

  /*
   * Clasificación provisoria.
   *
   * No definimos todavía las reglas definitivas porque serán
   * construidas a partir del análisis de cursos y estudiantes
   * reales.
   */
  const categoria =
    totalCargados === 0
      ? CATEGORIAS_TRAYECTORIA
          .SIN_REGISTROS
      : null;

  const nivelInstitucional =
    totalCargados === 0
      ? NIVELES_INSTITUCIONALES
          .SIN_EVALUACION
      : null;

  return {
    alumno,

    situacionActual: {
      tea,
      tep,
      ted,
      totalCargados,
      totalSinCargar,
      desempenos:
        desempenosNormalizados,
    },

    antecedentes: {
      asignaturasPendientes,

      cantidadAsignaturasPendientes:
        asignaturasPendientes.length,

      sobreedad,

      recursante,
    },

    persistencias,

    resumenPersistencias,

    factores,

    diagnostico: {
      categoria,

      nivelInstitucional,

      /*
       * Se completarán cuando definamos los criterios
       * institucionales definitivos.
       */
      titulo: null,

      descripcion: null,

      recomendaciones: [],
    },
  };
}