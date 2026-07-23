/*
 * ============================================================
 * MENSAJES DEL DIAGNÓSTICO INSTITUCIONAL
 * ============================================================
 *
 * Este archivo representa la voz institucional del sistema.
 *
 * Aquí no existen reglas de negocio.
 *
 * Aquí no existen cálculos.
 *
 * Aquí no existen puntajes.
 *
 * Su única responsabilidad consiste en transformar códigos
 * institucionales en mensajes claros, consistentes y
 * pedagógicamente respetuosos.
 *
 * De esta manera, la lógica y la comunicación permanecen
 * completamente desacopladas.
 *
 * ============================================================
 */

/*
 * ============================================================
 * TIPOS DE MENSAJE
 * ============================================================
 */

export const TIPOS_MENSAJE = {

  FORTALEZA: "FORTALEZA",

  ALERTA: "ALERTA",

  JUSTIFICACION: "JUSTIFICACION",

  RECOMENDACION: "RECOMENDACION"

};

/*
 * ============================================================
 * NIVELES SEMÁNTICOS
 * ============================================================
 */

export const NIVELES_MENSAJE = {

  POSITIVO: "POSITIVO",

  INFORMATIVO: "INFORMATIVO",

  MEDIO: "MEDIO",

  ALTO: "ALTO",

  CRITICO: "CRITICO"

};

/*
 * ============================================================
 * CATEGORÍAS VISUALES
 * ============================================================
 */

export const CATEGORIAS_VISUALES = {

  INFORMACION: "INFORMACION",

  TRAYECTORIA: "TRAYECTORIA",

  PENDIENTES: "PENDIENTES",

  PERSISTENCIAS: "PERSISTENCIAS",

  CONTEXTO: "CONTEXTO",

  ACOMPANAMIENTO: "ACOMPANAMIENTO"

};


/*
 * ============================================================
 * MENSAJES DE FORTALEZAS
 * ============================================================
 *
 * Las fortalezas representan aspectos positivos observados en la
 * trayectoria.
 *
 * No implican ausencia absoluta de dificultades futuras.
 *
 * Expresan condiciones favorables detectadas en el momento del
 * análisis.
 * ============================================================
 */

export const MENSAJES_FORTALEZAS = {

  REGISTROS_COMPLETOS: {

    tipo:
      TIPOS_MENSAJE.FORTALEZA,

    nivel:
      NIVELES_MENSAJE.POSITIVO,

    categoriaVisual:
      CATEGORIAS_VISUALES.INFORMACION,

    titulo:
      "Información pedagógica disponible",

    descripcion:
      "Se dispone de registros suficientes para realizar una valoración institucional de la trayectoria.",

    impacto:
      "La información disponible permite construir un análisis fundamentado y reconocer la situación pedagógica actual.",

    orientacion:
      "Continuar sosteniendo registros claros, actualizados y compartidos entre los actores institucionales."

  },

  SIN_TEP: {

    tipo:
      TIPOS_MENSAJE.FORTALEZA,

    nivel:
      NIVELES_MENSAJE.POSITIVO,

    categoriaVisual:
      CATEGORIAS_VISUALES.TRAYECTORIA,

    titulo:
      "Sin trayectorias en proceso",

    descripcion:
      "No se registran asignaturas con Trayectoria Educativa en Proceso (TEP) en el período analizado.",

    impacto:
      "Los registros actuales no evidencian aprendizajes que se encuentren todavía en proceso de consolidación.",

    orientacion:
      "Sostener las estrategias pedagógicas que favorecen la continuidad y consolidación de los aprendizajes."

  },

  SIN_TED: {

    tipo:
      TIPOS_MENSAJE.FORTALEZA,

    nivel:
      NIVELES_MENSAJE.POSITIVO,

    categoriaVisual:
      CATEGORIAS_VISUALES.TRAYECTORIA,

    titulo:
      "Sin trayectorias discontinuas",

    descripcion:
      "No se registran asignaturas con Trayectoria Educativa Discontinua (TED) en el período analizado.",

    impacto:
      "La trayectoria actual no presenta señales de discontinuidad pedagógica en las asignaturas registradas.",

    orientacion:
      "Continuar acompañando la participación, la asistencia y la continuidad de los aprendizajes."

  },

  SIN_DIFICULTADES_ACTUALES: {

    tipo:
      TIPOS_MENSAJE.FORTALEZA,

    nivel:
      NIVELES_MENSAJE.POSITIVO,

    categoriaVisual:
      CATEGORIAS_VISUALES.TRAYECTORIA,

    titulo:
      "Situación pedagógica actual favorable",

    descripcion:
      "La información disponible no evidencia trayectorias en proceso ni trayectorias discontinuas.",

    impacto:
      "Los registros actuales muestran condiciones favorables para la continuidad de la trayectoria escolar.",

    orientacion:
      "Mantener el acompañamiento habitual y reconocer las estrategias pedagógicas que están favoreciendo esta situación."

  },

  SIN_ASIGNATURAS_PENDIENTES: {

    tipo:
      TIPOS_MENSAJE.FORTALEZA,

    nivel:
      NIVELES_MENSAJE.POSITIVO,

    categoriaVisual:
      CATEGORIAS_VISUALES.PENDIENTES,

    titulo:
      "Sin asignaturas pendientes",

    descripcion:
      "No se registran asignaturas pendientes correspondientes a años anteriores.",

    impacto:
      "La trayectoria no presenta espacios curriculares pendientes que requieran instancias adicionales de acreditación.",

    orientacion:
      "Sostener las condiciones que favorecen la acreditación oportuna de los aprendizajes."

  },

  SIN_PERSISTENCIAS: {

    tipo:
      TIPOS_MENSAJE.FORTALEZA,

    nivel:
      NIVELES_MENSAJE.POSITIVO,

    categoriaVisual:
      CATEGORIAS_VISUALES.PERSISTENCIAS,

    titulo:
      "Sin persistencias detectadas",

    descripcion:
      "No se observaron relaciones de persistencia entre las dificultades actuales y los antecedentes académicos.",

    impacto:
      "La información analizada no muestra dificultades que se prolonguen o reaparezcan a lo largo de la trayectoria.",

    orientacion:
      "Continuar el seguimiento habitual y sostener las estrategias que favorecen la progresión de los aprendizajes."

  },

  TRAYECTORIA_ACTUAL_FAVORABLE: {

    tipo:
      TIPOS_MENSAJE.FORTALEZA,

    nivel:
      NIVELES_MENSAJE.POSITIVO,

    categoriaVisual:
      CATEGORIAS_VISUALES.TRAYECTORIA,

    titulo:
      "Trayectoria institucional favorable",

    descripcion:
      "La trayectoria presenta condiciones generales favorables en la situación actual y en los antecedentes analizados.",

    impacto:
      "No se identifican indicadores que requieran una intervención pedagógica específica o prioritaria.",

    orientacion:
      "Sostener las prácticas de acompañamiento y registrar los avances que permiten conservar esta situación favorable."

  }

};

/*
 * ============================================================
 * MENSAJES DE ALERTAS
 * ============================================================
 *
 * Las alertas señalan aspectos de la trayectoria que requieren
 * análisis, seguimiento o intervención.
 *
 * No constituyen diagnósticos definitivos.
 *
 * No etiquetan al estudiante.
 *
 * Su función consiste en hacer visibles situaciones que el
 * equipo institucional necesita revisar.
 * ============================================================
 */

export const MENSAJES_ALERTAS = {

  SIN_REGISTROS_ACTUALES: {

    tipo:
      TIPOS_MENSAJE.ALERTA,

    nivel:
      NIVELES_MENSAJE.ALTO,

    categoriaVisual:
      CATEGORIAS_VISUALES.INFORMACION,

    titulo:
      "Información pedagógica insuficiente",

    descripcion:
      "No se dispone de registros pedagógicos actuales suficientes para realizar una valoración institucional de la trayectoria.",

    impacto:
      "La ausencia de información impide interpretar con precisión la situación actual del estudiante.",

    orientacion:
      "Completar o actualizar los registros antes de establecer conclusiones o definir estrategias de intervención."

  },

  TEP_ACTUAL: {

    tipo:
      TIPOS_MENSAJE.ALERTA,

    nivel:
      NIVELES_MENSAJE.MEDIO,

    categoriaVisual:
      CATEGORIAS_VISUALES.TRAYECTORIA,

    titulo:
      "Trayectoria educativa en proceso",

    descripcion:
      "Se registra al menos una asignatura con Trayectoria Educativa en Proceso (TEP).",

    impacto:
      "Existen aprendizajes que todavía requieren tiempo, acompañamiento y oportunidades de consolidación.",

    orientacion:
      "Identificar los aprendizajes pendientes y revisar las estrategias pedagógicas implementadas en la asignatura."

  },

  TED_ACTUAL: {

    tipo:
      TIPOS_MENSAJE.ALERTA,

    nivel:
      NIVELES_MENSAJE.ALTO,

    categoriaVisual:
      CATEGORIAS_VISUALES.TRAYECTORIA,

    titulo:
      "Trayectoria educativa discontinua",

    descripcion:
      "Se registra al menos una asignatura con Trayectoria Educativa Discontinua (TED).",

    impacto:
      "La continuidad de los aprendizajes se encuentra comprometida y requiere una intervención pedagógica específica.",

    orientacion:
      "Analizar las causas de la discontinuidad y planificar acciones que permitan restablecer la participación y el vínculo pedagógico."

  },

  MULTIPLES_TEP: {

    tipo:
      TIPOS_MENSAJE.ALERTA,

    nivel:
      NIVELES_MENSAJE.ALTO,

    categoriaVisual:
      CATEGORIAS_VISUALES.TRAYECTORIA,

    titulo:
      "Varias trayectorias educativas en proceso",

    descripcion:
      "Se registran varias asignaturas con Trayectoria Educativa en Proceso (TEP).",

    impacto:
      "La presencia de dificultades en diferentes asignaturas puede indicar la necesidad de un acompañamiento más amplio y coordinado.",

    orientacion:
      "Revisar la situación junto al equipo docente para reconocer dificultades compartidas y acordar estrategias de acompañamiento."

  },

  MULTIPLES_TED: {

    tipo:
      TIPOS_MENSAJE.ALERTA,

    nivel:
      NIVELES_MENSAJE.CRITICO,

    categoriaVisual:
      CATEGORIAS_VISUALES.TRAYECTORIA,

    titulo:
      "Varias trayectorias educativas discontinuas",

    descripcion:
      "Se registran varias asignaturas con Trayectoria Educativa Discontinua (TED).",

    impacto:
      "La discontinuidad en múltiples espacios curriculares compromete de manera significativa la continuidad de la trayectoria.",

    orientacion:
      "Priorizar una intervención institucional coordinada y definir acciones inmediatas de acompañamiento."

  },

  ASIGNATURAS_PENDIENTES: {

    tipo:
      TIPOS_MENSAJE.ALERTA,

    titulo:
      "Asignaturas pendientes de acreditación",

    descripcion:
      "Se registran asignaturas pendientes correspondientes a años anteriores.",

    impacto:
      "Los aprendizajes pendientes forman parte de los antecedentes que deben considerarse al analizar la trayectoria actual.",

    orientacion:
      "Revisar las instancias de acompañamiento y acreditación disponibles para favorecer su resolución."

  },

  MULTIPLES_ASIGNATURAS_PENDIENTES: {

    tipo:
      TIPOS_MENSAJE.ALERTA,

    nivel:
      NIVELES_MENSAJE.ALTO,

    categoriaVisual:
      CATEGORIAS_VISUALES.PENDIENTES,

    titulo:
      "Acumulación de asignaturas pendientes",

    descripcion:
      "Se registra una cantidad significativa de asignaturas pendientes correspondientes a años anteriores.",

    impacto:
      "La acumulación de espacios pendientes puede dificultar la continuidad y aumentar las demandas académicas de la trayectoria actual.",

    orientacion:
      "Organizar un plan progresivo de acompañamiento y acreditación, estableciendo prioridades y tiempos posibles."

  },

  SOBREEDAD: {

    tipo:
      TIPOS_MENSAJE.ALERTA,

    nivel:
      NIVELES_MENSAJE.INFORMATIVO,

    categoriaVisual:
      CATEGORIAS_VISUALES.CONTEXTO,

    titulo:
      "Trayectoria con sobreedad",

    descripcion:
      "Se registra una diferencia entre la edad del estudiante y la edad teórica esperada para el curso.",

    impacto:
      "La sobreedad constituye un dato contextual relevante que puede relacionarse con interrupciones, repitencias u otras situaciones de la trayectoria.",

    orientacion:
      "Considerar este antecedente junto con el resto de la información, evitando interpretaciones aisladas o deterministas."

  },

  RECURSANCIA: {

    tipo:
      TIPOS_MENSAJE.ALERTA,

    nivel:
      NIVELES_MENSAJE.MEDIO,

    categoriaVisual:
      CATEGORIAS_VISUALES.CONTEXTO,

    titulo:
      "Condición de recursancia",

    descripcion:
      "El estudiante se encuentra recursando el año escolar.",

    impacto:
      "La recursancia constituye un antecedente relevante para comprender las experiencias escolares previas y planificar el acompañamiento actual.",

    orientacion:
      "Reconocer los aprendizajes ya construidos, revisar las dificultades persistentes y evitar la simple repetición de estrategias anteriores."

  },

  PERSISTENCIA_EXACTA: {

    tipo:
      TIPOS_MENSAJE.ALERTA,

    nivel:
      NIVELES_MENSAJE.ALTO,

    categoriaVisual:
      CATEGORIAS_VISUALES.PERSISTENCIAS,

    titulo:
      "Persistencia en la misma asignatura",

    descripcion:
      "Se detecta una relación entre una dificultad actual y una asignatura pendiente con la misma denominación.",

    impacto:
      "La dificultad aparece sostenida en el mismo espacio curricular a lo largo de diferentes momentos de la trayectoria.",

    orientacion:
      "Revisar los aprendizajes específicos que continúan pendientes y las intervenciones pedagógicas realizadas previamente."

  },

  PERSISTENCIA_DIRECTA: {

    tipo:
      TIPOS_MENSAJE.ALERTA,

    nivel:
      NIVELES_MENSAJE.MEDIO,

    categoriaVisual:
      CATEGORIAS_VISUALES.PERSISTENCIAS,

    titulo:
      "Persistencia disciplinar",

    descripcion:
      "Se detecta continuidad entre una dificultad actual y antecedentes pertenecientes a la misma trayectoria disciplinar.",

    impacto:
      "Las dificultades pueden estar vinculadas con aprendizajes previos necesarios para avanzar en la disciplina actual.",

    orientacion:
      "Identificar los saberes de base comprometidos y planificar estrategias que articulen los aprendizajes anteriores con los actuales."

  },

  PERSISTENCIA_HEREDADA: {

    tipo:
      TIPOS_MENSAJE.ALERTA,

    nivel:
      NIVELES_MENSAJE.MEDIO,

    categoriaVisual:
      CATEGORIAS_VISUALES.PERSISTENCIAS,

    titulo:
      "Persistencia vinculada con aprendizajes previos",

    descripcion:
      "Se detecta una posible relación entre una dificultad actual y espacios curriculares cursados en años anteriores.",

    impacto:
      "La situación actual puede estar asociada con aprendizajes previos que no lograron consolidarse completamente.",

    orientacion:
      "Analizar la relación entre los contenidos actuales y los antecedentes para reconocer qué aprendizajes necesitan ser retomados."

  },

  MULTIPLES_PERSISTENCIAS: {

    tipo:
      TIPOS_MENSAJE.ALERTA,

    nivel:
      NIVELES_MENSAJE.ALTO,

    categoriaVisual:
      CATEGORIAS_VISUALES.PERSISTENCIAS,

    titulo:
      "Persistencias acumuladas",

    descripcion:
      "Se identifican varias relaciones entre dificultades actuales y antecedentes académicos previos.",

    impacto:
      "La combinación de persistencias puede indicar una dificultad sostenida que atraviesa distintos momentos o espacios de la trayectoria.",

    orientacion:
      "Construir una mirada integral junto al equipo docente y acordar una intervención articulada y progresiva."

  },

  RELACION_MISMA_AREA: {

    tipo:
      TIPOS_MENSAJE.ALERTA,

    nivel:
      NIVELES_MENSAJE.INFORMATIVO,

    categoriaVisual:
      CATEGORIAS_VISUALES.PERSISTENCIAS,

    titulo:
      "Antecedentes vinculados con la misma área",

    descripcion:
      "Se observan dificultades actuales y antecedentes académicos pertenecientes a una misma área de conocimiento.",

    impacto:
      "La relación por área constituye un indicio que merece análisis, aunque no confirma por sí sola una persistencia específica.",

    orientacion:
      "Revisar los aprendizajes comunes entre las asignaturas involucradas antes de establecer conclusiones pedagógicas."

  }

};

/*
 * ============================================================
 * MENSAJES DE JUSTIFICACIÓN
 * ============================================================
 *
 * Explican los elementos concretos que fundamentan la valoración
 * institucional construida por el diagnóstico.
 * ============================================================
 */

export const MENSAJES_JUSTIFICACIONES = { 

  PRESENTA_TEP: {

    tipo:
      TIPOS_MENSAJE.JUSTIFICACION,

    nivel:
      NIVELES_MENSAJE.MEDIO,

    categoriaVisual:
      CATEGORIAS_VISUALES.TRAYECTORIA,

    titulo:
      "Presencia de trayectorias educativas en proceso",

    descripcion:
      "La valoración considera la existencia de una o más asignaturas con Trayectoria Educativa en Proceso (TEP) durante el período analizado.",

    impacto:
      "Estos registros indican que determinados aprendizajes aún se encuentran en proceso de consolidación y requieren continuidad en el acompañamiento pedagógico.",

    orientacion:
      "Interpretar cada situación en relación con los aprendizajes involucrados, las estrategias ya implementadas y la evolución observada en el período."

  },

  PRESENTA_TED: {

    tipo:
      TIPOS_MENSAJE.JUSTIFICACION,

    nivel:
      NIVELES_MENSAJE.ALTO,

    categoriaVisual:
      CATEGORIAS_VISUALES.TRAYECTORIA,

    titulo:
      "Presencia de trayectoria educativa discontinua",

    descripcion:
      "La valoración contempla la existencia de al menos una asignatura con Trayectoria Educativa Discontinua (TED) durante el período analizado.",

    impacto:
      "La discontinuidad registrada constituye un indicador relevante porque puede comprometer la participación, la continuidad de los aprendizajes y el vínculo pedagógico.",

    orientacion:
      "Analizar la situación específica de la asignatura y considerar los factores pedagógicos, personales e institucionales que pudieran estar interviniendo."

  },

  PRESENTA_PENDIENTES: {

    tipo:
      TIPOS_MENSAJE.JUSTIFICACION,

    nivel:
      NIVELES_MENSAJE.MEDIO,

    categoriaVisual:
      CATEGORIAS_VISUALES.PENDIENTES,

    titulo:
      "Existencia de asignaturas pendientes",

    descripcion:
      "La trayectoria presenta una o más asignaturas pendientes de acreditación correspondientes a años anteriores.",

    impacto:
      "Estos antecedentes forman parte de la situación académica integral del estudiante y pueden relacionarse con aprendizajes que todavía requieren recuperación o consolidación.",

    orientacion:
      "Considerar las instancias de intensificación, acompañamiento y acreditación disponibles al planificar las acciones institucionales."

  },

  PRESENTA_PERSISTENCIAS: {

    tipo:
      TIPOS_MENSAJE.JUSTIFICACION,

    nivel:
      NIVELES_MENSAJE.MEDIO,

    categoriaVisual:
      CATEGORIAS_VISUALES.PERSISTENCIAS,

    titulo:
      "Persistencia de dificultades pedagógicas",

    descripcion:
      "Se identifican relaciones posibles entre dificultades actuales y antecedentes académicos correspondientes a la misma asignatura, disciplina o área de conocimiento.",

    impacto:
      "La reiteración de dificultades puede señalar aprendizajes estructurales que no lograron consolidarse y que condicionan nuevos procesos de aprendizaje.",

    orientacion:
      "Revisar la trayectoria completa para distinguir una dificultad circunstancial de una necesidad sostenida de intervención pedagógica."

  }

};


/*
 * ============================================================
 * MENSAJES DE RECOMENDACIÓN
 * ============================================================
 *
 * Proponen líneas posibles de intervención.
 *
 * No reemplazan las decisiones profesionales del equipo docente.
 * ============================================================
 */

export const MENSAJES_RECOMENDACIONES = {

  ANALIZAR_TED: {

    tipo:
      TIPOS_MENSAJE.RECOMENDACION,

    nivel:
      NIVELES_MENSAJE.ALTO,

    categoriaVisual:
      CATEGORIAS_VISUALES.ACOMPANAMIENTO,

    titulo:
      "Analizar la trayectoria educativa discontinua",

    descripcion:
      "Se recomienda realizar un análisis específico de las asignaturas en las que se registra Trayectoria Educativa Discontinua (TED).",

    impacto:
      "Una intervención oportuna puede favorecer la recuperación de la participación, la continuidad pedagógica y el vínculo con los aprendizajes.",

    orientacion:
      "Identificar las causas de la discontinuidad, recuperar el diálogo con el estudiante y acordar acciones concretas de acompañamiento y seguimiento."

  },

  REVISAR_PERSISTENCIAS: {

    tipo:
      TIPOS_MENSAJE.RECOMENDACION,

    nivel:
      NIVELES_MENSAJE.MEDIO,

    categoriaVisual:
      CATEGORIAS_VISUALES.PERSISTENCIAS,

    titulo:
      "Revisar las persistencias detectadas",

    descripcion:
      "Se recomienda analizar la relación entre las dificultades actuales y los antecedentes académicos vinculados.",

    impacto:
      "Reconocer los aprendizajes de base comprometidos permite evitar intervenciones aisladas y construir estrategias pedagógicas con mayor continuidad.",

    orientacion:
      "Articular la información de años y asignaturas anteriores, identificar saberes prioritarios y acordar una propuesta progresiva de recuperación."

  },

  ABORDAR_ASIGNATURAS_PENDIENTES: {

    tipo:
      TIPOS_MENSAJE.RECOMENDACION,

    nivel:
      NIVELES_MENSAJE.MEDIO,

    categoriaVisual:
      CATEGORIAS_VISUALES.PENDIENTES,

    titulo:
      "Abordar las asignaturas pendientes de acreditación",

    descripcion:
      "Se recomienda incorporar las asignaturas pendientes al plan de acompañamiento de la trayectoria.",

    impacto:
      "La atención sistemática de estos espacios puede reducir la acumulación de dificultades y favorecer la continuidad del recorrido escolar.",

    orientacion:
      "Informar las instancias de acreditación disponibles, establecer prioridades y realizar un seguimiento compartido de los avances alcanzados."

  },

  ANALIZAR_TEP: {

    tipo:
      TIPOS_MENSAJE.RECOMENDACION,

    nivel:
      NIVELES_MENSAJE.MEDIO,

    categoriaVisual:
      CATEGORIAS_VISUALES.ACOMPANAMIENTO,

    titulo:
      "Acompañar las trayectorias educativas en proceso",

    descripcion:
      "Se recomienda revisar las asignaturas que presentan Trayectoria Educativa en Proceso (TEP) y los aprendizajes que aún necesitan consolidación.",

    impacto:
      "El acompañamiento sostenido puede favorecer avances antes de que las dificultades se profundicen o se transformen en situaciones de discontinuidad.",

    orientacion:
      "Definir aprendizajes prioritarios, ofrecer nuevas oportunidades de trabajo y registrar periódicamente la evolución del estudiante."

  }

};



/*
 * ============================================================
 * CATÁLOGO SEMÁNTICO
 * ============================================================
 */

export const CATALOGO_MENSAJES_DIAGNOSTICO = {

  FORTALEZAS:
    MENSAJES_FORTALEZAS,

  ALERTAS:
    MENSAJES_ALERTAS,

  JUSTIFICACIONES:
    MENSAJES_JUSTIFICACIONES,

  RECOMENDACIONES:
    MENSAJES_RECOMENDACIONES

}; 

/*
 * ============================================================
 * FUNCIONES AUXILIARES GENÉRICAS
 * ============================================================
 */

export function buscarMensajeDiagnostico(
  codigo,
) {

  if (
    typeof codigo !== "string" ||
    !codigo.trim()
  ) {

    return null;

  }

  for (
    const mensajes
    of Object.values(
      CATALOGO_MENSAJES_DIAGNOSTICO,
    )
  ) {

    if (mensajes[codigo]) {

      return {

        codigo,

        ...mensajes[codigo]

      };

    }

  }

  return null;

}

export function obtenerMensajePorCodigo(
  codigo,
) {

  return buscarMensajeDiagnostico(
    codigo,
  );

}

export function enriquecerElementoDiagnostico(
  elemento,
) {

  if (
    !elemento ||
    typeof elemento !== "object"
  ) {

    return null;

  }

  const mensaje =
    buscarMensajeDiagnostico(
      elemento.codigo,
    );

  if (!mensaje) {

    return {

      ...elemento,

      encontrado: false,

      mensajeEncontrado: false

    };

  }

  return {

    ...elemento,

    ...mensaje,

    encontrado: true,

    mensajeEncontrado: true

  };

}

export function enriquecerListaDiagnostico(
  elementos = [],
) {

  if (!Array.isArray(elementos)) {

    return [];

  }

  return elementos
    .map(
      enriquecerElementoDiagnostico,
    )
    .filter(Boolean);

}

export function enriquecerCodigosDiagnostico(
  codigos = [],
) {

  if (!Array.isArray(codigos)) {

    return [];

  }

  return enriquecerListaDiagnostico(
    codigos.map(
      (codigo) => ({
        codigo
      }),
    ),
  );

}

/*
 * ============================================================
 * COMPATIBILIDAD CON FUNCIONES ANTERIORES
 * ============================================================
 */

export function obtenerMensajeFortaleza(
  codigo,
) {

  return (
    MENSAJES_FORTALEZAS[codigo] ||
    null
  );

}

export function enriquecerFortaleza(
  fortaleza,
) {

  return enriquecerElementoDiagnostico(
    fortaleza,
  );

}

export function enriquecerFortalezas(
  fortalezas = [],
) {

  return enriquecerListaDiagnostico(
    fortalezas,
  );

}

export function obtenerMensajeAlerta(
  codigo,
) {

  return (
    MENSAJES_ALERTAS[codigo] ||
    null
  );

}

export function enriquecerAlerta(
  alerta,
) {

  return enriquecerElementoDiagnostico(
    alerta,
  );

}

export function enriquecerAlertas(
  alertas = [],
) {

  return enriquecerListaDiagnostico(
    alertas,
  );

}
