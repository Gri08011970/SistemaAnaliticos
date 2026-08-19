import {
  obtenerUsuariosService,
  crearUsuarioService,
} from "../services/usuarioService.js";

// ======================================================
// LISTAR USUARIOS
// ======================================================

export async function obtenerUsuariosController(req, res) {
  try {
    const usuarios = await obtenerUsuariosService();

    return res.json({
      usuarios,
      total: usuarios.length,
    });
  } catch (error) {
    console.error("Error al obtener usuarios:", error);

    return res.status(500).json({
      mensaje: "No se pudieron obtener los usuarios.",
    });
  }
}

// ======================================================
// CREAR USUARIO
// ======================================================

export async function crearUsuarioController(req, res) {
  try {
    const usuario = await crearUsuarioService(req.body);

    return res.status(201).json({
      mensaje: "Cuenta creada correctamente.",
      usuario,
    });
  } catch (error) {
    console.error("Error al crear usuario:", error);

    const mensajesValidacion = [
      "obligatorios",
      "no es válido",
      "debe estar vinculada",
      "ya está registrado",
      "ya tiene una cuenta",
    ];

    const esValidacion = mensajesValidacion.some((texto) =>
      error.message?.includes(texto),
    );

    return res.status(esValidacion ? 400 : 500).json({
      mensaje:
        error.message ||
        "No se pudo crear la cuenta.",
    });
  }
}