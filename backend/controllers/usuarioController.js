import { obtenerUsuariosService } from "../services/usuarioService.js";

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