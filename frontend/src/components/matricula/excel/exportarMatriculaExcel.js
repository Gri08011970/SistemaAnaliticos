import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

import {
  calcularEdadAl30Junio,
  formatearFecha,
  obtenerPreviasValidas,
} from "../matriculaUtils";

export function exportarMatriculaExcel({
  alumnosDelCurso = [],
  cursoSeleccionado,
}) {
  if (!cursoSeleccionado) {
    alert("Seleccioná un curso antes de exportar.");
    return;
  }

  const datos = alumnosDelCurso.map((alumno) => {
    const previasReales = obtenerPreviasValidas(alumno);

    return {
      "Apellido y Nombre":
        `${alumno.apellido || ""}, ${alumno.nombre || ""}`,

      DNI: alumno.dni || "",

      "Fecha nacimiento":
        formatearFecha(alumno.fechaNacimiento),

      "Edad al 30/06":
        calcularEdadAl30Junio(alumno.fechaNacimiento),

      "Materias pendientes": previasReales
        .map(
          (previa) =>
            `${previa.asignatura}${
              previa.anio ? ` (${previa.anio})` : ""
            }`,
        )
        .join(", "),

      Condición: alumno.condicionFinal || "",

      Curso: cursoSeleccionado.curso || "",

      Turno: cursoSeleccionado.turno || "",
    };
  });

  const hoja = XLSX.utils.json_to_sheet(datos);
  const libro = XLSX.utils.book_new();

  XLSX.utils.book_append_sheet(
    libro,
    hoja,
    "Matrícula",
  );

  const excelBuffer = XLSX.write(libro, {
    bookType: "xlsx",
    type: "array",
  });

  const archivo = new Blob([excelBuffer], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  });

  const nombreCurso =
    cursoSeleccionado.curso || "curso";

  const nombreTurno =
    cursoSeleccionado.turno || "turno";

  saveAs(
    archivo,
    `Matricula_${nombreCurso}_${nombreTurno}.xlsx`,
  );
}