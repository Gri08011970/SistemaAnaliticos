import {
  listarEspaciosDocente,
  obtenerOCrearContenidoAula,
  guardarMensajeDocente,
  crearUnidad,
  actualizarUnidad,
  agregarMaterialUnidad,
  actualizarMaterialUnidad,
  retirarMaterialUnidad,
  cambiarPublicacionAula,
  obtenerAulaPublicadaEstudiante,
  cambiarEstadoPublicacionAula,
  listarAulasPublicadasConsulta,
} from "../services/fotiaContenidoService.js";

export const obtenerAulaPublicadaEstudianteController =
  async (req, res) => {
    try {
      const { inscripcionId } = req.params;

      const alumnoId =
        req.usuario?.alumnoId;

      if (!alumnoId) {
        return res.status(403).json({
          mensaje:
            "No se pudo identificar al estudiante.",
        });
      }

      const contenido =
        await obtenerAulaPublicadaEstudiante({
          inscripcionId,
          alumnoId,
        });

      return res.json({
        contenido,
      });
    } catch (error) {
      console.error(
        "Error al abrir aula del estudiante:",
        error,
      );

      return res
        .status(error.status || 500)
        .json({
          mensaje:
            error.message ||
            "No se pudo abrir el aula.",
        });
    }
  };

// =====================================================
// UTILIDAD INTERNA
// =====================================================

const responderError = (res, error) => {
  console.error(
    "Error en contenido FOTIA:",
    error,
  );

  res.status(error.status || 500).json({
    mensaje:
      error.message ||
      "Ocurrió un error inesperado en el aula FOTIA",
  });
};

// =====================================================
// PORTAL DOCENTE - MIS ESPACIOS
// =====================================================

export const obtenerMisEspaciosDocenteController =
  async (req, res) => {
    try {
      const docenteId =
        req.usuario?.docenteId;

      const espacios =
        await listarEspaciosDocente({
          docenteId,
        });

      res.json({
        cantidad: espacios.length,
        espacios,
      });
    } catch (error) {
      responderError(res, error);
    }
  };

// =====================================================
// OBTENER O CREAR AULA
// =====================================================

export const obtenerOCrearAulaDocenteController =
  async (req, res) => {
    try {
      const docenteId =
        req.usuario?.docenteId;

      const {
        periodoId,
        asignatura,
        curso,
      } = req.body;

      const contenido =
        await obtenerOCrearContenidoAula({
          periodoId,
          docenteId,
          asignatura,
          curso: curso || "",
        });

      res.json({
        mensaje:
          "Aula FOTIA disponible correctamente",
        contenido,
      });
    } catch (error) {
      responderError(res, error);
    }
  };

// =====================================================
// CAMBIAR PUBLICACIÓN DEL AULA
// =====================================================

export const cambiarPublicacionAulaController =
  async (req, res) => {
    try {
      const { contenidoId } = req.params;
      const { publicado } = req.body;

      if (typeof publicado !== "boolean") {
        return res.status(400).json({
          mensaje:
            "El estado de publicación no es válido.",
        });
      }

      const docenteId =
        req.usuario?.docenteId;

      if (!docenteId) {
        return res.status(403).json({
          mensaje:
            "No se pudo identificar al docente.",
        });
      }

      const contenido =
        await cambiarPublicacionAula({
          contenidoId,
          docenteId,
          publicado,
        });

      return res.json({
        mensaje: publicado
          ? "Aula publicada correctamente."
          : "Aula devuelta a borrador.",
        contenido,
      });
    } catch (error) {
      console.error(
        "Error al cambiar publicación del aula:",
        error,
      );

      return res.status(500).json({
        mensaje:
          error.message ||
          "No se pudo cambiar la publicación del aula.",
      });
    }
  };

// =====================================================
// MENSAJE DEL DOCENTE
// =====================================================

export const guardarMensajeDocenteController =
  async (req, res) => {
    try {
      const docenteId =
        req.usuario?.docenteId;

      const {
        texto,
        audioUrl,
        audioNombreArchivo,
      } = req.body;

      const contenido =
        await guardarMensajeDocente({
          contenidoId:
            req.params.contenidoId,
          docenteId,
          texto,
          audioUrl,
          audioNombreArchivo,
        });

      res.json({
        mensaje:
          "Mensaje del docente guardado correctamente",
        contenido,
      });
    } catch (error) {
      responderError(res, error);
    }
  };

// =====================================================
// CREAR UNIDAD
// =====================================================

export const crearUnidadController =
  async (req, res) => {
    try {
      const docenteId =
        req.usuario?.docenteId;

      const {
        titulo,
        descripcion,
      } = req.body;

      const contenido =
        await crearUnidad({
          contenidoId:
            req.params.contenidoId,
          docenteId,
          titulo,
          descripcion,
        });

      res.status(201).json({
        mensaje:
          "Unidad creada correctamente",
        contenido,
      });
    } catch (error) {
      responderError(res, error);
    }
  };

// =====================================================
// ACTUALIZAR UNIDAD
// =====================================================

export const actualizarUnidadController =
  async (req, res) => {
    try {
      const docenteId =
        req.usuario?.docenteId;

      const {
        titulo,
        descripcion,
      } = req.body;

      const contenido =
        await actualizarUnidad({
          contenidoId:
            req.params.contenidoId,
          unidadId:
            req.params.unidadId,
          docenteId,
          titulo,
          descripcion,
        });

      res.json({
        mensaje:
          "Unidad actualizada correctamente",
        contenido,
      });
    } catch (error) {
      responderError(res, error);
    }
  };

// =====================================================
// AGREGAR MATERIAL A UNA UNIDAD
// =====================================================

export const agregarMaterialUnidadController =
  async (req, res) => {
    try {
      const docenteId =
        req.usuario?.docenteId;

      const {
        tipo,
        titulo,
        descripcion,
        url,
        nombreArchivo,
        imprimible,
      } = req.body;

      const contenido =
        await agregarMaterialUnidad({
          contenidoId:
            req.params.contenidoId,
          unidadId:
            req.params.unidadId,
          docenteId,
          tipo,
          titulo,
          descripcion,
          url,
          nombreArchivo,
          imprimible,
        });

      res.status(201).json({
        mensaje:
          "Material agregado correctamente",
        contenido,
      });
    } catch (error) {
      responderError(res, error);
    }
  };

// =====================================================
// SUBIR ARCHIVO
// =====================================================

export const subirArchivoFotiaController =
  async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({
          mensaje:
            "No se recibió ningún archivo.",
        });
      }

      res.status(201).json({
        mensaje:
          "Archivo subido correctamente",
        archivo: {
          nombreOriginal:
            req.file.originalname,
          nombreArchivo:
            req.file.filename,
          tipoMime:
            req.file.mimetype,
          tamanio:
            req.file.size,
          url:
            `/uploads/fotia/${req.file.filename}`,
        },
      });
    } catch (error) {
      responderError(res, error);
    }
  };

// =====================================================
// ACTUALIZAR MATERIAL
// =====================================================

export const actualizarMaterialUnidadController =
  async (req, res) => {
    try {
      const docenteId =
        req.usuario?.docenteId;

      const {
        tipo,
        titulo,
        descripcion,
        url,
        imprimible,
      } = req.body;

      const contenido =
        await actualizarMaterialUnidad({
          contenidoId:
            req.params.contenidoId,
          unidadId:
            req.params.unidadId,
          materialId:
            req.params.materialId,
          docenteId,
          tipo,
          titulo,
          descripcion,
          url,
          imprimible,
        });

      res.json({
        mensaje:
          "Material actualizado correctamente",
        contenido,
      });
    } catch (error) {
      responderError(res, error);
    }
  };

// =====================================================
// RETIRAR MATERIAL
// =====================================================

export const retirarMaterialUnidadController =
  async (req, res) => {
    try {
      const docenteId =
        req.usuario?.docenteId;

      const contenido =
        await retirarMaterialUnidad({
          contenidoId:
            req.params.contenidoId,
          unidadId:
            req.params.unidadId,
          materialId:
            req.params.materialId,
          docenteId,
        });

      res.json({
        mensaje:
          "Material retirado correctamente",
        contenido,
      });
    } catch (error) {
      responderError(res, error);
    }
  };

// =====================================================
// PUBLICAR / DESPUBLICAR AULA
// =====================================================

export const cambiarEstadoPublicacionAulaController =
  async (req, res) => {
    try {
      const docenteId =
        req.usuario?.docenteId;

      const {
        publicado,
      } = req.body;

      const contenido =
        await cambiarEstadoPublicacionAula({
          contenidoId:
            req.params.contenidoId,
          docenteId,
          publicado,
        });

      res.json({
        mensaje:
          publicado
            ? "Aula publicada correctamente"
            : "Aula devuelta a borrador correctamente",
        contenido,
      });
    } catch (error) {
      responderError(res, error);
    }
  };

// =====================================================
// CONSULTA INSTITUCIONAL - AULAS PUBLICADAS
// =====================================================

export const obtenerAulasPublicadasConsultaController =
  async (req, res) => {
    try {
      const aulas =
        await listarAulasPublicadasConsulta();

      return res.json({
        cantidad: aulas.length,
        aulas,
      });
    } catch (error) {
      responderError(res, error);
    }
  };