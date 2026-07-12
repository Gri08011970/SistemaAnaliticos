import * as XLSX from "xlsx";
import axios from "axios";

import { normalizarTexto } from "../matriculaUtils";

function calcularCondicionDesdeEstado(estado) {
  const estadoNormalizado = normalizarTexto(estado);

  if (estadoNormalizado.includes("baja")) {
    return "BAJA";
  }

  if (
    estadoNormalizado.includes(
      "continua mismo ano de estudio",
    )
  ) {
    return "Rec";
  }

  if (
    estadoNormalizado.includes(
      "ingresante al nivel",
    )
  ) {
    return "";
  }

  return "Prom";
}

export async function importarReporte({
  evento,
  esAdmin,
  cursoSeleccionado,
  obtenerMatricula,
}) {
  if (!esAdmin) {
    alert(
      "Solo el administrador puede importar estudiantes.",
    );
    return;
  }

  const archivo = evento.target.files?.[0];

  if (!archivo || !cursoSeleccionado) return;

  try {
    const datos = await archivo.arrayBuffer();
    const libro = XLSX.read(datos);

    const hoja =
      libro.Sheets[libro.SheetNames[0]];

    const filas = XLSX.utils.sheet_to_json(
      hoja,
      {
        header: 1,
        defval: "",
      },
    );

    const filaEncabezadosIndex = filas.findIndex(
      (fila) =>
        fila.some((celda) =>
          normalizarTexto(celda).includes(
            "nombre estudiante",
          ),
        ),
    );

    if (filaEncabezadosIndex === -1) {
      alert(
        "No encontré las columnas del reporte oficial.",
      );

      return;
    }

    const encabezados =
      filas[filaEncabezadosIndex].map(
        normalizarTexto,
      );

    const indiceEstado = encabezados.findIndex(
      (encabezado) =>
        encabezado.includes(
          "estado inscripcion",
        ),
    );

    const indiceNombre = encabezados.findIndex(
      (encabezado) =>
        encabezado.includes(
          "nombre estudiante",
        ),
    );

    const indiceDni = encabezados.findIndex(
      (encabezado) =>
        encabezado.includes(
          "documento estudiante",
        ),
    );

    if (
      indiceEstado === -1 ||
      indiceNombre === -1 ||
      indiceDni === -1
    ) {
      alert(
        "El archivo no contiene todas las columnas necesarias.",
      );

      return;
    }

    let ultimoEstado = "";

    const alumnosParaImportar = filas
      .slice(filaEncabezadosIndex + 1)
      .map((fila) => {
        const estadoFila =
          fila[indiceEstado] || ultimoEstado;

        if (fila[indiceEstado]) {
          ultimoEstado = fila[indiceEstado];
        }

        const condicion =
          calcularCondicionDesdeEstado(
            estadoFila,
          );

        if (condicion === "BAJA") {
          return null;
        }

        const nombreCompleto =
          fila[indiceNombre]
            ?.toString()
            .trim();

        const dni = fila[indiceDni]
          ?.toString()
          .replace(/\D/g, "");

        if (!nombreCompleto || !dni) {
          return null;
        }

        return {
          apellido: nombreCompleto,
          nombre: "",
          dni,
          curso:
            cursoSeleccionado.curso,
          turno:
            cursoSeleccionado.turno,
          fechaNacimiento: "",
          materiasPendientes: [],
          condicionFinal: condicion,
          estadoMatricula: "Activo",
        };
      })
      .filter(Boolean);

    if (alumnosParaImportar.length === 0) {
      alert(
        "No se encontraron estudiantes válidos para importar.",
      );

      return;
    }

    for (const alumno of alumnosParaImportar) {
      await axios.post(
        "/api/matricula",
        alumno,
      );
    }

    await obtenerMatricula();

    alert(
      `Se importaron ${alumnosParaImportar.length} estudiantes.`,
    );
  } catch (error) {
    console.log(error);

    alert(
      "Hubo un error al importar el reporte.",
    );
  } finally {
    evento.target.value = "";
  }
}