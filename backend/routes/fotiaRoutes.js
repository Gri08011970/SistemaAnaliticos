import express from "express";

import {
  verificarToken,
  soloEstudiante,
  soloDocente,
} from "../middleware/authMiddleware.js";

import {
  // Períodos
  obtenerPeriodosController,
  obtenerPeriodoController,
  crearPeriodoController,
  actualizarPeriodoController,

  // Docentes
  obtenerDocentesController,
  obtenerDocenteController,
  crearDocenteController,
  actualizarDocenteController,

  // Inscripciones
  obtenerAcreditacionesController,
  obtenerInscripcionesController,
  obtenerInscripcionController,
  obtenerMisAsignaturasEstudianteController,
  incorporarAsignaturaController,
  actualizarInscripcionController,
  retirarAsignaturaController,
  eliminarEstudiantePeriodoController,

  // Acreditación
  acreditarInscripcionController,

} from "../controllers/fotiaController.js";

import {
  obtenerMisEspaciosDocenteController,
  obtenerOCrearAulaDocenteController,
  guardarMensajeDocenteController,
  crearUnidadController,
  cambiarPublicacionAulaController,
} from "../controllers/fotiaContenidoController.js";

const router = express.Router();

// ======================================================
// PERÍODOS
// ======================================================

router.get(
  "/periodos",
  obtenerPeriodosController
);

router.get(
  "/periodos/:id",
  obtenerPeriodoController
);

router.post(
  "/periodos",
  crearPeriodoController
);

router.put(
  "/periodos/:id",
  actualizarPeriodoController
);

// ======================================================
// DOCENTES
// ======================================================

router.get(
  "/docentes",
  obtenerDocentesController
);

router.get(
  "/docentes/:id",
  obtenerDocenteController
);

router.post(
  "/docentes",
  crearDocenteController
);

router.put(
  "/docentes/:id",
  actualizarDocenteController
);

// ======================================================
// PORTAL ESTUDIANTE
// ======================================================

router.get(
  "/mi-espacio/asignaturas",
  verificarToken,
  soloEstudiante,
  obtenerMisAsignaturasEstudianteController,
);

// ======================================================
// PORTAL DOCENTE FOTIA
// ======================================================

// Mis espacios asignados
router.get(
  "/mi-espacio-docente",
  verificarToken,
  soloDocente,
  obtenerMisEspaciosDocenteController,
);

// Obtener o crear el aula de un espacio
router.post(
  "/mi-espacio-docente/aula",
  verificarToken,
  soloDocente,
  obtenerOCrearAulaDocenteController,
);

// Guardar mensaje escrito / referencia de audio
router.put(
  "/mi-espacio-docente/aulas/:contenidoId/mensaje",
  verificarToken,
  soloDocente,
  guardarMensajeDocenteController,
);

// Crear una unidad o tema
router.post(
  "/mi-espacio-docente/aulas/:contenidoId/unidades",
  verificarToken,
  soloDocente,
  crearUnidadController,
);

// Publicar o volver a borrador
router.put(
  "/mi-espacio-docente/aulas/:contenidoId/publicacion",
  verificarToken,
  soloDocente,
  cambiarPublicacionAulaController,
);

// ======================================================
// INSCRIPCIONES AL FORTALECIMIENTO
// ======================================================

// ======================================================
// ACREDITACIONES
// ======================================================

router.get(
  "/acreditaciones",
  obtenerAcreditacionesController,
);
router.get(
  "/inscripciones",
  obtenerInscripcionesController
);

router.get(
  "/inscripciones/:id",
  obtenerInscripcionController
);

router.post(
  "/inscripciones",
  incorporarAsignaturaController
);

router.put(
  "/inscripciones/:id",
  actualizarInscripcionController
);

// Retira la asignatura solamente del fortalecimiento.
// NO elimina la previa institucional.
router.put(
  "/inscripciones/:id/retirar",
  retirarAsignaturaController
);

// Elimina todos los registros de un estudiante dentro
// de un período específico de FOTIA.
// No elimina al estudiante de Matrícula.
router.delete(
  "/periodos/:periodoId/estudiantes/:alumnoId",
  eliminarEstudiantePeriodoController,
);

// ======================================================
// ACREDITACIÓN
// ======================================================

// Esta es la ÚNICA ruta que elimina la previa
// de materiasPendientes.
router.post(
  "/inscripciones/:id/acreditar",
  acreditarInscripcionController
);

export default router;