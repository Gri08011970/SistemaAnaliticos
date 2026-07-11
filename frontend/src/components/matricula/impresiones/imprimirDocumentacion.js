import { formatearDNI } from "../matriculaUtils";

export function imprimirDocumentacion(alumnosDocumentacion = []) {
  const ventana = window.open("", "_blank");

  if (!ventana) {
    alert(
      "El navegador bloqueó la ventana de impresión. Habilitá las ventanas emergentes.",
    );
    return;
  }

  const filas = alumnosDocumentacion
    .map(
      (alumno) => `
        <tr>
          <td>${alumno.curso || ""}</td>

          <td class="nombre">
            ${alumno.apellido || ""}, ${alumno.nombre || ""}
          </td>

          <td>${formatearDNI(alumno.dni)}</td>

          <td>
            ${
              alumno.legajoNumero && alumno.legajoAnio
                ? `${alumno.legajoNumero}/${alumno.legajoAnio}`
                : "-"
            }
          </td>

          <td>${alumno.dniFisico || ""}</td>

          <td>${alumno.partidaNacimiento || ""}</td>

          <td>${alumno.analiticoParcial || ""}</td>

          <td>${alumno.observacionDocumentacion || ""}</td>
        </tr>
      `,
    )
    .join("");

  ventana.document.write(`
    <html>
      <head>
        <title>Control de documentación</title>

        <style>
             
  * {
    box-sizing: border-box;
    -webkit-print-color-adjust: exact !important;
    print-color-adjust: exact !important;
  }

  body {
    font-family: Arial, sans-serif;
    padding: 18px;
    color: #222;
  }

  h2 {
    text-align: center;
    color: #1e3a5f;
    margin: 0 0 6px;
    font-size: 24px;
  }

  .subtitulo {
    text-align: center;
    font-size: 15px;
    color: #555;
    margin: 0 0 12px;
  }

  .fecha {
    text-align: right;
    font-size: 13px;
    color: #555;
    margin-bottom: 12px;
  }

  .cantidad {
    text-align: center;
    margin-bottom: 12px;
    font-size: 14px;
  }

  table {
    width: 100%;
    border-collapse: collapse;
    margin-top: 12px;
    font-size: 13px;
  }

  th,
  td {
    border: 1.5px solid #444;
    padding: 8px 6px;
    text-align: center;
    vertical-align: middle;
  }

  th {
    background: #1e3a5f !important;
    color: white !important;
    font-size: 13px;
  }

  .nombre {
    text-align: left;
    min-width: 180px;
  }

  @page {
    size: A4 landscape;
    margin: 8mm;
  }
</style>
      </head>

      <body>
        <h2>Control de documentación</h2>

        <p class="subtitulo">
          Escuela de Educación Secundaria N.º 140
        </p>

        <p class="fecha">
          Fecha de impresión:
          ${new Date().toLocaleString("es-AR")}
        </p>

        <p class="cantidad">
          Cantidad de estudiantes:
          <strong>${alumnosDocumentacion.length}</strong>
        </p>

        <table>
          <thead>
            <tr>
              <th>Curso</th>
              <th>Apellido y Nombre</th>
              <th>DNI</th>
              <th>Legajo</th>
              <th>DNI físico</th>
              <th>Partida</th>
              <th>Analítico</th>
              <th>Observaciones</th>
            </tr>
          </thead>

          <tbody>
            ${
              filas ||
              `
                <tr>
                  <td colspan="8">
                    No hay estudiantes para mostrar.
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
