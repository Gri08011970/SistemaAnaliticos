/*
 * ============================================================
 * CRITERIOS INSTITUCIONALES DE ANÁLISIS DE TRAYECTORIAS
 * ============================================================
 *
 * Este archivo contiene los criterios configurables utilizados
 * para interpretar institucionalmente la trayectoria de un
 * estudiante.
 *
 * ETAPA 1
 *
 * En esta primera versión:
 *
 * - definimos pesos institucionales;
 * - definimos umbrales;
 * - calculamos un puntaje explicable;
 * - determinamos un nivel institucional;
 * - devolvemos el detalle completo del cálculo.
 *
 * TODAVÍA NO:
 *
 * - asignamos categoría Favorable, Seguimiento o Prioritario;
 * - generamos justificaciones narrativas;
 * - generamos recomendaciones;
 * - aplicamos decisiones automáticas definitivas.
 *
 * Los valores actuales son PROVISORIOS y podrán modificarse
 * después de analizar casos reales con el equipo institucional.
 * ============================================================
 */

import {
   CATEGORIAS_TRAYECTORIA,
  NIVELES_INSTITUCIONALES,
} from "./trayectoriaInstitucional";

import {
  TIPOS_RELACION_ASIGNATURAS,
} from "./equivalenciasAsignaturas";

/*
 * ============================================================
 * PESOS INSTITUCIONALES
 * ============================================================
 *
 * Cada factor suma una cantidad determinada de puntos.
 *
 * La finalidad del puntaje no es etiquetar al estudiante,
 * sino ordenar señales institucionales de manera transparente.
 *
 * Ningún número queda escondido dentro de las funciones:
 * todos los valores pueden revisarse desde este bloque.
 */

export const PESOS_INSTITUCIONALES = {
  /*
   * Situación actual
   */
  TEP_ACTUAL: 1,
  TED_ACTUAL: 3,

  /*
   * Antecedentes
   */
  ASIGNATURA_PENDIENTE: 1,
  SOBREEDAD: 1,
  RECURSANCIA: 2,

  /*
   * Persistencias
   */
  PERSISTENCIA_EXACTA: 3,
  PERSISTENCIA_DIRECTA: 3,
  PERSISTENCIA_HEREDADA: 2,

  /*
   * Relación informativa dentro de la misma área.
   *
   * Por ahora no suma puntaje porque no constituye por sí sola
   * una persistencia específica.
   */
  RELACION_MISMA_AREA: 0,
};

/*
 * ============================================================
 * UMBRALES DE NIVEL INSTITUCIONAL
 * ============================================================
 *
 * Estos valores son provisorios.
 *
 * Puntaje:
 *
 * 0 a 2   → BAJO
 * 3 a 5   → MEDIO
 * 6 a 9   → ALTO
 * 10 o más → CRÍTICO
 */

export const UMBRALES_NIVEL_INSTITUCIONAL = {
  BAJO_DESDE: 0,
  MEDIO_DESDE: 3,
  ALTO_DESDE: 6,
  CRITICO_DESDE: 10,
};

/*
 * ============================================================
 * UTILIDADES BÁSICAS
 * ============================================================
 */

/**
 * Convierte cualquier valor numérico válido en un número seguro.
 *
 * Evita que null, undefined, strings inválidos o valores negativos
 * alteren accidentalmente el cálculo.
 */
export function obtenerCantidadSegura(
  valor,
) {
  const numero = Number(valor);

  if (
    !Number.isFinite(numero) ||
    numero < 0
  ) {
    return 0;
  }

  return numero;
}

/**
 * Crea un detalle uniforme para cada factor del puntaje.
 */
export function crearDetallePuntaje({
  codigo,
  descripcion,
  cantidad = 1,
  pesoUnitario = 0,
  metadata = null,
}) {
  const cantidadSegura =
    obtenerCantidadSegura(cantidad);

  const pesoSeguro =
    obtenerCantidadSegura(pesoUnitario);

  return {
    codigo,
    descripcion,
    cantidad: cantidadSegura,
    pesoUnitario: pesoSeguro,
    subtotal:
      cantidadSegura * pesoSeguro,
    metadata,
  };
}

/*
 * ============================================================
 * ANÁLISIS DE PERSISTENCIAS
 * ============================================================
 */

/**
 * Cuenta cuántas coincidencias de cada tipo aparecen dentro de
 * las persistencias detectadas.
 *
 * Una asignatura actual podría tener más de una pendiente
 * relacionada. Por eso contamos los detalles coincidentes y no
 * solamente la cantidad de asignaturas actuales.
 */
export function contarTiposDePersistencia(
  persistencias = [],
) {
  const conteo = {
    exactas: 0,
    directas: 0,
    heredadas: 0,
    mismaArea: 0,
  };

  persistencias.forEach(
    (persistencia) => {
      const pendientesCoincidentes =
        Array.isArray(
          persistencia
            ?.pendientesCoincidentes,
        )
          ? persistencia
              .pendientesCoincidentes
          : [];

      pendientesCoincidentes.forEach(
        (coincidencia) => {
          if (
            coincidencia.tipo ===
            TIPOS_RELACION_ASIGNATURAS.EXACTA
          ) {
            conteo.exactas += 1;
          }

          if (
            coincidencia.tipo ===
            TIPOS_RELACION_ASIGNATURAS.DIRECTA
          ) {
            conteo.directas += 1;
          }

          if (
            coincidencia.tipo ===
            TIPOS_RELACION_ASIGNATURAS.HEREDADA
          ) {
            conteo.heredadas += 1;
          }
        },
      );

      const relacionesMismaArea =
        Array.isArray(
          persistencia
            ?.relacionesMismaArea,
        )
          ? persistencia
              .relacionesMismaArea
          : [];

      conteo.mismaArea +=
        relacionesMismaArea.length;
    },
  );

  return conteo;
}

/*
 * ============================================================
 * CÁLCULO DEL PUNTAJE INSTITUCIONAL
 * ============================================================
 */

/**
 * Calcula el puntaje institucional completo.
 *
 * Recibe la estructura producida por
 * evaluarTrayectoriaAlumno().
 *
 * Devuelve:
 *
 * - puntaje total;
 * - detalle de cada factor;
 * - cantidades utilizadas;
 * - conteo de persistencias.
 */
export function calcularPuntajeInstitucional(
  evaluacionTrayectoria,
) {
  const situacionActual =
    evaluacionTrayectoria
      ?.situacionActual || {};

  const antecedentes =
    evaluacionTrayectoria
      ?.antecedentes || {};

  const persistencias =
    Array.isArray(
      evaluacionTrayectoria
        ?.persistencias,
    )
      ? evaluacionTrayectoria
          .persistencias
      : [];

  const tep =
    obtenerCantidadSegura(
      situacionActual.tep,
    );

  const ted =
    obtenerCantidadSegura(
      situacionActual.ted,
    );

  const cantidadPendientes =
    obtenerCantidadSegura(
      antecedentes
        .cantidadAsignaturasPendientes,
    );

  const sobreedad =
    Boolean(antecedentes.sobreedad);

  const recursante =
    Boolean(antecedentes.recursante);

  const conteoPersistencias =
    contarTiposDePersistencia(
      persistencias,
    );

  const detalles = [];

  if (tep > 0) {
    detalles.push(
      crearDetallePuntaje({
        codigo: "TEP_ACTUAL",
        descripcion:
          "Trayectorias actuales en proceso.",
        cantidad: tep,
        pesoUnitario:
          PESOS_INSTITUCIONALES
            .TEP_ACTUAL,
      }),
    );
  }

  if (ted > 0) {
    detalles.push(
      crearDetallePuntaje({
        codigo: "TED_ACTUAL",
        descripcion:
          "Trayectorias actuales discontinuas.",
        cantidad: ted,
        pesoUnitario:
          PESOS_INSTITUCIONALES
            .TED_ACTUAL,
      }),
    );
  }

  if (cantidadPendientes > 0) {
    detalles.push(
      crearDetallePuntaje({
        codigo:
          "ASIGNATURAS_PENDIENTES",
        descripcion:
          "Asignaturas pendientes de años anteriores.",
        cantidad:
          cantidadPendientes,
        pesoUnitario:
          PESOS_INSTITUCIONALES
            .ASIGNATURA_PENDIENTE,
      }),
    );
  }

  if (sobreedad) {
    detalles.push(
      crearDetallePuntaje({
        codigo: "SOBREEDAD",
        descripcion:
          "Presenta sobreedad.",
        cantidad: 1,
        pesoUnitario:
          PESOS_INSTITUCIONALES
            .SOBREEDAD,
      }),
    );
  }

  if (recursante) {
    detalles.push(
      crearDetallePuntaje({
        codigo: "RECURSANCIA",
        descripcion:
          "Registra condición de recursante.",
        cantidad: 1,
        pesoUnitario:
          PESOS_INSTITUCIONALES
            .RECURSANCIA,
      }),
    );
  }

  if (
    conteoPersistencias.exactas > 0
  ) {
    detalles.push(
      crearDetallePuntaje({
        codigo:
          "PERSISTENCIA_EXACTA",
        descripcion:
          "Persistencias exactas entre asignaturas actuales y pendientes.",
        cantidad:
          conteoPersistencias.exactas,
        pesoUnitario:
          PESOS_INSTITUCIONALES
            .PERSISTENCIA_EXACTA,
      }),
    );
  }

  if (
    conteoPersistencias.directas > 0
  ) {
    detalles.push(
      crearDetallePuntaje({
        codigo:
          "PERSISTENCIA_DIRECTA",
        descripcion:
          "Persistencias dentro de una misma trayectoria disciplinar.",
        cantidad:
          conteoPersistencias.directas,
        pesoUnitario:
          PESOS_INSTITUCIONALES
            .PERSISTENCIA_DIRECTA,
      }),
    );
  }

  if (
    conteoPersistencias.heredadas >
    0
  ) {
    detalles.push(
      crearDetallePuntaje({
        codigo:
          "PERSISTENCIA_HEREDADA",
        descripcion:
          "Persistencias heredadas desde espacios curriculares anteriores o generales.",
        cantidad:
          conteoPersistencias.heredadas,
        pesoUnitario:
          PESOS_INSTITUCIONALES
            .PERSISTENCIA_HEREDADA,
      }),
    );
  }

  if (conteoPersistencias.mismaArea > 0) {
    detalles.push(
      crearDetallePuntaje({
        codigo:
          "RELACION_MISMA_AREA",
        descripcion:
          "Antecedentes relacionados dentro de una misma área general.",
        cantidad:
          conteoPersistencias.mismaArea,
        pesoUnitario:
          PESOS_INSTITUCIONALES
            .RELACION_MISMA_AREA,
      }),
    );
  }

  const puntajeTotal =
    detalles.reduce(
      (acumulado, detalle) =>
        acumulado + detalle.subtotal,
      0,
    );

  return {
    puntajeTotal,

    detalles,

    cantidades: {
      tep,
      ted,
      asignaturasPendientes:
        cantidadPendientes,
      sobreedad,
      recursante,
    },

    persistencias:
      conteoPersistencias,
  };
}

/*
 * ============================================================
 * EVALUACIÓN DEL NIVEL INSTITUCIONAL
 * ============================================================
 */

/**
 * Determina el nivel institucional a partir del puntaje.
 *
 * Si el estudiante no tiene registros actuales cargados,
 * devuelve SIN_EVALUACION.
 */
export function evaluarNivelInstitucional({
  puntajeTotal = 0,
  totalCargados = 0,
}) {
  const totalSeguro =
    obtenerCantidadSegura(
      totalCargados,
    );

  const puntajeSeguro =
    obtenerCantidadSegura(
      puntajeTotal,
    );

  if (totalSeguro === 0) {
    return NIVELES_INSTITUCIONALES
      .SIN_EVALUACION;
  }

  if (
    puntajeSeguro >=
    UMBRALES_NIVEL_INSTITUCIONAL
      .CRITICO_DESDE
  ) {
    return NIVELES_INSTITUCIONALES
      .CRITICO;
  }

  if (
    puntajeSeguro >=
    UMBRALES_NIVEL_INSTITUCIONAL
      .ALTO_DESDE
  ) {
    return NIVELES_INSTITUCIONALES
      .ALTO;
  }

  if (
    puntajeSeguro >=
    UMBRALES_NIVEL_INSTITUCIONAL
      .MEDIO_DESDE
  ) {
    return NIVELES_INSTITUCIONALES
      .MEDIO;
  }

  return NIVELES_INSTITUCIONALES
    .BAJO;
}

/*
 * ============================================================
 * EVALUACIÓN DE LA CATEGORÍA INSTITUCIONAL
 * ============================================================
 *
 * La categoría expresa el tipo de respuesta institucional
 * sugerida:
 *
 * - FAVORABLE
 * - SEGUIMIENTO
 * - PRIORITARIO
 * - SIN_REGISTROS
 *
 * No es una copia automática del nivel.
 * También considera señales concretas como TED, persistencias
 * y cantidad de asignaturas pendientes.
 */

export function evaluarCategoriaInstitucional({
  nivelInstitucional,
  totalCargados = 0,
  tep = 0,
  ted = 0,
  cantidadAsignaturasPendientes = 0,
  persistenciasExactas = 0,
  persistenciasDirectas = 0,
  persistenciasHeredadas = 0,
}) {
  const totalSeguro =
    obtenerCantidadSegura(totalCargados);

  const tepSeguro =
    obtenerCantidadSegura(tep);

  const tedSeguro =
    obtenerCantidadSegura(ted);

  const pendientesSeguras =
    obtenerCantidadSegura(
      cantidadAsignaturasPendientes,
    );

  const persistenciasTotales =
    obtenerCantidadSegura(
      persistenciasExactas,
    ) +
    obtenerCantidadSegura(
      persistenciasDirectas,
    ) +
    obtenerCantidadSegura(
      persistenciasHeredadas,
    );

  if (totalSeguro === 0) {
    return CATEGORIAS_TRAYECTORIA
      .SIN_REGISTROS;
  }

  /*
   * PRIORITARIO
   *
   * Se considera prioritario cuando:
   *
   * - el nivel institucional es alto o crítico;
   * - presenta dos o más TED;
   * - presenta al menos un TED junto con persistencia;
   * - presenta varias persistencias acumuladas.
   */
  if (
    nivelInstitucional ===
      NIVELES_INSTITUCIONALES.CRITICO ||
    nivelInstitucional ===
      NIVELES_INSTITUCIONALES.ALTO ||
    tedSeguro >= 2 ||
    (tedSeguro >= 1 &&
      persistenciasTotales >= 1) ||
    persistenciasTotales >= 2
  ) {
    return CATEGORIAS_TRAYECTORIA
      .PRIORITARIO;
  }

  /*
   * SEGUIMIENTO
   *
   * Se considera seguimiento cuando:
   *
   * - el nivel institucional es medio;
   * - presenta al menos un TEP;
   * - presenta una asignatura pendiente;
   * - presenta una persistencia aislada.
   */
  if (
    nivelInstitucional ===
      NIVELES_INSTITUCIONALES.MEDIO ||
    tepSeguro >= 1 ||
    pendientesSeguras >= 1 ||
    persistenciasTotales >= 1
  ) {
    return CATEGORIAS_TRAYECTORIA
      .SEGUIMIENTO;
  }

  /*
   * FAVORABLE
   *
   * Sólo se alcanza cuando existen registros actuales y no se
   * detectan TED, TEP, pendientes ni persistencias.
   */
  return CATEGORIAS_TRAYECTORIA
    .FAVORABLE;
}

/*
 * ============================================================
 * DIAGNÓSTICO INSTITUCIONAL · ETAPA 1
 * ============================================================
 */

/**
 * Ejecuta la primera etapa del diagnóstico institucional.
 *
 * Recibe el resultado completo de evaluarTrayectoriaAlumno()
 * y devuelve:
 *
 * - puntaje;
 * - nivel institucional;
 * - detalle explicable del cálculo;
 * - parámetros utilizados.
 *
 * La categoría, justificación y recomendaciones se completarán
 * en las próximas etapas.
 */
export function evaluarDiagnosticoInstitucionalEtapa1(
  evaluacionTrayectoria,
) {
  const calculo =
    calcularPuntajeInstitucional(
      evaluacionTrayectoria,
    );

  const totalCargados =
    obtenerCantidadSegura(
      evaluacionTrayectoria
        ?.situacionActual
        ?.totalCargados,
    );

  const nivelInstitucional =
    evaluarNivelInstitucional({
      puntajeTotal:
        calculo.puntajeTotal,
      totalCargados,
    });

  return {
    puntaje:
      calculo.puntajeTotal,

    nivelInstitucional,

    detallePuntaje:
      calculo.detalles,

    cantidades:
      calculo.cantidades,

    persistencias:
      calculo.persistencias,

    parametrosAplicados: {
      pesos: {
        ...PESOS_INSTITUCIONALES,
      },

      umbrales: {
        ...UMBRALES_NIVEL_INSTITUCIONAL,
      },
    },

    /*
     * Campos reservados para las próximas etapas.
     */
    categoria: null,

    titulo: null,

    justificacion: null, 

    recomendaciones: [],
  };
}

/*
 * ============================================================
 * DIAGNÓSTICO INSTITUCIONAL · ETAPA 2
 * ============================================================
 */

/**
 * Incorpora la categoría institucional al diagnóstico.
 */
export function evaluarDiagnosticoInstitucionalEtapa2(
  evaluacionTrayectoria,
) {
  const diagnosticoEtapa1 =
    evaluarDiagnosticoInstitucionalEtapa1(
      evaluacionTrayectoria,
    );

  const situacionActual =
    evaluacionTrayectoria
      ?.situacionActual || {};

  const antecedentes =
    evaluacionTrayectoria
      ?.antecedentes || {};

  const categoria =
    evaluarCategoriaInstitucional({
      nivelInstitucional:
        diagnosticoEtapa1
          .nivelInstitucional,

      totalCargados:
        situacionActual.totalCargados,

      tep:
        situacionActual.tep,

      ted:
        situacionActual.ted,

      cantidadAsignaturasPendientes:
        antecedentes
          .cantidadAsignaturasPendientes,

      persistenciasExactas:
        diagnosticoEtapa1
          .persistencias.exactas,

      persistenciasDirectas:
        diagnosticoEtapa1
          .persistencias.directas,

      persistenciasHeredadas:
        diagnosticoEtapa1
          .persistencias.heredadas,
    });

  return {
    ...diagnosticoEtapa1,

    categoria,
  };
}