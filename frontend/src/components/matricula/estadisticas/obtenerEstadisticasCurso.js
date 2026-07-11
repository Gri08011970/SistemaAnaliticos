import { tieneSobreedad } from "../matriculaUtils";

export function obtenerEstadisticasCurso(alumnosDelCurso = []) {
  const totalEstudiantes = alumnosDelCurso.length;

  const totalProm = alumnosDelCurso.filter(
    (alumno) => alumno.condicionFinal === "Prom",
  ).length;

  const totalRec = alumnosDelCurso.filter(
    (alumno) => alumno.condicionFinal === "Rec",
  ).length;

  const totalConPrevias = alumnosDelCurso.filter((alumno) => {
    const previasReales = Array.isArray(alumno.materiasPendientes)
      ? alumno.materiasPendientes.filter(
          (previa) =>
            previa.asignatura &&
            previa.asignatura !== "----------",
        )
      : [];

    return previasReales.length > 0;
  }).length;

  const porcentajeProm =
    totalEstudiantes > 0
      ? Math.round((totalProm / totalEstudiantes) * 100)
      : 0;

  const porcentajeRec =
    totalEstudiantes > 0
      ? Math.round((totalRec / totalEstudiantes) * 100)
      : 0;

  const totalIngresantes = alumnosDelCurso.filter(
    (alumno) => alumno.condicionFinal === "Ingresante",
  ).length;

  const totalReinscriptos = alumnosDelCurso.filter(
    (alumno) => alumno.condicionFinal === "Reinscripto",
  ).length;

  const totalSobreedad = alumnosDelCurso.filter((alumno) =>
    tieneSobreedad(alumno),
  ).length;

  return {
    totalEstudiantes,
    totalProm,
    totalRec,
    totalConPrevias,
    porcentajeProm,
    porcentajeRec,
    totalIngresantes,
    totalReinscriptos,
    totalSobreedad,
  };
}