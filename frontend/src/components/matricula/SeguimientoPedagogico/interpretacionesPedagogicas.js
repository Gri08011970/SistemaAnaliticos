/*
 * ============================================================
 * INTERPRETACIONES PEDAGÓGICAS
 * ============================================================
 *
 * Este archivo transforma evidencias producidas por el análisis
 * de trayectoria en interpretaciones pedagógicas institucionales.
 *
 * NO calcula puntajes.
 *
 * NO determina categorías institucionales.
 *
 * NO reemplaza el diagnóstico.
 *
 * Su responsabilidad consiste en:
 *
 * - interpretar relaciones entre asignaturas actuales y previas;
 * - explicar posibles continuidades disciplinares;
 * - construir orientaciones pedagógicas específicas;
 * - conservar las evidencias que respaldan cada interpretación;
 * - producir textos claros, prudentes y auditables.
 *
 * PRINCIPIO INSTITUCIONAL:
 *
 * Ninguna interpretación debe construirse sin evidencias
 * concretas provenientes del diagnóstico.
 *
 * ============================================================
 */

import {
  TIPOS_RELACION_ASIGNATURAS,

} from "./equivalenciasAsignaturas";


/*
 * ============================================================
 * TIPOS DE INTERPRETACIÓN
 * ============================================================
 */

export const TIPOS_INTERPRETACION_PEDAGOGICA = {

  PERSISTENCIA_CRITICA:
    "PERSISTENCIA_CRITICA",

  PERSISTENCIA_EN_PROCESO:
    "PERSISTENCIA_EN_PROCESO",

  EVOLUCION_FAVORABLE:
    "EVOLUCION_FAVORABLE",

  CONTINUIDAD_DISCIPLINAR:
    "CONTINUIDAD_DISCIPLINAR",

  RELACION_DE_AREA:
    "RELACION_DE_AREA",

};


/*
 * ============================================================
 * NIVELES DE INTERVENCIÓN
 * ============================================================
 */

export const NIVELES_INTERPRETACION_PEDAGOGICA = {

  ALTO:
    "ALTO",

  MEDIO:
    "MEDIO",

  POSITIVO:
    "POSITIVO",

  INFORMATIVO:
    "INFORMATIVO",

};


/*
 * ============================================================
 * FUNCIONES AUXILIARES
 * ============================================================
 */

/**
 * Verifica que un valor sea un objeto válido.
 */
export function esObjetoInterpretacionValido(
  valor,
) {

  return (
    valor !== null &&
    typeof valor === "object" &&
    !Array.isArray(valor)
  );

}


/**
 * Convierte un valor en una lista segura.
 */
export function obtenerListaInterpretacionesSegura(
  valor,
) {

  return Array.isArray(valor)
    ? valor
    : [];

}


/**
 * Devuelve un texto seguro y sin espacios sobrantes.
 */
export function obtenerTextoInterpretacionSeguro(
  valor,
  textoAlternativo = "",
) {

  if (
    typeof valor !== "string"
  ) {

    return textoAlternativo;

  }

  const texto =
    valor.trim();

  return texto ||
    textoAlternativo;

}


/**
 * Normaliza un estado conceptual.
 */
export function normalizarEstadoConceptual(
  estado,
) {

  return obtenerTextoInterpretacionSeguro(
    estado,
  )
    .toUpperCase();

}


/**
 * Devuelve el nombre legible de un área institucional.
 */
export function obtenerNombreAreaPedagogica(
  area,
) {

  const nombres = {

    MATEMATICA:
      "Matemática",

    LENGUA_Y_LITERATURA:
      "Lengua y Literatura",

    CIENCIAS_SOCIALES:
      "Ciencias Sociales",

    CIENCIAS_NATURALES:
      "Ciencias Naturales",

    LENGUAS_EXTRANJERAS:
      "Lenguas Extranjeras",

    EDUCACION_FISICA:
      "Educación Física",

    CIUDADANIA:
      "Ciudadanía",

    ARTE:
      "Arte",

    SALUD:
      "Salud",

    TECNOLOGIA:
      "Tecnología",

    FILOSOFIA:
      "Filosofía",

  };

  return (
    nombres[
      area
    ] ||
    area ||
    "Área no especificada"
  );

}


/**
 * Devuelve el nombre institucional del tipo de relación.
 */
export function obtenerNombreRelacionPedagogica(
  tipoRelacion,
) {

  const nombres = {

    [TIPOS_RELACION_ASIGNATURAS.EXACTA]:
      "continuidad exacta",

    [TIPOS_RELACION_ASIGNATURAS.DIRECTA]:
      "continuidad disciplinar directa",

    [TIPOS_RELACION_ASIGNATURAS.HEREDADA]:
      "continuidad disciplinar heredada",

    [TIPOS_RELACION_ASIGNATURAS.MISMA_AREA]:
      "pertenencia a una misma área de conocimiento",

    [TIPOS_RELACION_ASIGNATURAS.NINGUNA]:
      "sin relación disciplinar específica",

  };

  return (
    nombres[
      tipoRelacion
    ] ||
    "relación disciplinar"
  );

}


/**
 * Construye una identificación legible de la asignatura previa.
 */
export function construirNombreAsignaturaPendiente({
  asignaturaPendiente,
  anioPendiente,
}) {

  const nombre =
    obtenerTextoInterpretacionSeguro(
      asignaturaPendiente,
      "la asignatura pendiente",
    );

  if (
    !anioPendiente
  ) {

    return nombre;

  }

  const anioTexto =
    String(
      anioPendiente,
    )
      .trim()
      .replace(
        /[.º°]+$/g,
        "",
      );

  return (
    `${nombre} de ${anioTexto}.º año`
  );

}

/**
 * Devuelve una clave estable para evitar interpretaciones
 * duplicadas.
 */
export function crearClaveInterpretacion(
  interpretacion,
) {

  return [
    interpretacion.tipo,
    interpretacion.asignaturaPendiente,
    interpretacion.asignaturaActual,
    interpretacion.estadoActual,
    interpretacion.periodo,
  ]
    .filter(Boolean)
    .join("::")
    .toUpperCase();

}


/**
 * Elimina interpretaciones repetidas.
 */
export function eliminarInterpretacionesDuplicadas(
  interpretaciones = [],
) {

  const claves =
    new Set();

  return obtenerListaInterpretacionesSegura(
    interpretaciones,
  )
    .filter(
      (interpretacion) => {

        const clave =
          crearClaveInterpretacion(
            interpretacion,
          );

        if (
          claves.has(
            clave,
          )
        ) {

          return false;

        }

        claves.add(
          clave,
        );

        return true;

      },
    );

}


/*
 * ============================================================
 * NORMALIZACIÓN DE PERSISTENCIAS
 * ============================================================
 */

/**
 * Convierte las diferentes formas posibles de una persistencia
 * en una estructura común.
 *
 * El motor puede entregar propiedades con nombres ligeramente
 * diferentes. Esta función permite que el módulo sea tolerante
 * durante la integración.
 */
export function normalizarPersistenciaPedagogica(
  persistencia,
) {

  if (
    !esObjetoInterpretacionValido(
      persistencia,
    )
  ) {

    return null;

  }

  /*
   * Cada persistencia de una asignatura actual puede contener
   * una o más asignaturas pendientes coincidentes.
   *
   * Para esta primera interpretación utilizamos la primera
   * coincidencia disciplinar disponible.
   */
  const coincidencia =
    Array.isArray(
      persistencia
        .pendientesCoincidentes,
    )
      ? persistencia
          .pendientesCoincidentes
          .find(
            (pendiente) =>
              pendiente
                ?.esPersistencia,
          ) ||
        persistencia
          .pendientesCoincidentes[0] ||
        {}
      : {};

  const pendienteOriginal =
    coincidencia
      .pendienteOriginal ||
    {};

  const relacion =
    persistencia.relacion ||
    persistencia.detalleRelacion ||
    persistencia.analisisRelacion ||
    coincidencia ||
    {};

  const asignaturaActual =
    obtenerTextoInterpretacionSeguro(
      coincidencia.asignaturaActual ||
      persistencia.asignaturaActual ||
      persistencia.materiaActual ||
      persistencia.asignatura ||
      relacion.asignaturaActual,
    );

  const asignaturaPendiente =
    obtenerTextoInterpretacionSeguro(
      coincidencia.asignaturaPendiente ||
      pendienteOriginal.asignatura ||
      coincidencia.nombrePendiente ||
      persistencia.asignaturaPendiente ||
      persistencia.materiaPendiente ||
      persistencia.previa ||
      relacion.asignaturaPendiente,
    );

  const estadoActual =
    normalizarEstadoConceptual(
      persistencia.estadoActual ||
      persistencia.conceptual ||
      persistencia.estado ||
      coincidencia.estadoActual ||
      persistencia.trayectoriaActual,
    );

  const tipoRelacion =
    coincidencia.tipo ||
    coincidencia.tipoRelacion ||
    persistencia.tipoRelacion ||
    persistencia.tipo ||
    relacion.tipo ||
    TIPOS_RELACION_ASIGNATURAS
      .NINGUNA;

  const areaActual =
    coincidencia.areaActual ||
    persistencia.areaActual ||
    persistencia.area ||
    relacion.areaActual ||
    null;

  const areaPendiente =
    coincidencia.areaPendiente ||
    persistencia.areaPendiente ||
    relacion.areaPendiente ||
    null;

  const anioPendiente =
    coincidencia.anioPendiente ||
    pendienteOriginal.anio ||
    pendienteOriginal.año ||
    persistencia.anioPendiente ||
    persistencia.añoPendiente ||
    persistencia.anio ||
    persistencia.año ||
    null;

  const periodo =
    persistencia.periodo ||
    persistencia.periodoActual ||
    coincidencia.periodo ||
    null;

  const esPersistencia =
    coincidencia.esPersistencia ??
    persistencia.esPersistencia ??
    relacion.esPersistencia ??
    (
      tipoRelacion ===
        TIPOS_RELACION_ASIGNATURAS.EXACTA ||
      tipoRelacion ===
        TIPOS_RELACION_ASIGNATURAS.DIRECTA ||
      tipoRelacion ===
        TIPOS_RELACION_ASIGNATURAS.HEREDADA
    );

  if (
    !asignaturaActual ||
    !asignaturaPendiente
  ) {

    return null;

  }

  return {

    asignaturaActual,

    asignaturaPendiente,

    estadoActual,

    tipoRelacion,

    areaActual,

    areaPendiente,

    anioPendiente,

    periodo,

    esPersistencia,

    trayectoriaActual:
      coincidencia.trayectoriaActual ||
      persistencia.trayectoriaActual ||
      relacion.trayectoriaActual ||
      null,

    trayectoriaPendiente:
      coincidencia.trayectoriaPendiente || 
      persistencia.trayectoriaPendiente ||
      relacion.trayectoriaPendiente ||
      null,

    evidenciaOriginal:
      persistencia,

    coincidenciaOriginal:
      coincidencia,

  };

}
/*
 * ============================================================
 * INTERPRETACIONES DE PERSISTENCIA
 * ============================================================
 */

/**
 * Construye una interpretación cuando la asignatura actual
 * presenta TED y posee un antecedente disciplinar pendiente.
 */
export function crearInterpretacionPersistenciaTED(
  persistencia,
) {

  const asignaturaPendiente =
    construirNombreAsignaturaPendiente(
      persistencia,
    );

  const asignaturaActual =
    persistencia.asignaturaActual;

  const area =
    obtenerNombreAreaPedagogica(
      persistencia.areaActual ||
      persistencia.areaPendiente,
    );

  return {

    codigo:
      "PERSISTENCIA_DISCIPLINAR_TED",

    tipo:
      TIPOS_INTERPRETACION_PEDAGOGICA
        .PERSISTENCIA_CRITICA,

    nivel:
      NIVELES_INTERPRETACION_PEDAGOGICA
        .ALTO,

    titulo:
      `Continuidad disciplinar entre ${persistencia.asignaturaPendiente} e ${asignaturaActual}`,

    area,

    asignaturaPendiente:
      persistencia.asignaturaPendiente,

    anioPendiente:
      persistencia.anioPendiente,

    asignaturaActual,

    estadoActual:
      persistencia.estadoActual,

    periodo:
      persistencia.periodo,

    tipoRelacion:
      persistencia.tipoRelacion,

    nombreRelacion:
      obtenerNombreRelacionPedagogica(
        persistencia.tipoRelacion,
      ),

    descripcion:
      `La estudiante mantiene pendiente de acreditación ${asignaturaPendiente} y presenta actualmente una Trayectoria Educativa Discontinua en ${asignaturaActual}.`,

    interpretacion:
      "La continuidad disciplinar entre ambos espacios curriculares permite considerar que parte de las dificultades actuales se vincula con aprendizajes de base que aún requieren consolidación.",

    orientacion:
      `Se recomienda planificar una intervención articulada entre la acreditación de ${asignaturaPendiente} y los contenidos prioritarios de ${asignaturaActual}, identificando saberes de base pendientes y diseñando una propuesta progresiva que favorezca tanto la trayectoria actual como la acreditación de la asignatura previa.`,

    prioridad:
      10,

    evidencias: [ 

      {
        tipo:
          "ASIGNATURA_PENDIENTE",

        asignatura:
          persistencia.asignaturaPendiente,

        anio:
          persistencia.anioPendiente,
      },

      {
        tipo:
          "SITUACION_ACTUAL",

        asignatura:
          asignaturaActual,

        estado:
          persistencia.estadoActual,

        periodo:
          persistencia.periodo,
      },

      {
        tipo:
          "RELACION_DISCIPLINAR",

        relacion:
          persistencia.tipoRelacion,

        area,
      },

    ],

    evidenciaOriginal:
      persistencia.evidenciaOriginal,

  };

}


/**
 * Construye una interpretación cuando la asignatura actual
 * presenta TEP y posee un antecedente disciplinar pendiente.
 */
export function crearInterpretacionPersistenciaTEP(
  persistencia,
) {

  const asignaturaPendiente =
    construirNombreAsignaturaPendiente(
      persistencia,
    );

  const asignaturaActual =
    persistencia.asignaturaActual;

  const area =
    obtenerNombreAreaPedagogica(
      persistencia.areaActual ||
      persistencia.areaPendiente,
    );

  return {

    codigo:
      "PERSISTENCIA_DISCIPLINAR_TEP",

    tipo:
      TIPOS_INTERPRETACION_PEDAGOGICA
        .PERSISTENCIA_EN_PROCESO,

    nivel:
      NIVELES_INTERPRETACION_PEDAGOGICA
        .MEDIO,

    titulo:
      `Aprendizajes en proceso dentro de la trayectoria de ${area}`,

    area,

    asignaturaPendiente:
      persistencia.asignaturaPendiente,

    anioPendiente:
      persistencia.anioPendiente,

    asignaturaActual,

    estadoActual:
      persistencia.estadoActual,

    periodo:
      persistencia.periodo,

    tipoRelacion:
      persistencia.tipoRelacion,

    nombreRelacion:
      obtenerNombreRelacionPedagogica(
        persistencia.tipoRelacion,
      ),

    descripcion:
      `La estudiante posee ${asignaturaPendiente} pendiente de acreditación y presenta actualmente una Trayectoria Educativa en Proceso en ${asignaturaActual}.`,

    interpretacion:
      "La continuidad disciplinar observada permite considerar que algunos aprendizajes aún en proceso podrían relacionarse con saberes previos que necesitan ser retomados y fortalecidos.",

    orientacion:
      `Se recomienda identificar los saberes prioritarios compartidos entre ${asignaturaPendiente} y ${asignaturaActual}, proponer actividades graduadas de recuperación y registrar periódicamente los avances alcanzados.`,

    prioridad:
      8,

    evidencias: [

      {
        tipo:
          "ASIGNATURA_PENDIENTE",

        asignatura:
          persistencia.asignaturaPendiente,

        anio:
          persistencia.anioPendiente,
      },

      {
        tipo:
          "SITUACION_ACTUAL",

        asignatura:
          asignaturaActual,

        estado:
          persistencia.estadoActual,

        periodo:
          persistencia.periodo,
      },

      {
        tipo:
          "RELACION_DISCIPLINAR",

        relacion:
          persistencia.tipoRelacion,

        area,
      },

    ],

    evidenciaOriginal:
      persistencia.evidenciaOriginal,

  };

}


/**
 * Construye una interpretación favorable cuando existe un
 * antecedente pendiente, pero la asignatura actual presenta TEA.
 */
export function crearInterpretacionEvolucionTEA(
  persistencia,
) {

  const asignaturaPendiente =
    construirNombreAsignaturaPendiente(
      persistencia,
    );

  const asignaturaActual =
    persistencia.asignaturaActual;

  const area =
    obtenerNombreAreaPedagogica(
      persistencia.areaActual ||
      persistencia.areaPendiente,
    );

  return {

    codigo:
      "EVOLUCION_FAVORABLE_CON_ANTECEDENTE",

    tipo:
      TIPOS_INTERPRETACION_PEDAGOGICA
        .EVOLUCION_FAVORABLE,

    nivel:
      NIVELES_INTERPRETACION_PEDAGOGICA
        .POSITIVO,

    titulo:
      `Evolución favorable en la trayectoria de ${area}`,

    area,

    asignaturaPendiente:
      persistencia.asignaturaPendiente,

    anioPendiente:
      persistencia.anioPendiente,

    asignaturaActual,

    estadoActual:
      persistencia.estadoActual,

    periodo:
      persistencia.periodo,

    tipoRelacion:
      persistencia.tipoRelacion,

    nombreRelacion:
      obtenerNombreRelacionPedagogica(
        persistencia.tipoRelacion,
      ),

    descripcion:
      `La estudiante posee como antecedente ${asignaturaPendiente}; sin embargo, presenta actualmente una Trayectoria Educativa Avanzada en ${asignaturaActual}.`,

    interpretacion:
      "La situación actual evidencia avances significativos dentro de la trayectoria disciplinar y permite reconocer una evolución favorable respecto de los antecedentes registrados.",

    orientacion:
      `Se recomienda sostener las estrategias que favorecieron los avances en ${asignaturaActual} y analizar de qué manera esos aprendizajes pueden contribuir también a la acreditación de ${asignaturaPendiente}.`,

    prioridad:
      6,

    evidencias: [

      {
        tipo:
          "ASIGNATURA_PENDIENTE",

        asignatura:
          persistencia.asignaturaPendiente,

        anio:
          persistencia.anioPendiente,
      },

      {
        tipo:
          "EVOLUCION_ACTUAL",

        asignatura:
          asignaturaActual,

        estado:
          persistencia.estadoActual,

        periodo:
          persistencia.periodo,
      },

    ],

    evidenciaOriginal:
      persistencia.evidenciaOriginal,

  };

}


/**
 * Construye una lectura informativa cuando las asignaturas
 * pertenecen a la misma área, pero no existe evidencia
 * suficiente para declarar persistencia.
 */
export function crearInterpretacionMismaArea(
  persistencia,
) {

  const area =
    obtenerNombreAreaPedagogica(
      persistencia.areaActual ||
      persistencia.areaPendiente,
    );

  return {

    codigo:
      "RELACION_MISMA_AREA_SIN_PERSISTENCIA",

    tipo:
      TIPOS_INTERPRETACION_PEDAGOGICA
        .RELACION_DE_AREA,

    nivel:
      NIVELES_INTERPRETACION_PEDAGOGICA
        .INFORMATIVO,

    titulo:
      `Antecedentes dentro del área de ${area}`,

    area,

    asignaturaPendiente:
      persistencia.asignaturaPendiente,

    anioPendiente:
      persistencia.anioPendiente,

    asignaturaActual:
      persistencia.asignaturaActual,

    estadoActual:
      persistencia.estadoActual,

    periodo:
      persistencia.periodo,

    tipoRelacion:
      persistencia.tipoRelacion,

    nombreRelacion:
      obtenerNombreRelacionPedagogica(
        persistencia.tipoRelacion,
      ),

    descripcion:
      `${persistencia.asignaturaPendiente} y ${persistencia.asignaturaActual} pertenecen al área de ${area}.`,

    interpretacion:
      "La pertenencia a una misma área de conocimiento constituye un antecedente relevante para el análisis, aunque por sí sola no permite afirmar que exista continuidad de una misma dificultad pedagógica.",

    orientacion:
      "Se recomienda considerar ambos registros dentro de la valoración integral de la trayectoria, evitando establecer relaciones causales sin información pedagógica adicional.",

    prioridad:
      3,

    evidencias: [

      {
        tipo:
          "RELACION_DE_AREA",

        asignaturaPendiente:
          persistencia.asignaturaPendiente,

        asignaturaActual:
          persistencia.asignaturaActual,

        area,
      },

    ],

    evidenciaOriginal:
      persistencia.evidenciaOriginal,

  };

}


/*
 * ============================================================
 * SELECCIÓN DE INTERPRETACIÓN
 * ============================================================
 */

/**
 * Genera la interpretación correspondiente a una persistencia
 * normalizada.
 */
export function interpretarPersistenciaPedagogica(
  persistenciaOriginal,
) {

  const persistencia =
    normalizarPersistenciaPedagogica(
      persistenciaOriginal,
    );

  if (
    !persistencia
  ) {

    return null;

  }

  if (
    persistencia.tipoRelacion ===
      TIPOS_RELACION_ASIGNATURAS.MISMA_AREA &&
    !persistencia.esPersistencia
  ) {

    return crearInterpretacionMismaArea(
      persistencia,
    );

  }

  if (
    !persistencia.esPersistencia
  ) {

    return null;

  }

  switch (
    persistencia.estadoActual
  ) {

    case "TED":

      return crearInterpretacionPersistenciaTED(
        persistencia,
      );

    case "TEP":

      return crearInterpretacionPersistenciaTEP(
        persistencia,
      );

    case "TEA":

      return crearInterpretacionEvolucionTEA(
        persistencia,
      );

    default:

      return {

        codigo:
          "CONTINUIDAD_DISCIPLINAR_DETECTADA",

        tipo:
          TIPOS_INTERPRETACION_PEDAGOGICA
            .CONTINUIDAD_DISCIPLINAR,

        nivel:
          NIVELES_INTERPRETACION_PEDAGOGICA
            .INFORMATIVO,

        titulo:
          `Continuidad disciplinar entre ${persistencia.asignaturaPendiente} y ${persistencia.asignaturaActual}`,

        area:
          obtenerNombreAreaPedagogica(
            persistencia.areaActual ||
            persistencia.areaPendiente,
          ),

        asignaturaPendiente:
          persistencia.asignaturaPendiente,

        anioPendiente:
          persistencia.anioPendiente,

        asignaturaActual:
          persistencia.asignaturaActual,

        estadoActual:
          persistencia.estadoActual,

        periodo:
          persistencia.periodo,

        tipoRelacion:
          persistencia.tipoRelacion,

        descripcion:
          `Se reconoce una relación disciplinar entre ${persistencia.asignaturaPendiente} y ${persistencia.asignaturaActual}.`,

        interpretacion:
          "La relación detectada constituye un antecedente relevante para comprender la trayectoria actual.",

        orientacion:
          "Se recomienda analizar los saberes compartidos entre ambos espacios curriculares y considerar su articulación dentro del acompañamiento pedagógico.",

        prioridad:
          5,

        evidencias: [

          {
            tipo:
              "RELACION_DISCIPLINAR",

            asignaturaPendiente:
              persistencia.asignaturaPendiente,

            asignaturaActual:
              persistencia.asignaturaActual,

            relacion:
              persistencia.tipoRelacion,
          },

        ],

        evidenciaOriginal:
          persistencia.evidenciaOriginal,

      };

  }

}


/*
 * ============================================================
 * GENERACIÓN GENERAL
 * ============================================================
 */

/**
 * Interpreta una lista de persistencias producidas por el motor.
 */
export function generarInterpretacionesDesdePersistencias(
  persistencias = [],
) {

  const interpretaciones =
    obtenerListaInterpretacionesSegura(
      persistencias,
    )
      .map(
        interpretarPersistenciaPedagogica,
      )
      .filter(Boolean);

  return eliminarInterpretacionesDuplicadas(
    interpretaciones,
  )
    .sort(
      (
        interpretacionA,
        interpretacionB,
      ) => {

        const prioridadA =
          Number(
            interpretacionA
              ?.prioridad,
          ) || 0;

        const prioridadB =
          Number(
            interpretacionB
              ?.prioridad,
          ) || 0;

        return (
          prioridadB -
          prioridadA
        );

      },
    );

}


/**
 * Busca las persistencias en las diferentes ubicaciones en las
 * que podrían encontrarse dentro del diagnóstico.
 */
export function obtenerPersistenciasDiagnostico(
  diagnostico,
) {

  if (
    !esObjetoInterpretacionValido(
      diagnostico,
    )
  ) {
    return [];
  }

  const posiblesListas = [
    diagnostico.persistenciasDetalladas,

    diagnostico
      .detalleTecnico
      ?.persistenciasDetalladas,

    diagnostico
      .evaluacion
      ?.persistenciasDetalladas,

    diagnostico
      .trayectoria
      ?.persistenciasDetalladas,
  ];

  return posiblesListas
    .filter(Array.isArray)
    .flat()
    .filter(Boolean);

} 

export function generarInterpretacionesPedagogicas(
  diagnostico = {},
) {

  const persistencias =
    obtenerPersistenciasDiagnostico(
      diagnostico,
    );

  return generarInterpretacionesDesdePersistencias(
    persistencias,
  );

}

export function generarAntecedentesAcademicos(
  diagnostico = {},
) {

  const antecedentes =
    diagnostico.antecedentes ||
    {};

  const pendientes =
    Array.isArray(
      antecedentes
        .asignaturasPendientes,
    )
      ? antecedentes
          .asignaturasPendientes
      : [];

  const persistencias =
    obtenerPersistenciasDiagnostico(
      diagnostico,
    );

  const continuidades = [];

  persistencias.forEach(
    (persistencia) => {

      const coincidencias =
        Array.isArray(
          persistencia
            ?.pendientesCoincidentes,
        )
          ? persistencia
              .pendientesCoincidentes
          : [];

      coincidencias
        .filter(
          (coincidencia) =>
            coincidencia
              ?.esPersistencia,
        )
        .forEach(
          (coincidencia) => {

            const pendienteOriginal =
              coincidencia
                ?.pendienteOriginal ||
              {};

            continuidades.push({
              asignaturaPendiente:
                coincidencia
                  .asignaturaPendiente ||
                pendienteOriginal
                  .asignatura ||
                coincidencia
                  .nombrePendiente ||
                "",

              anioPendiente:
                pendienteOriginal
                  .anio ||
                pendienteOriginal
                  .año ||
                null,

              asignaturaActual:
                coincidencia
                  .asignaturaActual ||
                persistencia
                  .asignatura ||
                "",

              estadoActual:
                persistencia
                  .conceptual ||
                persistencia
                  .estadoActual ||
                "",

              tipoRelacion:
                coincidencia
                  .tipo ||
                null,

              areaActual:
                coincidencia
                  .areaActual ||
                null,

              trayectoriaActual:
                coincidencia
                  .trayectoriaActual ||
                null,
            });

          },
        );

    },
  );

  const normalizarNombre =
    (valor) =>
      String(
        valor || "",
      )
        .trim()
        .toLocaleLowerCase(
          "es",
        );

  const conContinuidad =
    pendientes
      .map(
        (pendiente) => {

          const nombrePendiente =
            pendiente
              ?.asignatura ||
            pendiente
              ?.nombre ||
            "";

          const coincidencias =
            continuidades.filter(
              (continuidad) =>
                normalizarNombre(
                  continuidad
                    .asignaturaPendiente,
                ) ===
                normalizarNombre(
                  nombrePendiente,
                ),
            );

          if (
            coincidencias.length === 0
          ) {

            return null;

          }

          return {
            pendiente,
            coincidencias,
          };

        },
      )
      .filter(Boolean);

  const nombresConContinuidad =
    new Set(
      conContinuidad.map(
        (elemento) =>
          normalizarNombre(
            elemento
              ?.pendiente
              ?.asignatura ||
            elemento
              ?.pendiente
              ?.nombre,
          ),
      ),
    );

  const sinContinuidad =
    pendientes.filter(
      (pendiente) =>
        !nombresConContinuidad.has(
          normalizarNombre(
            pendiente
              ?.asignatura ||
            pendiente
              ?.nombre,
          ),
        ),
    );

  return {
    todas:
      pendientes,

    cantidadTotal:
      pendientes.length,

    conContinuidad,

    sinContinuidad,

    continuidades,
  };

}
/*
 * ============================================================
 * RESUMEN DE INTERPRETACIONES
 * ============================================================
 */

/**
 * Organiza las interpretaciones por nivel.
 */
export function resumirInterpretacionesPedagogicas(
  interpretaciones = [],
) {

  const lista =
    obtenerListaInterpretacionesSegura(
      interpretaciones,
    );

  return {

    total:
      lista.length,

    altas:
      lista.filter(
        (interpretacion) =>
          interpretacion.nivel ===
          NIVELES_INTERPRETACION_PEDAGOGICA
            .ALTO,
      ),

    medias:
      lista.filter(
        (interpretacion) =>
          interpretacion.nivel ===
          NIVELES_INTERPRETACION_PEDAGOGICA
            .MEDIO,
      ),

    favorables:
      lista.filter(
        (interpretacion) =>
          interpretacion.nivel ===
          NIVELES_INTERPRETACION_PEDAGOGICA
            .POSITIVO,
      ),

    informativas:
      lista.filter(
        (interpretacion) =>
          interpretacion.nivel ===
          NIVELES_INTERPRETACION_PEDAGOGICA
            .INFORMATIVO,
      ),

  };

}


/*
 * ============================================================
 * EXPORTACIÓN PRINCIPAL
 * ============================================================
 */

export default generarInterpretacionesPedagogicas;