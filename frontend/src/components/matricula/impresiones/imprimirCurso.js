import {
  calcularEdadAl30Junio,
  formatearDNI,
  formatearFecha,
} from "../matriculaUtils";

export function imprimirCurso({
  cursoSeleccionado,
  alumnosFiltrados,
  ordenCurso,
}) {
  if (!cursoSeleccionado) return;

  const mostrarLegajo = alumnosFiltrados.some(
    (alumno) => alumno.legajoNumero || alumno.legajoAnio,
  );

  const mostrarMatriz = alumnosFiltrados.some(
    (alumno) => alumno.folioMatriz || alumno.libroMatriz,
  );

  const mostrarFechaNacimiento = alumnosFiltrados.some(
    (alumno) => alumno.fechaNacimiento,
  );

  const mostrarEdad = mostrarFechaNacimiento;

  const mostrarCondicion = alumnosFiltrados.some(
    (alumno) => alumno.condicionFinal,
  );

  const mostrarPendientes = alumnosFiltrados.some(
    (alumno) =>
      Array.isArray(alumno.materiasPendientes) &&
      alumno.materiasPendientes.some(
        (previa) =>
          previa.asignatura &&
          previa.asignatura !== "----------",
      ),
  );

  const alumnosParaImprimir = [...alumnosFiltrados].sort((a, b) => {
    if (ordenCurso === "legajo") {
      const anioA = Number(a.legajoAnio || 0);
      const anioB = Number(b.legajoAnio || 0);

      if (anioA !== anioB) return anioB - anioA;

      const numeroA = Number(a.legajoNumero || 999999);
      const numeroB = Number(b.legajoNumero || 999999);

      return numeroA - numeroB;
    }

    if (ordenCurso === "matriz") {
      const matrizA = Number(
        String(
          a.folioMatriz || a.libroMatriz || "999999",
        ).split("/")[0],
      );

      const matrizB = Number(
        String(
          b.folioMatriz || b.libroMatriz || "999999",
        ).split("/")[0],
      );

      return matrizA - matrizB;
    }

    return `${a.apellido || ""} ${a.nombre || ""}`.localeCompare(
      `${b.apellido || ""} ${b.nombre || ""}`,
      "es",
      { sensitivity: "base" },
    );
  });

  const filas = alumnosParaImprimir
    .map((alumno, index) => {
      const previasReales = Array.isArray(alumno.materiasPendientes)
        ? alumno.materiasPendientes.filter(
            (previa) =>
              previa.asignatura &&
              previa.asignatura !== "----------",
          )
        : [];

      return `
        <tr class="${alumno.sexo === "Varón" ? "fila-varon" : ""}">
          <td>${index + 1}</td>

          <td class="nombre">
            ${alumno.apellido || ""}, ${alumno.nombre || ""}
          </td>

          <td>${formatearDNI(alumno.dni)}</td>

          ${
            mostrarLegajo
              ? `
                <td>
                  ${
                    alumno.legajoNumero && alumno.legajoAnio
                      ? `${alumno.legajoNumero}/${alumno.legajoAnio}`
                      : ""
                  }
                </td>
              `
              : ""
          }

          ${
            mostrarMatriz
              ? `
                <td>
                  ${alumno.folioMatriz || alumno.libroMatriz || ""}
                </td>
              `
              : ""
          }

          ${
            mostrarFechaNacimiento
              ? `
                <td>
                  ${
                    alumno.fechaNacimiento
                      ? formatearFecha(alumno.fechaNacimiento)
                      : ""
                  }
                </td>
              `
              : ""
          }

          ${
            mostrarEdad
              ? `
                <td>
                  ${
                    alumno.fechaNacimiento
                      ? calcularEdadAl30Junio(
                          alumno.fechaNacimiento,
                        )
                      : ""
                  }
                </td>
              `
              : ""
          }

          ${
            mostrarCondicion
              ? `<td>${alumno.condicionFinal || ""}</td>`
              : ""
          }

          ${
            mostrarPendientes
              ? `
                <td>
                  ${previasReales
                    .map(
                      (previa) =>
                        `${previa.asignatura}${
                          previa.anio
                            ? ` (${previa.anio})`
                            : ""
                        }`,
                    )
                    .join(", ")}
                </td>
              `
              : ""
          }
        </tr>
      `;
    })
    .join("");

  const ventana = window.open("", "_blank");

  if (!ventana) {
    alert(
      "El navegador bloqueó la ventana de impresión. Habilitá las ventanas emergentes.",
    );
    return;
  }

  ventana.document.write(`
    <html>
      <head>
        <title>Lista de matrícula por curso</title>

        <style>
          * {
            box-sizing: border-box;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }

          body {
            font-family: Arial, sans-serif;
            padding: 28px;
            color: #222;
          }

          h2,
          h3,
          p {
            text-align: center;
            margin: 4px 0;
          }

          h2 {
            color: #1e3a5f;
            font-size: 20px;
          }

          h3 {
            font-size: 16px;
            margin-top: 18px;
          }

          .subtitulo {
            font-size: 12px;
            color: #555;
          }

          .fecha-impresion {
            margin-bottom: 20px;
            font-size: 12px;
            color: #555;
          }

          table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 18px;
            font-size: 11px;
          }

          th,
          td {
            border: 1px solid #333;
            padding: 5px;
            text-align: center;
            vertical-align: middle;
          }

          th {
            background-color: #1e3a5f !important;
            color: white !important;
          }

          .nombre {
            text-align: left;
          }

          .fila-varon td {
            background-color: #d9d9d9 !important;
          }

          @page {
            size: A4 landscape;
            margin: 12mm;
          }
        </style>
      </head>

      <body>
        <h2>Escuela Educación Secundaria N.º 140</h2>

        <p class="subtitulo">
          “Florencio Molina Campos”
        </p>

        <h3>
          Lista de matrícula — Curso ${cursoSeleccionado.curso}
          — Turno ${cursoSeleccionado.turno}
        </h3>

        <p>
          Cantidad de estudiantes:
          ${alumnosParaImprimir.length}
        </p>

        <p class="fecha-impresion">
          Fecha de impresión:
          ${new Date().toLocaleString("es-AR")}
        </p>

        <table>
          <thead>
            <tr>
              <th>N.º</th>
              <th>Apellido y Nombre</th>
              <th>DNI</th>
              ${mostrarLegajo ? "<th>Legajo</th>" : ""}
              ${mostrarMatriz ? "<th>Libro/Folio</th>" : ""}
              ${
                mostrarFechaNacimiento
                  ? "<th>Fecha nac.</th>"
                  : ""
              }
              ${mostrarEdad ? "<th>Edad</th>" : ""}
              ${mostrarCondicion ? "<th>Cond.</th>" : ""}
              ${mostrarPendientes ? "<th>Pendientes</th>" : ""}
            </tr>
          </thead>

          <tbody>
            ${filas}
          </tbody>
        </table>
      </body>
    </html>
  `);

  ventana.document.close();
  ventana.focus();
  ventana.print();
}