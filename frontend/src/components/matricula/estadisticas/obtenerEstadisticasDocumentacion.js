import {
  limpiarDNI,
  normalizarTexto,
} from "../matriculaUtils";

export function obtenerEstadisticasDocumentacion({
  alumnosMatricula = [],
  cursoDocumentacion = "",
  turnoDocumentacion = "",
  busquedaDocumentacion = "",
}) {
  const textoBuscado = normalizarTexto(busquedaDocumentacion);
  const dniBuscado = limpiarDNI(busquedaDocumentacion);

  const alumnosDocumentacion = alumnosMatricula
    .filter((alumno) => alumno.estadoMatricula === "Activo")

    .filter((alumno) =>
      cursoDocumentacion
        ? alumno.curso === cursoDocumentacion
        : true,
    )

    .filter((alumno) =>
      turnoDocumentacion
        ? alumno.turno === turnoDocumentacion
        : true,
    )

    .filter((alumno) => {
      if (!textoBuscado && !dniBuscado) return true;

      const nombreCompleto = normalizarTexto(
        `${alumno.apellido || ""} ${alumno.nombre || ""}`,
      );

      const dniAlumno = limpiarDNI(alumno.dni);

      const coincideNombre =
        textoBuscado.length > 0 &&
        nombreCompleto.includes(textoBuscado);

      const coincideDni =
        dniBuscado.length > 0 &&
        dniAlumno.includes(dniBuscado);

      return coincideNombre || coincideDni;
    })

    .sort((a, b) =>
      `${a.curso || ""} ${a.turno || ""} ${a.apellido || ""} ${
        a.nombre || ""
      }`.localeCompare(
        `${b.curso || ""} ${b.turno || ""} ${b.apellido || ""} ${
          b.nombre || ""
        }`,
        "es",
        { sensitivity: "base" },
      ),
    );

  const totalDocumentacion = alumnosDocumentacion.length;

  const dniFisicoCompletos = alumnosDocumentacion.filter(
    (alumno) => alumno.dniFisico === "SI",
  ).length;

  const partidasCompletas = alumnosDocumentacion.filter(
    (alumno) => alumno.partidaNacimiento === "SI",
  ).length;

  const analiticosCompletos = alumnosDocumentacion.filter(
    (alumno) => alumno.analiticoParcial === "SI",
  ).length;

  return {
    alumnosDocumentacion,
    totalDocumentacion,
    dniFisicoCompletos,
    partidasCompletas,
    analiticosCompletos,
  };
}