export function obtenerEstadisticasGenerales(alumnosMatricula = []) {
  const alumnosActivos = alumnosMatricula.filter(
    (alumno) => alumno.estadoMatricula === "Activo",
  );

  const totalGeneral = alumnosActivos.length;

  const totalManana = alumnosActivos.filter(
    (alumno) => alumno.turno === "Mañana",
  ).length;

  const totalTarde = alumnosActivos.filter(
    (alumno) => alumno.turno === "Tarde",
  ).length;

  const cicloBasico = alumnosActivos.filter(
    (alumno) =>
      alumno.curso?.startsWith("1°") ||
      alumno.curso?.startsWith("2°") ||
      alumno.curso?.startsWith("3°"),
  ).length;

  const cicloSuperior = alumnosActivos.filter(
    (alumno) =>
      alumno.curso?.startsWith("4°") ||
      alumno.curso?.startsWith("5°") ||
      alumno.curso?.startsWith("6°"),
  ).length;

  return {
    totalGeneral,
    totalManana,
    totalTarde,
    cicloBasico,
    cicloSuperior,
  };
}