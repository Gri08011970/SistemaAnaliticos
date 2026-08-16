const escaparHtml = (valor = "") =>
  String(valor)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");

const normalizarTexto = (valor) =>
  String(valor || "")
    .trim()
    .toLocaleLowerCase("es");
const abreviarNacionalidad = (valor) => {
  const nacionalidad = normalizarTexto(valor);

  const abreviaturas = {
    argentina: "Arg.",
    argentino: "Arg.",
    boliviana: "Bol.",
    boliviano: "Bol.",
    paraguaya: "Par.",
    paraguayo: "Par.",
    peruana: "Per.",
    peruano: "Per.",
    chilena: "Chi.",
    chileno: "Chi.",
    uruguaya: "Uru.",
    uruguayo: "Uru.",
    brasileña: "Bra.",
    brasilera: "Bra.",
    brasileño: "Bra.",
    venezolana: "Ven.",
    venezolano: "Ven.",
    colombiana: "Col.",
    colombiano: "Col.",
  };

  if (!nacionalidad) return "—";

  return abreviaturas[nacionalidad] || String(valor).trim().slice(0, 3);
};

const abreviarSexo = (valor) => {
  const sexo = normalizarTexto(valor);

  if (["varón", "varon", "masculino", "m"].includes(sexo)) {
    return "Var.";
  }

  if (["mujer", "femenino", "f"].includes(sexo)) {
    return "Muj.";
  }

  return valor ? String(valor).trim() : "—";
};

const esEstudianteVaron = (alumno) => {
  const sexo = normalizarTexto(
    alumno.sexo || alumno.genero || alumno.sexoRegistrado,
  );

  return ["masculino", "masculino/a", "varón", "varon", "m"].includes(sexo);
};

const formatearDni = (dni) => {
  const numeros = String(dni || "").replace(/\D/g, "");

  if (!numeros) return "—";

  return numeros.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
};

const formatearFecha = (fecha) => {
  if (!fecha) return "—";

  const texto = String(fecha).trim();

  if (/^\d{2}\/\d{2}\/\d{4}$/.test(texto)) {
    return texto;
  }

  const fechaPreparada = new Date(texto);

  if (Number.isNaN(fechaPreparada.getTime())) {
    return texto;
  }

  return fechaPreparada.toLocaleDateString("es-AR");
};

const calcularEdad = (fechaNacimiento) => {
  if (!fechaNacimiento) return "—";

  const nacimiento = new Date(fechaNacimiento);

  if (Number.isNaN(nacimiento.getTime())) {
    return "—";
  }

  const hoy = new Date();

  let edad = hoy.getFullYear() - nacimiento.getFullYear();

  const diferenciaMes = hoy.getMonth() - nacimiento.getMonth();

  if (
    diferenciaMes < 0 ||
    (diferenciaMes === 0 && hoy.getDate() < nacimiento.getDate())
  ) {
    edad -= 1;
  }

  return edad >= 0 ? edad : "—";
};

const obtenerNombreCompleto = (alumno) => {
  const apellido = String(alumno.apellido || "").trim();

  const nombre = String(alumno.nombre || "").trim();

  if (apellido || nombre) {
    return [apellido, nombre].filter(Boolean).join(", ");
  }

  return (
    alumno.apellidoNombre || alumno.estudiante || alumno.nombreCompleto || "—"
  );
};

const obtenerLegajo = (alumno) => {
  const numero = alumno.legajoNumero || alumno.numeroLegajo || "";

  const anio = alumno.legajoAnio || alumno.anioLegajo || "";

  if (!numero) return "—";
  if (!anio) return String(numero);

  return `${numero}/${anio}`;
};

const obtenerMatriz = (alumno) => {
  const libro = alumno.libroMatriz || alumno.libro || "";

  const folio = alumno.folioMatriz || alumno.folio || "";

  if (!libro && !folio) return "—";

  if (libro && String(libro).includes("/")) {
    return String(libro);
  }

  return [libro, folio].filter(Boolean).join("/");
};

const obtenerAsignaturasPendientes = (alumno) => {
  const materias = Array.isArray(alumno.materiasPendientes)
    ? alumno.materiasPendientes
    : [];

  const nombres = materias
    .map((materia) => {
      if (typeof materia === "string") {
        return materia.trim();
      }

      return String(
        materia?.asignatura || materia?.materia || materia?.nombre || "",
      ).trim();
    })
    .filter(Boolean)
    .filter((materia) => materia !== "----------" && materia !== "---------");

  return nombres.length > 0 ? nombres.join(", ") : "Ninguna";
};

const obtenerTextoAutorizados = (datosComplementarios) => {
  if (datosComplementarios.sinAutorizados) {
    return "SIN AUTORIZADOS";
  }

  const autorizados = datosComplementarios.autorizados || [];

  if (autorizados.length === 0) {
    return "Sin información";
  }

  return autorizados
    .map((registro) => registro.adultoAutorizado || "—")
    .join(" / ");
};

const obtenerVinculosAutorizados = (datosComplementarios) => {
  if (datosComplementarios.sinAutorizados) {
    return "—";
  }

  const autorizados = datosComplementarios.autorizados || [];

  if (autorizados.length === 0) {
    return "—";
  }

  return autorizados
    .map((registro) =>
      registro.vinculo === "Otro"
        ? registro.vinculoOtro || "Otro"
        : registro.vinculo || "—",
    )
    .join(" / ");
};

const obtenerDniAutorizados = (datosComplementarios) => {
  if (datosComplementarios.sinAutorizados) {
    return "—";
  }

  const autorizados = datosComplementarios.autorizados || [];

  if (autorizados.length === 0) {
    return "—";
  }

  return autorizados
    .map((registro) => formatearDni(registro.dniAdultoResponsable))
    .join(" / ");
};

const obtenerDocumentacion = (alumno) => {
  const dniFisico = alumno.dniFisico || "NO";

  const partida = alumno.partidaNacimiento || "NO";

  const analitico = alumno.analiticoParcial || "-----";

  return [
    `DNI físico: ${dniFisico}`,
    `Partida: ${partida}`,
    `Analítico: ${analitico}`,
  ].join(" · ");
};

const crearFilas = ({ estudiantes, obtenerDatosAlumno, tipo }) =>
  estudiantes
    .map((alumno, indice) => {
      const datosComplementarios = obtenerDatosAlumno(alumno);

      const claseVaron = esEstudianteVaron(alumno) ? " fila-varon" : "";

      const claseSeparador = (indice + 1) % 5 === 0 ? " fila-separador" : "";

      const claseFila = `${claseVaron}${claseSeparador}`;

      const numero = indice + 1;

      if (tipo === 1) {
        return `
    <tr class="${claseFila}">
      <td class="numero">
        ${numero}
      </td>

      <td class="nombre">
        ${escaparHtml(obtenerNombreCompleto(alumno))}
      </td>

      <td class="dato-breve">
        ${escaparHtml(formatearDni(alumno.dni))}
      </td>

      <td class="dato-breve">
        ${escaparHtml(formatearFecha(alumno.fechaNacimiento))}
      </td>

      <td class="dato-breve">
        ${escaparHtml(calcularEdad(alumno.fechaNacimiento))}
      </td>

      <td class="dato-breve">
        ${escaparHtml(abreviarNacionalidad(alumno.nacionalidad))}
      </td>

      <td class="dato-breve">
        ${escaparHtml(
          abreviarSexo(alumno.sexo || alumno.genero || alumno.sexoRegistrado),
        )}
      </td>

      <td class="dato-breve">
        ${escaparHtml(obtenerLegajo(alumno))}
      </td>

      <td class="dato-breve">
        ${escaparHtml(obtenerMatriz(alumno))}
      </td>
    </tr>
  `;
      }
      if (tipo === 2) {
        return `
          <tr class="${claseFila}">
            <td class="numero">${numero}</td>
            <td class="nombre">
              ${escaparHtml(obtenerNombreCompleto(alumno))}
            </td>
            <td>
              ${escaparHtml(
                datosComplementarios.domicilio ||
                  alumno.domicilio ||
                  alumno.direccion ||
                  "—",
              )}
            </td>
            <td>
              ${escaparHtml(
                datosComplementarios.telefono ||
                  alumno.telefono ||
                  alumno.celular ||
                  "—",
              )}
            </td>
            <td>
              ${escaparHtml(
                datosComplementarios.nombreResponsable ||
                  alumno.adultoResponsable ||
                  alumno.responsable ||
                  alumno.tutor ||
                  "—",
              )}
            </td>
            <td>
              ${escaparHtml(
                datosComplementarios.vinculoResponsable ||
                  alumno.vinculo ||
                  alumno.vinculoResponsable ||
                  "—",
              )}
            </td>
            <td>
              ${escaparHtml(obtenerTextoAutorizados(datosComplementarios))}
            </td>
            <td>
              ${escaparHtml(obtenerVinculosAutorizados(datosComplementarios))}
            </td>
            <td>
              ${escaparHtml(obtenerDniAutorizados(datosComplementarios))}
            </td>
          </tr>
        `;
      }

      return `
        <tr class="${claseFila}">
          <td class="numero">${numero}</td>
          <td class="nombre">
            ${escaparHtml(obtenerNombreCompleto(alumno))}
          </td>
          <td>
            ${escaparHtml(obtenerAsignaturasPendientes(alumno))}
          </td>
          <td>
            ${escaparHtml(obtenerDocumentacion(alumno))}
          </td>
          <td class="observacion">
            ${escaparHtml(alumno.observacionDocumentacion || "")}
          </td>
          <td class="control">
            ☐ Sin cambios<br>
            ☐ Datos actualizados
          </td>
          <td class="firma"></td>
        </tr>
      `;
    })
    .join("");

const crearEncabezado = ({ curso, turno, cicloLectivo, cantidad, parte }) => `
  <header>
    <div class="institucion">
      ESCUELA DE EDUCACIÓN SECUNDARIA N.º 140
      “FLORENCIO MOLINA CAMPOS”
    </div>

    <h1>
      PLANILLA INTEGRAL DE REINSCRIPCIÓN
    </h1>

    <div class="subtitulo">
      Parte ${parte} de 3
    </div>

    <div class="datos-generales">
      <span>
        <strong>Curso:</strong>
        ${escaparHtml(curso)}
      </span>

      <span>
        <strong>Turno:</strong>
        ${escaparHtml(turno)}
      </span>

      <span>
        <strong>Ciclo lectivo:</strong>
        ${escaparHtml(cicloLectivo)}
      </span>

      <span>
        <strong>Estudiantes:</strong>
        ${cantidad}
      </span>

      <span>
        <strong>Fecha:</strong>
        ____ / ____ / ______
      </span>
    </div>
  </header>
`;

export default function imprimirPlanillaReinscripcion({
  curso,
  turno,
  cicloLectivo,
  estudiantes = [],
  obtenerDatosAlumno,
}) {
  if (!Array.isArray(estudiantes) || estudiantes.length === 0) {
    alert("No hay estudiantes para imprimir.");
    return;
  }

  if (typeof obtenerDatosAlumno !== "function") {
    alert("No se pudieron preparar los datos complementarios.");
    return;
  }

  const filasParte1 = crearFilas({
    estudiantes,
    obtenerDatosAlumno,
    tipo: 1,
  });

  const filasParte2 = crearFilas({
    estudiantes,
    obtenerDatosAlumno,
    tipo: 2,
  });

  const filasParte3 = crearFilas({
    estudiantes,
    obtenerDatosAlumno,
    tipo: 3,
  });

  const ventana = window.open("", "_blank", "width=1400,height=900");

  if (!ventana) {
    alert("El navegador bloqueó la ventana de impresión.");
    return;
  }

  ventana.document.write(`
    <!DOCTYPE html>
    <html lang="es">
      <head>
        <meta charset="UTF-8">

        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0"
        >

        <title>
          Reinscripción ${escaparHtml(curso)}
        </title>

        <style>
          @page {
            size: A4 landscape;
            margin: 3.5mm;
          }

          * {
            box-sizing: border-box;
          }

          html,
          body {
            margin: 0;
            padding: 0;
            font-family: Arial, Helvetica, sans-serif;
            color: #172b42;
            background: #ffffff;
          }

          body {
            width: 100%;
          }

          .parte {
            width: 100%;
            margin: 0;
            padding: 0;
            page-break-after: always;
            break-after: page;
          }

          .parte:last-child {
            page-break-after: auto;
            break-after: auto;
          }

         header {
  margin: 0 0 1mm;
}

.institucion {
  font-size: 5.8px;
  line-height: 1;
}

h1 {
  margin: 0.5mm 0 0;
  font-size: 9.5px;
  line-height: 1;
}

.subtitulo {
  margin-top: 0.3mm;
  font-size: 5.5px;
  line-height: 1;
}

.datos-generales {
  gap: 0.7mm;
  margin-top: 0.8mm;
  padding: 0.7mm 1mm;
  font-size: 5.8px;
  line-height: 1;
}
          .datos-generales span {
            min-width: 0;
          }
            table {
  width: 100%;
  border-collapse: collapse;
  table-layout: fixed;
  font-size: 7px;
  line-height: 1.08;
}

thead {
  display: table-header-group;
}

tbody {
  display: table-row-group;
}

tr {
  break-inside: avoid;
  page-break-inside: avoid;
}

th,
td {
  border: 0.65px solid #657787;
  padding: 0.38mm 0.45mm;
  vertical-align: middle;
  overflow: hidden;
  overflow-wrap: anywhere;
  word-break: normal;
}

th {
  height: 6.2mm;
  background: #dbe8ee;
  color: #173f68;
  text-align: center;
  font-size: 6.8px;
  line-height: 1.05;
  font-weight: 800;
}

tbody tr {
  height: 5.85mm;
  max-height: 5.85mm;
}

td {
  height: 5.85mm;
  max-height: 5.85mm;
  font-size: 7px;
}

.fila-varon td {
  background: #cfd6dd;
}

.fila-separador td {
  border-bottom: 1.8px solid #526879;
}

.numero {
  text-align: center;
  font-size: 6.6px;
}

.nombre {
  font-weight: 800;
  font-size: 7.2px;
  line-height: 1.08;
  text-align: left;
}

.observacion {
  position: relative;
}

.observacion::after {
  content: "";
  position: absolute;
  left: 1.5mm;
  right: 1.5mm;
  bottom: 1.3mm;
  border-bottom: 0.5px dotted #6f7d87;
}

.control {
  font-size: 6.4px;
  line-height: 1.2;
}

.firma {
  position: relative;
}

.firma::after {
  content: "";
  position: absolute;
  left: 2mm;
  right: 2mm;
  bottom: 1.4mm;
  border-bottom: 0.5px dotted #626e78;
}

.parte-1 table {
  font-size: 7.4px;
}

.parte-1 th {
  height: 5.2mm;
  padding: 0.25mm 0.35mm;
  font-size: 7px;
  line-height: 1;
  white-space: nowrap;
}

.parte-1 tbody tr {
  height: 4.75mm;
  max-height: 4.75mm;
}

.parte-1 td {
  height: 4.75mm;
  max-height: 4.75mm;
  padding: 0.22mm 0.4mm;
  font-size: 7.3px;
  line-height: 1;
  overflow: hidden;
}

.parte-1 .numero {
  text-align: center;
  white-space: nowrap;
  font-size: 7px;
}

.parte-1 .nombre {
  padding-left: 0.8mm;
  font-size: 7.6px;
  font-weight: 800;
  line-height: 1;
  white-space: nowrap;
  text-align: left;
}

.parte-1 .dato-breve {
  text-align: center;
  white-space: nowrap;
  font-size: 7.1px;
}

/* Parte 2: información familiar */
.parte-2 td {
  font-size: 6.7px;
}

.parte-2 .nombre {
  font-size: 7px;
}

.parte-2 td:nth-child(4),
.parte-2 td:nth-child(6),
.parte-2 td:nth-child(8),
.parte-2 td:nth-child(9) {
  font-size: 6.3px;
}

/* Parte 3 */
.parte-3 td {
  font-size: 6.8px;
}

.parte-3 .nombre {
  font-size: 7.1px;
}

          
          .pie {
            margin-top: 0.9mm;
            display: flex;
            justify-content: space-between;
            gap: 4mm;
            color: #586875;
            font-size: 4.7px;
            line-height: 1;
          }

          @media print {
            html,
            body {
              width: 100%;
              margin: 0;
              padding: 0;
            }

            .parte {
              width: 100%;
            }
          }
        </style>
      </head>

      <body>
        <section class="parte parte-1">
          ${crearEncabezado({
            curso,
            turno,
            cicloLectivo,
            cantidad: estudiantes.length,
            parte: 1,
          })}

          <table>
            <colgroup>
               <col style="width: 3%;">
               <col style="width: 40%;">
               <col style="width: 10%;">
               <col style="width: 9%;">
               <col style="width: 4%;">
               <col style="width: 5%;">
               <col style="width: 5%;">
               <col style="width: 9%;">
               <col style="width: 15%;">
            </colgroup>
 
            <thead>
               <tr>
                 <th>N.º</th>
                 <th>Apellido y nombre</th>
                 <th>DNI</th>
                 <th>F. nac.</th>
                 <th>Edad</th>
                 <th>Nac.</th>
                 <th>Sexo</th>
                 <th>Legajo</th>
                 <th>Libro/Folio</th>
               </tr>
            </thead>
 

            <tbody>
              ${filasParte1}
            </tbody>
          </table>

          <div class="pie">
            <span>
              Parte 1: Datos personales e institucionales
            </span>

            <span>
              Fila gris: estudiante registrado como varón
            </span>
          </div>
        </section>

        <section class="parte parte-2">
          ${crearEncabezado({
            curso,
            turno,
            cicloLectivo,
            cantidad: estudiantes.length,
            parte: 2,
          })}

          <table>
            <colgroup>
              <col style="width: 3%;">
              <col style="width: 18%;">
              <col style="width: 22%;">
              <col style="width: 9%;">
              <col style="width: 15%;">
              <col style="width: 6%;">
              <col style="width: 15%;">
              <col style="width: 6%;">
              <col style="width: 6%;">
            </colgroup>

            <thead>
              <tr>
                <th>N.º</th>
                <th>Apellido y nombre</th>
                <th>Domicilio</th>
                <th>Teléfono</th>
                <th>Adulto responsable</th>
                <th>Vínculo</th>
                <th>Autorizados a retirar</th>
                <th>Vínculo autorizado</th>
                <th>DNI autorizado</th>
              </tr>
            </thead>

            <tbody>
              ${filasParte2}
            </tbody>
          </table>

          <div class="pie">
            <span>
              Parte 2: Domicilio, responsables y autorizados
            </span>

            <span>
              Línea reforzada cada cinco estudiantes
            </span>
          </div>
        </section>

        <section class="parte parte-3">
          ${crearEncabezado({
            curso,
            turno,
            cicloLectivo,
            cantidad: estudiantes.length,
            parte: 3,
          })}

          <table>
            <colgroup>
              <col style="width: 3%;">
              <col style="width: 19%;">
              <col style="width: 16%;">
              <col style="width: 14%;">
              <col style="width: 23%;">
              <col style="width: 12%;">
              <col style="width: 13%;">
            </colgroup>

            <thead>
              <tr>
                <th>N.º</th>
                <th>Apellido y nombre</th>
                <th>Asignaturas pendientes</th>
                <th>Documentación</th>
                <th>Observaciones</th>
                <th>Control de actualización</th>
                <th>Firma del responsable</th>
              </tr>
            </thead>

            <tbody>
              ${filasParte3}
            </tbody>
          </table>

          <div class="pie">
            <span>
              Parte 3: Trayectoria y actualización de datos
            </span>

            <span>
              Documento generado por el Sistema de Gestión Institucional
            </span>
          </div>
        </section>

        <script>
          window.addEventListener("load", function () {
            window.setTimeout(function () {
              window.print();
            }, 300);
          });
        </script>
      </body>
    </html>
  `);

  ventana.document.close();
}
