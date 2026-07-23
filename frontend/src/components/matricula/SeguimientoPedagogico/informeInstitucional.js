/*
 * ============================================================
 * INFORME INSTITUCIONAL
 * ============================================================
 *
 * Este archivo organiza la información producida por el
 * diagnóstico institucional para que pueda ser presentada,
 * impresa o exportada por la interfaz.
 *
 * No calcula puntajes.
 *
 * No determina niveles.
 *
 * No clasifica trayectorias.
 *
 * Su responsabilidad consiste en:
 *
 * - enriquecer los códigos del diagnóstico;
 * - organizar las distintas secciones del informe;
 * - construir un resumen institucional;
 * - producir una conclusión general;
 * - conservar el detalle técnico para consultas posteriores.
 *
 * ============================================================
 */

import { enriquecerListaDiagnostico } from "./mensajesDiagnostico";
import { generarInterpretacionesPedagogicas } from "./interpretacionesPedagogicas";

/*
 * ============================================================
 * CATEGORÍAS INSTITUCIONALES
 * ============================================================
 *
 * Se mantienen como códigos independientes para evitar que la
 * interfaz dependa de textos narrativos.
 * ============================================================
 */

export const CATEGORIAS_INFORME = {
  FAVORABLE: "FAVORABLE",

  SEGUIMIENTO: "SEGUIMIENTO",

  PRIORITARIO: "PRIORITARIO",

  SIN_REGISTROS: "SIN_REGISTROS",
};

/*
 * ============================================================
 * TÍTULOS DEL INFORME
 * ============================================================
 */

export const TITULOS_CATEGORIA_INFORME = {
  [CATEGORIAS_INFORME.FAVORABLE]: "Trayectoria institucional favorable",

  [CATEGORIAS_INFORME.SEGUIMIENTO]: "Trayectoria que requiere seguimiento",

  [CATEGORIAS_INFORME.PRIORITARIO]: "INFORME INSTITUCIONAL DE SEGUIMIENTO PEDAGÓGICO",

  [CATEGORIAS_INFORME.SIN_REGISTROS]: "Trayectoria sin información suficiente",
};

/*
 * ============================================================
 * RESÚMENES INSTITUCIONALES
 * ============================================================
 */

export const RESUMENES_CATEGORIA_INFORME = {
  [CATEGORIAS_INFORME.FAVORABLE]:
    "La información disponible presenta condiciones generales favorables para la continuidad de la trayectoria escolar. No se identifican indicadores que requieran una intervención pedagógica específica o prioritaria.",

  [CATEGORIAS_INFORME.SEGUIMIENTO]:
    "La trayectoria presenta indicadores que requieren observación y acompañamiento institucional. Se recomienda sostener un seguimiento planificado para favorecer la consolidación y continuidad de los aprendizajes.",

  [CATEGORIAS_INFORME.PRIORITARIO]:
    "La trayectoria presenta indicadores que requieren una intervención institucional prioritaria, articulada y sostenida. Resulta necesario analizar la situación junto al equipo docente y definir estrategias concretas de acompañamiento.",

  [CATEGORIAS_INFORME.SIN_REGISTROS]:
    "La información pedagógica disponible no resulta suficiente para construir una valoración institucional completa. Es necesario actualizar o completar los registros antes de establecer conclusiones.",
};

/*
 * ============================================================
 * CONCLUSIONES INSTITUCIONALES
 * ============================================================
 */

export const CONCLUSIONES_CATEGORIA_INFORME = {
  [CATEGORIAS_INFORME.FAVORABLE]:
    "Se sugiere continuar con el acompañamiento pedagógico habitual, sostener las estrategias que favorecen la trayectoria y mantener actualizados los registros institucionales.",

  [CATEGORIAS_INFORME.SEGUIMIENTO]:
    "Se sugiere acordar acciones de seguimiento entre los actores institucionales involucrados, registrar los avances y revisar periódicamente la evolución de la trayectoria.",

  [CATEGORIAS_INFORME.PRIORITARIO]:
    "Se sugiere construir una estrategia institucional de intervención, establecer prioridades pedagógicas, distribuir responsabilidades y definir instancias periódicas de revisión.",

  [CATEGORIAS_INFORME.SIN_REGISTROS]:
    "No corresponde establecer una conclusión pedagógica definitiva hasta disponer de información suficiente, actualizada y compartida por los actores institucionales.",
};

/*
 * ============================================================
 * TEXTO DE RESPONSABILIDAD PROFESIONAL
 * ============================================================
 */

export const ACLARACION_INSTITUCIONAL =
  "Este informe constituye una herramienta de apoyo para el análisis pedagógico institucional. No reemplaza la valoración profesional, contextual y colectiva del equipo docente y directivo.";

/*
 * ============================================================
 * FUNCIONES AUXILIARES
 * ============================================================
 */

/**
 * Verifica que un valor sea un objeto válido.
 */
export function esObjetoValido(valor) {
  return valor !== null && typeof valor === "object" && !Array.isArray(valor);
}

/**
 * Convierte un valor en una lista segura.
 */
export function obtenerListaSegura(valor) {
  return Array.isArray(valor) ? valor : [];
}

/**
 * Convierte una lista que puede contener códigos u objetos en
 * una lista uniforme de objetos.
 *
 * Entrada posible:
 *
 * [
 *   "TED_ACTUAL",
 *   {
 *     codigo: "PERSISTENCIA_DIRECTA",
 *     prioridad: 8
 *   }
 * ]
 *
 * Salida:
 *
 * [
 *   {
 *     codigo: "TED_ACTUAL"
 *   },
 *   {
 *     codigo: "PERSISTENCIA_DIRECTA",
 *     prioridad: 8
 *   }
 * ]
 */
export function normalizarElementosInforme(elementos = []) {
  return obtenerListaSegura(elementos)
    .map((elemento) => {
      if (typeof elemento === "string") {
        return {
          codigo: elemento,
        };
      }

      if (esObjetoValido(elemento)) {
        return elemento;
      }

      return null;
    })
    .filter(Boolean);
}

/**
 * Enriquece una sección del informe.
 *
 * Admite tanto listas de códigos como listas de objetos.
 */
export function enriquecerSeccionInforme(elementos = []) {
  const elementosNormalizados = normalizarElementosInforme(elementos);

  return enriquecerListaDiagnostico(elementosNormalizados);
}

/**
 * Devuelve un código de categoría seguro.
 */
/**
 * Convierte las distintas variantes de categoría al código
 * institucional utilizado por el informe.
 */
export function normalizarCategoriaInforme(categoria) {
  if (typeof categoria !== "string" || !categoria.trim()) {
    return CATEGORIAS_INFORME.SIN_REGISTROS;
  }

  const categoriaNormalizada = categoria
    .trim()
    .replace(/[\s-]+/g, "_")
    .toUpperCase();

  const equivalencias = {
    FAVORABLE: CATEGORIAS_INFORME.FAVORABLE,

    SEGUIMIENTO: CATEGORIAS_INFORME.SEGUIMIENTO,

    PRIORITARIO: CATEGORIAS_INFORME.PRIORITARIO,

    PRIORITARIA: CATEGORIAS_INFORME.PRIORITARIO,

    SINREGISTROS: CATEGORIAS_INFORME.SIN_REGISTROS,

    SIN_REGISTROS: CATEGORIAS_INFORME.SIN_REGISTROS,
  };

  return (
    equivalencias[categoriaNormalizada] || CATEGORIAS_INFORME.SIN_REGISTROS
  );
}

/**
 * Devuelve un código de categoría seguro.
 */
export function obtenerCategoriaInforme(diagnostico) {
  return normalizarCategoriaInforme(diagnostico?.categoria);
}

/**
 * Devuelve el título correspondiente a una categoría.
 */
export function obtenerTituloInforme(categoria) {
  return (
    TITULOS_CATEGORIA_INFORME[categoria] ||
    "Informe institucional de trayectoria"
  );
}

/**
 * Devuelve el resumen correspondiente a una categoría.
 */
export function obtenerResumenInforme(categoria) {
  return (
    RESUMENES_CATEGORIA_INFORME[categoria] ||
    "La información disponible fue organizada para acompañar el análisis institucional de la trayectoria."
  );
}

/**
 * Devuelve la conclusión correspondiente a una categoría.
 */
export function obtenerConclusionInforme(categoria) {
  return (
    CONCLUSIONES_CATEGORIA_INFORME[categoria] ||
    "Se recomienda analizar la información junto al equipo institucional y acordar las acciones pedagógicas que resulten pertinentes."
  );
}

/**
 * Devuelve una fecha en formato institucional.
 */
export function formatearFechaInforme(fecha = new Date()) {
  const fechaValida = fecha instanceof Date ? fecha : new Date(fecha);

  if (Number.isNaN(fechaValida.getTime())) {
    return "";
  }

  return fechaValida.toLocaleDateString("es-AR", {
    day: "2-digit",

    month: "2-digit",

    year: "numeric",
  });
}

/**
 * Ordena una sección según su prioridad.
 *
 * Los elementos sin prioridad se ubican al final.
 */
export function ordenarSeccionPorPrioridad(elementos = []) {
  return [...obtenerListaSegura(elementos)].sort((elementoA, elementoB) => {
    const prioridadA = Number.isFinite(Number(elementoA?.prioridad))
      ? Number(elementoA.prioridad)
      : -1;

    const prioridadB = Number.isFinite(Number(elementoB?.prioridad))
      ? Number(elementoB.prioridad)
      : -1;

    return prioridadB - prioridadA;
  });
}

/**
 * Cuenta los mensajes encontrados y los códigos que todavía no
 * poseen contenido dentro del catálogo institucional.
 */
export function crearEstadoMensajes(secciones) {
  const elementos = Object.values(secciones).flatMap((seccion) =>
    obtenerListaSegura(seccion),
  );

  const encontrados = elementos.filter(
    (elemento) => elemento?.mensajeEncontrado === true,
  );

  const pendientes = elementos.filter(
    (elemento) => elemento?.mensajeEncontrado === false,
  );

  return {
    total: elementos.length,

    encontrados: encontrados.length,

    pendientes: pendientes.length,

    codigosPendientes: pendientes
      .map((elemento) => elemento.codigo)
      .filter(Boolean),
  };
}

/*
 * ============================================================
 * REDACCIÓN PERSONALIZADA DEL INFORME
 * ============================================================
 */

/**
 * Devuelve los primeros títulos diferentes de una sección.
 */
export function obtenerTitulosPrincipales(elementos = [], limite = 3) {
  const titulos = obtenerListaSegura(elementos)
    .map((elemento) => elemento?.titulo)
    .filter((titulo) => typeof titulo === "string" && titulo.trim());

  return [...new Set(titulos)].slice(0, limite);
}

/**
 * Une expresiones con una redacción natural.
 */
export function unirExpresiones(expresiones = []) {
  const lista = obtenerListaSegura(expresiones).filter(Boolean);

  if (lista.length === 0) {
    return "";
  }

  if (lista.length === 1) {
    return lista[0];
  }

  if (lista.length === 2) {
    return `${lista[0]} y ${lista[1]}`;
  }

  return `${lista.slice(0, -1).join(", ")} y ` + lista[lista.length - 1];
}

/**
 * Convierte una categoría técnica en una expresión narrativa.
 */
export function obtenerDescripcionCategoria(categoria) {
  const descripciones = {
    [CATEGORIAS_INFORME.FAVORABLE]: "una trayectoria institucional favorable",

    [CATEGORIAS_INFORME.SEGUIMIENTO]:
      "una trayectoria que requiere seguimiento institucional",

    [CATEGORIAS_INFORME.PRIORITARIO]:
      "una trayectoria que requiere intervención institucional prioritaria",

    [CATEGORIAS_INFORME.SIN_REGISTROS]:
      "una trayectoria que todavía no puede ser valorada de manera completa debido a la información disponible",
  };

  return (
    descripciones[categoria] ||
    "una trayectoria que requiere análisis institucional"
  );
}

/**
 * Genera un resumen narrativo a partir de la información real
 * contenida en el diagnóstico.
 */
export function generarResumenPersonalizado({
  categoria,
  periodo,
  nivel,
  puntaje,
  fortalezas = [],
  alertas = [],
}) {
  const descripcionCategoria = obtenerDescripcionCategoria(categoria);

  const alertasPrincipales = obtenerTitulosPrincipales(alertas, 3);

  const fortalezasPrincipales = obtenerTitulosPrincipales(fortalezas, 2);

  const partes = [];

  partes.push(
    `Durante el período ${
      periodo || "analizado"
    }, la información registrada permite reconocer ${descripcionCategoria}.`,
  );

  if (nivel && categoria !== CATEGORIAS_INFORME.SIN_REGISTROS) {
    partes.push(
      `La valoración alcanza un nivel institucional ${String(
        nivel,
      ).toLowerCase()}${
        Number.isFinite(Number(puntaje))
          ? `, con un puntaje de ${Number(puntaje)}`
          : ""
      }.`,
    );
  }

  if (alertasPrincipales.length > 0) {
    partes.push(
      `Entre los aspectos que requieren mayor atención se identifican: ${unirExpresiones(
        alertasPrincipales,
      ).toLowerCase()}.`,
    );
  }

  if (fortalezasPrincipales.length > 0) {
    partes.push(
      `Como aspectos favorables, se reconocen ${unirExpresiones(
        fortalezasPrincipales,
      ).toLowerCase()}.`,
    );
  }

  return partes.join(" ");
}

/**
 * Construye una conclusión concreta y vinculada con las
 * recomendaciones producidas por el diagnóstico.
 */
export function generarConclusionPersonalizada({
  categoria,
  periodo,
  recomendaciones = [],
}) {
  const recomendacionesPrincipales = obtenerTitulosPrincipales(
    recomendaciones,
    3,
  );

  if (categoria === CATEGORIAS_INFORME.SIN_REGISTROS) {
    return (
      "La información actualmente disponible no permite establecer una conclusión pedagógica definitiva. " +
      "Se considera necesario completar los registros, recuperar la valoración de los actores institucionales involucrados y realizar nuevamente el análisis de la trayectoria."
    );
  }

  if (categoria === CATEGORIAS_INFORME.FAVORABLE) {
    return (
      `La trayectoria analizada durante ${
        periodo || "el período seleccionado"
      } presenta condiciones generales favorables. ` +
      "Se recomienda sostener las estrategias pedagógicas implementadas, mantener actualizados los registros y continuar observando la evolución de los aprendizajes."
    );
  }

  const acciones =
    recomendacionesPrincipales.length > 0
      ? ` Las líneas de intervención prioritarias son: ${unirExpresiones(
          recomendacionesPrincipales,
        ).toLowerCase()}.`
      : "";

  if (categoria === CATEGORIAS_INFORME.PRIORITARIO) {
    return (
      `La trayectoria requiere una intervención pedagógica prioritaria, articulada y sostenida durante ${
        periodo || "el período analizado"
      }.` +
      acciones +
      " Se sugiere acordar responsables, definir metas de corto plazo, registrar las acciones implementadas y establecer una fecha institucional para revisar los avances."
    );
  }

  return (
    `La trayectoria requiere seguimiento planificado durante ${
      periodo || "el período analizado"
    }.` +
    acciones +
    " Se recomienda sostener el acompañamiento, documentar los avances y revisar periódicamente la evolución de los aprendizajes."
  );
}

/*
 * ============================================================
 * SÍNTESIS INSTITUCIONAL FINAL
 * ============================================================
 */

export function generarSintesisInstitucional({
  diagnostico,
  interpretacionesPedagogicas = [],
  periodo,
}) {
  const categoria = normalizarCategoriaInforme(diagnostico?.categoria);

  const cantidades = diagnostico?.detalleTecnico?.cantidades || {};

  const cantidadTEP = Number(
    cantidades.tep || cantidades.cantidadTEP || cantidades.totalTEP || 0,
  );

  const cantidadTED = Number(
    cantidades.ted || cantidades.cantidadTED || cantidades.totalTED || 0,
  );

  const interpretacionPrincipal =
    obtenerListaSegura(interpretacionesPedagogicas)[0] || null;

  const partes = [];

  if (categoria === CATEGORIAS_INFORME.SIN_REGISTROS) {
    return (
      "La información pedagógica disponible no resulta suficiente para construir una valoración institucional completa. " +
      "Se considera necesario completar los registros y realizar nuevamente el análisis de la trayectoria."
    );
  }

  if (categoria === CATEGORIAS_INFORME.FAVORABLE) {
    partes.push(
      `Durante ${
        periodo || "el período analizado"
      }, la trayectoria presenta condiciones generales favorables para la continuidad de los aprendizajes.`,
    );
  } else if (categoria === CATEGORIAS_INFORME.PRIORITARIO) {
    partes.push(
      `Durante el ${
        periodo || "el período analizado"
      }, la trayectoria requiere seguimiento e intervención pedagógica prioritaria.`,
    );
  } else {
    partes.push(
      `Durante ${
        periodo || "el período analizado"
      }, la trayectoria requiere seguimiento institucional planificado.`,
    );
  }

  const situaciones = [];

  if (cantidadTEP > 1) {
    situaciones.push("varias Trayectorias Educativas en Proceso");
  } else if (cantidadTEP === 1) {
    situaciones.push("una Trayectoria Educativa en Proceso");
  }

  if (cantidadTED > 1) {
    situaciones.push("varias Trayectorias Educativas Discontinuas");
  } else if (cantidadTED === 1) {
    const asignaturaTED =
      interpretacionPrincipal?.estadoActual === "TED"
        ? interpretacionPrincipal.asignaturaActual
        : null;

    situaciones.push(
      asignaturaTED
        ? `una Trayectoria Educativa Discontinua en ${asignaturaTED}`
        : "una Trayectoria Educativa Discontinua",
    );
  }

  if (situaciones.length > 0) {
    partes.push(`Se registran ${unirExpresiones(situaciones)}.`);
  }

  if (interpretacionPrincipal?.descripcion) {
    partes.push(interpretacionPrincipal.descripcion);
  }

  if (interpretacionPrincipal?.interpretacion) {
    partes.push(interpretacionPrincipal.interpretacion);
  }

  if (categoria === CATEGORIAS_INFORME.PRIORITARIO) {
    partes.push(
      "La situación observada aconseja un acompañamiento institucional articulado, sostenido y con metas de corto plazo.",
    );
  } else if (categoria === CATEGORIAS_INFORME.SEGUIMIENTO) {
    partes.push(
      "La situación observada aconseja sostener un acompañamiento planificado y revisar periódicamente la evolución de los aprendizajes.",
    );
  }

  return partes.join(" ");
}

/*
 * ============================================================
 * ORIENTACIÓN DE INTERVENCIÓN FINAL
 * ============================================================
 */

export function generarOrientacionIntervencion({
  diagnostico,
  interpretacionesPedagogicas = [],
}) {
  const categoria = normalizarCategoriaInforme(diagnostico?.categoria);

  if (categoria === CATEGORIAS_INFORME.SIN_REGISTROS) {
    return "Se recomienda completar los registros pedagógicos, recuperar la valoración de los docentes involucrados y realizar nuevamente el análisis antes de definir acciones institucionales.";
  }

  const interpretacionPrincipal =
    obtenerListaSegura(interpretacionesPedagogicas)[0] || null;

  const partes = [];

  if (interpretacionPrincipal?.orientacion) {
    partes.push(interpretacionPrincipal.orientacion);
  }

  const cantidades = diagnostico?.detalleTecnico?.cantidades || {};

  const cantidadTEP = Number(
    cantidades.tep || cantidades.cantidadTEP || cantidades.totalTEP || 0,
  );

  if (cantidadTEP > 0) {
    partes.push(
      "También se sugiere acordar estrategias comunes para las asignaturas que presentan TEP, establecer responsables de seguimiento, registrar las acciones implementadas y Se propone establecer una instancia de revisión institucional para valorar los avances alcanzados y redefinir, cuando resulte necesario, las estrategias de acompañamiento implementadas.",
    );
  } else if (categoria === CATEGORIAS_INFORME.PRIORITARIO) {
    partes.push(
      "Se sugiere acordar responsables, definir metas de corto plazo, registrar las acciones implementadas y establecer una fecha institucional para revisar los avances.",
    );
  } else {
    partes.push(
      "Se recomienda sostener el acompañamiento, registrar los avances y revisar periódicamente la evolución de la trayectoria.",
    );
  }

  return partes.join(" ");
}

/*
 * ============================================================
 * VALORACIÓN INSTITUCIONAL VISIBLE
 * ============================================================
 */

export function obtenerValoracionInstitucional(
  categoria,
) {

  const valoraciones = {

    [CATEGORIAS_INFORME.FAVORABLE]:
      "La trayectoria presenta condiciones favorables para la continuidad de los aprendizajes.",

    [CATEGORIAS_INFORME.SEGUIMIENTO]:
      "La trayectoria requiere seguimiento y acompañamiento pedagógico planificado.",

    [CATEGORIAS_INFORME.PRIORITARIO]:
      "La trayectoria requiere seguimiento e intervención pedagógica prioritaria.",

    [CATEGORIAS_INFORME.SIN_REGISTROS]:
      "La información disponible todavía no permite realizar una valoración institucional completa.",

  };

  return (
    valoraciones[
      categoria
    ] ||
    "La trayectoria requiere valoración y seguimiento institucional."
  );

}

/*
 * ============================================================
 * GENERACIÓN DEL INFORME
 * ============================================================
 */

/**
 * Genera el informe institucional completo.
 *
 * Recibe el objeto producido por:
 *
 * crearDiagnosticoInstitucional()
 *
 * y devuelve un objeto listo para ser consumido por React.
 */
export function generarInformeInstitucional(diagnostico, opciones = {}) {
  if (!esObjetoValido(diagnostico)) {
    return null;
  }

  const categoria = obtenerCategoriaInforme(diagnostico);

  const valoracionInstitucional =
  obtenerValoracionInstitucional(
    categoria,
  );

  const fechaGeneracion = opciones.fecha || new Date();

  const fortalezas = ordenarSeccionPorPrioridad(
    enriquecerSeccionInforme(diagnostico.fortalezas),
  );

  const alertas = ordenarSeccionPorPrioridad(
    enriquecerSeccionInforme(diagnostico.alertas),
  );

  const indicadores = ordenarSeccionPorPrioridad(
    enriquecerSeccionInforme(diagnostico.indicadores),
  );

  const factores = ordenarSeccionPorPrioridad(
    enriquecerSeccionInforme(diagnostico.factores),
  );

  /*
   * Estas dos secciones ya quedan preparadas.
   *
   * Mientras sus códigos todavía no estén incluidos en
   * mensajesDiagnostico.js, conservarán:
   *
   * mensajeEncontrado: false
   *
   * Cuando agreguemos sus catálogos, comenzarán a enriquecerse
   * automáticamente sin modificar este archivo.
   */
  const justificacion = ordenarSeccionPorPrioridad(
    enriquecerSeccionInforme(diagnostico.justificacion),
  );

  const recomendaciones = ordenarSeccionPorPrioridad(
    enriquecerSeccionInforme(diagnostico.recomendaciones),
  );

  const secciones = {
    fortalezas,

    alertas,

    indicadores,

    factores,

    justificacion,

    recomendaciones,
  };

  const estadoMensajes = crearEstadoMensajes(secciones);

  const interpretacionesPedagogicas =
    generarInterpretacionesPedagogicas(diagnostico);

  const nivel = diagnostico.nivel || diagnostico.nivelInstitucional || null;
 
  const puntaje = Number.isFinite(Number(diagnostico.puntaje))
    ? Number(diagnostico.puntaje)
    : 0;

  const periodoInforme = opciones.periodo || diagnostico.periodo || null;

  const sintesisInstitucional = generarSintesisInstitucional({
    diagnostico,
    interpretacionesPedagogicas,
    recomendaciones,
    periodo: periodoInforme,
  });

  const orientacionIntervencion = generarOrientacionIntervencion({
    diagnostico,
    interpretacionesPedagogicas,
    recomendaciones,
  });

  const resumenPersonalizado = generarResumenPersonalizado({
    categoria,
    periodo: periodoInforme,
    nivel,
    puntaje,
    fortalezas,
    alertas,
  });

  const conclusionPersonalizada = generarConclusionPersonalizada({
    categoria,
    periodo: periodoInforme,
    recomendaciones,
  });

  return {
    /*
     * Identificación general del informe.
     */
    tipo: "INFORME_INSTITUCIONAL_TRAYECTORIA",

    version: 1,

    fechaGeneracion:
      fechaGeneracion instanceof Date
        ? fechaGeneracion.toISOString()
        : new Date(fechaGeneracion).toISOString(),

    fechaFormateada: formatearFechaInforme(fechaGeneracion),

    /*
     * Datos opcionales del estudiante y del contexto.
     *
     * El generador no necesita conocer su estructura completa.
     * Simplemente conserva los datos recibidos.
     */
    estudiante: opciones.estudiante || diagnostico.estudiante || null,

    curso: opciones.curso || diagnostico.curso || null,

    periodo: opciones.periodo || diagnostico.periodo || null,

    institucion: opciones.institucion || null,

    /*
     * Encabezado institucional.
     */
    encabezado: {
      titulo: obtenerTituloInforme(categoria),

      categoria,

      nivel,

      puntaje,
    },

    /*
     * Lectura general de la trayectoria.
     */
    resumen: resumenPersonalizado,

    valoracionInstitucional, 

    sintesisInstitucional,

    orientacionIntervencion,

    /*
     * Secciones enriquecidas.
     */
    fortalezas,

    alertas,

    indicadores,

    factores,

    fundamentos: justificacion,

    justificacion,

    interpretacionesPedagogicas,

    recomendaciones,

    /*
     * Cierre del informe.
     */
    conclusion: conclusionPersonalizada,

    aclaracionInstitucional: ACLARACION_INSTITUCIONAL,

    /*
     * Información sobre el estado del catálogo.
     *
     * Nos permitirá detectar fácilmente códigos que todavía no
     * tengan textos institucionales asociados.
     */
    estadoMensajes,

    /*
     * Detalle técnico conservado para auditoría, pruebas o una
     * vista avanzada.
     */
    detalleTecnico: {
      ...(diagnostico.detalleTecnico || {}),

      cantidades:
        diagnostico.detalleTecnico?.cantidades ||
        diagnostico.cantidades ||
        null,

      persistencias:
        diagnostico.detalleTecnico?.persistencias ||
        diagnostico.persistencias ||
        null,

      interpretacionesPedagogicas,

      detallePuntaje:
        diagnostico.detalleTecnico?.detallePuntaje ||
        diagnostico.detallePuntaje ||
        null,

      parametrosAplicados:
        diagnostico.detalleTecnico?.parametrosAplicados ||
        diagnostico.parametrosAplicados ||
        null,
    },
    /*
     * Diagnóstico original.
     *
     * Se conserva para trazabilidad, sin modificarlo.
     */
    diagnosticoOriginal: diagnostico,

  };
}

/**
 * Alias breve para facilitar su utilización desde componentes.
 */
export function crearInformeInstitucional(diagnostico, opciones = {}) {
  return generarInformeInstitucional(diagnostico, opciones);
}

/*
 * ============================================================
 * EXPORTACIÓN PRINCIPAL 
 * ============================================================
 */

export default generarInformeInstitucional;
