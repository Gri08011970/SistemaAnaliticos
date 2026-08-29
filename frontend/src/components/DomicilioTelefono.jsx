import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import * as XLSX from "xlsx";
import QRCode from "qrcode";

const DOMICILIO_ESCUELA = "Titanic 2996, Rafael Castillo";

function DomicilioTelefono({ volverInicio, esAdmin }) {
  const [registros, setRegistros] = useState([]);
  const [alumnosMatricula, setAlumnosMatricula] = useState([]);
  const [cursoSeleccionado, setCursoSeleccionado] = useState("");
  const [borradores, setBorradores] = useState({});
  const [contactosDesplegados, setContactosDesplegados] = useState({});
  const [contactoEditando, setContactoEditando] = useState({});

  useEffect(() => {
    obtenerRegistros();
    obtenerMatricula();
  }, []);

  async function obtenerRegistros() {
    try {
      const respuesta = await axios.get("/api/domicilios");
      setRegistros(Array.isArray(respuesta.data) ? respuesta.data : []);
    } catch (error) {
      console.log(error);
      alert("Error al obtener domicilios");
    }
  }

  async function obtenerMatricula() {
    try {
      const respuesta = await axios.get("/api/matricula");
      setAlumnosMatricula(Array.isArray(respuesta.data) ? respuesta.data : []);
    } catch (error) {
      console.log(error);
      alert("Error al obtener la matrícula");
    }
  }

  const alumnosActivos = useMemo(() => {
    return alumnosMatricula
      .filter((alumno) => alumno.estadoMatricula !== "Baja")
      .sort((a, b) => {
        const cursoA = a.curso || "";
        const cursoB = b.curso || "";

        if (cursoA !== cursoB) {
          return cursoA.localeCompare(cursoB, "es", { numeric: true });
        }

        return `${a.apellido || ""} ${a.nombre || ""}`.localeCompare(
          `${b.apellido || ""} ${b.nombre || ""}`,
          "es",
          { sensitivity: "base" },
        );
      });
  }, [alumnosMatricula]);

  const cursosDisponibles = useMemo(() => {
    return [
      ...new Set(alumnosActivos.map((alumno) => alumno.curso).filter(Boolean)),
    ].sort((a, b) => a.localeCompare(b, "es", { numeric: true }));
  }, [alumnosActivos]);

  const alumnosDelCurso = useMemo(() => {
    return alumnosActivos.filter(
      (alumno) => alumno.curso === cursoSeleccionado,
    );
  }, [alumnosActivos, cursoSeleccionado]);

  const registrosDelCurso = useMemo(() => {
    if (!cursoSeleccionado) return registros;

    return registros.filter((registro) => registro.curso === cursoSeleccionado);
  }, [registros, cursoSeleccionado]);

  const registrosPorAlumno = useMemo(() => {
    const mapa = {};

    registros.forEach((registro) => {
      if (registro.alumnoId) {
        mapa[registro.alumnoId] = registro;
      }
    });

    return mapa;
  }, [registros]);

  function nombreCompletoAlumno(alumno) {
    return `${alumno.apellido || ""} ${alumno.nombre || ""}`.trim();
  }

  function formatearDNI(dni) {
    if (!dni) return "";

    return dni
      .toString()
      .replace(/\D/g, "")
      .replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  }

 function obtenerBorrador(alumno) {
  const registro = registrosPorAlumno[alumno._id] || {};

  return {
    domicilio:
      borradores[alumno._id]?.domicilio ??
      registro.domicilio ??
      "",

    telefono:
      borradores[alumno._id]?.telefono ??
      "",

    nombreResponsable:
      borradores[alumno._id]?.nombreResponsable ??
      "",

    adultoResponsable:
      borradores[alumno._id]?.adultoResponsable ??
      "MADRE",

    vinculoOtro:
      borradores[alumno._id]?.vinculoOtro ??
      "",
  };
}

  function cambiarBorrador(alumnoId, campo, valor) {
    setBorradores((previo) => ({
      ...previo,
      [alumnoId]: {
        ...previo[alumnoId],
        [campo]: valor,
      },
    }));
  }

  function alternarContactos(alumnoId) {
  setContactosDesplegados((previo) => ({
    ...previo,
    [alumnoId]: !previo[alumnoId],
  }));
}

function editarContacto(alumno, contacto, indiceContacto) {
  if (!esAdmin) return;

  setBorradores((previo) => ({
    ...previo,
    [alumno._id]: {
      ...previo[alumno._id],
      domicilio:
        previo[alumno._id]?.domicilio ??
        registrosPorAlumno[alumno._id]?.domicilio ??
        "",
      telefono: contacto.telefono || "",
      nombreResponsable: contacto.nombreResponsable || "",
      adultoResponsable: contacto.vinculo || "MADRE",
      vinculoOtro: contacto.vinculoOtro || "",
    },
  }));

  setContactoEditando((previo) => ({
    ...previo,
    [alumno._id]: {
      id: contacto._id ? String(contacto._id) : null,
      indice: indiceContacto,
    },
  }));

  setContactosDesplegados((previo) => ({
    ...previo,
    [alumno._id]: true,
  }));
}

function cancelarEdicionContacto(alumno) {
  const registro = registrosPorAlumno[alumno._id];

  setContactoEditando((previo) => {
    const copia = { ...previo };
    delete copia[alumno._id];
    return copia;
  });

  setBorradores((previo) => ({
    ...previo,
    [alumno._id]: {
      domicilio:
        previo[alumno._id]?.domicilio ??
        registro?.domicilio ??
        "",
      telefono: "",
      nombreResponsable: "",
      adultoResponsable: "MADRE",
      vinculoOtro: "",
    },
  }));
}

async function eliminarContacto(alumno, contactoId) {
  if (!esAdmin) {
    return;
  }

  const registro = registrosPorAlumno[alumno._id];

  if (!registro?._id) {
    return;
  }

  const confirmar = window.confirm(
    "¿Eliminar este contacto telefónico?",
  );

  if (!confirmar) {
    return;
  }

  const contactosActuales =
    obtenerContactosRegistro(registro);

  const contactosActualizados =
    contactosActuales.filter(
      (contacto) =>
        String(contacto._id) !== String(contactoId),
    );

  const primerContacto =
    contactosActualizados[0] || {};

  try {
    await axios.put(
      `/api/domicilios/${registro._id}`,
      {
        alumnoId: alumno._id,
        curso: alumno.curso || "",
        apellidoNombre:
          nombreCompletoAlumno(alumno),
        dni: alumno.dni || "",
        domicilio: registro.domicilio || "",

        contactos: contactosActualizados,

        telefono:
          primerContacto.telefono || "",

        nombreResponsable:
          primerContacto.nombreResponsable || "",

        adultoResponsable: ["MADRE", "PADRE", "TUTOR"].includes(
          primerContacto.vinculo,
        )
          ? primerContacto.vinculo
          : "TUTOR",
      },
    );

    await obtenerRegistros();
  } catch (error) {
    console.error(
      "Error al eliminar contacto:",
      error,
    );

    alert("No se pudo eliminar el contacto.");
  }
}

  function obtenerContactosRegistro(registro) {
  if (!registro) {
    return [];
  }

  if (
    Array.isArray(registro.contactos) &&
    registro.contactos.length > 0
  ) {
    return registro.contactos;
  }

  /*
   * Compatibilidad con registros antiguos:
   * si todavía no existe contactos[],
   * convertimos los campos históricos en un primer contacto.
   */
  if (
    registro.telefono ||
    registro.nombreResponsable
  ) {
    return [
      {
        nombreResponsable:
          registro.nombreResponsable || "",
        vinculo:
          registro.adultoResponsable || "MADRE",
        vinculoOtro: "",
        telefono:
          registro.telefono || "",
      },
    ];
  }

  return [];
}

  function seleccionarCurso(curso) {
    setCursoSeleccionado(curso);
  }

async function guardarAlumno(alumno) {
  if (!esAdmin) {
    alert("Solo el administrador puede guardar cambios.");
    return;
  }

  const borrador = obtenerBorrador(alumno);

  const registroExistente = registrosPorAlumno[alumno._id];

  if (!borrador.domicilio) {
    if (registroExistente?._id) {
      await axios.delete(`/api/domicilios/${registroExistente._id}`);

      setBorradores((previo) => {
        const copia = { ...previo };
        delete copia[alumno._id];
        return copia;
      });

      obtenerRegistros();
      return;
    }

    alert("Completá el domicilio.");
    return;
  }

  const contactosExistentes =
    obtenerContactosRegistro(registroExistente);

  const tieneNuevoContacto =
    borrador.telefono.trim() ||
    borrador.nombreResponsable.trim();

  let contactosActualizados = contactosExistentes;
  const edicionActual = contactoEditando[alumno._id];

  if (tieneNuevoContacto) {
    if (!borrador.telefono.trim()) {
      alert("Completá el teléfono del contacto.");
      return;
    }

    if (!borrador.nombreResponsable.trim()) {
      alert("Completá el nombre del adulto responsable.");
      return;
    }

    const contactoNuevo = {
      nombreResponsable: borrador.nombreResponsable.trim(),
      vinculo: borrador.adultoResponsable || "MADRE",
      vinculoOtro: borrador.vinculoOtro?.trim() || "",
      telefono: borrador.telefono.trim(),
    };

    if (edicionActual) {
      contactosActualizados = contactosExistentes.map((contacto, indice) => {
        const coincidePorId =
          edicionActual.id &&
          contacto._id &&
          String(contacto._id) === String(edicionActual.id);

        const coincidePorIndice =
          !edicionActual.id && indice === edicionActual.indice;

        if (!coincidePorId && !coincidePorIndice) return contacto;

        return contacto._id
          ? { ...contactoNuevo, _id: contacto._id }
          : contactoNuevo;
      });
    } else {
      contactosActualizados = [...contactosExistentes, contactoNuevo];
    }
  }


  const datos = {
    alumnoId: alumno._id,
    curso: alumno.curso || "",
    apellidoNombre: nombreCompletoAlumno(alumno),
    dni: alumno.dni || "",
    domicilio: borrador.domicilio,

    contactos: contactosActualizados,

    /*
     * Compatibilidad con el formato anterior.
     * Conservamos como campos históricos el primer contacto.
     */
    telefono:
      contactosActualizados[0]?.telefono || "",

    nombreResponsable:
      contactosActualizados[0]?.nombreResponsable || "",

    adultoResponsable: ["MADRE", "PADRE", "TUTOR"].includes(
      contactosActualizados[0]?.vinculo,
    )
      ? contactosActualizados[0].vinculo
      : "TUTOR",
  };

  try {
    if (registroExistente?._id) {
      await axios.put(
        `/api/domicilios/${registroExistente._id}`,
        datos,
      );
    } else {
      await axios.post(
        "/api/domicilios",
        datos,
      );
    }

    /*
     * Después de guardar:
     * conservamos el domicilio,
     * pero limpiamos los campos para cargar otro contacto.
     */
    setBorradores((previo) => ({
      ...previo,

      [alumno._id]: {
        domicilio: borrador.domicilio,
        telefono: "",
        nombreResponsable: "",
        adultoResponsable: "MADRE",
        vinculoOtro: "",
      },
    }));

    setContactoEditando((previo) => {
      const copia = { ...previo };
      delete copia[alumno._id];
      return copia;
    });

    await obtenerRegistros();
  } catch (error) {
    console.log(error);
    alert("Error al guardar el registro");
  }
}

  async function eliminarRegistro(id) {
    if (!esAdmin) return;

    const confirmar = window.confirm("¿Eliminar este domicilio/teléfono?");
    if (!confirmar) return;

    try {
      await axios.delete(`/api/domicilios/${id}`);
      obtenerRegistros();
    } catch (error) {
      console.log(error);
      alert("Error al eliminar el registro");
    }
  }

  function abrirMapa(domicilio) {
    if (!domicilio) {
      alert("Primero cargá el domicilio.");
      return;
    }

    const origen = encodeURIComponent(DOMICILIO_ESCUELA);
    const destino = encodeURIComponent(domicilio);

    window.open(
      `https://www.google.com/maps/dir/?api=1&origin=${origen}&destination=${destino}&travelmode=driving`,
      "_blank",
    );
  }

  async function imprimirActa(alumno) {
  const registro = registrosPorAlumno[alumno._id];

  if (!registro) {
    alert("Primero guardá el domicilio del estudiante.");
    return;
  }

  const contactos = obtenerContactosRegistro(registro);

  const contactosHtml =
    contactos.length > 0
      ? contactos
          .map((contacto, index) => {
            const vinculo =
              contacto.vinculo === "OTRO"
                ? contacto.vinculoOtro || "Otro"
                : contacto.vinculo || "Sin informar";

            return `
              <div class="contacto">
                <strong>Contacto ${index + 1}:</strong>
                ${contacto.nombreResponsable || "Sin nombre"}<br>
                <strong>Vínculo:</strong> ${vinculo}<br>
                <strong>Teléfono:</strong> ${contacto.telefono || "Sin informar"}
              </div>
            `;
          })
          .join("")
      : `
          <div class="contacto contacto-vacio">
            Sin contactos telefónicos registrados.
          </div>
        `;

  const origen = encodeURIComponent(DOMICILIO_ESCUELA);
  const destino = encodeURIComponent(registro.domicilio);

  const urlMapa = `https://www.google.com/maps/dir/?api=1&origin=${origen}&destination=${destino}&travelmode=driving`;

  const qrMapa = await QRCode.toDataURL(urlMapa);

  const ventana = window.open("", "_blank");

  ventana.document.write(`
<html>
<head>
<title>Acta de Visita Domiciliaria</title>

<style>
body{
  font-family:Arial,sans-serif;
  padding:26px;
  color:#222;
}

h1{
  text-align:center;
  color:#1e3a5f;
  font-size:28px;
  margin:0;
}

h2{
  text-align:center;
  font-size:19px;
  margin:4px 0 0 0;
}

h3{
  text-align:center;
  font-weight:normal;
  margin:3px 0 4px 0;
  font-size:13px;
}

.fecha{
  text-align:center;
  margin-bottom:10px;
  font-size:12px;
}

.recuadro-superior{
  display:grid;
  grid-template-columns:1fr 1fr;
  gap:16px;
  border:1px solid #777;
  padding:9px 12px;
  margin-bottom:10px;
  font-size:12px;
}

.datos-acta p,
.estado-visita p{
  margin:3px 0;
}

.estado-visita{
  border-left:1px solid #bbb;
  padding-left:16px;
}

.dos-columnas{
  display:grid;
  grid-template-columns:1fr 1fr;
  gap:18px;
  margin-top:10px;
}

.titulo{
  font-weight:bold;
  font-size:13px;
  margin-bottom:6px;
}

.dato{
  border-bottom:1px solid #ccc;
  padding:4px 0;
  font-size:12px;
}

.contactos{
  margin-top:10px;
}

.contacto{
  border:1px solid #d6e4ea;
  border-radius:8px;
  padding:7px 9px;
  margin-bottom:6px;
  font-size:11px;
  line-height:1.45;
}

.contacto-vacio{
  color:#666;
  font-style:italic;
}

.checks{
  line-height:1.7;
  font-size:12px;
}

.obs{
  border:1px solid #777;
  height:320px;
  margin-top:8px;
}

.firmas-qr{
  display:grid;
  grid-template-columns:1fr 1fr 1fr 150px;
  gap:18px;
  align-items:end;
  margin-top:32px;
}

.firma{
  text-align:center;
  font-size:12px;
}

.linea{
  border-top:1px solid black;
  margin-bottom:6px;
}

.qr{
  text-align:center;
  border:1px dashed #999;
  border-radius:12px;
  padding:6px;
  font-size:9px;
  background:white;
}

.qr p{
  margin:3px 0;
  font-size:9px;
}

.qr img{
  width:92px;
  height:92px;
}
</style>
</head>

<body>

<h1>E.E.S. Nº 140</h1>
<h2>ACTA DE VISITA DOMICILIARIA</h2>
<h3>Florencio Molina Campos</h3>

<div class="fecha">
  Fecha de impresión:
  <strong>${new Date().toLocaleString("es-AR")}</strong>
</div>

<div class="recuadro-superior">
  <div class="datos-acta">
    <p><strong>ACTA Nº</strong> ____________________</p>
    <p><strong>Fecha de la visita</strong> ____ / ____ / ______</p>
    <p><strong>Hora de inicio</strong> __________</p>
    <p><strong>Hora de finalización</strong> __________</p>
  </div>

  <div class="estado-visita">
    <p>☐ Primera visita</p>
    <p>☐ Segunda visita</p>
    <p>☐ Tercera visita</p>
    <p>☐ Concretada</p>
    <p>☐ No se encontró adulto responsable</p>
    <p>☐ Domicilio inexistente</p>
    <p>☐ Se dejó citación</p>
  </div>
</div>

<div class="dos-columnas">
  <div>
    <div class="titulo">DATOS DEL ESTUDIANTE</div>

    <div class="dato"><strong>Curso:</strong> ${alumno.curso}</div>
    <div class="dato"><strong>Alumno:</strong> ${nombreCompletoAlumno(alumno)}</div>
    <div class="dato"><strong>DNI:</strong> ${formatearDNI(alumno.dni)}</div>
    <div class="dato"><strong>Domicilio:</strong> ${registro.domicilio}</div>

    <div class="contactos">
      <div class="titulo">CONTACTOS DE REFERENCIA</div>
      ${contactosHtml}
    </div>
  </div>

  <div>
    <div class="titulo">MOTIVO DE LA VISITA</div>

    <div class="checks">
      ☐ Ausencias reiteradas<br>
      ☐ Riesgo de abandono escolar<br>
      ☐ Inasistencias injustificadas<br>
      ☐ Entrevista con la familia<br>
      ☐ Situación pedagógica<br>
      ☐ Situación de convivencia<br>
      ☐ Solicitud del Equipo de Orientación Escolar<br>
      ☐ Otro: _______________________________
    </div>
  </div>
</div>

<div class="titulo" style="margin-top:14px;">
  DESARROLLO / OBSERVACIONES
</div>

<div class="obs"></div>

<div class="firmas-qr">
  <div class="firma">
    <div class="linea"></div>
    Actuante 1
  </div>

  <div class="firma">
    <div class="linea"></div>
    Actuante 2
  </div>

  <div class="firma">
    <div class="linea"></div>
    Adulto responsable
  </div>

  <div class="qr">
    <strong>UBICACIÓN EN MAPS</strong>
    <p>Escaneá el QR para abrir el recorrido.</p>
    <img src="${qrMapa}" />
  </div>
</div>

</body>
</html>
`);

  ventana.document.close();
  ventana.print();
}

 function imprimirListado() {
  const lista = cursoSeleccionado ? registrosDelCurso : registros;

  const filas = lista
    .map((registro, index) => {
      const contactos = obtenerContactosRegistro(registro);

      const contactosHtml =
        contactos.length > 0
          ? contactos
              .map((contacto) => {
                const vinculo =
                  contacto.vinculo === "OTRO"
                    ? contacto.vinculoOtro || "Otro"
                    : contacto.vinculo || "Sin informar";

                return `
                  <div class="contacto-item">
                    <strong>${contacto.nombreResponsable || "Sin nombre"}</strong><br>
                    ${vinculo} · ${contacto.telefono || "Sin teléfono"}
                  </div>
                `;
              })
              .join("")
          : `<span class="sin-contactos">Sin contactos registrados</span>`;

      return `
        <tr>
          <td>${index + 1}</td>
          <td>${registro.curso || ""}</td>
          <td>${registro.apellidoNombre || ""}</td>
          <td>${formatearDNI(registro.dni) || ""}</td>
          <td>${registro.domicilio || ""}</td>
          <td class="contactos-celda">
            ${contactosHtml}
          </td>
        </tr>
      `;
    })
    .join("");

  const ventana = window.open("", "_blank");

  ventana.document.write(`
    <html>
      <head>
        <title>Domicilio y teléfono</title>

        <style>
          body {
            font-family: Arial, sans-serif;
            padding: 30px;
            color: #222;
          }

          h2,
          p {
            text-align: center;
          }

          h2 {
            color: #1e3a5f;
          }

          table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 20px;
            font-size: 11px;
          }

          th,
          td {
            border: 1px solid #444;
            padding: 7px;
            text-align: center;
            vertical-align: top;
          }

          th {
            background: #1e3a5f;
            color: white;
          }

          .fecha {
            text-align: right;
            color: #555;
            font-size: 12px;
          }

          .contactos-celda {
            text-align: left;
            min-width: 180px;
          }

          .contacto-item {
            padding: 4px 0;
            border-bottom: 1px solid #ddd;
            line-height: 1.35;
          }

          .contacto-item:last-child {
            border-bottom: none;
          }

          .sin-contactos {
            color: #777;
            font-style: italic;
          }
        </style>
      </head>

      <body>
        <h2>Domicilio y teléfono</h2>

        <p>E.E.S. N° 140 "Florencio Molina Campos"</p>

        <p>
          ${
            cursoSeleccionado
              ? `Curso: ${cursoSeleccionado}`
              : "Todos los cursos"
          }
        </p>

        <p class="fecha">
          Fecha de impresión:
          ${new Date().toLocaleString("es-AR")}
        </p>

        <table>
          <thead>
            <tr>
              <th>N°</th>
              <th>Curso</th>
              <th>Apellido y Nombre</th>
              <th>DNI</th>
              <th>Domicilio</th>
              <th>Contactos de referencia</th>
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
  ventana.print();
}
 function exportarPlantillaExcel() {
  if (!cursoSeleccionado) {
    alert("Primero seleccioná un curso.");
    return;
  }

  const datos = alumnosDelCurso.map((alumno) => {
    const registro = registrosPorAlumno[alumno._id] || {};

    const contactos = obtenerContactosRegistro(registro);

    const contactosTexto =
      contactos.length > 0
        ? contactos
            .map((contacto) => {
              const vinculo =
                contacto.vinculo === "OTRO"
                  ? contacto.vinculoOtro || "Otro"
                  : contacto.vinculo || "Sin informar";

              return `${contacto.nombreResponsable || "Sin nombre"} (${vinculo}): ${
                contacto.telefono || "Sin teléfono"
              }`;
            })
            .join(" | ")
        : "";

    return {
      Curso: alumno.curso || "",
      "Apellido y Nombre": nombreCompletoAlumno(alumno),
      "DNI estudiante": alumno.dni || "",
      Domicilio: registro.domicilio || "",
      "Contactos de referencia": contactosTexto,
    };
  });

  const hoja = XLSX.utils.json_to_sheet(datos);
  const libro = XLSX.utils.book_new();

  XLSX.utils.book_append_sheet(
    libro,
    hoja,
    "Domicilios",
  );

  XLSX.writeFile(
    libro,
    `Domicilio_Telefono_${cursoSeleccionado}.xlsx`,
  );
}

  function normalizarTexto(texto = "") {
    return String(texto)
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[.,;:()]/g, " ")
      .replace(/\s+/g, " ")
      .trim()
      .toUpperCase();
  }

  function nombreAlumnoParaComparar(alumno) {
    return normalizarTexto(
      alumno.apellidoNombre ||
        alumno.nombreCompleto ||
        `${alumno.apellido || ""} ${alumno.nombre || ""}`,
    );
  }

  function distanciaLeve(a = "", b = "") {
    if (a === b) return 0;
    if (!a || !b) return Math.max(a.length, b.length);

    const matriz = Array.from({ length: a.length + 1 }, (_, i) => [i]);

    for (let j = 1; j <= b.length; j++) matriz[0][j] = j;

    for (let i = 1; i <= a.length; i++) {
      for (let j = 1; j <= b.length; j++) {
        matriz[i][j] =
          a[i - 1] === b[j - 1]
            ? matriz[i - 1][j - 1]
            : Math.min(
                matriz[i - 1][j] + 1,
                matriz[i][j - 1] + 1,
                matriz[i - 1][j - 1] + 1,
              );
      }
    }

    return matriz[a.length][b.length];
  }

  function coincideNombre(nombreSistema, nombreExcel) {
    const sistema = normalizarTexto(nombreSistema);
    const excel = normalizarTexto(nombreExcel);

    if (!sistema || !excel) return false;
    if (sistema === excel) return true;

    const palabrasSistema = sistema.split(" ").filter(Boolean);
    const palabrasExcel = excel.split(" ").filter(Boolean);

    return palabrasExcel.every((palabraExcel) => {
      if (palabraExcel.length === 1) {
        return palabrasSistema.some((p) => p.startsWith(palabraExcel));
      }

      return palabrasSistema.some((palabraSistema) => {
        return (
          palabraSistema === palabraExcel ||
          palabraSistema.includes(palabraExcel) ||
          palabraExcel.includes(palabraSistema) ||
          distanciaLeve(palabraSistema, palabraExcel) <= 1
        );
      });
    });
  }

  async function importarExcel(evento) {
    if (!esAdmin) {
      alert("Solo el administrador puede importar.");
      return;
    }

    const archivo = evento.target.files[0];
    if (!archivo) return;

    try {
      const datos = await archivo.arrayBuffer();
      const libro = XLSX.read(datos);
      const hoja = libro.Sheets[libro.SheetNames[0]];
      const filas = XLSX.utils.sheet_to_json(hoja, { defval: "" });

      for (const fila of filas) {
        const nombreFila = normalizarTexto(
          fila.Estudiante || fila["Apellido y Nombre"] || fila.Alumno || "",
        );

        const dniFila = String(
          fila["DNI estudiante"] || fila.DNI || "",
        ).replace(/\D/g, "");

        const alumno = alumnosActivos.find((item) => {
          const dniAlumno = String(item.dni || "").replace(/\D/g, "");

          if (dniFila && dniAlumno && dniAlumno === dniFila) {
            return true;
          }

          return coincideNombre(nombreAlumnoParaComparar(item), nombreFila);
        });

        if (!alumno) {
          console.log(
            "No encontrado:",
            nombreFila,
            "Fila Excel:",
            fila.Estudiante || fila["Apellido y Nombre"] || fila.Alumno,
          );

          continue;
        }

        const registroExistente = registrosPorAlumno[alumno._id];

        const domicilioExcel = fila.Domicilio || fila.domicilio || "";

        const telefonoExcel =
          fila["Teléfono"] ||
          fila.Telefono ||
          fila["teléfono"] ||
          fila.telefono ||
          "";

        const nombreResponsableExcel =
          fila["Adulto responsable"] ||
          fila["adulto responsable"] ||
          fila["Adulto Responsable"] ||
          fila["Madre / Responsable"] ||
          fila["Nombre adulto responsable"] ||
          "";

        const vinculoExcel =
          fila["Vínculo"] ||
          fila.Vinculo ||
          fila["vínculo"] ||
          fila.vinculo ||
          fila["Vínculo responsable"] ||
          fila["Vinculo responsable"] ||
          "MADRE";

        const datosAGuardar = {
          alumnoId: alumno._id,
          curso: alumno.curso || fila.Curso || "",
          apellidoNombre: nombreCompletoAlumno(alumno),
          dni: alumno.dni || "",

          domicilio: domicilioExcel,
          telefono: telefonoExcel,

          nombreResponsable: nombreResponsableExcel,

          adultoResponsable: vinculoExcel,
        };

        const tieneDatosParaGuardar =
          datosAGuardar.domicilio ||
          datosAGuardar.telefono ||
          datosAGuardar.nombreResponsable ||
          datosAGuardar.adultoResponsable;

        if (!tieneDatosParaGuardar) {
          console.log("Sin datos para guardar:", datosAGuardar.apellidoNombre);

          continue;
        }

        console.log("DATOS A GUARDAR:", datosAGuardar);

        try {
          if (registroExistente?._id) {
            await axios.put(
              `/api/domicilios/${registroExistente._id}`,
              datosAGuardar,
            );
          } else {
            await axios.post("/api/domicilios", datosAGuardar);
          }
        } catch (errorRegistro) {
          console.error("ERROR EN REGISTRO:", datosAGuardar);

          console.error(
            "RESPUESTA BACKEND:",
            JSON.stringify(errorRegistro.response?.data, null, 2),
          );
        }
      }

      await obtenerRegistros();

      alert("Archivo importado correctamente.");
    } catch (error) {
      console.error("ERROR IMPORTANDO:", error);

      console.error(
        "RESPUESTA BACKEND:",
        JSON.stringify(error.response?.data, null, 2),
      );

      alert("Error al importar el archivo.");
    }

    evento.target.value = "";
  }

  const totalCurso = alumnosDelCurso.length;
  const completosCurso = alumnosDelCurso.filter((alumno) => {
    const registro = registrosPorAlumno[alumno._id];
    return registro?.domicilio;
  }).length;

  return (
    <div className="tarjeta-inicio" style={contenedor}>
      <button
        className="boton-sistema boton-volver"
        style={botonVolver}
        onClick={volverInicio}
      >
        Volver al inicio
      </button>

      <h2 style={titulo}>🏠 Domicilio / Teléfono</h2>

      <p style={subtitulo}>
        Domicilio de referencia de la escuela:{" "}
        <strong>{DOMICILIO_ESCUELA}</strong>
      </p>

      <div style={selectorCurso}>
        <select
          style={inputGrande}
          value={cursoSeleccionado}
          onChange={(e) => seleccionarCurso(e.target.value)}
        >
          <option value="">Seleccionar curso</option>
          {cursosDisponibles.map((curso) => (
            <option key={curso} value={curso}>
              {curso}
            </option>
          ))}
        </select>

        {cursoSeleccionado && (
          <div style={progreso}>
            Curso {cursoSeleccionado}: {completosCurso} de {totalCurso}{" "}
            completos
          </div>
        )}
      </div>

      <div style={botonera}>
        <button
          className="boton-sistema boton-imprimir"
          style={botonImprimir}
          onClick={imprimirListado}
        >
          🖨️ Imprimir
        </button>

        <button
          className="boton-sistema boton-secundario"
          style={botonSecundario}
          onClick={exportarPlantillaExcel}
        >
          📥 Descargar Excel
        </button>

        <label
          className="boton-sistema boton-secundario"
          style={botonSecundario}
        >
          📥 Cargar Excel
          <input
            type="file"
            accept=".xlsx,.xls"
            onChange={importarExcel}
            style={{ display: "none" }}
          />
        </label>
      </div>

      <h3 style={subtituloTabla}>
        {cursoSeleccionado
          ? `Cargando domicilios de ${cursoSeleccionado}`
          : "Seleccioná un curso para cargar cada estudiante"}
      </h3>

      <div style={tablaContenedor}>
        <table style={tabla}>
          <thead>
            <tr style={encabezado}>
              <th style={celdaEncabezadoFija}>Estudiante</th>
              <th style={celdaEncabezadoFija}>DNI</th>
              <th style={celdaEncabezadoFija}>Domicilio</th>
              <th style={celdaEncabezadoFija}>Teléfono</th>
              <th style={celdaEncabezadoFija}>Adulto responsable</th>
              <th style={celdaEncabezadoFija}>Vínculo</th>
              <th style={celdaEncabezadoFija}>Acciones</th>
              <th style={celdaEncabezadoFija}>Contactos cargados</th>
            </tr>
          </thead>

          <tbody>
            {cursoSeleccionado &&
              alumnosDelCurso.map((alumno) => {
                const borrador = obtenerBorrador(alumno);
                const registro = registrosPorAlumno[alumno._id];
                const contactos = obtenerContactosRegistro(registro);

                return (
                  <tr key={alumno._id} className="fila-tabla">
                    <td style={celdaNombre}>{nombreCompletoAlumno(alumno)}</td>
                    <td style={celda}>{formatearDNI(alumno.dni)}</td>

                    <td style={celda}>
                      <input
                        style={inputTabla}
                        value={borrador.domicilio}
                        onChange={(e) =>
                          cambiarBorrador(
                            alumno._id,
                            "domicilio",
                            e.target.value,
                          )
                        }
                        disabled={!esAdmin}
                        placeholder="Calle y altura, localidad"
                      />
                    </td>

                    <td style={celda}>
                      <input
                        style={inputTabla}
                        value={borrador.telefono}
                        onChange={(e) =>
                          cambiarBorrador(
                            alumno._id,
                            "telefono",
                            e.target.value,
                          )
                        }
                        disabled={!esAdmin}
                        placeholder="Teléfono"
                        autoComplete="off"
                      />
                    </td>

                    <td style={celda}>
                      <input
                        style={inputTabla}
                        value={borrador.nombreResponsable}
                        onChange={(e) =>
                          cambiarBorrador(
                            alumno._id,
                            "nombreResponsable",
                            e.target.value,
                          )
                        }
                        disabled={!esAdmin}
                        placeholder="Nombre y apellido"
                      />
                    </td>

                    <td style={celda}>
                      <select
                        style={inputTabla}
                        value={borrador.adultoResponsable}
                        onChange={(e) =>
                          cambiarBorrador(
                            alumno._id,
                            "adultoResponsable",
                            e.target.value,
                          )
                        }
                        disabled={!esAdmin}
                      >
                        <option value="MADRE">MADRE</option>
                        <option value="PADRE">PADRE</option>
                        <option value="TUTOR">TUTOR</option>
                        <option value="ABUELA">ABUELA</option>
                        <option value="ABUELO">ABUELO</option>
                        <option value="HERMANA">HERMANA</option>
                        <option value="HERMANO">HERMANO</option>
                        <option value="TIA">TÍA</option>
                        <option value="TIO">TÍO</option>
                        <option value="OTRO">OTRO</option>
                      </select>

                      {borrador.adultoResponsable === "OTRO" && (
                        <input
                          style={{ ...inputTabla, marginTop: "6px" }}
                          value={borrador.vinculoOtro || ""}
                          onChange={(e) =>
                            cambiarBorrador(
                              alumno._id,
                              "vinculoOtro",
                              e.target.value,
                            )
                          }
                          disabled={!esAdmin}
                          placeholder="Especificar vínculo"
                        />
                      )}
                    </td>

                    <td style={celda}>
                      <button
                        className="boton-accion"
                        style={{
                          ...botonGuardarFila,
                          opacity: esAdmin ? 1 : 0.45,
                          cursor: esAdmin ? "pointer" : "not-allowed",
                        }}
                        disabled={!esAdmin}
                        onClick={() => guardarAlumno(alumno)}
                        title={
                          contactoEditando[alumno._id]
                            ? "Guardar cambios del contacto"
                            : "Guardar domicilio / agregar contacto"
                        }
                      >
                        💾
                      </button>

                      {contactoEditando[alumno._id] && (
                        <button
                          type="button"
                          className="boton-accion"
                          style={botonCancelarEdicion}
                          disabled={!esAdmin}
                          onClick={() => cancelarEdicionContacto(alumno)}
                          title="Cancelar edición del contacto"
                        >
                          ✖️
                        </button>
                      )}

                      {registro?._id && (
                        <button
                          className="boton-accion"
                          style={botonEliminar}
                          disabled={!esAdmin}
                          onClick={() => eliminarRegistro(registro._id)}
                          title="Eliminar domicilio y contactos"
                        >
                          🗑️
                        </button>
                      )}

                      <button
                        className="boton-accion"
                        style={botonMapa}
                        onClick={() => abrirMapa(borrador.domicilio)}
                        title="Ver recorrido en mapa"
                      >
                        🏠
                      </button>

                      <button
                        className="boton-accion"
                        style={{
                          ...botonMapa,
                          background: "#efe7fb",
                          color: "#5c3d91",
                        }}
                        onClick={() => imprimirActa(alumno)}
                        title="Imprimir acta"
                      >
                        📝
                      </button>
                    </td>

                    <td style={celdaContactos}>
                      {contactos.length === 0 ? (
                        <span style={sinContactos}>Sin contactos cargados</span>
                      ) : (
                        <>
                          <button
                            type="button"
                            style={botonDesplegarContactos}
                            onClick={() => alternarContactos(alumno._id)}
                          >
                            {contactosDesplegados[alumno._id] ? "▲" : "▼"}{" "}
                            {contactos.length}{" "}
                            {contactos.length === 1 ? "contacto" : "contactos"}
                          </button>

                          {contactosDesplegados[alumno._id] && (
                            <div style={contenedorContactos}>
                              {contactos.map((contacto, indiceContacto) => (
                                <div
                                  key={
                                    contacto._id ||
                                    `contacto-${alumno._id}-${indiceContacto}`
                                  }
                                  style={tarjetaContacto}
                                >
                                  <strong style={nombreContacto}>
                                    {contacto.nombreResponsable ||
                                      "Adulto sin nombre"}
                                  </strong>

                                  <div>
                                    <strong>Vínculo:</strong>{" "}
                                    {contacto.vinculo === "OTRO"
                                      ? contacto.vinculoOtro || "Otro"
                                      : contacto.vinculo || "Sin informar"}
                                  </div>

                                  <div>
                                    <strong>Teléfono:</strong>{" "}
                                    {contacto.telefono || "Sin informar"}
                                  </div>

                                  {esAdmin && (
                                    <div style={accionesContacto}>
                                      <button
                                        type="button"
                                        style={botonEditarContacto}
                                        onClick={() =>
                                          editarContacto(alumno, contacto, indiceContacto)
                                        }
                                      >
                                        ✏️ Editar
                                      </button>

                                      {contacto._id && (
                                        <button
                                          type="button"
                                          style={botonEliminarContacto}
                                          onClick={() =>
                                            eliminarContacto(alumno, contacto._id)
                                          }
                                        >
                                          🗑️ Eliminar
                                        </button>
                                      )}
                                    </div>
                                  )}
                                </div>
                              ))}
                            </div>
                          )}
                        </>
                      )}
                    </td>
                  </tr>
                );
              })}

            {!cursoSeleccionado && (
              <tr>
                <td style={celda} colSpan="8">
                  Seleccioná un curso para ver la lista completa de estudiantes.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

const contenedor = {
  marginTop: "40px",
  background: "#f8fbfc",
  border: "2px solid #b9d6df",
  borderRadius: "18px",
  padding: "28px",
  boxShadow: "0 10px 24px rgba(22,58,95,.15)",
};

const titulo = {
  color: "#1e3a5f",
  textAlign: "center",
  marginTop: 0,
};

const subtitulo = {
  textAlign: "center",
  color: "#5f6f7a",
  marginBottom: "22px",
};

const selectorCurso = {
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  gap: "12px",
  flexWrap: "wrap",
  marginBottom: "18px",
};

const inputGrande = {
  padding: "11px",
  borderRadius: "10px",
  border: "1px solid #b9cbd1",
  fontSize: "14px",
  backgroundColor: "white",
  width: "260px",
};

const progreso = {
  backgroundColor: "#eef5f7",
  border: "1px solid #b9d6df",
  color: "#1e3a5f",
  padding: "10px 14px",
  borderRadius: "12px",
  fontWeight: "bold",
};

const botonera = {
  display: "flex",
  gap: "10px",
  justifyContent: "center",
  flexWrap: "wrap",
  marginBottom: "18px",
};

const botonSecundario = {
  backgroundColor: "#eef5f7",
  color: "#1e3a5f",
  border: "1px solid #c7dde3",
  cursor: "pointer",
};

const botonImprimir = {
  backgroundColor: "#1e3a5f",
  color: "white",
  border: "none",
};

const subtituloTabla = {
  color: "#5f6f7a",
  textAlign: "center",
  marginBottom: "14px",
};

const tablaContenedor = {
  overflowX: "auto",
  overflowY: "auto",
  maxHeight: "65vh",

  borderRadius: "14px",
  border: "1px solid #d6e4ea",
  backgroundColor: "white",
};

const tabla = {
  width: "100%",
  borderCollapse: "collapse",
};

const encabezado = {
  backgroundColor: "#1e3a5f",
  color: "white",
};

const celda = {
  border: "1px solid #dbe4ee",
  padding: "8px",
  textAlign: "center",
  fontSize: "13px",
};

const celdaNombre = {
  ...celda,
  minWidth: "190px",
  fontWeight: "600",
  color: "#4f4a68",
};

const celdaEncabezadoFija = {
  ...celda,
  position: "sticky",
  top: 0,
  zIndex: 3,
  background: "#eaf3f1",
  color: "#1e3a5f",
  fontWeight: "700",
  boxShadow: "0 1px 0 #cfdedb",
};

const inputTabla = {
  width: "100%",
  boxSizing: "border-box",
  padding: "8px",
  borderRadius: "8px",
  border: "1px solid #c7dde3",
  fontSize: "13px",
};

const botonGuardarFila = {
  backgroundColor: "#e8f4f1",
  color: "#0f766e",
  border: "none",
  padding: "6px 8px",
  borderRadius: "10px",
  cursor: "pointer",
  marginRight: "4px",
};

const botonEliminar = {
  backgroundColor: "#f7dede",
  color: "#8b2e2e",
  border: "none",
  padding: "6px 8px",
  borderRadius: "10px",
  cursor: "pointer",
  marginRight: "4px",
};

const botonMapa = {
  backgroundColor: "#e8f4f1",
  color: "#0f766e",
  border: "none",
  padding: "6px 8px",
  borderRadius: "10px",
  cursor: "pointer",
};

const celdaContactos = {
  ...celda,
  minWidth: "220px",
  textAlign: "left",
};

const botonDesplegarContactos = {
  width: "100%",
  padding: "7px 10px",
  border: "1px solid #c7dde3",
  borderRadius: "999px",
  backgroundColor: "#eef5f7",
  color: "#1e3a5f",
  fontWeight: "700",
  cursor: "pointer",
};

const contenedorContactos = {
  display: "flex",
  flexDirection: "column",
  gap: "7px",
  marginTop: "8px",
};

const tarjetaContacto = {
  padding: "8px",
  border: "1px solid #d6e4ea",
  borderRadius: "10px",
  backgroundColor: "#ffffff",
  color: "#4f4a68",
  boxShadow: "0 2px 7px rgba(22,58,95,.07)",
};

const nombreContacto = {
  display: "block",
  marginBottom: "4px",
  color: "#1e3a5f",
};

const accionesContacto = {
  display: "flex",
  gap: "6px",
  flexWrap: "wrap",
  marginTop: "7px",
};

const botonEditarContacto = {
  padding: "4px 7px",
  border: "none",
  borderRadius: "999px",
  backgroundColor: "#e4eef9",
  color: "#24527a",
  fontSize: "11px",
  cursor: "pointer",
};

const botonEliminarContacto = {
  padding: "4px 7px",
  border: "none",
  borderRadius: "999px",
  backgroundColor: "#f7dede",
  color: "#8b2e2e",
  fontSize: "11px",
  cursor: "pointer",
};

const botonCancelarEdicion = {
  backgroundColor: "#fff3cd",
  color: "#7a5b00",
  border: "none",
  padding: "6px 8px",
  borderRadius: "10px",
  cursor: "pointer",
  marginRight: "4px",
};

const sinContactos = {
  color: "#777",
  fontSize: "12px",
  fontStyle: "italic",
};

const botonVolver = {
  backgroundColor: "#9e7ac0",
  color: "white",
  border: "none",
  marginBottom: "12px",
};

export default DomicilioTelefono;

