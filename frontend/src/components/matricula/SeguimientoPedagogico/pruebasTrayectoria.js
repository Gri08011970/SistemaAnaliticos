/*
 * ============================================================
 * PRUEBAS MANUALES DEL MODELO INSTITUCIONAL
 * ============================================================
 *
 * Este archivo funciona como banco de pruebas del motor de
 * análisis de trayectorias.
 *
 * NO modifica estudiantes.
 * NO guarda información.
 * NO altera localStorage.
 * NO se conecta con MongoDB.
 *
 * Solamente ejecuta casos ficticios y muestra en consola si el
 * resultado obtenido coincide con el esperado.
 * ============================================================
 */

import {
  analizarRelacionAsignaturas,
  TIPOS_RELACION_ASIGNATURAS,
} from "./equivalenciasAsignaturas";

import {
  detectarPersistenciaAsignatura,
  evaluarTrayectoriaAlumno,
} from "./trayectoriaInstitucional";

import {
  evaluarDiagnosticoInstitucionalEtapa1,
} from "./criteriosInstitucionales";

/*
 * ============================================================
 * UTILIDADES DE PRUEBA
 * ============================================================
 */

/**
 * Muestra un resultado simple en consola.
 */
function mostrarResultado({
  titulo,
  esperado,
  obtenido,
  aprobado,
  detalle = null,
}) {
  const simbolo = aprobado ? "✅" : "❌";

  console.group(`${simbolo} ${titulo}`);

  console.log("Esperado:", esperado);
  console.log("Obtenido:", obtenido);

  if (detalle) {
    console.log("Detalle:", detalle);
  }

  console.groupEnd();
}

/**
 * Ejecuta una prueba de relación entre dos asignaturas.
 */
function probarRelacion({
  titulo,
  asignaturaActual,
  asignaturaPendiente,
  tipoEsperado,
  persistenciaEsperada,
}) {
  const resultado =
    analizarRelacionAsignaturas({
      asignaturaActual,
      asignaturaPendiente,
    });

  const aprobado =
    resultado.tipo === tipoEsperado &&
    resultado.esPersistencia ===
      persistenciaEsperada;

  mostrarResultado({
    titulo,
    esperado: {
      tipo: tipoEsperado,
      esPersistencia:
        persistenciaEsperada,
    },
    obtenido: {
      tipo: resultado.tipo,
      esPersistencia:
        resultado.esPersistencia,
    },
    aprobado,
    detalle: resultado,
  });

  return aprobado;
}

/**
 * Ejecuta una prueba completa de persistencia considerando:
 *
 * - asignatura actual;
 * - conceptual actual;
 * - materias pendientes.
 */
function probarPersistencia({
  titulo,
  asignaturaActual,
  conceptualActual,
  asignaturasPendientes,
  existeEsperado,
  tipoEsperado = null,
}) {
  const resultado =
    detectarPersistenciaAsignatura({
      asignaturaActual,
      conceptualActual,
      asignaturasPendientes,
    });

  const coincideExistencia =
    resultado.existe === existeEsperado;

  const coincideTipo =
    tipoEsperado === null
      ? true
      : resultado.tiposPersistencia.includes(
          tipoEsperado,
        );

  const aprobado =
    coincideExistencia && coincideTipo;

  mostrarResultado({
    titulo,
    esperado: {
      existe: existeEsperado,
      tipo: tipoEsperado,
    },
    obtenido: {
      existe: resultado.existe,
      tiposPersistencia:
        resultado.tiposPersistencia,
    },
    aprobado,
    detalle: resultado,
  });

  return aprobado;
}

/*
 * ============================================================
 * CASOS DE RELACIÓN ENTRE ASIGNATURAS
 * ============================================================
 */

export function ejecutarPruebasRelaciones() {
  console.group(
    "🧠 PRUEBAS DE RELACIONES ENTRE ASIGNATURAS",
  );

  const resultados = [];

  /*
   * CASO 1
   *
   * Historia actual + Historia pendiente
   * → coincidencia exacta
   */
  resultados.push(
    probarRelacion({
      titulo:
        "Caso 1 · Historia + Historia",
      asignaturaActual: "Historia",
      asignaturaPendiente: "Historia",
      tipoEsperado:
        TIPOS_RELACION_ASIGNATURAS.EXACTA,
      persistenciaEsperada: true,
    }),
  );

  /*
   * CASO 2
   *
   * Matemática Ciclo Superior + Matemática
   * → continuidad directa
   */
  resultados.push(
    probarRelacion({
      titulo:
        "Caso 2 · Matemática Ciclo Superior + Matemática",
      asignaturaActual:
        "Matemática Ciclo Superior",
      asignaturaPendiente:
        "Matemática",
      tipoEsperado:
        TIPOS_RELACION_ASIGNATURAS.DIRECTA,
      persistenciaEsperada: true,
    }),
  );

  /*
   * CASO 3
   *
   * Historia actual + Ciencias Sociales pendiente
   * → coincidencia heredada
   */
  resultados.push(
    probarRelacion({
      titulo:
        "Caso 3 · Historia + Ciencias Sociales",
      asignaturaActual: "Historia",
      asignaturaPendiente:
        "Ciencias Sociales",
      tipoEsperado:
        TIPOS_RELACION_ASIGNATURAS.HEREDADA,
      persistenciaEsperada: true,
    }),
  );

  /*
   * CASO 4
   *
   * Historia actual + Geografía pendiente
   * → misma área general
   * → no persistencia específica
   */
  resultados.push(
    probarRelacion({
      titulo:
        "Caso 4 · Historia + Geografía",
      asignaturaActual: "Historia",
      asignaturaPendiente: "Geografía",
      tipoEsperado:
        TIPOS_RELACION_ASIGNATURAS.MISMA_AREA,
      persistenciaEsperada: false,
    }),
  );

  /*
   * CASO 5
   *
   * Inglés actual + Matemática pendiente
   * → sin relación disciplinar
   */
  resultados.push(
    probarRelacion({
      titulo:
        "Caso 5 · Inglés + Matemática",
      asignaturaActual: "Inglés",
      asignaturaPendiente:
        "Matemática",
      tipoEsperado:
        TIPOS_RELACION_ASIGNATURAS.NINGUNA,
      persistenciaEsperada: false,
    }),
  );

  /*
   * CASO 6
   *
   * Física actual + Fisicoquímica pendiente
   * → coincidencia heredada
   */
  resultados.push(
    probarRelacion({
      titulo:
        "Caso 6 · Introducción a la Física + Fisicoquímica",
      asignaturaActual:
        "Introducción a la Física",
      asignaturaPendiente:
        "Fisicoquímica",
      tipoEsperado:
        TIPOS_RELACION_ASIGNATURAS.HEREDADA,
      persistenciaEsperada: true,
    }),
  );

  /*
   * CASO 7
   *
   * Química actual + Ciencias Naturales pendiente
   * → coincidencia heredada
   */
  resultados.push(
    probarRelacion({
      titulo:
        "Caso 7 · Introducción a la Química + Ciencias Naturales",
      asignaturaActual:
        "Introducción a la Química",
      asignaturaPendiente:
        "Ciencias Naturales",
      tipoEsperado:
        TIPOS_RELACION_ASIGNATURAS.HEREDADA,
      persistenciaEsperada: true,
    }),
  );

  /*
   * CASO 8
   *
   * Literatura actual + Prácticas del Lenguaje pendiente
   * → continuidad directa
   */
  resultados.push(
    probarRelacion({
      titulo:
        "Caso 8 · Literatura + Prácticas del Lenguaje",
      asignaturaActual: "Literatura",
      asignaturaPendiente:
        "Prácticas del Lenguaje",
      tipoEsperado:
        TIPOS_RELACION_ASIGNATURAS.DIRECTA,
      persistenciaEsperada: true,
    }),
  );

  const cantidadAprobadas =
    resultados.filter(Boolean).length;

  console.log(
    `Resultado: ${cantidadAprobadas} de ${resultados.length} pruebas aprobadas.`,
  );

  console.groupEnd();

  return {
    total: resultados.length,
    aprobadas: cantidadAprobadas,
    fallidas:
      resultados.length -
      cantidadAprobadas,
  };
}

/*
 * ============================================================
 * CASOS DE PERSISTENCIA SEGÚN EL CONCEPTUAL
 * ============================================================
 */

export function ejecutarPruebasPersistencias() {
  console.group(
    "📚 PRUEBAS DE PERSISTENCIA PEDAGÓGICA",
  );

  const resultados = [];

  /*
   * CASO 1
   *
   * TEP + misma asignatura pendiente
   * → existe persistencia
   */
  resultados.push(
    probarPersistencia({
      titulo:
        "Caso 1 · TEP en Historia + Historia pendiente",
      asignaturaActual: "Historia",
      conceptualActual: "TEP",
      asignaturasPendientes: [
        "Historia",
      ],
      existeEsperado: true,
      tipoEsperado:
        TIPOS_RELACION_ASIGNATURAS.EXACTA,
    }),
  );

  /*
   * CASO 2
   *
   * TED + continuidad directa
   * → existe persistencia
   */
  resultados.push(
    probarPersistencia({
      titulo:
        "Caso 2 · TED en Matemática Ciclo Superior + Matemática pendiente",
      asignaturaActual:
        "Matemática Ciclo Superior",
      conceptualActual: "TED",
      asignaturasPendientes: [
        "Matemática",
      ],
      existeEsperado: true,
      tipoEsperado:
        TIPOS_RELACION_ASIGNATURAS.DIRECTA,
    }),
  );

  /*
   * CASO 3
   *
   * TEP + antecedente común
   * → existe persistencia heredada
   */
  resultados.push(
    probarPersistencia({
      titulo:
        "Caso 3 · TEP en Historia + Ciencias Sociales pendiente",
      asignaturaActual: "Historia",
      conceptualActual: "TEP",
      asignaturasPendientes: [
        "Ciencias Sociales",
      ],
      existeEsperado: true,
      tipoEsperado:
        TIPOS_RELACION_ASIGNATURAS.HEREDADA,
    }),
  );

  /*
   * CASO 4
   *
   * TEP + materia de la misma área
   * → no existe persistencia específica
   */
  resultados.push(
    probarPersistencia({
      titulo:
        "Caso 4 · TEP en Historia + Geografía pendiente",
      asignaturaActual: "Historia",
      conceptualActual: "TEP",
      asignaturasPendientes: [
        "Geografía",
      ],
      existeEsperado: false,
    }),
  );

  /*
   * CASO 5
   *
   * TEA + misma asignatura pendiente
   *
   * Aunque existe un antecedente, no se considera persistencia
   * actual porque el desempeño vigente es favorable.
   */
  resultados.push(
    probarPersistencia({
      titulo:
        "Caso 5 · TEA en Historia + Historia pendiente",
      asignaturaActual: "Historia",
      conceptualActual: "TEA",
      asignaturasPendientes: [
        "Historia",
      ],
      existeEsperado: false,
    }),
  );

  /*
   * CASO 6
   *
   * Sin conceptual actual
   * → no existe persistencia evaluable
   */
  resultados.push(
    probarPersistencia({
      titulo:
        "Caso 6 · Sin conceptual + Matemática pendiente",
      asignaturaActual: "Matemática",
      conceptualActual: "",
      asignaturasPendientes: [
        "Matemática",
      ],
      existeEsperado: false,
    }),
  );

  /*
   * CASO 7
   *
   * Pendientes recibidas como objetos
   * → debe reconocer igualmente el nombre.
   */
  resultados.push(
    probarPersistencia({
      titulo:
        "Caso 7 · Pendiente recibida como objeto",
      asignaturaActual:
        "Introducción a la Física",
      conceptualActual: "TEP",
      asignaturasPendientes: [
        {
          asignatura:
            "Ciencias Naturales", 
          anio: "3°",
        },
      ],
      existeEsperado: true,
      tipoEsperado:
        TIPOS_RELACION_ASIGNATURAS.HEREDADA,
    }),
  );

  const cantidadAprobadas =
    resultados.filter(Boolean).length;

  console.log(
    `Resultado: ${cantidadAprobadas} de ${resultados.length} pruebas aprobadas.`,
  );

  console.groupEnd();

  return {
    total: resultados.length,
    aprobadas: cantidadAprobadas,
    fallidas:
      resultados.length -
      cantidadAprobadas,
  };
}

/*
 * ============================================================
 * PRUEBA INTEGRAL DE UN ESTUDIANTE FICTICIO
 * ============================================================
 */

export function ejecutarPruebaIntegralAlumno() {
  console.group(
    "🎓 PRUEBA INTEGRAL DE TRAYECTORIA",
  );

  const alumnoFicticio = {
    id: "alumno-prueba-001",
    apellido: "Pérez",
    nombre: "Ana",
    curso: "5°1°",
  };

  const resultado =
    evaluarTrayectoriaAlumno({
      alumno: alumnoFicticio,

      desempenoActual: [
        {
          asignatura:
            "Matemática Ciclo Superior",
          conceptual: "TEP",
        },
        {
          asignatura: "Historia",
          conceptual: "TED",
        },
        {
          asignatura: "Geografía",
          conceptual: "TEA",
        },
        {
          asignatura: "Inglés",
          conceptual: "TEA",
        },
      ],

      asignaturasPendientes: [
        {
          asignatura: "Matemática",
          anio: "4°",
        },
        {
          asignatura:
            "Ciencias Sociales",
          anio: "2°",
        },
        {
          asignatura: "Inglés",
          anio: "3°",
        },
      ],

      sobreedad: true,
      recursante: false,
    });

  const cumpleSituacionActual =
    resultado.situacionActual.tea === 2 &&
    resultado.situacionActual.tep === 1 &&
    resultado.situacionActual.ted === 1;

  const cumplePersistencias =
    resultado.resumenPersistencias
      .cantidadAsignaturasConPersistencia ===
    2;

  const cumpleFactores =
    resultado.factores.some(
      (factor) =>
        factor.codigo ===
        "PERSISTENCIA_DISCIPLINAR",
    ) &&
    resultado.factores.some(
      (factor) =>
        factor.codigo === "SOBREEDAD",
    );

  const aprobado =
    cumpleSituacionActual &&
    cumplePersistencias &&
    cumpleFactores;

  mostrarResultado({
    titulo:
      "Alumno ficticio con persistencias y sobreedad",
    esperado: {
      tea: 2,
      tep: 1,
      ted: 1,
      asignaturasConPersistencia: 2,
      incluyeFactorPersistencia: true,
      incluyeFactorSobreedad: true,
    },
    obtenido: {
      tea:
        resultado.situacionActual.tea,
      tep:
        resultado.situacionActual.tep,
      ted:
        resultado.situacionActual.ted,
      asignaturasConPersistencia:
        resultado.resumenPersistencias
          .cantidadAsignaturasConPersistencia,
      factores:
        resultado.factores.map(
          (factor) => factor.codigo,
        ),
    },
    aprobado,
    detalle: resultado,
  });

  console.groupEnd();

  return {
    aprobado,
    resultado,
  };
}

/*
 * ============================================================
 * PRUEBAS DE NIVELES INSTITUCIONALES
 * ============================================================
 */

/**
 * Ejecuta una prueba completa del nivel institucional.
 *
 * Primero construye una trayectoria ficticia y después aplica
 * los criterios de la Etapa 1.
 */
function probarNivelInstitucional({
  titulo,
  desempenoActual = [],
  asignaturasPendientes = [],
  sobreedad = false,
  recursante = false,
  nivelEsperado,
  puntajeEsperado = null,
}) {
  const evaluacionTrayectoria =
    evaluarTrayectoriaAlumno({
      alumno: {
        id: `prueba-${titulo}`,
        apellido: "Prueba",
        nombre: "Institucional",
      },

      desempenoActual,
      asignaturasPendientes,
      sobreedad,
      recursante,
    });

  const diagnostico =
    evaluarDiagnosticoInstitucionalEtapa1(
      evaluacionTrayectoria,
    );

  const coincideNivel =
    diagnostico.nivelInstitucional ===
    nivelEsperado;

  const coincidePuntaje =
    puntajeEsperado === null
      ? true
      : diagnostico.puntaje ===
        puntajeEsperado;

  const aprobado =
    coincideNivel &&
    coincidePuntaje;

  mostrarResultado({
    titulo,
    esperado: {
      nivelInstitucional:
        nivelEsperado,
      puntaje: puntajeEsperado,
    },
    obtenido: {
      nivelInstitucional:
        diagnostico.nivelInstitucional,
      puntaje:
        diagnostico.puntaje,
    },
    aprobado,
    detalle: {
      evaluacionTrayectoria,
      diagnostico,
    },
  });

  return aprobado;
}

/**
 * Verifica los cuatro niveles institucionales:
 *
 * - bajo;
 * - medio;
 * - alto;
 * - crítico.
 *
 * Los casos fueron construidos según los pesos y umbrales
 * provisorios definidos en criteriosInstitucionales.js.
 */
export function ejecutarPruebasNivelesInstitucionales() {
  console.group(
    "🚦 PRUEBAS DE NIVELES INSTITUCIONALES",
  );

  const resultados = [];

  /*
   * NIVEL BAJO
   *
   * 1 TEP actual:
   *
   * TEP = 1 punto
   *
   * Total: 1
   */
  resultados.push(
    probarNivelInstitucional({
      titulo:
        "Nivel BAJO · 1 TEP sin antecedentes",

      desempenoActual: [
        {
          asignatura: "Inglés",
          conceptual: "TEP",
        },
      ],

      asignaturasPendientes: [],

      sobreedad: false,

      recursante: false,

      nivelEsperado: "bajo",

      puntajeEsperado: 1,
    }),
  );

  /*
   * NIVEL MEDIO
   *
   * 1 TED actual:
   *
   * TED = 3 puntos
   *
   * Total: 3
   */
  resultados.push(
    probarNivelInstitucional({
      titulo:
        "Nivel MEDIO · 1 TED sin antecedentes",

      desempenoActual: [
        {
          asignatura: "Inglés",
          conceptual: "TED",
        },
      ],

      asignaturasPendientes: [],

      sobreedad: false,

      recursante: false,

      nivelEsperado: "medio",

      puntajeEsperado: 3,
    }),
  );

  /*
   * NIVEL ALTO
   *
   * 1 TED actual:
   *   3 puntos
   *
   * 1 asignatura pendiente:
   *   1 punto
   *
   * 1 persistencia exacta:
   *   3 puntos
   *
   * Total: 7
   */
  resultados.push(
    probarNivelInstitucional({
      titulo:
        "Nivel ALTO · TED con persistencia exacta",

      desempenoActual: [
        {
          asignatura: "Historia",
          conceptual: "TED",
        },
      ],

      asignaturasPendientes: [
        "Historia",
      ],

      sobreedad: false,

      recursante: false,

      nivelEsperado: "alto",

      puntajeEsperado: 7,
    }),
  );

  /*
   * NIVEL CRÍTICO
   *
   * 1 TED:
   *   3 puntos
   *
   * 1 TEP:
   *   1 punto
   *
   * 2 asignaturas pendientes:
   *   2 puntos
   *
   * Persistencia directa:
   *   3 puntos
   *
   * Sobreedad:
   *   1 punto
   *
   * Recursancia:
   *   2 puntos
   *
   * Total: 12
   */
  resultados.push(
    probarNivelInstitucional({
      titulo:
        "Nivel CRÍTICO · múltiples factores combinados",

      desempenoActual: [
        {
          asignatura:
            "Matemática Ciclo Superior",
          conceptual: "TED",
        },
        {
          asignatura: "Inglés",
          conceptual: "TEP",
        },
      ],

      asignaturasPendientes: [
        "Matemática",
        "Geografía",
      ],

      sobreedad: true,

      recursante: true,

      nivelEsperado: "critico",

      puntajeEsperado: 12,
    }),
  );

  const cantidadAprobadas =
    resultados.filter(Boolean).length;

  console.log(
    `Resultado: ${cantidadAprobadas} de ${resultados.length} pruebas aprobadas.`,
  );

  console.groupEnd();

  return {
    total: resultados.length,

    aprobadas:
      cantidadAprobadas, 

    fallidas:
      resultados.length -
      cantidadAprobadas,
  };
}

/*
 * ============================================================
 * EJECUCIÓN GENERAL
 * ============================================================
 */

/**
 * Ejecuta todas las pruebas del modelo.
 */
export function ejecutarTodasLasPruebasTrayectoria() {
  console.group(
    "🏫 BANCO DE PRUEBAS DEL MODELO INSTITUCIONAL",
  );

  const relaciones =
    ejecutarPruebasRelaciones();

  const persistencias =
    ejecutarPruebasPersistencias();

  const integral =
    ejecutarPruebaIntegralAlumno();

  const nivelesInstitucionales =
    ejecutarPruebasNivelesInstitucionales();

  const total =
    relaciones.total +
    persistencias.total +
    1 +
    nivelesInstitucionales.total;

  const aprobadas =
    relaciones.aprobadas +
    persistencias.aprobadas +
    (integral.aprobado ? 1 : 0) +
    nivelesInstitucionales.aprobadas;

  const resumen = {
    total,

    aprobadas,

    fallidas:
      total - aprobadas,
  };

  if (resumen.fallidas === 0) {
    console.log(
      `✅ TODAS LAS PRUEBAS APROBADAS: ${resumen.aprobadas} de ${resumen.total}`,
    );
  } else {
    console.error(
      `❌ PRUEBAS CON ERRORES: ${resumen.aprobadas} aprobadas y ${resumen.fallidas} fallidas.`,
    );
  }

  console.groupEnd();

  return resumen;
}

/*
 * ============================================================
 * EJECUCIÓN TEMPORAL AUTOMÁTICA
 * ============================================================
 *
 * Mientras estemos validando el motor, esta llamada ejecutará
 * las pruebas cuando el archivo sea importado.
 *
 * Más adelante podremos eliminarla o comentarla.
 */

 ejecutarTodasLasPruebasTrayectoria();