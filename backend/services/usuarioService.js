import Usuario from "../models/Usuario.js";

// ======================================================
// LISTAR USUARIOS
// ======================================================

export async function obtenerUsuariosService() {
  const usuarios = await Usuario.find()
    .select("-password")
    .sort({
      rol: 1,
      nombre: 1,
    });

  return usuarios;
}