import { formatearDNI } from "../matriculaUtils";

export function imprimirRecursantes(alumnosRecursantes = []) {
  const ventana = window.open("", "_blank");

  if (!ventana) {
    alert(
      "El navegador bloqueó la ventana de impresión. Habilitá las ventanas emergentes.",
    );
    return;
  }

  const filas = alumnosRecursantes
    .map(
      (alumno) => `
        <tr>
          <td>${alumno.apellido || ""}, ${alumno.nombre || ""}</td>
          <td>${formatearDNI(alumno.dni)}</td>
          <td>${alumno.curso || ""}</td>
          <td>${alumno.turno || ""}</td>
        </tr>
      `,
    )
    .join("");

  ventana.document.write(`
    <html>
      <head>
        <title>Recursantes</title>

        <style>
          * {
            box-sizing: border-box;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }

          body {
            font-family: Arial, sans-serif;
            padding: 30px;
            color: #222;
          }

          h2 {
            text-align: center;
            color: #1e3a5f;
            margin-bottom: 6px;
          }

          .fecha {
            text-align: right;
            font-size: 12px;
            color: #555;
            margin-bottom: 18px;
          }

          table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 20px;
            font-size: 12px;
          }

          th,
          td {
            border: 1px solid #444;
            padding: 8px;
            text-align: center;
          }

          th {
            background: #1e3a5f !important;
            color: white !important;
          }

          td:first-child {
            text-align: left;
          }

          @page {
            size: A4 landscape;
            margin: 12mm;
          }
        </style>
      </head>

      <body>
        <h2>Listado de estudiantes recursantes</h2>

        <p class="fecha">
          Fecha de impresión:
          ${new Date().toLocaleString("es-AR")}
        </p>

        <p style="text-align:center;">
          Cantidad de estudiantes:
          <strong>${alumnosRecursantes.length}</strong>
        </p>

        <table>
          <thead>
            <tr>
              <th>Apellido y Nombre</th>
              <th>DNI</th>
              <th>Curso</th>
              <th>Turno</th>
            </tr>
          </thead>

          <tbody>
            ${
              filas ||
              `
                <tr>
                  <td colspan="4">
                    No hay estudiantes recursantes.
                  </td>
                </tr>
              `
            }
          </tbody>
        </table>
      </body>
    </html>
  `);

  ventana.document.close();
  ventana.focus();
  ventana.print();
}