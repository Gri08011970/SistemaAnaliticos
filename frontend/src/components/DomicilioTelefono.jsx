import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import * as XLSX from "xlsx";
import QRCode from "qrcode";

const DOMICILIO_ESCUELA = "Titanic 2996, Rafael Castillo";

export default function DomicilioTelefono({ volverInicio, esAdmin }) {
  const [registros, setRegistros] = useState([]);
  const [alumnosMatricula, setAlumnosMatricula] = useState([]);
  const [cursoSeleccionado, setCursoSeleccionado] = useState("");
  const [borradores, setBorradores] = useState({});

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
      domicilio: borradores[alumno._id]?.domicilio ?? registro.domicilio ?? "",
      telefono: borradores[alumno._id]?.telefono ?? registro.telefono ?? "",
      nombreResponsable:
        borradores[alumno._id]?.nombreResponsable ??
        registro.nombreResponsable ??
        "",
      adultoResponsable:
        borradores[alumno._id]?.adultoResponsable ??
        registro.adultoResponsable ??
        "MADRE",
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

    const datos = {
      alumnoId: alumno._id,
      curso: alumno.curso || "",
      apellidoNombre: nombreCompletoAlumno(alumno),
      dni: alumno.dni || "",
      domicilio: borrador.domicilio,
      telefono: borrador.telefono,
      nombreResponsable: borrador.nombreResponsable,
      adultoResponsable: borrador.adultoResponsable,
    };

    try {
      if (registroExistente?._id) {
        await axios.put(`/api/domicilios/${registroExistente._id}`, datos);
      } else {
        await axios.post("/api/domicilios", datos);
      }

      setBorradores((previo) => {
        const copia = { ...previo };
        delete copia[alumno._id];
        return copia;
      });

      obtenerRegistros();
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
  grid-template-columns: 1fr 1fr;
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
  grid-template-columns: 1fr 1fr;
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

.checks{
  line-height:1.7;
  font-size:12px;
}

.obs{
  border:1px solid #777;
  height:355px;
  margin-top:8px;
}
.firmas-qr{
  display:grid;
  grid-template-columns: 1fr 1fr 1fr 150px;
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
    <div class="dato"><strong>Teléfono:</strong> ${registro.telefono || ""}</div>
    <div class="dato"><strong>Adulto responsable:</strong> ${registro.nombreResponsable || ""}</div>
    <div class="dato"><strong>Vínculo:</strong> ${registro.adultoResponsable || ""}</div>
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
      .map(
        (registro, index) => `
          <tr> 
            <td>${index + 1}</td>
            <td>${registro.curso || ""}</td>
            <td>${registro.apellidoNombre || ""}</td>
            <td>${formatearDNI(registro.dni) || ""}</td>
            <td>${registro.domicilio || ""}</td>
            <td>${registro.telefono || ""}</td>
            <td>${registro.nombreResponsable || ""}</td>
            <td>${registro.adultoResponsable || ""}</td>
          </tr>
        `,
      )
      .join("");

    const ventana = window.open("", "_blank");

    ventana.document.write(`
      <html>
        <head>
          <title>Domicilio y teléfono</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 30px; color: #222; }
            h2, p { text-align: center; }
            h2 { color: #1e3a5f; }
            table { width: 100%; border-collapse: collapse; margin-top: 20px; font-size: 12px; }
            th, td { border: 1px solid #444; padding: 7px; text-align: center; }
            th { background: #1e3a5f; color: white; }
            .fecha { text-align: right; color: #555; font-size: 13px; }
          </style>
        </head>
        <body>
          <h2>Domicilio y teléfono</h2>
          <p>E.E.S. N° 140 "Florencio Molina Campos"</p>
          <p>${cursoSeleccionado ? `Curso: ${cursoSeleccionado}` : "Todos los cursos"}</p>
          <p class="fecha">Fecha de impresión: ${new Date().toLocaleString("es-AR")}</p>

          <table>
            <thead>
              <tr>
                <th>N°</th>
                <th>Curso</th>
                <th>Apellido y Nombre</th>
                <th>DNI</th>
                <th>Domicilio</th>
                <th>Teléfono</th>
                <th>Adulto responsable</th>
                <th>Vínculo</th>
              </tr>
            </thead>
            <tbody>${filas}</tbody>
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

      return {
        Curso: alumno.curso || "",
        "Apellido y Nombre": nombreCompletoAlumno(alumno),
        "DNI estudiante": alumno.dni || "",
        Domicilio: registro.domicilio || "",
        Teléfono: registro.telefono || "",
        "Nombre adulto responsable": registro.nombreResponsable || "",
        "Vínculo responsable": registro.adultoResponsable || "MADRE",
      };
    });

    const hoja = XLSX.utils.json_to_sheet(datos);
    const libro = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(libro, hoja, "Domicilios");
    XLSX.writeFile(libro, `Domicilio_Telefono_${cursoSeleccionado}.xlsx`);
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
        fila.Estudiante ||
          fila["Apellido y Nombre"] ||
          fila.Alumno ||
          "",
      );

      const dniFila = String(
        fila["DNI estudiante"] ||
          fila.DNI ||
          "",
      ).replace(/\D/g, "");

      const alumno = alumnosActivos.find((item) => {
        const dniAlumno = String(
          item.dni || "",
        ).replace(/\D/g, "");

        if (
          dniFila &&
          dniAlumno &&
          dniAlumno === dniFila
        ) {
          return true;
        }

        return coincideNombre(
          nombreAlumnoParaComparar(item),
          nombreFila,
        );
      });

      if (!alumno) {
        console.log(
          "No encontrado:",
          nombreFila,
          "Fila Excel:",
          fila.Estudiante ||
            fila["Apellido y Nombre"] ||
            fila.Alumno,
        );

        continue;
      }

      const registroExistente =
        registrosPorAlumno[alumno._id];

      const domicilioExcel =
        fila.Domicilio ||
        fila.domicilio ||
        "";

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
        apellidoNombre:
          nombreCompletoAlumno(alumno),
        dni: alumno.dni || "",

        domicilio: domicilioExcel,
        telefono: telefonoExcel,

        nombreResponsable:
          nombreResponsableExcel,

        adultoResponsable:
          vinculoExcel,
      };

      const tieneDatosParaGuardar =
        datosAGuardar.domicilio ||
        datosAGuardar.telefono ||
        datosAGuardar.nombreResponsable ||
        datosAGuardar.adultoResponsable;

      if (!tieneDatosParaGuardar) {
        console.log(
          "Sin datos para guardar:",
          datosAGuardar.apellidoNombre,
        );

        continue;
      }

      console.log(
        "DATOS A GUARDAR:",
        datosAGuardar,
      );

      try {
        if (registroExistente?._id) {
          await axios.put(
            `/api/domicilios/${registroExistente._id}`,
            datosAGuardar,
          );
        } else {
          await axios.post(
            "/api/domicilios",
            datosAGuardar,
          );
        }
      } catch (errorRegistro) {
        console.error(
          "ERROR EN REGISTRO:",
          datosAGuardar,
        );

        console.error(
          "RESPUESTA BACKEND:",
          JSON.stringify(
            errorRegistro.response?.data,
            null,
            2,
          ),
        );
      }
    }

    await obtenerRegistros();

    alert("Archivo importado correctamente.");
  } catch (error) {
    console.error(
      "ERROR IMPORTANDO:",
      error,
    );

    console.error(
      "RESPUESTA BACKEND:",
      JSON.stringify(
        error.response?.data,
        null,
        2,
      ),
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
          📤 Exportar Excel
        </button>

        <label
          className="boton-sistema boton-secundario"
          style={botonSecundario}
        >
          📥 Importar Excel
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
          : "Seleccioná un curso para cargar alumno por alumno"}
      </h3>

      <div style={tablaContenedor}>
        <table style={tabla}>
          <thead>
            <tr style={encabezado}>
              <th style={celda}>Alumno</th>
              <th style={celda}>DNI</th>
              <th style={celda}>Domicilio</th>
              <th style={celda}>Teléfono</th>
              <th style={celda}>Adulto responsable</th>
              <th style={celda}>Vínculo</th>
              <th style={celda}>Acciones</th>
            </tr>
          </thead>

          <tbody>
            {cursoSeleccionado &&
              alumnosDelCurso.map((alumno) => {
                const borrador = obtenerBorrador(alumno);
                const registro = registrosPorAlumno[alumno._id];

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
                      </select>
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
                        title="Guardar"
                      >
                        💾
                      </button>

                      {registro?._id && (
                        <button
                          className="boton-accion"
                          style={botonEliminar}
                          disabled={!esAdmin}
                          onClick={() => eliminarRegistro(registro._id)}
                          title="Eliminar"
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
                  </tr>
                );
              })}

            {!cursoSeleccionado && (
              <tr>
                <td style={celda} colSpan="7">
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

const botonVolver = {
  backgroundColor: "#9e7ac0",
  color: "white",
  border: "none",
  marginBottom: "12px",
};
