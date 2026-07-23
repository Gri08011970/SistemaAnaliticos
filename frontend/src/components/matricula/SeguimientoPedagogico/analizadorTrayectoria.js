/*
 * ============================================================
 * ANALIZADOR INSTITUCIONAL DE TRAYECTORIAS
 * ============================================================
 *
 * Este archivo constituye la puerta única de entrada al motor
 * institucional.
 *
 * Recibe los datos disponibles en la interfaz:
 *
 * - estudiante;
 * - seguimiento pedagógico;
 * - asignaturas;
 * - período seleccionado.
 *
 * Y coordina:
 *
 * 1. preparación de los registros;
 * 2. evaluación de la trayectoria;
 * 3. diagnóstico institucional;
 * 4. generación del informe.
 *
 * React no debe conocer ni reproducir esta lógica.
 * ============================================================
 */

import {
  evaluarTrayectoriaAlumno,
} from "./trayectoriaInstitucional";

import {
  crearDiagnosticoInstitucional,
} from "./diagnosticoInstitucional";

import {
  generarInformeInstitucional,
} from "./informeInstitucional";


/*
 * ============================================================
 * CONSTANTES
 * ============================================================
 */

export const PERIODOS_ANALISIS_TRAYECTORIA = [
  "mayo",
  "primerCuat",
  "octubre",
  "segundoCuat",
  "diciembre",
  "febrero",
  "marzo",
  "final",
];

export const ETIQUETAS_PERIODOS_ANALISIS = {
  mayo: "Mayo",
  primerCuat: "1° Cuatrimestre",
  octubre: "Octubre",
  segundoCuat: "2° Cuatrimestre",
  diciembre: "Diciembre",
  febrero: "Febrero",
  marzo: "Marzo",
  final: "Final",
};


/*
 * ============================================================
 * UTILIDADES BÁSICAS
 * ============================================================
 */

function esObjetoValido(valor) {
  return (
    valor !== null &&
    typeof valor === "object" &&
    !Array.isArray(valor)
  );
}


function obtenerListaSegura(valor) {
  return Array.isArray(valor)
    ? valor
    : [];
}


function obtenerPeriodoSeguro(periodo) {
  if (
    PERIODOS_ANALISIS_TRAYECTORIA.includes(
      periodo,
    )
  ) {
    return periodo;
  }

  return "final";
}


function obtenerEtiquetaPeriodo(periodo) {
  return (
    ETIQUETAS_PERIODOS_ANALISIS[
      periodo
    ] ||
    periodo ||
    "Sin período"
  );
}


/*
 * ============================================================
 * NORMALIZACIÓN DE ASIGNATURAS PENDIENTES
 * ============================================================
 */

function obtenerAsignaturasPendientes(
  alumno,
) {
  const materiasPendientes =
    obtenerListaSegura(
      alumno?.materiasPendientes,
    );

  return materiasPendientes.filter(
    (materia) => {
      if (!materia) {
        return false;
      }

      const asignatura =
        typeof materia === "string"
          ? materia
          : materia.asignatura;

      return (
        typeof asignatura === "string" &&
        asignatura.trim() !== "" &&
        asignatura.trim() !==
          "----------"
      );
    },
  );
}


/*
 * ============================================================
 * PREPARACIÓN DEL SEGUIMIENTO ACTUAL
 * ============================================================
 */

/**
 * Convierte el objeto de seguimiento utilizado por React:
 *
 * {
 *   "3°1°-Matemática-id-mayo": {
 *      conceptual: "TEP",
 *      nota: "5"
 *   }
 * }
 *
 * en una lista independiente de la interfaz:
 *
 * [
 *   {
 *      asignatura: "Matemática",
 *      conceptual: "TEP",
 *      nota: "5",
 *      periodo: "mayo"
 *   }
 * ]
 */
export function prepararRegistrosTrayectoria({
  alumno,
  seguimiento = {},
  asignaturas = [],
  periodo = "final",
}) {
  if (!esObjetoValido(alumno)) {
    return [];
  }

  const periodoSeguro =
    obtenerPeriodoSeguro(periodo);

  const curso =
    alumno.curso || "";

  const alumnoId =
    alumno._id ||
    alumno.id ||
    alumno.dni ||
    "";

  return obtenerListaSegura(
    asignaturas,
  ).map((asignatura) => {
    const clave =
      `${curso}-` +
      `${asignatura}-` +
      `${alumnoId}-` +
      `${periodoSeguro}`;

    const dato =
      seguimiento[clave] || {};

    return {
      asignatura,

      conceptual:
        dato.conceptual || "-",

      nota:
        dato.nota ?? "",

      periodo:
        periodoSeguro,

      periodoEtiqueta:
        obtenerEtiquetaPeriodo(
          periodoSeguro,
        ),

      curso,

      alumnoId:
        String(alumnoId),

      tieneRegistro:
        Boolean(
          dato.conceptual &&
          dato.conceptual !== "-",
        ),
    };
  });
}


/*
 * ============================================================
 * PREPARACIÓN DEL ESTUDIANTE
 * ============================================================
 */

export function prepararAlumnoParaAnalisis(
  alumno,
) {
  if (!esObjetoValido(alumno)) {
    return null;
  }

  return {
    ...alumno,

    id:
      alumno._id ||
      alumno.id ||
      alumno.dni ||
      null,

    nombreCompleto:
      [
        alumno.apellido,
        alumno.nombre,
      ]
        .filter(Boolean)
        .join(", "),

    materiasPendientes:
      obtenerAsignaturasPendientes(
        alumno,
      ),

    recursante:
      alumno.condicionFinal === "Rec",
  };
}


/*
 * ============================================================
 * ANALIZADOR PRINCIPAL
 * ============================================================
 */

/**
 * Ejecuta todo el recorrido institucional.
 *
 * Devuelve:
 *
 * {
 *   entrada,
 *   evaluacion,
 *   diagnostico,
 *   informe
 * }
 */
export function analizarTrayectoria({
  alumno,
  seguimiento = {},
  asignaturas = [],
  periodo = "final",
  institucion =
    'E.E.S. N° 140 "Florencio Molina Campos"',
} = {}) {
  const alumnoPreparado =
    prepararAlumnoParaAnalisis(
      alumno,
    );

  if (!alumnoPreparado) {
    return {
      entrada: null,
      evaluacion: null,
      diagnostico: null,
      informe: null,

      error:
        "No se recibió un estudiante válido para analizar.",
    };
  }

  const periodoSeguro =
    obtenerPeriodoSeguro(periodo);

  const registrosActuales =
    prepararRegistrosTrayectoria({
      alumno: alumnoPreparado,
      seguimiento,
      asignaturas,
      periodo: periodoSeguro,
    });

  /*
   * Esta es la estructura independiente de React.
   *
   * A partir de aquí trabajan exclusivamente los módulos
   * institucionales.
   */
  const entrada = {
    alumno:
      alumnoPreparado,

    estudiante:
      alumnoPreparado,

    curso:
      alumnoPreparado.curso || "",

    periodo:
      periodoSeguro,

    periodoEtiqueta:
      obtenerEtiquetaPeriodo(
        periodoSeguro,
      ),

    registrosActuales,

    seguimientoActual:
      registrosActuales,

    asignaturasPendientes:
      alumnoPreparado
        .materiasPendientes,

    fechaNacimiento:
      alumnoPreparado
        .fechaNacimiento,

    condicionFinal:
      alumnoPreparado
        .condicionFinal,

    recursante:
      alumnoPreparado
        .recursante,
  };

  const evaluacion =
    evaluarTrayectoriaAlumno({

        alumno: alumnoPreparado,

        desempenoActual:
            registrosActuales,

        asignaturasPendientes:
            alumnoPreparado.materiasPendientes,

        sobreedad:
            Boolean(
                alumnoPreparado.sobreedad,
            ),

        recursante:
            alumnoPreparado.recursante,

    }); 

  const diagnostico =
    crearDiagnosticoInstitucional(
      evaluacion,
    );

  const informe =
    generarInformeInstitucional(
      diagnostico,
      {
        estudiante:
          alumnoPreparado,

        curso:
          alumnoPreparado.curso ||
          "",

        periodo:
          obtenerEtiquetaPeriodo(
            periodoSeguro,
          ),

        institucion,
      },
    );

  return {
    entrada,

    evaluacion,

    diagnostico,

    informe,

    error: null,
  };
}


/*
 * ============================================================
 * EXPORTACIÓN ALTERNATIVA
 * ============================================================
 */

export const analizarTrayectoriaInstitucional =
  analizarTrayectoria;

export default analizarTrayectoria;