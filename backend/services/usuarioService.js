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
export async function crearUsuarioService(datosUsuario) {
  const {
    nombre,
    usuario,
    password,
    rol,
    alumnoId,
    docenteId,
  } = datosUsuario;

  const nombreLimpio = String(nombre || "").trim();
  const usuarioLimpio = String(usuario || "")
    .trim()
    .toLowerCase();

  const passwordLimpia = String(password || "").trim();

  const rolesPermitidos = [
    "admin",
    "consulta",
    "docente",
    "estudiante",
  ];

  if (!nombreLimpio || !usuarioLimpio || !passwordLimpia) {
    throw new Error(
      "Nombre, usuario y contraseña son obligatorios.",
    );
  }

  if (!rolesPermitidos.includes(rol)) {
    throw new Error("El rol seleccionado no es válido.");
  }

  if (rol === "docente" && !docenteId) {
    throw new Error(
      "La cuenta docente debe estar vinculada a un docente FOTIA.",
    );
  }

  if (rol === "estudiante" && !alumnoId) {
    throw new Error(
      "La cuenta estudiante debe estar vinculada a un estudiante de Matrícula.",
    );
  }

  const usuarioExistente = await Usuario.findOne({
    usuario: usuarioLimpio,
  });

  if (usuarioExistente) {
    throw new Error(
      `El usuario "${usuarioLimpio}" ya está registrado.`,
    );
  }

  if (rol === "docente") {
    const cuentaDocenteExistente = await Usuario.findOne({
      docenteId,
    });

    if (cuentaDocenteExistente) {
      throw new Error(
        "Ese docente ya tiene una cuenta de acceso registrada.",
      );
    }
  }

  if (rol === "estudiante") {
    const cuentaEstudianteExistente = await Usuario.findOne({
      alumnoId,
    });

    if (cuentaEstudianteExistente) {
      throw new Error(
        "Ese estudiante ya tiene una cuenta de acceso registrada.",
      );
    }
  }

  const nuevoUsuario = await Usuario.create({
    nombre: nombreLimpio,
    usuario: usuarioLimpio,
    password: passwordLimpia,
    rol,

    alumnoId:
      rol === "estudiante"
        ? alumnoId
        : null,

    docenteId:
      rol === "docente"
        ? docenteId
        : null,

    activo: true,

    debeCambiarPassword: true,
    generadoAutomaticamente: false,
  });

  const usuarioSeguro = nuevoUsuario.toObject();

  delete usuarioSeguro.password;

  return usuarioSeguro;
}