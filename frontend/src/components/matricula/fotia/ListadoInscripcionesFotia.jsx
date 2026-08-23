import { Fragment, useMemo, useRef, useState } from "react";
import TarjetaEstudianteFotia from "./TarjetaEstudianteFotia";
import TarjetaAsignaturaFotia from "./TarjetaAsignaturaFotia";

const normalizarTexto = (valor) =>
  String(valor || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();

const compararTexto = (valorA, valorB) =>
  normalizarTexto(valorA).localeCompare(normalizarTexto(valorB), "es", {
    numeric: true,
    sensitivity: "base",
  });

const obtenerPrimeraAsignatura = (estudiante) => {
  const asignaturas = estudiante.asignaturas
    .map((inscripcion) => inscripcion.asignatura || "")
    .filter(Boolean)
    .sort(compararTexto);

  return asignaturas[0] || "";
};

const obtenerPrimerDocente = (estudiante) => {
  const docentes = estudiante.asignaturas
    .map((inscripcion) => inscripcion.docenteNombre || "")
    .filter(Boolean)
    .sort(compararTexto);

  return docentes[0] || "";
};

const compararPorApellidoNombre = (estudianteA, estudianteB) => {
  const comparacionApellido = compararTexto(
    estudianteA.apellido,
    estudianteB.apellido,
  );

  if (comparacionApellido !== 0) {
    return comparacionApellido;
  }

  return compararTexto(estudianteA.nombre, estudianteB.nombre);
};

const compararPorCursoApellido = (estudianteA, estudianteB) => {
  const comparacionCurso = compararTexto(estudianteA.curso, estudianteB.curso);

  if (comparacionCurso !== 0) {
    return comparacionCurso;
  }

  const comparacionTurno = compararTexto(estudianteA.turno, estudianteB.turno);

  if (comparacionTurno !== 0) {
    return comparacionTurno;
  }

  return compararPorApellidoNombre(estudianteA, estudianteB);
};

const obtenerOpcionesUnicas = (valores) =>
  [...new Set(valores.filter(Boolean))].sort(compararTexto);

const escaparHtml = (valor) =>
  String(valor ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");

const formatearFechaImpresion = (fecha) => {
  if (!fecha) return "Sin informar";

  const partes = String(fecha).slice(0, 10).split("-");

  if (partes.length === 3) {
    const [anio, mes, dia] = partes;
    return `${dia}/${mes}/${anio}`;
  }

  return String(fecha);
};

export default function ListadoInscripcionesFotia({
  inscripciones = [],
  programaSeleccionado = "Todos",
  docentesFotia = [],
  esAdmin = false,
  onRetirar,
  onActualizada,
  onEliminarEstudiante,
}) {
  const [criterioOrden, setCriterioOrden] = useState("curso-apellido");
  const [vistaListado, setVistaListado] = useState("compacta");
  const [estudianteDetalleId, setEstudianteDetalleId] = useState("");

  const [busqueda, setBusqueda] = useState("");
  const [filtroCurso, setFiltroCurso] = useState("");
  const [filtroTurno, setFiltroTurno] = useState("");
  const [filtroAsignatura, setFiltroAsignatura] = useState("");
  const [filtroDocente, setFiltroDocente] = useState("");
  const [filtroEstado, setFiltroEstado] = useState("");

  const scrollSuperiorRef = useRef(null);
  const scrollTablaRef = useRef(null);

  const sincronizarScrollSuperior = () => {
    if (scrollSuperiorRef.current && scrollTablaRef.current) {
      scrollTablaRef.current.scrollLeft = scrollSuperiorRef.current.scrollLeft;
    }
  };

  const sincronizarScrollTabla = () => {
    if (scrollSuperiorRef.current && scrollTablaRef.current) {
      scrollSuperiorRef.current.scrollLeft = scrollTablaRef.current.scrollLeft;
    }
  };

  const inscripcionesActivas = useMemo(
    () => inscripciones.filter((inscripcion) => inscripcion.activo !== false),
    [inscripciones],
  );

  const cursosDisponibles = useMemo(
    () =>
      obtenerOpcionesUnicas(
        inscripcionesActivas.map((inscripcion) => inscripcion.curso || ""),
      ),
    [inscripcionesActivas],
  );

  const turnosDisponibles = useMemo(
    () =>
      obtenerOpcionesUnicas(
        inscripcionesActivas.map((inscripcion) => inscripcion.turno || ""),
      ),
    [inscripcionesActivas],
  );

  const asignaturasDisponibles = useMemo(
    () =>
      obtenerOpcionesUnicas(
        inscripcionesActivas.map((inscripcion) => inscripcion.asignatura || ""),
      ),
    [inscripcionesActivas],
  );

  const docentesDisponibles = useMemo(
    () =>
      obtenerOpcionesUnicas(
        docentesFotia
          .filter((docente) => docente.activo !== false)
          .map((docente) =>
            `${docente.apellido || ""} ${docente.nombre || ""}`.trim(),
          ),
      ),
    [docentesFotia],
  );
  const estadosDisponibles = useMemo(
    () =>
      obtenerOpcionesUnicas(
        inscripcionesActivas.map((inscripcion) => inscripcion.estado || ""),
      ),
    [inscripcionesActivas],
  );

  const estudiantesAgrupados = useMemo(() => {
    const grupos = new Map();

    inscripcionesActivas.forEach((inscripcion) => {
      const alumnoId = String(
        inscripcion.alumnoId?._id || inscripcion.alumnoId || "",
      );

      if (!alumnoId) return;

      if (!grupos.has(alumnoId)) {
        grupos.set(alumnoId, {
          alumnoId,
          apellido: inscripcion.apellido || "",
          nombre: inscripcion.nombre || "",
          dni: inscripcion.dni || inscripcion.alumnoId?.dni || "",
          curso: inscripcion.curso || "",
          turno: inscripcion.turno || "",
          asignaturas: [],
        });
      }

      grupos.get(alumnoId).asignaturas.push(inscripcion);
    });

    return Array.from(grupos.values());
  }, [inscripcionesActivas]);

  const estudiantesFiltrados = useMemo(() => {
    const textoBuscado = normalizarTexto(busqueda);

    return estudiantesAgrupados
      .filter((estudiante) => {
        const coincideCurso = !filtroCurso || estudiante.curso === filtroCurso;

        const coincideTurno = !filtroTurno || estudiante.turno === filtroTurno;

        const coincideBusqueda =
          !textoBuscado ||
          [
            estudiante.apellido,
            estudiante.nombre,
            `${estudiante.apellido} ${estudiante.nombre}`,
            `${estudiante.nombre} ${estudiante.apellido}`,
            estudiante.dni,
            estudiante.curso,
            estudiante.turno,
            ...estudiante.asignaturas.flatMap((inscripcion) => [
              inscripcion.asignatura,
              inscripcion.docenteNombre,
              inscripcion.estado,
            ]),
          ].some((valor) => normalizarTexto(valor).includes(textoBuscado));

        return coincideCurso && coincideTurno && coincideBusqueda;
      })
      .map((estudiante) => {
        const asignaturasFiltradas = estudiante.asignaturas.filter(
          (inscripcion) => {
            const coincideAsignatura =
              !filtroAsignatura || inscripcion.asignatura === filtroAsignatura;

            const coincideDocente =
              !filtroDocente || inscripcion.docenteNombre === filtroDocente;

            const coincideEstado =
              !filtroEstado || inscripcion.estado === filtroEstado;

            return coincideAsignatura && coincideDocente && coincideEstado;
          },
        );

        return {
          ...estudiante,
          asignaturas: asignaturasFiltradas,
        };
      })
      .filter((estudiante) => estudiante.asignaturas.length > 0);
  }, [
    estudiantesAgrupados,
    busqueda,
    filtroCurso,
    filtroTurno,
    filtroAsignatura,
    filtroDocente,
    filtroEstado,
  ]);

  const estudiantesOrdenados = useMemo(() => {
    const estudiantes = estudiantesFiltrados.map((estudiante) => ({
      ...estudiante,
      asignaturas: [...estudiante.asignaturas].sort(
        (asignaturaA, asignaturaB) => {
          const comparacionAsignatura = compararTexto(
            asignaturaA.asignatura,
            asignaturaB.asignatura,
          );

          if (comparacionAsignatura !== 0) {
            return comparacionAsignatura;
          }

          return compararTexto(
            asignaturaA.docenteNombre,
            asignaturaB.docenteNombre,
          );
        },
      ),
    }));

    estudiantes.sort((estudianteA, estudianteB) => {
      if (criterioOrden === "apellido") {
        return compararPorApellidoNombre(estudianteA, estudianteB);
      }

      if (criterioOrden === "asignatura") {
        const comparacionAsignatura = compararTexto(
          obtenerPrimeraAsignatura(estudianteA),
          obtenerPrimeraAsignatura(estudianteB),
        );

        if (comparacionAsignatura !== 0) {
          return comparacionAsignatura;
        }

        return compararPorCursoApellido(estudianteA, estudianteB);
      }

      if (criterioOrden === "docente") {
        const comparacionDocente = compararTexto(
          obtenerPrimerDocente(estudianteA),
          obtenerPrimerDocente(estudianteB),
        );

        if (comparacionDocente !== 0) {
          return comparacionDocente;
        }

        return compararPorCursoApellido(estudianteA, estudianteB);
      }

      return compararPorCursoApellido(estudianteA, estudianteB);
    });

    return estudiantes;
  }, [estudiantesFiltrados, criterioOrden]);

  const cantidadAreasMostradas = useMemo(
    () =>
      estudiantesOrdenados.reduce(
        (total, estudiante) => total + estudiante.asignaturas.length,
        0,
      ),
    [estudiantesOrdenados],
  );

  const filasCompactas = useMemo(
    () =>
      estudiantesOrdenados.flatMap((estudiante) =>
        estudiante.asignaturas.map((inscripcion) => ({
          estudiante,
          inscripcion,
        })),
      ),
    [estudiantesOrdenados],
  );

  const hayFiltrosActivos =
    Boolean(busqueda.trim()) ||
    Boolean(filtroCurso) ||
    Boolean(filtroTurno) ||
    Boolean(filtroAsignatura) ||
    Boolean(filtroDocente) ||
    Boolean(filtroEstado);

  const limpiarFiltros = () => {
    setBusqueda("");
    setFiltroCurso("");
    setFiltroTurno("");
    setFiltroAsignatura("");
    setFiltroDocente("");
    setFiltroEstado("");
  };

  const imprimirListadoFiltrado = () => {
    if (estudiantesOrdenados.length === 0) {
      return;
    }

    const ventanaImpresion = window.open("", "_blank", "width=1200,height=800");

    if (!ventanaImpresion) {
      window.alert(
        "El navegador bloqueó la ventana de impresión. Permití las ventanas emergentes e intentá nuevamente.",
      );
      return;
    }

    const nombrePeriodo =
      inscripcionesActivas.find(
        (inscripcion) =>
          inscripcion.periodoId && typeof inscripcion.periodoId === "object",
      )?.periodoId?.nombre || "Período FOTIA-FORTE";

    const tituloPrograma =
      programaSeleccionado === "FOTIA"
        ? "FOTIA · Alfabetización"
        : programaSeleccionado === "FORTE"
          ? "FORTE · Intensificación y acreditación"
          : "FOTIA-FORTE · Listado general";

    const filtrosAplicados = [
      filtroCurso && `Curso: ${filtroCurso}`,
      filtroTurno && `Turno: ${filtroTurno}`,
      filtroAsignatura && `Asignatura: ${filtroAsignatura}`,
      filtroDocente && `Docente: ${filtroDocente}`,
      filtroEstado && `Estado: ${filtroEstado}`,
      busqueda.trim() && `Búsqueda: ${busqueda.trim()}`,
    ].filter(Boolean);

    const filas = estudiantesOrdenados
      .flatMap((estudiante) =>
        estudiante.asignaturas.map(
          (inscripcion) => `
            <tr>
              <td class="estudiante">
                ${escaparHtml(
                  [estudiante.apellido, estudiante.nombre]
                    .filter(Boolean)
                    .join(" "),
                )}
              </td>
              <td>${escaparHtml(estudiante.curso || "Sin curso")}</td>
              <td>${escaparHtml(estudiante.turno || "Sin turno")}</td>
              <td>${escaparHtml(
                inscripcion.asignatura || "Sin asignatura",
              )}</td>
              <td>${escaparHtml(
                inscripcion.anio ? `${inscripcion.anio} año` : "Sin informar",
              )}</td>
              <td>${escaparHtml(
                inscripcion.docenteNombre || "Sin docente asignado",
              )}</td>
              <td>${escaparHtml(inscripcion.estado || "Incorporada")}</td>
              <td>${escaparHtml(
                formatearFechaImpresion(inscripcion.fechaIncorporacion),
              )}</td>
            </tr>
          `,
        ),
      )
      .join("");

    const fechaEmision = new Date().toLocaleDateString("es-AR");

    ventanaImpresion.document.open();

    ventanaImpresion.document.write(`
      <!doctype html>
      <html lang="es">
        <head>
          <meta charset="UTF-8" />
           <title>${escaparHtml(tituloPrograma)}</title>

          <style>
            * {
              box-sizing: border-box;
            }

            body {
              margin: 0;
              padding: 10px;
              background: #ffffff;
              color: #243b53;
              font-family: Arial, Helvetica, sans-serif;
            }

            .encabezado {
              margin-bottom: 12px;
              padding-bottom: 9px;
              border-bottom: 2px solid #7fa6c2;
              text-align: center;
            }

            .escuela {
              margin: 0 0 4px;
              color: #385d7c;
              font-size: 11px;
              font-weight: 700;
              letter-spacing: 0.35px;
              text-transform: uppercase;
            }

            h1 {
              margin: 0 0 4px;
              color: #183b63;
              font-size: 21px;
            }

            .subtitulo {
              margin: 0;
              color: #63788b;
              font-size: 11px;
            }

            .datos {
              display: flex;
              justify-content: space-between;
              gap: 12px;
              margin-bottom: 9px;
              color: #52687a;
              font-size: 10px;
            }

            .filtros {
              display: flex;
              flex-wrap: wrap;
              gap: 6px;
              margin-bottom: 10px;
            }

            .filtros span,
            .resumen span {
              padding: 5px 8px;
              border: 1px solid #b9cedd;
              border-radius: 5px;
              background: #f5f9fc;
              font-size: 9px;
              font-weight: 700;
            }

            .resumen {
              display: flex;
              flex-wrap: wrap;
              gap: 6px;
              margin-bottom: 10px;
            }

            table {
              width: 100%;
              border-collapse: collapse;
              table-layout: fixed;
              font-size: 8px;
            }

            th {
              padding: 6px 5px;
              border: 1px solid #8eabbf;
              background: #e9f1f6;
              color: #294d6b;
              text-align: left;
            }

            td {
              padding: 6px 5px;
              border: 1px solid #c3d1da;
              vertical-align: top;
              overflow-wrap: anywhere;
            }

            th:nth-child(1),
            td:nth-child(1) {
              width: 20%;
            }

            th:nth-child(2),
            td:nth-child(2) {
              width: 9%;
            }

            th:nth-child(3),
            td:nth-child(3) {
              width: 10%;
            }

            th:nth-child(4),
            td:nth-child(4) {
              width: 17%;
            }

            th:nth-child(5),
            td:nth-child(5) {
              width: 8%;
            }

            th:nth-child(6),
            td:nth-child(6) {
              width: 16%;
            }

            th:nth-child(7),
            td:nth-child(7) {
              width: 10%;
            }

            th:nth-child(8),
            td:nth-child(8) {
              width: 10%;
            }

            .estudiante {
              font-weight: 700;
            }

            .pie {
              margin-top: 9px;
              color: #63788b;
              font-size: 9px;
              text-align: right;
            }

            @page {
              size: A4 landscape;
              margin: 6mm;
            }

            @media print {
              body {
                padding: 0;
              }

              thead {
                display: table-header-group;
              }

              tr {
                break-inside: avoid;
                page-break-inside: avoid;
              }
            }
          </style>
        </head>

        <body>
          <header class="encabezado">
            <p class="escuela">
              Escuela de Educación Secundaria N.º 140
              “Florencio Molina Campos”
            </p>

            <h1>${escaparHtml(tituloPrograma)}</h1>

            <p class="subtitulo">
              ${escaparHtml(nombrePeriodo)}
            </p>
          </header>

          <div class="datos">
            <span>
              Orden:
              <strong>${escaparHtml(
                {
                  "curso-apellido": "Curso y apellido",
                  apellido: "Apellido",
                  asignatura: "Asignatura",
                  docente: "Docente",
                }[criterioOrden] || "Curso y apellido",
              )}</strong>
            </span>

            <span>
              Fecha de emisión:
              <strong>${escaparHtml(fechaEmision)}</strong>
            </span>
          </div>

          ${
            filtrosAplicados.length > 0
              ? `
          <div class="filtros">
            <span>Filtros: ${escaparHtml(filtrosAplicados.join(" · "))}</span>
          </div>`
              : ""
          }

          <div class="resumen">
               <span>
                 Total de estudiantes:
                ${estudiantesOrdenados.length} 
               </span>

              <span>
                Total de áreas:
               ${cantidadAreasMostradas}
               </span>
          </div>
          <table>
            <thead>
              <tr>
                <th>Apellido y nombre</th>
                <th>Curso</th>
                <th>Turno</th>
                <th>Asignatura</th>
                <th>Año</th>
                <th>Docente</th>
                <th>Estado</th>
                <th>Fecha</th>
              </tr>
            </thead>

            <tbody>
              ${filas}
            </tbody>
          </table>

          <p class="pie">
            Registros impresos:
            ${cantidadAreasMostradas}
          </p>

          <script>
            window.onload = function () {
              window.focus();
              window.print();
            };

            window.onafterprint = function () {
              window.close();
            };
          </script>
        </body>
      </html>
    `);

    ventanaImpresion.document.close();
  };

  if (estudiantesAgrupados.length === 0) {
    return null;
  }

  return (
    <div
      style={{
        marginTop: "24px",
        display: "grid",
        gap: "16px",

        width: "100%",
        maxWidth: "100%",
        minWidth: 0,
        boxSizing: "border-box",
      }}
    >
      <style>
        {`
          @media (max-width: 760px) {
            .fotia-filtros-listado {
              grid-template-columns: 1fr 1fr !important;
            }

            .fotia-busqueda-listado {
              grid-column: 1 / -1 !important;
            }
          }

          @media (max-width: 520px) {
            .fotia-filtros-listado {
              grid-template-columns: 1fr !important;
            }

            .fotia-busqueda-listado {
              grid-column: auto !important;
            }
          }

          .fotia-tabla-compacta th,
          .fotia-tabla-compacta td {
            border-right: 1px solid #d4e0e8;
            border-bottom: 1px solid #d4e0e8;
          }

          .fotia-tabla-compacta th:last-child,
          .fotia-tabla-compacta td:last-child {
            border-right: none;
          }
        `}
      </style>

      <div
        style={{
          textAlign: "center",
        }}
      >
        <h3
          style={{
            margin: "0 0 6px",
            color: "#23436d",
            fontSize: "21px",
          }}
        >
          👨‍🎓 Estudiantes del período
        </h3>

        <p
          style={{
            margin: 0,
            color: "#607080",
          }}
        >
          {programaSeleccionado === "FOTIA"
            ? "Estudiantes de FOTIA · Alfabetización."
            : programaSeleccionado === "FORTE"
              ? "Estudiantes de FORTE · Intensificación y acreditación."
              : "Seguimiento de las áreas incorporadas al fortalecimiento."}
        </p>
      </div>

      <section
        style={{
          padding: "16px",
          border: "1px solid #c8dceb",
          borderRadius: "13px",
          background: "#f7fafc",
          boxShadow: "0 3px 9px rgba(41, 78, 112, 0.05)",
          width: "100%",
          maxWidth: "100%",
          minWidth: 0,
          boxSizing: "border-box",
        }}
      >
        <div
          className="fotia-filtros-listado"
          style={{
            display: "grid",
            gridTemplateColumns:
              "repeat(auto-fit, minmax(min(100%, 190px), 1fr))",
            gap: "12px",
            alignItems: "end",
            width: "100%",
            minWidth: 0,
          }}
        >
          <label className="fotia-busqueda-listado" style={estiloLabel}>
            Buscar
            <input
              type="search"
              value={busqueda}
              onChange={(evento) => setBusqueda(evento.target.value)}
              placeholder="Apellido, nombre, DNI, asignatura o docente"
              style={estiloControl}
            />
          </label>

          <label style={estiloLabel}>
            Curso
            <select
              value={filtroCurso}
              onChange={(evento) => setFiltroCurso(evento.target.value)}
              style={estiloControl}
            >
              <option value="">Todos los cursos</option>

              {cursosDisponibles.map((curso) => (
                <option key={curso} value={curso}>
                  {curso}
                </option>
              ))}
            </select>
          </label>

          <label style={estiloLabel}>
            Turno
            <select
              value={filtroTurno}
              onChange={(evento) => setFiltroTurno(evento.target.value)}
              style={estiloControl}
            >
              <option value="">Todos los turnos</option>

              {turnosDisponibles.map((turno) => (
                <option key={turno} value={turno}>
                  {turno}
                </option>
              ))}
            </select>
          </label>

          <label style={estiloLabel}>
            Estado
            <select
              value={filtroEstado}
              onChange={(evento) => setFiltroEstado(evento.target.value)}
              style={estiloControl}
            >
              <option value="">Todos los estados</option>

              {estadosDisponibles.map((estado) => (
                <option key={estado} value={estado}>
                  {estado}
                </option>
              ))}
            </select>
          </label>

          <label style={estiloLabel}>
            Asignatura
            <select
              value={filtroAsignatura}
              onChange={(evento) => setFiltroAsignatura(evento.target.value)}
              style={estiloControl}
            >
              <option value="">Todas las asignaturas</option>

              {asignaturasDisponibles.map((asignatura) => (
                <option key={asignatura} value={asignatura}>
                  {asignatura}
                </option>
              ))}
            </select>
          </label>

          <label style={estiloLabel}>
            Docente
            <select
              value={filtroDocente}
              onChange={(evento) => setFiltroDocente(evento.target.value)}
              style={estiloControl}
            >
              <option value="">Todos los docentes</option>

              {docentesDisponibles.map((docente) => (
                <option key={docente} value={docente}>
                  {docente}
                </option>
              ))}
            </select>
          </label>

          <label style={estiloLabel}>
            Ordenar por
            <select
              value={criterioOrden}
              onChange={(evento) => setCriterioOrden(evento.target.value)}
              style={estiloControl}
            >
              <option value="curso-apellido">Curso y apellido</option>

              <option value="apellido">Apellido</option>

              <option value="asignatura">Asignatura</option>

              <option value="docente">Docente</option>
            </select>
          </label>

          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "8px",
              alignItems: "stretch",
            }}
          >
            <button
              type="button"
              onClick={limpiarFiltros}
              disabled={!hayFiltrosActivos}
              style={{
                flex: "1 1 130px",
                minHeight: "40px",
                padding: "9px 14px",
                border: "1px solid #c7d7e3",
                borderRadius: "8px",
                background: hayFiltrosActivos ? "#ffffff" : "#f0f3f5",
                color: hayFiltrosActivos ? "#52697d" : "#8b98a3",
                fontWeight: "700",
                cursor: hayFiltrosActivos ? "pointer" : "default",
              }}
            >
              Limpiar filtros
            </button>

            <button
              type="button"
              onClick={imprimirListadoFiltrado}
              disabled={estudiantesOrdenados.length === 0}
              style={{
                flex: "1 1 170px",
                minHeight: "40px",
                padding: "9px 14px",
                border: "none",
                borderRadius: "8px",
                background:
                  estudiantesOrdenados.length === 0 ? "#9db7b4" : "#148c84",
                color: "#ffffff",
                fontWeight: "700",
                cursor:
                  estudiantesOrdenados.length === 0 ? "not-allowed" : "pointer",
                boxShadow: "0 3px 8px rgba(20, 140, 132, 0.18)",
              }}
            >
              🖨️ Imprimir listado filtrado
            </button>
          </div>
        </div>
      </section>

      <div
        style={{
          display: "flex",
          justifyContent: "center",
          flexWrap: "wrap",
          gap: "10px",
          padding: "9px 13px",
          border: "1px solid #c8dceb",
          borderRadius: "9px",
          background: "#f5f9fc",
          color: "#4f667a",
          fontSize: "13px",
          fontWeight: "700",
          textAlign: "center",
        }}
      >
        <span>Estudiantes mostrados: {estudiantesOrdenados.length}</span>

        <span aria-hidden="true">•</span>

        <span>Áreas mostradas: {cantidadAreasMostradas}</span>
      </div>

      <div
        style={{
          display: "flex",
          justifyContent: "center",
          flexWrap: "wrap",
          gap: "8px",
        }}
      >
        <button
          type="button"
          onClick={() => {
            setVistaListado("tarjetas");
            setEstudianteDetalleId("");
          }}
          aria-pressed={vistaListado === "tarjetas"}
          style={{
            padding: "9px 15px",
            border:
              vistaListado === "tarjetas"
                ? "1px solid #6fa3cf"
                : "1px solid #c7d7e3",
            borderRadius: "9px",
            background: vistaListado === "tarjetas" ? "#eaf4fb" : "#ffffff",
            color: vistaListado === "tarjetas" ? "#24577f" : "#52697d",
            fontWeight: "700",
            cursor: "pointer",
          }}
        >
          ▦ Tarjetas
        </button>

        <button
          type="button"
          onClick={() => {
            setVistaListado("compacta");
            setEstudianteDetalleId("");
          }}
          aria-pressed={vistaListado === "compacta"}
          style={{
            padding: "9px 15px",
            border:
              vistaListado === "compacta"
                ? "1px solid #6fa3cf"
                : "1px solid #c7d7e3",
            borderRadius: "9px",
            background: vistaListado === "compacta" ? "#eaf4fb" : "#ffffff",
            color: vistaListado === "compacta" ? "#24577f" : "#52697d",
            fontWeight: "700",
            cursor: "pointer",
          }}
        >
          ☷ Lista compacta
        </button>
      </div>

      {estudiantesOrdenados.length === 0 ? (
        <div
          style={{
            padding: "28px 18px",
            border: "1px dashed #c7d7e3",
            borderRadius: "12px",
            background: "#fafcfd",
            color: "#607080",
            textAlign: "center",
          }}
        >
          <div
            style={{
              marginBottom: "7px",
              fontSize: "30px",
            }}
          >
            🔎
          </div>

          <strong
            style={{
              display: "block",
              marginBottom: "5px",
              color: "#365b7d",
            }}
          >
            No se encontraron estudiantes
          </strong>

          <span style={{ fontSize: "13px" }}>
            Probá cambiando o limpiando los filtros seleccionados.
          </span>
        </div>
      ) : vistaListado === "tarjetas" ? (
        <div
          style={{
            maxHeight: "720px",
            overflowY: "auto",
            paddingRight: "8px",
            display: "flex",
            flexDirection: "column",
            gap: "16px",
            scrollbarGutter: "stable",
            borderRadius: "12px",
          }}
        >
          {estudiantesOrdenados.map((estudiante) => (
            <div
              key={estudiante.alumnoId}
              style={{
                flex: "0 0 auto",
                minHeight: 0,
              }}
            >
              <TarjetaEstudianteFotia
                estudiante={estudiante}
                docentesFotia={docentesFotia}
                esAdmin={esAdmin}
                onRetirar={onRetirar}
                onActualizada={onActualizada}
                onEliminarEstudiante={onEliminarEstudiante}
              />
            </div>
          ))}
        </div>
      ) : (
        <div>
          {/* Scroll horizontal superior */}
          <div
            ref={scrollSuperiorRef}
            onScroll={sincronizarScrollSuperior}
            style={{
              overflowX: "scroll",
              overflowY: "hidden",
              marginBottom: "6px",
              border: "1px solid #c7d7e3",
              borderRadius: "8px",
              background: "#f5f9fc",
            }}
          >
            <div
              style={{
                width: "820px",
                height: "18px",
              }}
            />
          </div>

          {/* Tabla + scroll inferior */}
          <div
            ref={scrollTablaRef}
            data-fotia-scroll="tabla"
            onScroll={sincronizarScrollTabla}
            style={{
              maxHeight: "720px",
              overflow: "auto",
              border: "1px solid #c7d7e3",
              borderRadius: "12px",
              background: "#ffffff",
              scrollbarGutter: "stable",
            }}
          >
            <table
              className="fotia-tabla-compacta"
              style={{
                width: "100%",
                minWidth: "820px",
                borderCollapse: "separate",
                borderSpacing: 0,
                color: "#31465a",
                fontSize: "13px",
              }}
            >
              <thead
                style={{
                  position: "sticky",
                  top: 0,
                  zIndex: 2,
                }}
              >
                <tr style={{ background: "#eaf2f7" }}>
                  {[
                    "Estudiante",
                    "Curso",
                    "Turno",
                    "Asignatura",
                    "Docente",
                    "Estado",
                    "Acciones",
                  ].map((titulo) => (
                    <th
                      key={titulo}
                      style={{
                        padding: "11px 9px",
                        color: "#294d6b",
                        textAlign: "left",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {titulo}
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody>
                {filasCompactas.map(({ estudiante, inscripcion }, indice) => {
                  const detalleId = `${estudiante.alumnoId}-${inscripcion._id || indice}`;

                  const detalleAbierto = estudianteDetalleId === detalleId;

                  return (
                    <Fragment
                      key={`${estudiante.alumnoId}-${inscripcion._id || indice}`}
                    >
                      <tr
                        style={{
                          background:
                            inscripcion.estado === "Incorporada"
                              ? "#eef8f5"
                              : inscripcion.estado === "En proceso"
                                ? "#eef5fb"
                                : inscripcion.estado === "Acreditada"
                                  ?"#e8f6ef"
                                  : indice % 2 === 0
                                    ? "#ffffff"
                                    : "#f8fbfd",
                        }}
                      >
                        <td
                          style={{
                            padding: "10px 9px",
                            minWidth: "175px",
                            fontWeight: "700",
                            color: "#23436d",
                          }}
                        >
                          {[estudiante.apellido, estudiante.nombre]
                            .filter(Boolean)
                            .join(" ")}
                        </td>

                        <td
                          style={{
                            padding: "10px 9px",
                            whiteSpace: "nowrap",
                          }}
                        >
                          {estudiante.curso || "Sin curso"}
                        </td>

                        <td
                          style={{
                            padding: "10px 9px",
                            whiteSpace: "nowrap",
                          }}
                        >
                          {estudiante.turno || "Sin turno"}
                        </td>

                        <td
                          style={{
                            padding: "10px 9px",
                            minWidth: "150px",
                          }}
                        >
                          <strong>
                            {inscripcion.asignatura || "Sin asignatura"}
                          </strong>

                          {inscripcion.anio && (
                            <div
                              style={{
                                marginTop: "3px",
                                color: "#718294",
                                fontSize: "11px",
                              }}
                            >
                              {inscripcion.anio} año
                            </div>
                          )}
                        </td>

                        <td
                          style={{
                            padding: "10px 9px",
                            minWidth: "145px",
                          }}
                        >
                          {inscripcion.docenteNombre || "Sin docente asignado"}
                        </td>

                        <td
                          style={{
                            padding: "10px 9px",
                            whiteSpace: "nowrap",
                          }}
                        >
                          {inscripcion.estado || "Incorporada"}
                        </td>

                        <td
                          style={{
                            padding: "8px 9px",
                            whiteSpace: "nowrap",
                          }}
                        >
                          <button
                            type="button"
                            onClick={() =>
                              setEstudianteDetalleId((anterior) =>
                                anterior === detalleId ? "" : detalleId,
                              )
                            }
                            style={{
                              padding: "7px 10px",
                              border: "1px solid #a8c7dc",
                              borderRadius: "8px",
                              background: detalleAbierto
                                ? "#e8f2f8"
                                : "#ffffff",
                              color: "#295b7d",
                              fontWeight: "700",
                              cursor: "pointer",
                            }}
                          >
                            {detalleAbierto
                              ? "▲ Ocultar detalle"
                              : "▼ Ver detalle"}
                          </button>
                        </td>
                      </tr>

                      {detalleAbierto && (
                        <tr
                          key={`${estudiante.alumnoId}-detalle-${inscripcion._id || indice}`}
                        >
                          <td
                            colSpan={7}
                            style={{
                              padding: "14px",
                              background: "#f5f9fc",
                              boxSizing: "border-box",
                            }}
                          >
                            <div
                              style={{
                                width: "100%",
                                minWidth: 0,
                                boxSizing: "border-box",
                              }}
                            >
                              <TarjetaAsignaturaFotia
                                asignatura={inscripcion}
                                docentesFotia={docentesFotia}
                                esAdmin={esAdmin}
                                onRetirar={onRetirar}
                                onActualizada={onActualizada}
                              />
                            </div>
                          </td>
                        </tr>
                      )}
                    </Fragment>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

const estiloLabel = {
  display: "grid",
  gap: "6px",
  color: "#365b7d",
  fontSize: "12px",
  fontWeight: "700",
  textTransform: "uppercase",
  letterSpacing: "0.04em",
};

const estiloControl = {
  width: "100%",
  minWidth: 0,
  boxSizing: "border-box",
  padding: "9px 11px",
  border: "1px solid #bfd4df",
  borderRadius: "8px",
  background: "#ffffff",
  color: "#31465a",
  fontSize: "14px",
  outline: "none",
};
