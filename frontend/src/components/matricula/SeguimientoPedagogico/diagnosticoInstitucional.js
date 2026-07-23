/*
 * ============================================================
 * DIAGNÓSTICO INSTITUCIONAL DE TRAYECTORIAS
 * ============================================================
 *
 * Este archivo construye el objeto único de diagnóstico
 * institucional.
 *
 * Su responsabilidad es:
 *
 * - recibir la evaluación completa de una trayectoria;
 * - utilizar los criterios institucionales existentes;
 * - organizar indicadores, factores, fortalezas y alertas;
 * - devolver una estructura uniforme y reutilizable.
 *
 * IMPORTANTE:
 *
 * Este archivo NO redacta todavía mensajes narrativos.
 * Trabaja con códigos institucionales estables.
 *
 * La transformación de esos códigos en textos comprensibles
 * quedará a cargo de mensajesDiagnostico.js.
 * ============================================================
 */

import {
  evaluarDiagnosticoInstitucionalEtapa2,
  obtenerCantidadSegura,
} from "./criteriosInstitucionales";

/*
 * ============================================================
 * CÓDIGOS DE INDICADORES
 * ============================================================
 *
 * Los indicadores describen dimensiones de la trayectoria.
 *
 * No son mensajes para mostrar directamente en pantalla.
 */

export const ESTADOS_INDICADOR = {
  SIN_INFORMACION: "SIN_INFORMACION",
  FAVORABLE: "FAVORABLE",
  ATENCION: "ATENCION",
  ALERTA: "ALERTA",
  CRITICO: "CRITICO",
};

export const CODIGOS_INDICADORES = {
  REGISTROS_ACTUALES:
    "REGISTROS_ACTUALES",

  TRAYECTORIA_ACTUAL:
    "TRAYECTORIA_ACTUAL",

  ASIGNATURAS_PENDIENTES:
    "ASIGNATURAS_PENDIENTES",

  PERSISTENCIAS:
    "PERSISTENCIAS",

  SOBREEDAD:
    "SOBREEDAD",

  RECURSANCIA:
    "RECURSANCIA",
};

/*
 * ============================================================
 * CÓDIGOS DE FORTALEZAS
 * ============================================================
 */

export const CODIGOS_FORTALEZAS = {
  REGISTROS_COMPLETOS:
    "REGISTROS_COMPLETOS",

  SIN_TEP:
    "SIN_TEP",

  SIN_TED:
    "SIN_TED",

  SIN_DIFICULTADES_ACTUALES:
    "SIN_DIFICULTADES_ACTUALES",

  SIN_ASIGNATURAS_PENDIENTES:
    "SIN_ASIGNATURAS_PENDIENTES",

  SIN_PERSISTENCIAS:
    "SIN_PERSISTENCIAS",

  TRAYECTORIA_ACTUAL_FAVORABLE:
    "TRAYECTORIA_ACTUAL_FAVORABLE",
};

/*
 * ============================================================
 * CÓDIGOS DE ALERTAS
 * ============================================================
 */

export const CODIGOS_ALERTAS = {
  SIN_REGISTROS_ACTUALES:
    "SIN_REGISTROS_ACTUALES",

  TEP_ACTUAL:
    "TEP_ACTUAL",

  TED_ACTUAL:
    "TED_ACTUAL",

  MULTIPLES_TEP:
    "MULTIPLES_TEP",

  MULTIPLES_TED:
    "MULTIPLES_TED",

  ASIGNATURAS_PENDIENTES:
    "ASIGNATURAS_PENDIENTES",

  MULTIPLES_ASIGNATURAS_PENDIENTES:
    "MULTIPLES_ASIGNATURAS_PENDIENTES",

  SOBREEDAD:
    "SOBREEDAD",

  RECURSANCIA:
    "RECURSANCIA",

  PERSISTENCIA_EXACTA:
    "PERSISTENCIA_EXACTA",

  PERSISTENCIA_DIRECTA:
    "PERSISTENCIA_DIRECTA",

  PERSISTENCIA_HEREDADA:
    "PERSISTENCIA_HEREDADA",

  MULTIPLES_PERSISTENCIAS:
    "MULTIPLES_PERSISTENCIAS",

  RELACION_MISMA_AREA:
    "RELACION_MISMA_AREA",
};

/*
 * ============================================================
 * CÓDIGOS DE JUSTIFICACIÓN
 * ============================================================
 *
 * Por ahora la justificación se guarda como una lista de códigos.
 *
 * mensajesDiagnostico.js convertirá posteriormente estos códigos
 * en una explicación narrativa.
 */

export const CODIGOS_JUSTIFICACION = {
  SIN_REGISTROS:
    "SIN_REGISTROS",

  TRAYECTORIA_FAVORABLE:
    "TRAYECTORIA_FAVORABLE",

  REQUIERE_SEGUIMIENTO:
    "REQUIERE_SEGUIMIENTO",

  REQUIERE_INTERVENCION_PRIORITARIA:
    "REQUIERE_INTERVENCION_PRIORITARIA",

  PRESENTA_TEP:
    "PRESENTA_TEP",

  PRESENTA_TED:
    "PRESENTA_TED",

  PRESENTA_PENDIENTES:
    "PRESENTA_PENDIENTES",

  PRESENTA_PERSISTENCIAS:
    "PRESENTA_PERSISTENCIAS",

  PRESENTA_SOBREEDAD:
    "PRESENTA_SOBREEDAD",

  PRESENTA_RECURSANCIA:
    "PRESENTA_RECURSANCIA",
};

/*
 * ============================================================
 * CÓDIGOS DE RECOMENDACIONES
 * ============================================================
 *
 * Todavía no contienen textos.
 *
 * Estos códigos permitirán posteriormente:
 *
 * - generar mensajes;
 * - ordenar recomendaciones;
 * - agruparlas por tipo;
 * - construir estadísticas institucionales;
 * - mostrarlas de diferentes formas según la pantalla.
 */

export const CODIGOS_RECOMENDACIONES = {
  COMPLETAR_REGISTROS:
    "COMPLETAR_REGISTROS",

  SOSTENER_TRAYECTORIA:
    "SOSTENER_TRAYECTORIA",

  REALIZAR_SEGUIMIENTO:
    "REALIZAR_SEGUIMIENTO",

  PRIORIZAR_INTERVENCION:
    "PRIORIZAR_INTERVENCION",

  ANALIZAR_TEP:
    "ANALIZAR_TEP",

  ANALIZAR_TED:
    "ANALIZAR_TED",

  ABORDAR_ASIGNATURAS_PENDIENTES:
    "ABORDAR_ASIGNATURAS_PENDIENTES",

  REVISAR_PERSISTENCIAS:
    "REVISAR_PERSISTENCIAS",

  ARTICULAR_CON_EQUIPO:
    "ARTICULAR_CON_EQUIPO",

  REGISTRAR_ESTRATEGIAS:
    "REGISTRAR_ESTRATEGIAS",
};

/*
 * ============================================================
 * UTILIDADES INTERNAS
 * ============================================================
 */

/**
 * Crea una estructura uniforme para fortalezas, alertas,
 * factores y recomendaciones.
 */
export function crearElementoDiagnostico({
  codigo,
  tipo,
  prioridad = 0,
  cantidad = 0,
  metadata = null,
}) {
  return {
    codigo,
    tipo,
    prioridad:
      obtenerCantidadSegura(prioridad),

    cantidad:
      obtenerCantidadSegura(cantidad),

    metadata,
  };
}

/**
 * Evita que un mismo código se agregue más de una vez.
 */
export function agregarElementoUnico(
  elementos,
  nuevoElemento,
) {
  if (
    !Array.isArray(elementos) ||
    !nuevoElemento?.codigo
  ) {
    return elementos;
  }

  const yaExiste =
    elementos.some(
      (elemento) =>
        elemento.codigo ===
        nuevoElemento.codigo,
    );

  if (!yaExiste) {
    elementos.push(nuevoElemento);
  }

  return elementos;
}

/**
 * Ordena elementos desde la prioridad más alta hacia la menor.
 */
export function ordenarPorPrioridad(
  elementos = [],
) {
  return [...elementos].sort(
    (elementoA, elementoB) =>
      obtenerCantidadSegura(
        elementoB?.prioridad,
      ) -
      obtenerCantidadSegura(
        elementoA?.prioridad,
      ),
  );
}

/*
 * ============================================================
 * CONSTRUCCIÓN DE INDICADORES
 * ============================================================
 */

/**
 * Construye los indicadores estructurados del diagnóstico.
 */
export function crearIndicadoresDiagnostico({ 
  situacionActual = {},
  antecedentes = {},
  persistencias = {},
}) {
  const totalCargados =
    obtenerCantidadSegura(
      situacionActual.totalCargados,
    );

  const tea =
    obtenerCantidadSegura(
      situacionActual.tea,
    );

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

  const persistenciasExactas =
    obtenerCantidadSegura(
      persistencias.exactas,
    );

  const persistenciasDirectas =
    obtenerCantidadSegura(
      persistencias.directas,
    );

  const persistenciasHeredadas =
    obtenerCantidadSegura(
      persistencias.heredadas,
    );

  const relacionesMismaArea =
    obtenerCantidadSegura(
      persistencias.mismaArea,
    );

  const persistenciasTotales =
    persistenciasExactas +
    persistenciasDirectas +
    persistenciasHeredadas;

  let estadoTrayectoriaActual =
    ESTADOS_INDICADOR.FAVORABLE;

  if (totalCargados === 0) {
    estadoTrayectoriaActual =
      ESTADOS_INDICADOR
        .SIN_INFORMACION;
  } else if (ted >= 2) {
    estadoTrayectoriaActual =
      ESTADOS_INDICADOR.CRITICO;
  } else if (ted >= 1) {
    estadoTrayectoriaActual =
      ESTADOS_INDICADOR.ALERTA;
  } else if (tep >= 1) {
    estadoTrayectoriaActual =
      ESTADOS_INDICADOR.ATENCION;
  }

  let estadoPendientes =
    ESTADOS_INDICADOR.FAVORABLE;

  if (cantidadPendientes >= 3) {
    estadoPendientes =
      ESTADOS_INDICADOR.ALERTA;
  } else if (cantidadPendientes >= 1) {
    estadoPendientes =
      ESTADOS_INDICADOR.ATENCION;
  }

  let estadoPersistencias =
    ESTADOS_INDICADOR.FAVORABLE;

  if (persistenciasTotales >= 2) {
    estadoPersistencias =
      ESTADOS_INDICADOR.ALERTA;
  } else if (persistenciasTotales >= 1) {
    estadoPersistencias =
      ESTADOS_INDICADOR.ATENCION;
  }

  return {
    registrosActuales: {
      codigo:
        CODIGOS_INDICADORES
          .REGISTROS_ACTUALES,

      estado:
        totalCargados > 0
          ? ESTADOS_INDICADOR
              .FAVORABLE
          : ESTADOS_INDICADOR
              .SIN_INFORMACION,

      valor: totalCargados,
    },

    trayectoriaActual: {
      codigo:
        CODIGOS_INDICADORES
          .TRAYECTORIA_ACTUAL,

      estado:
        estadoTrayectoriaActual,

      valores: {
        totalCargados,
        tea,
        tep,
        ted,
      },
    },

    asignaturasPendientes: {
      codigo:
        CODIGOS_INDICADORES
          .ASIGNATURAS_PENDIENTES,

      estado:
        estadoPendientes,

      valor:
        cantidadPendientes,
    },

    persistencias: {
      codigo:
        CODIGOS_INDICADORES
          .PERSISTENCIAS,

      estado:
        estadoPersistencias,

      valores: {
        total:
          persistenciasTotales,

        exactas:
          persistenciasExactas,

        directas:
          persistenciasDirectas,

        heredadas:
          persistenciasHeredadas,

        mismaArea:
          relacionesMismaArea,
      },
    },

    sobreedad: {
      codigo:
        CODIGOS_INDICADORES
          .SOBREEDAD,

      estado:
        antecedentes.sobreedad
          ? ESTADOS_INDICADOR
              .ATENCION
          : ESTADOS_INDICADOR
              .FAVORABLE,

      valor:
        Boolean(
          antecedentes.sobreedad,
        ),
    },

    recursancia: {
      codigo:
        CODIGOS_INDICADORES
          .RECURSANCIA,

      estado:
        antecedentes.recursante
          ? ESTADOS_INDICADOR
              .ATENCION
          : ESTADOS_INDICADOR
              .FAVORABLE,

      valor:
        Boolean(
          antecedentes.recursante,
        ),
    },
  };
}

/*
 * ============================================================
 * CONSTRUCCIÓN DE FACTORES
 * ============================================================
 */

/**
 * Convierte el detalle del puntaje en factores estructurados.
 *
 * Conservamos el código, la cantidad, el peso y el subtotal para
 * que el diagnóstico pueda explicar de dónde surgió el puntaje.
 */
export function crearFactoresDiagnostico(
  detallePuntaje = [],
) {
  if (!Array.isArray(detallePuntaje)) {
    return [];
  }

  return detallePuntaje.map(
    (detalle) => ({
      codigo: detalle.codigo,

      tipo: "FACTOR",

      descripcionTecnica:
        detalle.descripcion,

      cantidad:
        obtenerCantidadSegura(
          detalle.cantidad,
        ),

      pesoUnitario:
        obtenerCantidadSegura(
          detalle.pesoUnitario,
        ),

      subtotal:
        obtenerCantidadSegura(
          detalle.subtotal,
        ),

      metadata:
        detalle.metadata || null,
    }),
  );
}

/*
 * ============================================================
 * CONSTRUCCIÓN DE FORTALEZAS
 * ============================================================
 */

export function crearFortalezasDiagnostico({
  situacionActual = {},
  antecedentes = {},
  persistencias = {},
}) {
  const fortalezas = [];

  const totalCargados =
    obtenerCantidadSegura(
      situacionActual.totalCargados,
    );

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

  const persistenciasTotales =
    obtenerCantidadSegura(
      persistencias.exactas,
    ) +
    obtenerCantidadSegura(
      persistencias.directas,
    ) +
    obtenerCantidadSegura(
      persistencias.heredadas,
    );

  if (totalCargados > 0) {
    agregarElementoUnico(
      fortalezas,
      crearElementoDiagnostico({
        codigo:
          CODIGOS_FORTALEZAS
            .REGISTROS_COMPLETOS,

        tipo: "FORTALEZA",
        prioridad: 1,
        cantidad: totalCargados,
      }),
    );
  }

  if (
    totalCargados > 0 &&
    tep === 0
  ) {
    agregarElementoUnico(
      fortalezas,
      crearElementoDiagnostico({
        codigo:
          CODIGOS_FORTALEZAS
            .SIN_TEP,

        tipo: "FORTALEZA",
        prioridad: 2,
      }),
    );
  }

  if (
    totalCargados > 0 &&
    ted === 0
  ) {
    agregarElementoUnico(
      fortalezas,
      crearElementoDiagnostico({
        codigo:
          CODIGOS_FORTALEZAS
            .SIN_TED,

        tipo: "FORTALEZA",
        prioridad: 3,
      }),
    );
  }

  if (
    totalCargados > 0 &&
    tep === 0 &&
    ted === 0
  ) {
    agregarElementoUnico(
      fortalezas,
      crearElementoDiagnostico({
        codigo:
          CODIGOS_FORTALEZAS
            .SIN_DIFICULTADES_ACTUALES,

        tipo: "FORTALEZA",
        prioridad: 5,
      }),
    );
  }

  if (cantidadPendientes === 0) {
    agregarElementoUnico(
      fortalezas,
      crearElementoDiagnostico({
        codigo:
          CODIGOS_FORTALEZAS
            .SIN_ASIGNATURAS_PENDIENTES,

        tipo: "FORTALEZA",
        prioridad: 2,
      }),
    );
  }

  if (persistenciasTotales === 0) {
    agregarElementoUnico(
      fortalezas,
      crearElementoDiagnostico({
        codigo:
          CODIGOS_FORTALEZAS
            .SIN_PERSISTENCIAS,

        tipo: "FORTALEZA",
        prioridad: 2,
      }),
    );
  }

  if (
    totalCargados > 0 &&
    tep === 0 &&
    ted === 0 &&
    cantidadPendientes === 0 &&
    persistenciasTotales === 0
  ) {
    agregarElementoUnico(
      fortalezas,
      crearElementoDiagnostico({
        codigo:
          CODIGOS_FORTALEZAS
            .TRAYECTORIA_ACTUAL_FAVORABLE,

        tipo: "FORTALEZA",
        prioridad: 10,
      }),
    );
  }

  return ordenarPorPrioridad(
    fortalezas,
  );
}

/*
 * ============================================================
 * CONSTRUCCIÓN DE ALERTAS
 * ============================================================
 */

export function crearAlertasDiagnostico({
  situacionActual = {},
  antecedentes = {},
  persistencias = {},
}) {
  const alertas = [];

  const totalCargados =
    obtenerCantidadSegura(
      situacionActual.totalCargados,
    );

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

  const exactas =
    obtenerCantidadSegura(
      persistencias.exactas,
    );

  const directas =
    obtenerCantidadSegura(
      persistencias.directas,
    );

  const heredadas =
    obtenerCantidadSegura(
      persistencias.heredadas,
    );

  const mismaArea =
    obtenerCantidadSegura(
      persistencias.mismaArea,
    );

  const persistenciasTotales =
    exactas +
    directas +
    heredadas;

  if (totalCargados === 0) {
    agregarElementoUnico(
      alertas,
      crearElementoDiagnostico({
        codigo:
          CODIGOS_ALERTAS
            .SIN_REGISTROS_ACTUALES,

        tipo: "ALERTA",
        prioridad: 10,
      }),
    );
  }

  if (tep >= 1) {
    agregarElementoUnico(
      alertas,
      crearElementoDiagnostico({
        codigo:
          CODIGOS_ALERTAS
            .TEP_ACTUAL,

        tipo: "ALERTA",
        prioridad: 4,
        cantidad: tep,
      }),
    );
  }

  if (tep >= 2) {
    agregarElementoUnico(
      alertas,
      crearElementoDiagnostico({
        codigo:
          CODIGOS_ALERTAS
            .MULTIPLES_TEP,

        tipo: "ALERTA",
        prioridad: 6,
        cantidad: tep,
      }),
    );
  }

  if (ted >= 1) {
    agregarElementoUnico(
      alertas,
      crearElementoDiagnostico({
        codigo:
          CODIGOS_ALERTAS
            .TED_ACTUAL,

        tipo: "ALERTA",
        prioridad: 8,
        cantidad: ted,
      }),
    );
  }

  if (ted >= 2) {
    agregarElementoUnico(
      alertas,
      crearElementoDiagnostico({
        codigo:
          CODIGOS_ALERTAS
            .MULTIPLES_TED,

        tipo: "ALERTA",
        prioridad: 10,
        cantidad: ted,
      }),
    );
  }

  if (cantidadPendientes >= 1) {
    agregarElementoUnico(
      alertas,
      crearElementoDiagnostico({
        codigo:
          CODIGOS_ALERTAS
            .ASIGNATURAS_PENDIENTES,

        tipo: "ALERTA",
        prioridad: 4,
        cantidad:
          cantidadPendientes,
      }),
    );
  }

  if (cantidadPendientes >= 3) {
    agregarElementoUnico(
      alertas,
      crearElementoDiagnostico({
        codigo:
          CODIGOS_ALERTAS
            .MULTIPLES_ASIGNATURAS_PENDIENTES,

        tipo: "ALERTA",
        prioridad: 7,
        cantidad:
          cantidadPendientes,
      }),
    );
  }

  if (antecedentes.sobreedad) {
    agregarElementoUnico(
      alertas,
      crearElementoDiagnostico({
        codigo:
          CODIGOS_ALERTAS.SOBREEDAD,

        tipo: "ALERTA",
        prioridad: 3,
      }),
    );
  }

  if (antecedentes.recursante) {
    agregarElementoUnico(
      alertas,
      crearElementoDiagnostico({
        codigo:
          CODIGOS_ALERTAS.RECURSANCIA,

        tipo: "ALERTA",
        prioridad: 5,
      }),
    );
  }

  if (exactas >= 1) {
    agregarElementoUnico(
      alertas,
      crearElementoDiagnostico({
        codigo:
          CODIGOS_ALERTAS
            .PERSISTENCIA_EXACTA,

        tipo: "ALERTA",
        prioridad: 8,
        cantidad: exactas,
      }),
    );
  }

  if (directas >= 1) {
    agregarElementoUnico(
      alertas,
      crearElementoDiagnostico({
        codigo:
          CODIGOS_ALERTAS
            .PERSISTENCIA_DIRECTA,

        tipo: "ALERTA",
        prioridad: 8,
        cantidad: directas,
      }),
    );
  }

  if (heredadas >= 1) {
    agregarElementoUnico(
      alertas,
      crearElementoDiagnostico({
        codigo:
          CODIGOS_ALERTAS
            .PERSISTENCIA_HEREDADA,

        tipo: "ALERTA",
        prioridad: 6,
        cantidad: heredadas,
      }),
    );
  }

  if (persistenciasTotales >= 2) {
    agregarElementoUnico(
      alertas,
      crearElementoDiagnostico({
        codigo:
          CODIGOS_ALERTAS
            .MULTIPLES_PERSISTENCIAS,

        tipo: "ALERTA",
        prioridad: 9,
        cantidad:
          persistenciasTotales,
      }),
    );
  }

  if (mismaArea >= 1) {
    agregarElementoUnico(
      alertas,
      crearElementoDiagnostico({
        codigo:
          CODIGOS_ALERTAS
            .RELACION_MISMA_AREA,

        tipo: "ALERTA",
        prioridad: 2,
        cantidad: mismaArea,
      }),
    );
  }

  return ordenarPorPrioridad(
    alertas,
  );
}

/*
 * ============================================================
 * CONSTRUCCIÓN DE LA JUSTIFICACIÓN
 * ============================================================
 *
 * La justificación todavía no es un texto.
 *
 * Devuelve códigos institucionales que después serán redactados
 * por mensajesDiagnostico.js.
 */

export function crearJustificacionDiagnostico({
  categoria,
  situacionActual = {},
  antecedentes = {},
  persistencias = {},
}) {
  const codigos = [];

  const totalCargados =
    obtenerCantidadSegura(
      situacionActual.totalCargados,
    );

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

  const persistenciasTotales =
    obtenerCantidadSegura(
      persistencias.exactas,
    ) +
    obtenerCantidadSegura(
      persistencias.directas,
    ) +
    obtenerCantidadSegura(
      persistencias.heredadas,
    );

  if (totalCargados === 0) {
    codigos.push(
      CODIGOS_JUSTIFICACION
        .SIN_REGISTROS,
    );

    return codigos;
  }

  if (categoria === "FAVORABLE") {
    codigos.push(
      CODIGOS_JUSTIFICACION
        .TRAYECTORIA_FAVORABLE,
    );
  }

  if (categoria === "SEGUIMIENTO") {
    codigos.push(
      CODIGOS_JUSTIFICACION
        .REQUIERE_SEGUIMIENTO,
    );
  }

  if (categoria === "PRIORITARIO") {
    codigos.push(
      CODIGOS_JUSTIFICACION
        .REQUIERE_INTERVENCION_PRIORITARIA,
    );
  }

  if (tep >= 1) {
    codigos.push(
      CODIGOS_JUSTIFICACION
        .PRESENTA_TEP,
    );
  }

  if (ted >= 1) {
    codigos.push(
      CODIGOS_JUSTIFICACION
        .PRESENTA_TED,
    );
  }

  if (cantidadPendientes >= 1) {
    codigos.push(
      CODIGOS_JUSTIFICACION
        .PRESENTA_PENDIENTES,
    );
  }

  if (persistenciasTotales >= 1) {
    codigos.push(
      CODIGOS_JUSTIFICACION
        .PRESENTA_PERSISTENCIAS,
    );
  }

  if (antecedentes.sobreedad) {
    codigos.push(
      CODIGOS_JUSTIFICACION
        .PRESENTA_SOBREEDAD,
    );
  }

  if (antecedentes.recursante) {
    codigos.push(
      CODIGOS_JUSTIFICACION
        .PRESENTA_RECURSANCIA,
    );
  }

  return [...new Set(codigos)];
}

/*
 * ============================================================
 * CONSTRUCCIÓN DE RECOMENDACIONES
 * ============================================================
 *
 * Por ahora genera códigos iniciales.
 *
 * La definición pedagógica detallada y la redacción se
 * desarrollarán en las próximas etapas.
 */

export function crearRecomendacionesDiagnostico({
  categoria,
  situacionActual = {},
  antecedentes = {},
  persistencias = {},
}) {
  const recomendaciones = [];

  const totalCargados =
    obtenerCantidadSegura(
      situacionActual.totalCargados,
    );

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

  const persistenciasTotales =
    obtenerCantidadSegura(
      persistencias.exactas,
    ) +
    obtenerCantidadSegura(
      persistencias.directas,
    ) +
    obtenerCantidadSegura(
      persistencias.heredadas,
    );

  if (totalCargados === 0) {
    agregarElementoUnico(
      recomendaciones,
      crearElementoDiagnostico({
        codigo:
          CODIGOS_RECOMENDACIONES
            .COMPLETAR_REGISTROS,

        tipo: "RECOMENDACION",
        prioridad: 10,
      }),
    );

    return recomendaciones;
  }

  if (categoria === "FAVORABLE") {
    agregarElementoUnico(
      recomendaciones,
      crearElementoDiagnostico({
        codigo:
          CODIGOS_RECOMENDACIONES
            .SOSTENER_TRAYECTORIA,

        tipo: "RECOMENDACION",
        prioridad: 5,
      }),
    );
  }

  if (categoria === "SEGUIMIENTO") {
    agregarElementoUnico(
      recomendaciones,
      crearElementoDiagnostico({
        codigo:
          CODIGOS_RECOMENDACIONES
            .REALIZAR_SEGUIMIENTO,

        tipo: "RECOMENDACION",
        prioridad: 7,
      }),
    );
  }

  if (categoria === "PRIORITARIO") {
    agregarElementoUnico(
      recomendaciones,
      crearElementoDiagnostico({
        codigo:
          CODIGOS_RECOMENDACIONES
            .PRIORIZAR_INTERVENCION,

        tipo: "RECOMENDACION",
        prioridad: 10,
      }),
    );

    agregarElementoUnico(
      recomendaciones,
      crearElementoDiagnostico({
        codigo:
          CODIGOS_RECOMENDACIONES
            .ARTICULAR_CON_EQUIPO,

        tipo: "RECOMENDACION",
        prioridad: 9,
      }),
    );
  }

  if (tep >= 1) {
    agregarElementoUnico(
      recomendaciones,
      crearElementoDiagnostico({
        codigo:
          CODIGOS_RECOMENDACIONES
            .ANALIZAR_TEP,

        tipo: "RECOMENDACION",
        prioridad: 6,
        cantidad: tep,
      }),
    );
  }

  if (ted >= 1) {
    agregarElementoUnico(
      recomendaciones,
      crearElementoDiagnostico({
        codigo:
          CODIGOS_RECOMENDACIONES
            .ANALIZAR_TED,

        tipo: "RECOMENDACION",
        prioridad: 9,
        cantidad: ted,
      }),
    );
  }

  if (cantidadPendientes >= 1) {
    agregarElementoUnico(
      recomendaciones,
      crearElementoDiagnostico({
        codigo:
          CODIGOS_RECOMENDACIONES
            .ABORDAR_ASIGNATURAS_PENDIENTES,

        tipo: "RECOMENDACION",
        prioridad: 7,
        cantidad:
          cantidadPendientes,
      }),
    );
  }

  if (persistenciasTotales >= 1) {
    agregarElementoUnico(
      recomendaciones,
      crearElementoDiagnostico({
        codigo:
          CODIGOS_RECOMENDACIONES
            .REVISAR_PERSISTENCIAS,

        tipo: "RECOMENDACION",
        prioridad: 8,
        cantidad:
          persistenciasTotales,
      }),
    );
  }

  if (
    categoria === "SEGUIMIENTO" ||
    categoria === "PRIORITARIO"
  ) {
    agregarElementoUnico(
      recomendaciones,
      crearElementoDiagnostico({
        codigo:
          CODIGOS_RECOMENDACIONES
            .REGISTRAR_ESTRATEGIAS,

        tipo: "RECOMENDACION",
        prioridad: 5,
      }),
    );
  }

  return ordenarPorPrioridad(
    recomendaciones,
  );
}

/*
 * ============================================================
 * CREACIÓN DEL OBJETO ÚNICO DE DIAGNÓSTICO
 * ============================================================
 */

/**
 * Construye el diagnóstico institucional completo.
 *
 * Esta función será el punto único de entrada utilizado por React.
 */
export function crearDiagnosticoInstitucional(
  evaluacionTrayectoria,
) {
  const diagnosticoTecnico =
    evaluarDiagnosticoInstitucionalEtapa2(
      evaluacionTrayectoria,
    );

  const situacionActual =
    evaluacionTrayectoria
      ?.situacionActual || {};

  const antecedentes =
    evaluacionTrayectoria
      ?.antecedentes || {};

  const persistencias =
    diagnosticoTecnico
      ?.persistencias || {
        exactas: 0,
        directas: 0,
        heredadas: 0,
        mismaArea: 0,
      };
  const persistenciasDetalladas =
  Array.isArray(
    evaluacionTrayectoria
      ?.resumenPersistencias
      ?.persistenciasDetalladas,
  )
    ? evaluacionTrayectoria
        .resumenPersistencias
        .persistenciasDetalladas
    : Array.isArray(
        evaluacionTrayectoria
          ?.resumenPersistencias
          ?.detalle,
      )
      ? evaluacionTrayectoria
          .resumenPersistencias
          .detalle
      : Array.isArray(
          evaluacionTrayectoria
            ?.persistencias,
        )
        ? evaluacionTrayectoria
            .persistencias
            .filter(
              (persistencia) =>
                persistencia?.existe,
            )
        : [];

  const indicadores =
    crearIndicadoresDiagnostico({ 
      situacionActual,
      antecedentes,
      persistencias,
    });

  const factores =
    crearFactoresDiagnostico(
      diagnosticoTecnico
        .detallePuntaje,
    );

  const fortalezas =
    crearFortalezasDiagnostico({
      situacionActual,
      antecedentes,
      persistencias,
    });

  const alertas =
    crearAlertasDiagnostico({
      situacionActual,
      antecedentes,
      persistencias,
    });

  const justificacion =
    crearJustificacionDiagnostico({
      categoria:
        diagnosticoTecnico
          .categoria,

      situacionActual,
      antecedentes,
      persistencias,
    });

  const recomendaciones =
    crearRecomendacionesDiagnostico({
      categoria:
        diagnosticoTecnico
          .categoria,

      situacionActual,
      antecedentes,
      persistencias,
    });

  return {
    categoria:
      diagnosticoTecnico
        .categoria,

    nivel:
      diagnosticoTecnico
        .nivelInstitucional,

    puntaje:
      diagnosticoTecnico
        .puntaje,

    indicadores,

    factores,

    fortalezas,

    alertas,

    justificacion,

    recomendaciones,

    /*
     * Información técnica disponible para auditoría y pruebas.
     */
    detalleTecnico: {
      cantidades:
        diagnosticoTecnico
          .cantidades,

      persistencias,

      persistenciasDetalladas,

      detallePuntaje:
        diagnosticoTecnico
          .detallePuntaje,

      parametrosAplicados:
        diagnosticoTecnico
          .parametrosAplicados,
    },
  };
}

/*
 * Alias semántico.
 *
 * Podremos usar cualquiera de estos nombres según el contexto:
 *
 * crearDiagnosticoInstitucional()
 * evaluarDiagnosticoInstitucional()
 */
export const evaluarDiagnosticoInstitucional =
  crearDiagnosticoInstitucional;

export default crearDiagnosticoInstitucional;