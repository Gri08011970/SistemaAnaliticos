import FotiaContenido from "../models/FotiaContenido.js";
import FotiaInscripcion from "../models/FotiaInscripcion.js";

// =====================================================
// OBTENER ESPACIOS DEL DOCENTE
// =====================================================

export const listarEspaciosDocente = async ({
  docenteId,
} = {}) => {
  if (!docenteId) {
    const error = new Error(
      "No se recibió el docente vinculado."
    );
    error.status = 400;
    throw error;
  }

  const inscripciones =
    await FotiaInscripcion.find({
      docenteId,
      activo: true,
    })
      .populate(
        "periodoId",
        "nombre cicloLectivo fechaInicio fechaFin estado"
      )
      .sort({
        asignatura: 1,
        curso: 1,
      });

  const mapa = new Map();

  for (const inscripcion of inscripciones) {
    const periodoId =
      inscripcion.periodoId?._id?.toString() ||
      inscripcion.periodoId?.toString() ||
      "";

    const asignatura =
      inscripcion.asignatura || "";

    const curso =
      inscripcion.curso || "";

    const clave =
      `${periodoId}-${asignatura}-${curso}`;

    if (!mapa.has(clave)) {
      mapa.set(clave, {
        periodoId:
          inscripcion.periodoId || null,

        asignatura,

        curso,

        docenteId:
          inscripcion.docenteId,

        cantidadEstudiantes: 0,
      });
    }

    mapa.get(clave).cantidadEstudiantes += 1;
  }

  return Array.from(mapa.values());
};

// =====================================================
// OBTENER O CREAR AULA
// =====================================================

export const obtenerOCrearContenidoAula = async ({
  periodoId,
  docenteId,
  asignatura,
  curso = "",
}) => {
  if (!periodoId) {
    const error = new Error(
      "El período es obligatorio."
    );
    error.status = 400;
    throw error;
  }

  if (!docenteId) {
    const error = new Error(
      "El docente es obligatorio."
    );
    error.status = 400;
    throw error;
  }

  if (!asignatura?.trim()) {
    const error = new Error(
      "La asignatura es obligatoria."
    );
    error.status = 400;
    throw error;
  }

  const asignaturaLimpia =
    asignatura.trim();

  const cursoLimpio =
    curso?.trim() || "";

  const contenido =
    await FotiaContenido.findOneAndUpdate(
      {
        periodoId,
        docenteId,
        asignatura: asignaturaLimpia,
        curso: cursoLimpio,
      },
      {
        $setOnInsert: {
          periodoId,
          docenteId,
          asignatura: asignaturaLimpia,
          curso: cursoLimpio,
          publicado: false,
          activo: true,
        },
      },
      {
        returnDocument: "after",
        upsert: true,
        runValidators: true,
      }
    );

  return contenido;
};

export const cambiarPublicacionAula = async ({
  contenidoId,
  docenteId,
  publicado,
}) => {
  const contenido = await FotiaContenido.findOne({
    _id: contenidoId,
    docenteId,
    activo: true,
  });

  if (!contenido) {
    throw new Error("No se encontró el aula.");
  }

  contenido.publicado = Boolean(publicado);

  await contenido.save();

  return contenido;
};

export const obtenerAulaPublicadaEstudiante = async ({
  inscripcionId,
  alumnoId,
}) => {
  if (!inscripcionId) {
    const error = new Error(
      "No se recibió la inscripción.",
    );
    error.status = 400;
    throw error;
  }

  if (!alumnoId) {
    const error = new Error(
      "No se pudo identificar al estudiante.",
    );
    error.status = 403;
    throw error;
  }

  const inscripcion = await FotiaInscripcion.findOne({
    _id: inscripcionId,
    alumnoId,
    activo: true,
  });

  if (!inscripcion) {
    const error = new Error(
      "No se encontró esta inscripción o no pertenece al estudiante.",
    );
    error.status = 404;
    throw error;
  }

  const periodoId =
    inscripcion.periodoId?._id ||
    inscripcion.periodoId;

  const docenteId =
    inscripcion.docenteId?._id ||
    inscripcion.docenteId;

  const aula = await FotiaContenido.findOne({
    periodoId,
    docenteId,
    asignatura: inscripcion.asignatura,
    curso: inscripcion.curso || "",
    publicado: true,
    activo: true,
  });

  if (!aula) {
    const error = new Error(
      "Esta aula todavía no está publicada por el docente.",
    );
    error.status = 404;
    throw error;
  }

  const aulaSegura = aula.toObject();

  aulaSegura.unidades = (
    aulaSegura.unidades || []
  )
    .filter(
      (unidad) => unidad.activo !== false,
    )
    .map((unidad) => ({
      ...unidad,

      recursos: (
        unidad.recursos || []
      ).filter(
        (recurso) =>
          recurso.activo !== false,
      ),
    }));

  return aulaSegura;
};
// =====================================================
// GUARDAR MENSAJE DEL DOCENTE
// =====================================================

export const guardarMensajeDocente = async ({
  contenidoId,
  docenteId,
  texto = "",
  audioUrl = "",
  audioNombreArchivo = "",
}) => {
  const contenido =
    await FotiaContenido.findOne({
      _id: contenidoId,
      docenteId,
      activo: true,
    });

  if (!contenido) {
    const error = new Error(
      "No se encontró el aula o no tenés permiso para modificarla."
    );
    error.status = 404;
    throw error;
  }

  contenido.mensajeDocente = {
    texto: texto || "",
    audioUrl: audioUrl || "",
    audioNombreArchivo:
      audioNombreArchivo || "",
    actualizadoEn: new Date(),
  };

  await contenido.save();

  return contenido;
};

// =====================================================
// CREAR UNIDAD
// =====================================================

export const crearUnidad = async ({
  contenidoId,
  docenteId,
  titulo,
  descripcion = "",
}) => {
  if (!titulo?.trim()) {
    const error = new Error(
      "El título de la unidad es obligatorio."
    );
    error.status = 400;
    throw error;
  }

  const contenido =
    await FotiaContenido.findOne({
      _id: contenidoId,
      docenteId,
      activo: true,
    });

  if (!contenido) {
    const error = new Error(
      "No se encontró el aula o no tenés permiso para modificarla."
    );
    error.status = 404;
    throw error;
  }

  const orden =
    contenido.unidades.length + 1;

  contenido.unidades.push({
    titulo: titulo.trim(),
    descripcion:
      descripcion?.trim() || "",
    orden,
    activo: true,
  });

  await contenido.save();

  return contenido;
};

// =====================================================
// ACTUALIZAR UNIDAD
// =====================================================

export const actualizarUnidad = async ({
  contenidoId,
  unidadId,
  docenteId,
  titulo,
  descripcion = "",
}) => {
  if (!titulo?.trim()) {
    const error = new Error(
      "El título de la unidad es obligatorio."
    );
    error.status = 400;
    throw error;
  }

  const contenido = await FotiaContenido.findOne({
    _id: contenidoId,
    docenteId,
    activo: true,
  });

  if (!contenido) {
    const error = new Error(
      "No se encontró el aula o no tenés permiso para modificarla."
    );
    error.status = 404;
    throw error;
  }

  const unidad = contenido.unidades.id(unidadId);

  if (!unidad) {
    const error = new Error(
      "No se encontró la unidad."
    );
    error.status = 404;
    throw error;
  }

  unidad.titulo = titulo.trim();
  unidad.descripcion =
    descripcion?.trim() || "";

  await contenido.save();

  return contenido;
};

// =====================================================
// AGREGAR MATERIAL A UNA UNIDAD
// =====================================================

export const agregarMaterialUnidad = async ({
  contenidoId,
  unidadId,
  docenteId,
  tipo,
  titulo,
  descripcion = "",
  url = "",
  nombreArchivo = "",
  imprimible = false,
}) => {
  if (!titulo?.trim()) {
    const error = new Error(
      "El título del material es obligatorio."
    );
    error.status = 400;
    throw error;
  }

  const tiposPermitidos = [
    "texto",
    "pdf",
    "archivo",
    "enlace",
    "audio",
    "video",
    "imagen",
  ];

  if (!tiposPermitidos.includes(tipo)) {
    const error = new Error(
      "El tipo de material no es válido."
    );
    error.status = 400;
    throw error;
  }

  const contenido = await FotiaContenido.findOne({
    _id: contenidoId,
    docenteId,
    activo: true,
  });

  if (!contenido) {
    const error = new Error(
      "No se encontró el aula o no tenés permiso para modificarla."
    );
    error.status = 404;
    throw error;
  }

  const unidad = contenido.unidades.id(unidadId);

  if (!unidad) {
    const error = new Error(
      "No se encontró la unidad."
    );
    error.status = 404;
    throw error;
  }

  const materialDuplicado = unidad.recursos.find(
  (recurso) =>
    recurso.activo !== false &&
    recurso.tipo === tipo &&
    recurso.titulo?.trim().toLowerCase() ===
      titulo.trim().toLowerCase() &&
    (recurso.url || "").trim().toLowerCase() ===
      (url || "").trim().toLowerCase(),
);

if (materialDuplicado) {
  const error = new Error(
    "Este recurso ya está cargado en la unidad.",
  );
  error.status = 409;
  throw error;
}

  const orden = unidad.recursos.length + 1;

  unidad.recursos.push({
    tipo,
    titulo: titulo.trim(),
    descripcion: descripcion?.trim() || "",
    url: url?.trim() || "",
    nombreArchivo: nombreArchivo?.trim() || "",
    imprimible: Boolean(imprimible),
    orden,
    activo: true,
  });

  await contenido.save();

  return contenido;
};

// =====================================================
// ACTUALIZAR MATERIAL DE UNA UNIDAD
// =====================================================

export const actualizarMaterialUnidad = async ({
  contenidoId,
  unidadId,
  materialId,
  docenteId,
  tipo,
  titulo,
  descripcion = "",
  url = "",
  imprimible = false,
}) => {
  if (!titulo?.trim()) {
    const error = new Error(
      "El título del material es obligatorio.",
    );
    error.status = 400;
    throw error;
  }

  const contenido = await FotiaContenido.findOne({
    _id: contenidoId,
    docenteId,
    activo: true,
  });

  if (!contenido) {
    const error = new Error(
      "No se encontró el aula o no tenés permiso para modificarla.",
    );
    error.status = 404;
    throw error;
  }

  const unidad = contenido.unidades.id(unidadId);

  if (!unidad) {
    const error = new Error(
      "No se encontró la unidad.",
    );
    error.status = 404;
    throw error;
  }

  const material = unidad.recursos.id(materialId);

  if (!material || material.activo === false) {
    const error = new Error(
      "No se encontró el material.",
    );
    error.status = 404;
    throw error;
  }

  const duplicado = unidad.recursos.find(
    (recurso) =>
      recurso._id.toString() !== materialId &&
      recurso.activo !== false &&
      recurso.tipo === tipo &&
      recurso.titulo?.trim().toLowerCase() ===
        titulo.trim().toLowerCase() &&
      (recurso.url || "").trim().toLowerCase() ===
        (url || "").trim().toLowerCase(),
  );

  if (duplicado) {
    const error = new Error(
      "Ya existe otro recurso igual en esta unidad.",
    );
    error.status = 409;
    throw error;
  }

  material.tipo = tipo;
  material.titulo = titulo.trim();
  material.descripcion =
    descripcion?.trim() || "";
  material.url = url?.trim() || "";
  material.imprimible = Boolean(imprimible);

  await contenido.save();

  return contenido;
};


// =====================================================
// RETIRAR MATERIAL DE UNA UNIDAD
// =====================================================

export const retirarMaterialUnidad = async ({
  contenidoId,
  unidadId,
  materialId,
  docenteId,
}) => {
  const contenido = await FotiaContenido.findOne({
    _id: contenidoId,
    docenteId,
    activo: true,
  });

  if (!contenido) {
    const error = new Error(
      "No se encontró el aula o no tenés permiso para modificarla.",
    );
    error.status = 404;
    throw error;
  }

  const unidad = contenido.unidades.id(unidadId);

  if (!unidad) {
    const error = new Error(
      "No se encontró la unidad.",
    );
    error.status = 404;
    throw error;
  }

  const material = unidad.recursos.id(materialId);

  if (!material || material.activo === false) {
    const error = new Error(
      "No se encontró el material.",
    );
    error.status = 404;
    throw error;
  }

  material.activo = false;

  await contenido.save();

  return contenido;
};

// =====================================================
// PUBLICAR / DESPUBLICAR AULA
// =====================================================

export const cambiarEstadoPublicacionAula =
  async ({
    contenidoId,
    docenteId,
    publicado,
  }) => {
    const contenido =
      await FotiaContenido.findOne({
        _id: contenidoId,
        docenteId,
        activo: true, 
      });

    if (!contenido) {
      const error = new Error(
        "No se encontró el aula o no tenés permiso para modificarla."
      );
      error.status = 404;
      throw error;
    }

    contenido.publicado =
      Boolean(publicado);

    await contenido.save();

    return contenido;
  };