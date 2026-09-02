import { useEffect, useMemo, useState } from "react";

const formatearFechaFotia = (fecha) => {
  if (!fecha) return "Sin fecha";

  const partes = String(fecha).split("-");

  if (partes.length === 3) {
    const [anio, mes, dia] = partes;

    return `${dia}/${mes}/${anio}`;
  }

  const fechaConvertida = new Date(fecha);

  if (Number.isNaN(fechaConvertida.getTime())) {
    return String(fecha);
  }

  return fechaConvertida.toLocaleDateString("es-AR");
};

const obtenerNombreEstudiante = (acreditacion) => {
  return (
    [acreditacion.apellido, acreditacion.nombre]
      .filter(Boolean)
      .join(" ")
      .trim() || "Estudiante sin identificar"
  );
};

const obtenerNombreDocente = (acreditacion) => {
  if (acreditacion.docenteNombre) {
    return acreditacion.docenteNombre;
  }

  if (acreditacion.docenteId && typeof acreditacion.docenteId === "object") {
    return [acreditacion.docenteId.apellido, acreditacion.docenteId.nombre]
      .filter(Boolean)
      .join(" ")
      .trim();
  }

  return "Sin docente informado";
};

const obtenerNombrePeriodo = (acreditacion) => {
  if (acreditacion.periodoId && typeof acreditacion.periodoId === "object") {
    return acreditacion.periodoId.nombre || "Período sin nombre";
  }

  return "Período no disponible";
};

const normalizarTexto = (valor) =>
  String(valor || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();

export default function HistorialAcreditacionesFotia({
  periodoActivo,
  esAdmin = false,
  onVolver,
  onAcreditacionRevertida,
}) {
  const [acreditaciones, setAcreditaciones] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");

  const [busqueda, setBusqueda] = useState("");
  const [filtroOrigen, setFiltroOrigen] = useState("");
  const [filtroCurso, setFiltroCurso] = useState("");
  const [filtroPeriodo, setFiltroPeriodo] = useState("");
  const [filtroAsignatura, setFiltroAsignatura] = useState("");

  useEffect(() => {
    let componenteActivo = true;

    const cargarAcreditaciones = async () => {
      try {
        setCargando(true);
        setError("");

        const respuesta = await fetch("/api/fotia/acreditaciones");

        const datos = await respuesta.json();

        if (!respuesta.ok) {
          throw new Error(
            datos.mensaje ||
              "No se pudo obtener el historial de acreditaciones.",
          );
        }

        if (componenteActivo) {
          setAcreditaciones(Array.isArray(datos) ? datos : []);
        }
      } catch (errorCarga) {
        console.error(
          "Error al cargar el historial de acreditaciones FOTIA:",
          errorCarga,
        );

        if (componenteActivo) {
          setError(
            errorCarga.message ||
              "No se pudo cargar el historial de acreditaciones.",
          );
        }
      } finally {
        if (componenteActivo) {
          setCargando(false);
        }
      }
    };

    cargarAcreditaciones();

    return () => {
      componenteActivo = false;
    };
  }, []);

  const cursosDisponibles = useMemo(() => {
    return [
      ...new Set(
        acreditaciones
          .map((acreditacion) => acreditacion.curso)
          .filter(Boolean),
      ),
    ].sort((cursoA, cursoB) =>
      String(cursoA).localeCompare(String(cursoB), "es", {
        numeric: true,
      }),
    );
  }, [acreditaciones]);

  const asignaturasDisponibles = useMemo(() => {
    return [
      ...new Set(
        acreditaciones
          .map((acreditacion) => String(acreditacion.asignatura || "").trim())
          .filter(Boolean),
      ),
    ].sort((asignaturaA, asignaturaB) =>
      asignaturaA.localeCompare(asignaturaB, "es"),
    );
  }, [acreditaciones]);

  const periodosDisponibles = useMemo(() => {
    const periodos = new Map();

    acreditaciones.forEach((acreditacion) => {
      const periodo = acreditacion.periodoId;

      if (!periodo || typeof periodo !== "object") {
        return;
      }

      const periodoId = String(periodo._id || periodo.id || "");

      if (!periodoId) return;

      periodos.set(periodoId, {
        id: periodoId,
        nombre: periodo.nombre || "Período sin nombre",
        cicloLectivo: periodo.cicloLectivo || "",
      });
    });

    return [...periodos.values()].sort((periodoA, periodoB) => {
      const comparacionCiclo =
        Number(periodoB.cicloLectivo || 0) - Number(periodoA.cicloLectivo || 0);

      if (comparacionCiclo !== 0) {
        return comparacionCiclo;
      }

      return periodoA.nombre.localeCompare(periodoB.nombre, "es");
    });
  }, [acreditaciones]);

  const acreditacionesFiltradas = useMemo(() => {
    const textoBuscado = normalizarTexto(busqueda);

    return acreditaciones.filter((acreditacion) => {
      const periodoId =
        acreditacion.periodoId && typeof acreditacion.periodoId === "object"
          ? String(
              acreditacion.periodoId._id || acreditacion.periodoId.id || "",
            )
          : String(acreditacion.periodoId || "");

      const coincideBusqueda =
        !textoBuscado ||
        [
          obtenerNombreEstudiante(acreditacion),
          acreditacion.asignatura,
          acreditacion.anio,
          acreditacion.curso,
          acreditacion.turno,
          obtenerNombreDocente(acreditacion),
          obtenerNombrePeriodo(acreditacion),
          acreditacion.observaciones,
        ].some((valor) => normalizarTexto(valor).includes(textoBuscado));

      const coincideOrigen =
        !filtroOrigen || acreditacion.tipoOrigen === filtroOrigen;
      const coincideAsignatura =
        !filtroAsignatura || acreditacion.asignatura === filtroAsignatura;

      const coincideCurso = !filtroCurso || acreditacion.curso === filtroCurso;

      const coincidePeriodo = !filtroPeriodo || periodoId === filtroPeriodo;

      return (
        coincideBusqueda &&
        coincideOrigen &&
        coincideAsignatura &&
        coincideCurso &&
        coincidePeriodo
      );
    });
  }, [
    acreditaciones,
    busqueda,
    filtroOrigen,
    filtroAsignatura,
    filtroCurso,
    filtroPeriodo,
  ]);

  const totalPreviasAcreditadas = useMemo(
    () =>
      acreditacionesFiltradas.filter(
        (acreditacion) => acreditacion.tipoOrigen === "Previa",
      ).length,
    [acreditacionesFiltradas],
  );

  const totalMateriasEnCursoAcreditadas = useMemo(
    () =>
      acreditacionesFiltradas.filter(
        (acreditacion) => acreditacion.tipoOrigen === "En curso",
      ).length,
    [acreditacionesFiltradas],
  );

  const totalEstudiantes = useMemo(() => {
    const estudiantes = new Set();

    acreditacionesFiltradas.forEach((acreditacion) => {
      const alumnoId =
        acreditacion.alumnoId && typeof acreditacion.alumnoId === "object"
          ? acreditacion.alumnoId._id || acreditacion.alumnoId.id
          : acreditacion.alumnoId;

      estudiantes.add(
        String(alumnoId || obtenerNombreEstudiante(acreditacion)),
      );
    });

    return estudiantes.size;
  }, [acreditacionesFiltradas]);

  const revertirAcreditacion = async (acreditacion) => {
    if (!esAdmin) return;

    const estudiante = obtenerNombreEstudiante(acreditacion);

    const confirmar = window.confirm(
      `¿Confirmás que querés revertir la acreditación de ${acreditacion.asignatura || "esta asignatura"} de ${estudiante}?\n\n` +
        "La asignatura volverá a figurar como previa institucional en Matrícula y regresará al seguimiento activo de FORTE.\n\n" +
        "El docente y las observaciones de la intervención se conservarán.",
    );

    if (!confirmar) {
      return;
    }

    try {
      const token =
        localStorage.getItem("tokenUsuario") || localStorage.getItem("token");

      const respuesta = await fetch(
        `/api/fotia/inscripciones/${acreditacion._id}/revertir-acreditacion`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        },
      );

      const datos = await respuesta.json();

      if (!respuesta.ok) {
        throw new Error(
          datos.mensaje || "No se pudo revertir la acreditación FORTE.",
        );
      }

      // Sale inmediatamente del historial porque
      // ya dejó de estar acreditada.
      setAcreditaciones((anteriores) =>
        anteriores.filter(
          (item) => String(item._id) !== String(acreditacion._id),
        ),
      );

      onAcreditacionRevertida?.(datos.inscripcion, datos.alumno);

      window.alert(
        datos.mensaje || "La acreditación FORTE fue revertida correctamente.",
      );
    } catch (error) {
      console.error("Error al revertir acreditación FORTE:", error);

      window.alert(
        error.message || "No se pudo revertir la acreditación FORTE.",
      );
    }
  };

  const limpiarFiltros = () => {
    setBusqueda("");
    setFiltroOrigen("");
    setFiltroAsignatura("");
    setFiltroCurso("");
    setFiltroPeriodo("");
  };

  const imprimirHistorial = () => {
    if (acreditacionesFiltradas.length === 0) {
      return;
    }

    const ventanaImpresion = window.open("", "_blank", "width=1200,height=800");

    if (!ventanaImpresion) {
      alert(
        "El navegador bloqueó la ventana de impresión. Permití las ventanas emergentes e intentá nuevamente.",
      );
      return;
    }

    const filasImpresion = acreditacionesFiltradas
      .map(
        (acreditacion) => `
        <tr>
          <td>${formatearFechaFotia(acreditacion.fechaAcreditacion)}</td>

          <td class="estudiante">
            ${obtenerNombreEstudiante(acreditacion)}
          </td>

          <td>
            ${acreditacion.curso || "Sin curso"}
            ${acreditacion.turno ? ` · ${acreditacion.turno}` : ""}
          </td>

          <td>
            <strong>
              ${acreditacion.asignatura || "Sin asignatura"}
            </strong>

            ${
              acreditacion.anio
                ? `<div class="dato-secundario">
                    ${acreditacion.anio} año
                  </div>`
                : ""
            }
          </td>

          <td>
            ${acreditacion.tipoOrigen || "Sin origen"}
          </td>

          <td>
            ${obtenerNombreDocente(acreditacion)}
          </td>

          <td>
            ${obtenerNombrePeriodo(acreditacion)}
          </td>

          <td>
            ${acreditacion.observaciones || ""}
          </td>
        </tr>
      `,
      )
      .join("");

    const fechaImpresion = new Date().toLocaleDateString("es-AR");

    ventanaImpresion.document.open();

    ventanaImpresion.document.write(`
    <!doctype html>

    <html lang="es">
      <head>
        <meta charset="UTF-8" />

        <title>Historial de acreditaciones FOTIA</title>

        <style>
          * {
            box-sizing: border-box;
          }

          body {
            margin: 0;
            padding: 10px;
            color: #243b53;
            background: #ffffff;
            font-family: Arial, Helvetica, sans-serif;
          }

          .encabezado {
            padding-bottom: 10px;
            margin-bottom: 12px;
            border-bottom: 2px solid #7fa6c2;
            text-align: center;
          }

          .escuela {
            margin: 0 0 5px;
            color: #385d7c;
            font-size: 13px;
            font-weight: 700;
            text-transform: uppercase;
            letter-spacing: 0.4px;
          }

          h1 {
            margin: 0 0 4px;
            color: #183b63;
            font-size: 22px;
            font-weight: 700;
          }

          .subtitulo {
            margin: 0;
            color: #63788b;
            font-size: 13px;
          }

          .datos {
            display: flex;
            justify-content: space-between;
            gap: 15px;
            margin-bottom: 14px;
            color: #52687a;
            font-size: 12px;
          }

          .resumen {
            display: flex;
            flex-wrap: wrap;
            gap: 8px;
            margin-bottom: 10px;
          }

          .resumen span {
            padding: 6px 10px;
            border: 1px solid #b9cedd;
            border-radius: 6px;
            background: #f5f9fc;
            font-size: 12px;
            font-weight: 700;
          }

          table {
            width: 100%;
            border-collapse: collapse;
            table-layout: fixed;
            font-size: 9px;
          }

          th:nth-child(1),
          td:nth-child(1) {
            width: 8%;
          }

          th:nth-child(2),
          td:nth-child(2) {
            width: 15%;
          }

          th:nth-child(3),
          td:nth-child(3) {
            width: 11%;
          }

          th:nth-child(4),
          td:nth-child(4) {
            width: 17%;
          }

          th:nth-child(5),
          td:nth-child(5) {
            width: 9%;
          }

          th:nth-child(6),
          td:nth-child(6) {
            width: 14%;
          }

          th:nth-child(7),
          td:nth-child(7) {
            width: 14%;
          }

          th:nth-child(8),
          td:nth-child(8) {
            width: 12%;
          }

          th {
            padding: 7px 6px;
            border: 1px solid #8eabbf;
            background: #e9f1f6;
            color: #294d6b;
            text-align: left;
          }

          td {
            padding: 7px 6px;
            border: 1px solid #c3d1da;
            vertical-align: top;
            overflow-wrap: anywhere;
          }

          .estudiante {
            min-width: 135px;
            font-weight: 700;
          }

          .dato-secundario {
            margin-top: 3px;
            color: #687d8e;
            font-size: 9px;
          }

          .pie {
            margin-top: 14px;
            color: #63788b;
            font-size: 10px;
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

          <h1>Historial de acreditaciones FOTIA</h1>

          <p class="subtitulo">
            Registro institucional de asignaturas acreditadas mediante
            el fortalecimiento de trayectorias
          </p>
        </header>

        <div class="datos">
          <span>
            Período activo:
            <strong>
              ${periodoActivo?.nombre || "Sin período activo"}
            </strong>
          </span>

          <span>
            Fecha de emisión:
            <strong>${fechaImpresion}</strong>
          </span>
        </div>

        <div class="resumen">
          <span>
            Acreditaciones:
            ${acreditacionesFiltradas.length}
          </span>

          <span>
            Estudiantes:
            ${totalEstudiantes}
          </span>

          <span>
            Previas:
            ${totalPreviasAcreditadas}
          </span>

          <span>
            En curso:
            ${totalMateriasEnCursoAcreditadas}
          </span>
        </div>

        <table>
          <thead>
            <tr>
              <th>Fecha</th>
              <th>Estudiante</th>
              <th>Curso</th>
              <th>Asignatura</th>
              <th>Origen</th>
              <th>Docente</th>
              <th>Período</th>
              <th>Observaciones</th>
            </tr>
          </thead>

          <tbody>
            ${filasImpresion}
          </tbody>
        </table>

        <p class="pie">
          Registros impresos:
          ${acreditacionesFiltradas.length}
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

  return (
    <section
      style={{
        width: "100%",
        minWidth: 0,
      }}
    >
      <style>
        {`
          @media (max-width: 900px) {
            .fotia-filtro-buscar,
            .fotia-filtro-origen,
            .fotia-filtro-asignatura,
            .fotia-filtro-curso,
            .fotia-filtro-periodo {
              grid-column: span 6 !important;
            }
          }

          @media (max-width: 560px) {
            .fotia-filtro-buscar,
            .fotia-filtro-origen,
            .fotia-filtro-asignatura, 
            .fotia-filtro-curso,
            .fotia-filtro-periodo {
              grid-column: span 12 !important;
            }
          }
        `}
      </style>

      <div
        className="fotia-no-imprimir"
        style={{
          display: "flex",
          justifyContent: "flex-start",
          marginBottom: "18px",
        }}
      >
        <button
          type="button"
          onClick={onVolver}
          style={{
            padding: "10px 18px",
            border: "1px solid #b8cadb",
            borderRadius: "10px",
            background: "#ffffff",
            color: "#365572",
            fontWeight: "700",
            cursor: "pointer",
            boxShadow: "0 3px 8px rgba(0,0,0,.05)",
          }}
        >
          ← Volver a FOTIA-FORTE
        </button>
      </div>

      <div
        id="historial-acreditaciones-fotia"
        style={{
          padding: "clamp(16px, 3vw, 26px)",
          border: "2px solid #b8d7d2",
          borderRadius: "16px",
          background: "#ffffff",
          boxShadow: "0 6px 16px rgba(0,0,0,.07)",
          minWidth: 0,
        }}
      >
        <header
          style={{
            marginBottom: "24px",
            textAlign: "center",
          }}
        >
          <p
            style={{
              margin: "0 0 5px",
              color: "#60758a",
              fontSize: "13px",
              fontWeight: "700",
              letterSpacing: ".4px",
              textTransform: "uppercase",
            }}
          >
            Registro institucional
          </p>

          <h2
            style={{
              margin: "0 0 8px",
              color: "#23436d",
              fontSize: "clamp(23px, 3vw, 29px)",
            }}
          >
            📖 Historial de acreditaciones FOTIA-FORTE
          </h2>

          <p
            style={{
              margin: 0,
              color: "#62768a",
              fontSize: "15px",
              lineHeight: 1.5,
            }}
          >
            Consulta de las asignaturas acreditadas mediante el fortalecimiento
            institucional.
          </p>

          {periodoActivo && (
            <p
              style={{
                display: "inline-block",
                margin: "14px 0 0",
                padding: "8px 14px",
                borderRadius: "999px",
                background: "#eef8f5",
                border: "1px solid #b7ddd3",
                color: "#256b61",
                fontSize: "13px",
                fontWeight: "700",
              }}
            >
              Período actualmente activo: {periodoActivo.nombre}
            </p>
          )}
        </header>

        {!cargando && !error && (
          <>
            <div
              style={{
                display: "grid",
                gridTemplateColumns:
                  "repeat(auto-fit, minmax(min(100%, 175px), 1fr))",
                gap: "14px",
                marginBottom: "22px",
              }}
            >
              <div
                style={{
                  padding: "16px",
                  border: "1px solid #b9d7ef",
                  borderRadius: "12px",
                  background: "#f4f9fd",
                  textAlign: "center",
                }}
              >
                <div
                  style={{
                    color: "#315d80",
                    fontSize: "28px",
                    fontWeight: "800",
                  }}
                >
                  {acreditacionesFiltradas.length}
                </div>

                <div
                  style={{
                    color: "#60758a",
                    fontSize: "13px",
                    fontWeight: "700",
                  }}
                >
                  Acreditaciones
                </div>
              </div>

              <div
                style={{
                  padding: "16px",
                  border: "1px solid #b7ddd3",
                  borderRadius: "12px",
                  background: "#f1faf7",
                  textAlign: "center",
                }}
              >
                <div
                  style={{
                    color: "#257266",
                    fontSize: "28px",
                    fontWeight: "800",
                  }}
                >
                  {totalEstudiantes}
                </div>

                <div
                  style={{
                    color: "#60758a",
                    fontSize: "13px",
                    fontWeight: "700",
                  }}
                >
                  Estudiantes
                </div>
              </div>

              <div
                style={{
                  padding: "16px",
                  border: "1px solid #d7c8ef",
                  borderRadius: "12px",
                  background: "#faf7fe",
                  textAlign: "center",
                }}
              >
                <div
                  style={{
                    color: "#74549a",
                    fontSize: "28px",
                    fontWeight: "800",
                  }}
                >
                  {totalPreviasAcreditadas}
                </div>

                <div
                  style={{
                    color: "#60758a",
                    fontSize: "13px",
                    fontWeight: "700",
                  }}
                >
                  Previas acreditadas
                </div>
              </div>

              <div
                style={{
                  padding: "16px",
                  border: "1px solid #ecd8a9",
                  borderRadius: "12px",
                  background: "#fffaf0",
                  textAlign: "center",
                }}
              >
                <div
                  style={{
                    color: "#9a6a22",
                    fontSize: "28px",
                    fontWeight: "800",
                  }}
                >
                  {totalMateriasEnCursoAcreditadas}
                </div>

                <div
                  style={{
                    color: "#60758a",
                    fontSize: "13px",
                    fontWeight: "700",
                  }}
                >
                  Materias en curso
                </div>
              </div>
            </div>

            <div
              className="fotia-no-imprimir"
              style={{
                marginBottom: "22px",
                padding: "16px",
                border: "1px solid #ccdbe6",
                borderRadius: "12px",
                background: "#f8fafc",
              }}
            >
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(12, minmax(0, 1fr))",
                  gap: "12px",
                  alignItems: "end",
                }}
              >
                <label
                  className="fotia-filtro-buscar"
                  style={{
                    display: "grid",
                    gap: "6px",
                    color: "#41566c",
                    fontSize: "13px",
                    fontWeight: "700",
                    gridColumn: "span 3",
                  }}
                >
                  Buscar
                  <input
                    type="search"
                    value={busqueda}
                    onChange={(evento) => setBusqueda(evento.target.value)}
                    placeholder="Estudiante, materia o docente"
                    style={{
                      width: "100%",
                      minWidth: 0,
                      padding: "10px 11px",
                      border: "1px solid #b9cad8",
                      borderRadius: "8px",
                      background: "#ffffff",
                      color: "#31465a",
                      fontSize: "14px",
                    }}
                  />
                </label>

                <label
                  className="fotia-filtro-origen"
                  style={{
                    display: "grid",
                    gap: "6px",
                    color: "#41566c",
                    fontSize: "13px",
                    fontWeight: "700",
                    gridColumn: "span 2",
                  }}
                >
                  Origen
                  <select
                    value={filtroOrigen}
                    onChange={(evento) => setFiltroOrigen(evento.target.value)}
                    style={{
                      width: "100%",
                      minWidth: 0,
                      padding: "10px 11px",
                      border: "1px solid #b9cad8",
                      borderRadius: "8px",
                      background: "#ffffff",
                      color: "#31465a",
                      fontSize: "14px",
                    }}
                  >
                    <option value="">Todos </option>
                    <option value="Previa">Previa</option>
                    <option value="En curso">En curso</option>
                  </select>
                </label>

                <label
                  className="fotia-filtro-asignatura"
                  style={{
                    display: "grid",
                    gap: "6px",
                    color: "#41566c",
                    fontSize: "13px",
                    fontWeight: "700",
                    gridColumn: "span 3",
                  }}
                >
                  Asignatura
                  <select
                    value={filtroAsignatura}
                    onChange={(evento) =>
                      setFiltroAsignatura(evento.target.value)
                    }
                    style={{
                      width: "100%",
                      minWidth: 0,
                      padding: "10px 11px",
                      border: "1px solid #b9cad8",
                      borderRadius: "8px",
                      background: "#ffffff",
                      color: "#31465a",
                      fontSize: "14px",
                    }}
                  >
                    <option value="">Todas las asignaturas</option>

                    {asignaturasDisponibles.map((asignatura) => (
                      <option key={asignatura} value={asignatura}>
                        {asignatura}
                      </option>
                    ))}
                  </select>
                </label>

                <label
                  className="fotia-filtro-curso"
                  style={{
                    display: "grid",
                    gap: "6px",
                    color: "#41566c",
                    fontSize: "13px",
                    fontWeight: "700",
                    gridColumn: "span 2",
                  }}
                >
                  Curso
                  <select
                    value={filtroCurso}
                    onChange={(evento) => setFiltroCurso(evento.target.value)}
                    style={{
                      width: "100%",
                      minWidth: 0,
                      padding: "10px 11px",
                      border: "1px solid #b9cad8",
                      borderRadius: "8px",
                      background: "#ffffff",
                      color: "#31465a",
                      fontSize: "14px",
                    }}
                  >
                    <option value="">Todos los cursos</option>

                    {cursosDisponibles.map((curso) => (
                      <option key={curso} value={curso}>
                        {curso}
                      </option>
                    ))}
                  </select>
                </label>

                <label
                  className="fotia-filtro-periodo"
                  style={{
                    display: "grid",
                    gap: "6px",
                    color: "#41566c",
                    fontSize: "13px",
                    fontWeight: "700",
                    gridColumn: "span 2",
                  }}
                >
                  Período
                  <select
                    value={filtroPeriodo}
                    onChange={(evento) => setFiltroPeriodo(evento.target.value)}
                    style={{
                      width: "100%",
                      minWidth: 0,
                      padding: "10px 11px",
                      border: "1px solid #b9cad8",
                      borderRadius: "8px",
                      background: "#ffffff",
                      color: "#31465a",
                      fontSize: "14px",
                    }}
                  >
                    <option value="">Todos los períodos</option>

                    {periodosDisponibles.map((periodo) => (
                      <option key={periodo.id} value={periodo.id}>
                        {periodo.nombre}
                        {periodo.cicloLectivo
                          ? ` · ${periodo.cicloLectivo}`
                          : ""}
                      </option>
                    ))}
                  </select>
                </label>
              </div>

              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  justifyContent: "center",
                  gap: "10px",
                  marginTop: "15px",
                }}
              >
                <button
                  type="button"
                  onClick={limpiarFiltros}
                  style={{
                    padding: "9px 16px",
                    border: "1px solid #b8cadb",
                    borderRadius: "8px",
                    background: "#ffffff",
                    color: "#3e5d77",
                    fontWeight: "700",
                    cursor: "pointer",
                  }}
                >
                  Limpiar filtros
                </button>

                <button
                  type="button"
                  onClick={imprimirHistorial}
                  disabled={acreditacionesFiltradas.length === 0}
                  style={{
                    padding: "9px 18px",
                    border: "none",
                    borderRadius: "8px",
                    background:
                      acreditacionesFiltradas.length === 0
                        ? "#aebac5"
                        : "#148c84",
                    color: "#ffffff",
                    fontWeight: "700",
                    cursor:
                      acreditacionesFiltradas.length === 0
                        ? "not-allowed"
                        : "pointer",
                  }}
                >
                  🖨️ Imprimir historial
                </button>
              </div>
            </div>
          </>
        )}

        {cargando && (
          <div
            style={{
              padding: "32px 20px",
              borderRadius: "12px",
              background: "#f6f9fb",
              color: "#51687d",
              textAlign: "center",
              fontWeight: "700",
            }}
          >
            Cargando historial de acreditaciones...
          </div>
        )}

        {!cargando && error && (
          <div
            style={{
              padding: "18px",
              border: "1px solid #e5b8b8",
              borderRadius: "12px",
              background: "#fff2f2",
              color: "#9a3030",
              textAlign: "center",
              fontWeight: "700",
            }}
          >
            {error}
          </div>
        )}

        {!cargando && !error && acreditacionesFiltradas.length === 0 && (
          <div
            style={{
              padding: "32px 20px",
              border: "1px dashed #c7d4df",
              borderRadius: "12px",
              background: "#fafcfd",
              textAlign: "center",
            }}
          >
            <div
              style={{
                marginBottom: "8px",
                fontSize: "32px",
              }}
            >
              📭
            </div>

            <h3
              style={{
                margin: "0 0 7px",
                color: "#3d5870",
                fontSize: "18px",
              }}
            >
              No hay acreditaciones para mostrar
            </h3>

            <p
              style={{
                margin: 0,
                color: "#718294",
                fontSize: "14px",
              }}
            >
              Todavía no se registraron acreditaciones o ninguna coincide con
              los filtros seleccionados.
            </p>
          </div>
        )}

        {!cargando && !error && acreditacionesFiltradas.length > 0 && (
          <div
            style={{
              width: "100%",
              overflowX: "auto",
              border: "1px solid #c7d7e2",
              borderRadius: "12px",
            }}
          >
            <table
              className="fotia-tabla-historial"
              style={{
                width: "100%",
                minWidth: "1120px",
                borderCollapse: "collapse",
                background: "#ffffff",
                color: "#31465a",
                fontSize: "13px",
              }}
            >
              <thead>
                <tr
                  style={{
                    background: "#eaf2f7",
                  }}
                >
                  {[
                    "Fecha",
                    "Estudiante",
                    "Curso",
                    "Asignatura",
                    "Origen",
                    "Docente",
                    "Período",
                    "Observaciones",
                    ...(esAdmin ? ["Acción"] : []),
                  ].map((titulo) => (
                    <th
                      key={titulo}
                      style={{
                        padding: "11px 9px",
                        borderRight: "1px solid #c7d7e2",
                        borderBottom: "2px solid #9eb8ca",
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
                {acreditacionesFiltradas.map((acreditacion, indice) => (
                  <tr
                    key={
                      acreditacion._id ||
                      `${acreditacion.alumnoId}-${acreditacion.asignatura}-${indice}`
                    }
                    style={{
                      background: indice % 2 === 0 ? "#ffffff" : "#f9fbfc",
                    }}
                  >
                    <td
                      style={{
                        padding: "10px 9px",
                        borderRight: "1px solid #d7e1e8",
                        borderBottom: "1px solid #d7e1e8",
                        whiteSpace: "nowrap",
                        fontWeight: "700",
                      }}
                    >
                      {formatearFechaFotia(acreditacion.fechaAcreditacion)}
                    </td>

                    <td
                      style={{
                        padding: "10px 9px",
                        borderRight: "1px solid #d7e1e8",
                        borderBottom: "1px solid #d7e1e8",
                        minWidth: "190px",
                        fontWeight: "700",
                        color: "#294d6b",
                      }}
                    >
                      {obtenerNombreEstudiante(acreditacion)}
                    </td>

                    <td
                      style={{
                        padding: "10px 9px",
                        borderRight: "1px solid #d7e1e8",
                        borderBottom: "1px solid #d7e1e8",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {acreditacion.curso || "Sin curso"}

                      {acreditacion.turno ? ` · ${acreditacion.turno}` : ""}
                    </td>

                    <td
                      style={{
                        padding: "10px 9px",
                        borderRight: "1px solid #d7e1e8",
                        borderBottom: "1px solid #d7e1e8",
                        minWidth: "180px",
                      }}
                    >
                      <strong>
                        {acreditacion.asignatura || "Sin asignatura"}
                      </strong>

                      {acreditacion.anio && (
                        <div
                          style={{
                            marginTop: "3px",
                            color: "#718294",
                            fontSize: "12px",
                          }}
                        >
                          {acreditacion.anio} año
                        </div>
                      )}
                    </td>

                    <td
                      style={{
                        padding: "10px 9px",
                        borderRight: "1px solid #d7e1e8",
                        borderBottom: "1px solid #d7e1e8",
                        whiteSpace: "nowrap",
                      }}
                    >
                      <span
                        style={{
                          display: "inline-block",
                          padding: "5px 9px",
                          borderRadius: "999px",
                          background:
                            acreditacion.tipoOrigen === "Previa"
                              ? "#f2eafd"
                              : "#fff4d9",
                          color:
                            acreditacion.tipoOrigen === "Previa"
                              ? "#674595"
                              : "#8b641f",
                          fontSize: "12px",
                          fontWeight: "800",
                        }}
                      >
                        {acreditacion.tipoOrigen || "Sin origen"}
                      </span>
                    </td>

                    <td
                      style={{
                        padding: "10px 9px",
                        borderRight: "1px solid #d7e1e8",
                        borderBottom: "1px solid #d7e1e8",
                        minWidth: "170px",
                      }}
                    >
                      {obtenerNombreDocente(acreditacion)}
                    </td>

                    <td
                      style={{
                        padding: "10px 9px",
                        borderRight: "1px solid #d7e1e8",
                        borderBottom: "1px solid #d7e1e8",
                        minWidth: "160px",
                      }}
                    >
                      {obtenerNombrePeriodo(acreditacion)}
                    </td>

                    <td
                      style={{
                        padding: "10px 9px",
                        borderBottom: "1px solid #d7e1e8",
                        minWidth: "220px",
                        lineHeight: 1.45,
                        color: acreditacion.observaciones
                          ? "#4d6072"
                          : "#8997a4",
                        fontStyle: acreditacion.observaciones
                          ? "normal"
                          : "italic",
                      }}
                    >
                      {acreditacion.observaciones || "Sin observaciones"}
                    </td>
                    {esAdmin && (
                      <td
                        style={{
                          padding: "10px 9px",
                          borderBottom: "1px solid #d7e1e8",
                          minWidth: "175px",
                          textAlign: "center",
                        }}
                      >
                        {acreditacion.tipoOrigen === "Previa" ? (
                          <button
                            type="button"
                            onClick={() => revertirAcreditacion(acreditacion)}
                            style={{
                              padding: "8px 12px",
                              border: "1px solid #c8d6e2",
                              borderRadius: "8px",
                              background: "#f4f7f9",
                              color: "#445b6e",
                              fontSize: "13px",
                              fontWeight: "700",
                              cursor: "pointer",
                              whiteSpace: "nowrap",
                            }}
                          >
                            ↩ Revertir acreditación
                          </button>
                        ) : (
                          <span
                            style={{
                              color: "#8a98a5",
                              fontSize: "12px",
                            }}
                          >
                            —
                          </span>
                        )}
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {!cargando && !error && acreditacionesFiltradas.length > 0 && (
          <p
            style={{
              margin: "14px 0 0",
              color: "#718294",
              fontSize: "12px",
              textAlign: "right",
            }}
          >
            Registros mostrados: {acreditacionesFiltradas.length}
          </p>
        )}
      </div>
    </section>
  );
}
