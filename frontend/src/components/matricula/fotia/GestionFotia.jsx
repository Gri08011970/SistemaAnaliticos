import { useEffect, useMemo, useRef, useState } from "react";
import FormularioPeriodoFotia from "./FormularioPeriodoFotia";
import IncorporarEstudianteFotia from "./IncorporarEstudianteFotia";
import ListadoInscripcionesFotia from "./ListadoInscripcionesFotia";
import GestionDocentesFotia from "./GestionDocentesFotia";
import HistorialAcreditacionesFotia from "./HistorialAcreditacionesFotia";
import EstadisticasFotia from "./EstadisticasFotia";
import HistorialAlfabetizacionFotia from "./HistorialAlfabetizacionFotia";

const normalizarTextoForte = (valor = "") =>
  String(valor)
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();

const esPreviaRealForte = (materia) => {
  const asignatura = normalizarTextoForte(
    materia?.asignatura || materia?.materia || "",
  );

  const valoresSinMateria = [
    "",
    "-",
    "----------",
    "---------",
    "--------",
    "ninguna",
    "sin previas",
    "sin previa",
    "no posee",
  ];

  return !valoresSinMateria.includes(asignatura);
};

export default function GestionFotia({
  alumnosMatricula = [],
  alumnosParaExamen = [],
  esAdmin = false,
}) {
  const [vistaActiva, setVistaActiva] = useState("inicio");

  const [periodoActivo, setPeriodoActivo] = useState(null);

  const [inscripcionesFotia, setInscripcionesFotia] = useState([]);

  const [acreditacionesFotia, setAcreditacionesFotia] = useState([]);

  const [docentesFotia, setDocentesFotia] = useState([]);

  const [cargandoFotia, setCargandoFotia] = useState(false);

  const [errorFotia, setErrorFotia] = useState("");

  const listadoFotiaRef = useRef(null);

  const reabrirSeguimientoFotia = async (inscripcion) => {
    const confirmar = window.confirm(
      `¿Querés reabrir el seguimiento de alfabetización de ${[
        inscripcion.apellido,
        inscripcion.nombre,
      ]
        .filter(Boolean)
        .join(
          " ",
        )}?\n\nEl estudiante volverá a figurar en el seguimiento activo de FOTIA.`,
    );

    if (!confirmar) {
      return;
    }

    try {
      const token =
        localStorage.getItem("tokenUsuario") || localStorage.getItem("token");

      const respuesta = await fetch(
        `/api/fotia/inscripciones/${inscripcion._id}/reabrir-seguimiento`,
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
          datos.mensaje || "No se pudo reabrir el seguimiento FOTIA.",
        );
      }

      setInscripcionesFotia((anteriores) =>
        anteriores.map((item) =>
          String(item._id) === String(inscripcion._id)
            ? datos.inscripcion
            : item,
        ),
      );

      window.alert(
        datos.mensaje || "El seguimiento FOTIA fue reabierto correctamente.",
      );
    } catch (error) {
      console.error("Error al reabrir seguimiento FOTIA:", error);

      window.alert(error.message || "No se pudo reabrir el seguimiento FOTIA.");
    }
  };

  useEffect(() => {
    let componenteActivo = true;

    const cargarAcreditaciones = async () => {
      try {
        const respuesta = await fetch("/api/fotia/acreditaciones");

        const datos = await respuesta.json();

        if (!respuesta.ok) {
          throw new Error(
            datos.mensaje || "No se pudieron obtener las acreditaciones.",
          );
        }

        if (componenteActivo) {
          setAcreditacionesFotia(Array.isArray(datos) ? datos : []);
        }
      } catch (error) {
        console.error(
          "Error al cargar acreditaciones para estadísticas:",
          error,
        );
      }
    };
    cargarAcreditaciones();

    return () => {
      componenteActivo = false;
    };
  }, []);

  const fuenteAlumnos =
    Array.isArray(alumnosMatricula) && alumnosMatricula.length > 0
      ? alumnosMatricula
      : alumnosParaExamen;

  const inscripcionesForteAutomaticas = useMemo(() => {
    return fuenteAlumnos.flatMap((alumno) => {
      const materiasPendientes = Array.isArray(alumno?.materiasPendientes)
        ? alumno.materiasPendientes.filter(esPreviaRealForte)
        : [];

      return materiasPendientes.map((materia) => {
        const asignatura = materia?.asignatura || materia?.materia || "";

        const anio = materia?.anio || materia?.año || "";

        const inscripcionExistente = inscripcionesFotia.find((inscripcion) => {
          const alumnoIdInscripcion =
            inscripcion.alumnoId?._id || inscripcion.alumnoId;

          return (
            String(alumnoIdInscripcion) === String(alumno._id) &&
            inscripcion.tipoOrigen === "Previa" &&
            normalizarTextoForte(inscripcion.asignatura) ===
              normalizarTextoForte(asignatura) &&
            String(inscripcion.anio || "") === String(anio || "")
          );
        });

        return {
          _id:
            inscripcionExistente?._id ||
            `forte-${alumno._id}-${materia?._id || `${asignatura}-${anio}`}`,

          periodoId: inscripcionExistente?.periodoId || periodoActivo || null,

          alumnoId: alumno,

          apellido: alumno.apellido || alumno.apellidoNombre || "",

          nombre: alumno.nombre || "",

          dni: alumno.dni || "",

          curso: alumno.curso || "",

          turno: alumno.turno || "",

          tipoOrigen: "Previa",

          materiaPendienteId: materia?._id || null,

          asignatura,

          anio,

          docenteId: inscripcionExistente?.docenteId || null,

          docenteNombre: inscripcionExistente?.docenteNombre || "",

          estado: inscripcionExistente?.estado || "Sin intervención",

          fechaIncorporacion: inscripcionExistente?.fechaIncorporacion || "",

          fechaAcreditacion: inscripcionExistente?.fechaAcreditacion || "",

          motivoIncorporacion: inscripcionExistente?.motivoIncorporacion || "",

          observaciones: inscripcionExistente?.observaciones || "",

          activo: true,

          origenAutomaticoForte: true,
        };
      });
    });
  }, [fuenteAlumnos, inscripcionesFotia, periodoActivo]);

  console.log("FORTE AUTOMÁTICO:", inscripcionesForteAutomaticas);

  console.log("TOTAL PREVIAS FORTE:", inscripcionesForteAutomaticas.length);

  const estudiantesForteUnicos = new Set(
    inscripcionesForteAutomaticas.map((inscripcion) =>
      String(inscripcion.alumnoId?._id || inscripcion.alumnoId || ""),
    ),
  );

  console.log("TOTAL ESTUDIANTES FORTE:", estudiantesForteUnicos.size);

  const totalDocentesForte = useMemo(() => {
    const docentes = new Set();

    // Docentes con intervenciones FORTE actualmente activas
    inscripcionesForteAutomaticas.forEach((inscripcion) => {
      const docenteId = inscripcion.docenteId?._id || inscripcion.docenteId;

      if (docenteId) {
        docentes.add(`id:${String(docenteId)}`);
      }
    });

    // Docentes que ya participaron acreditando previas
    acreditacionesFotia
      .filter((acreditacion) => {
        if (acreditacion.tipoOrigen !== "Previa") {
          return false;
        }

        if (!periodoActivo?._id) {
          return true;
        }

        const periodoId =
          acreditacion.periodoId && typeof acreditacion.periodoId === "object"
            ? acreditacion.periodoId._id || acreditacion.periodoId.id
            : acreditacion.periodoId;

        return String(periodoId || "") === String(periodoActivo._id);
      })
      .forEach((acreditacion) => {
        const docenteId =
          acreditacion.docenteId && typeof acreditacion.docenteId === "object"
            ? acreditacion.docenteId._id || acreditacion.docenteId.id
            : acreditacion.docenteId;

        if (docenteId) {
          docentes.add(`id:${String(docenteId)}`);
          return;
        }

        const docenteNombre = String(acreditacion.docenteNombre || "")
          .trim()
          .toLowerCase();

        if (docenteNombre) {
          docentes.add(`nombre:${docenteNombre}`);
        }
      });

    return docentes.size;
  }, [inscripcionesForteAutomaticas, acreditacionesFotia, periodoActivo]);

  const inscripcionesActivas = useMemo(
    () =>
      inscripcionesFotia.filter(
        (inscripcion) =>
          inscripcion.activo !== false && inscripcion.estado !== "Suspendida",
      ),
    [inscripcionesFotia],
  );

  const totalEstudiantesIncorporados = useMemo(() => {
    const estudiantes = new Set(
      inscripcionesActivas
        .map((inscripcion) =>
          String(inscripcion.alumnoId?._id || inscripcion.alumnoId || ""),
        )
        .filter(Boolean),
    );

    return estudiantes.size;
  }, [inscripcionesActivas]);

  const totalAsignaturasFortalecimiento = inscripcionesActivas.length;

  const totalDocentesParticipantes = useMemo(() => {
    const docentes = new Set(
      inscripcionesActivas
        .map((inscripcion) =>
          String(inscripcion.docenteId?._id || inscripcion.docenteId || ""),
        )
        .filter(Boolean),
    );

    return docentes.size;
  }, [inscripcionesActivas]);

  const totalAcreditaciones = useMemo(
    () =>
      inscripcionesFotia.filter(
        (inscripcion) => inscripcion.estado === "Acreditada",
      ).length,
    [inscripcionesFotia],
  );

  const volverAlInicioFotia = () => {
    setVistaActiva("inicio");
  };

  const abrirHistorialFotia = () => {
    setVistaActiva("historial");
  };

  useEffect(() => {
    async function cargarDatosFotia() {
      try {
        setCargandoFotia(true);
        setErrorFotia("");

        const [respuestaPeriodos, respuestaDocentes] = await Promise.all([
          fetch("/api/fotia/periodos"),
          fetch("/api/fotia/docentes"),
        ]);

        if (!respuestaPeriodos.ok) {
          throw new Error("No se pudieron obtener los períodos de FOTIA");
        }

        if (!respuestaDocentes.ok) {
          throw new Error("No se pudieron obtener los docentes de FOTIA");
        }

        const periodos = await respuestaPeriodos.json();

        const docentes = await respuestaDocentes.json();

        const listaPeriodos = Array.isArray(periodos) ? periodos : [];

        const listaDocentes = Array.isArray(docentes) ? docentes : [];

        setDocentesFotia(listaDocentes);

        const periodoEncontrado =
          listaPeriodos.find(
            (periodo) =>
              periodo.estado === "Activo" && periodo.activo !== false,
          ) || null;

        setPeriodoActivo(periodoEncontrado);

        if (!periodoEncontrado?._id) {
          setInscripcionesFotia([]);
          return;
        }

        const respuestaInscripciones = await fetch(
          `/api/fotia/inscripciones?periodoId=${periodoEncontrado._id}&activo=true`,
        );

        if (!respuestaInscripciones.ok) {
          throw new Error("No se pudieron obtener las inscripciones de FOTIA");
        }

        const inscripciones = await respuestaInscripciones.json();

        setInscripcionesFotia(
          Array.isArray(inscripciones) ? inscripciones : [],
        );
      } catch (error) {
        console.error("Error al cargar FOTIA:", error);

        setErrorFotia("No se pudieron cargar los datos de FOTIA.");
      } finally {
        setCargandoFotia(false);
      }
    }

    cargarDatosFotia();
  }, []);

  const [mostrarFormularioPeriodo, setMostrarFormularioPeriodo] =
    useState(false);

  const [mostrarIncorporacion, setMostrarIncorporacion] = useState(false);

  const [filtroPrograma, setFiltroPrograma] = useState("Todos");

  console.log(
    "DATOS PARA CLASIFICAR:",
    inscripcionesFotia.map((i) => ({
      estudiante: `${i.apellido} ${i.nombre}`,
      asignatura: i.asignatura,
      tipoOrigen: i.tipoOrigen,
    })),
  );

  console.log("FILTRO PROGRAMA:", filtroPrograma);
  const inscripcionesFotiaAlfabetizacion = useMemo(() => {
    return inscripcionesFotia.filter((inscripcion) => {
      const asignatura = normalizarTextoForte(inscripcion.asignatura);

      return (
        inscripcion.activo !== false &&
        inscripcion.tipoOrigen === "En curso" &&
        asignatura === "practicas del lenguaje"
      );
    });
  }, [inscripcionesFotia]);

  const inscripcionesFotiaActivas = useMemo(() => {
    return inscripcionesFotiaAlfabetizacion.filter(
      (inscripcion) => inscripcion.estado !== "Objetivo alcanzado",
    );
  }, [inscripcionesFotiaAlfabetizacion]);

  const inscripcionesFotiaObjetivoAlcanzado = useMemo(() => {
    return inscripcionesFotiaAlfabetizacion.filter(
      (inscripcion) => inscripcion.estado === "Objetivo alcanzado",
    );
  }, [inscripcionesFotiaAlfabetizacion]);

  const inscripcionesSegunPrograma = useMemo(() => {
    if (filtroPrograma === "FOTIA") {
      return inscripcionesFotiaActivas;
    }

    return inscripcionesForteAutomaticas;
  }, [
    filtroPrograma,
    inscripcionesFotiaActivas,
    inscripcionesForteAutomaticas,
  ]);

  const totalEstudiantesFotia = useMemo(() => {
    const estudiantes = new Set(
      inscripcionesFotiaAlfabetizacion
        .map((inscripcion) =>
          String(inscripcion.alumnoId?._id || inscripcion.alumnoId || ""),
        )
        .filter(Boolean),
    );

    return estudiantes.size;
  }, [inscripcionesFotiaAlfabetizacion]);

  const totalFotiaEnSeguimiento = useMemo(() => {
    const estudiantes = new Set(
      inscripcionesFotiaActivas
        .map((inscripcion) =>
          String(inscripcion.alumnoId?._id || inscripcion.alumnoId || ""),
        )
        .filter(Boolean),
    );

    return estudiantes.size;
  }, [inscripcionesFotiaActivas]);

  const totalFotiaObjetivoAlcanzado = useMemo(() => {
    const estudiantes = new Set(
      inscripcionesFotiaObjetivoAlcanzado
        .map((inscripcion) =>
          String(inscripcion.alumnoId?._id || inscripcion.alumnoId || ""),
        )
        .filter(Boolean),
    );

    return estudiantes.size;
  }, [inscripcionesFotiaObjetivoAlcanzado]);

  const totalDocentesFotia = useMemo(() => {
    const docentes = new Set(
      inscripcionesFotiaAlfabetizacion
        .map((inscripcion) =>
          String(inscripcion.docenteId?._id || inscripcion.docenteId || ""),
        )
        .filter(Boolean),
    );

    return docentes.size;
  }, [inscripcionesFotiaAlfabetizacion]);
  const totalEstudiantesForte = estudiantesForteUnicos.size;

  const totalMateriasForte = inscripcionesForteAutomaticas.length;

  console.log(
    "RESULTADO DEL FILTRO:",
    inscripcionesSegunPrograma.map((i) => ({
      estudiante: `${i.apellido} ${i.nombre}`,
      asignatura: i.asignatura,
      tipoOrigen: i.tipoOrigen,
    })),
  );

  const cancelarFormularioPeriodo = () => {
    setMostrarFormularioPeriodo(false);
  };

  const periodoCreado = (periodo) => {
    setMostrarFormularioPeriodo(false);

    if (periodo.estado === "Activo" && periodo.activo !== false) {
      setPeriodoActivo(periodo);
    }

    setErrorFotia("");
  };

  const retirarInscripcionFotia = async (inscripcion) => {
    console.log("Retirar inscripción:", inscripcion);

    const confirmar = window.confirm(
      `¿Retirar ${inscripcion.asignatura} de FOTIA?\n\nLa asignatura continuará registrada como previa en Matrícula.`,
    );

    if (!confirmar) return;

    try {
      const respuesta = await fetch(
        `/api/fotia/inscripciones/${inscripcion._id}/retirar`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("tokenUsuario")}`,
          },
          body: JSON.stringify({
            observacion: "Retirada desde la gestión del período FOTIA",
          }),
        },
      );

      const datos = await respuesta.json();

      if (!respuesta.ok) {
        throw new Error(
          datos.mensaje || "No se pudo retirar la asignatura de FOTIA.",
        );
      }

      setInscripcionesFotia((anteriores) =>
        anteriores.filter(
          (item) => String(item._id) !== String(inscripcion._id),
        ),
      );
    } catch (error) {
      console.error("Error al retirar inscripción de FOTIA:", error);

      window.alert(
        error.message || "No se pudo retirar la asignatura de FOTIA.",
      );
    }
  };

  const eliminarEstudiantePeriodo = async (estudiante) => {
    const alumnoId =
      estudiante.alumnoId?._id || estudiante.alumnoId || estudiante._id;

    const periodoId = periodoActivo?._id || periodoActivo?.id;

    const nombreCompleto =
      [estudiante.apellido, estudiante.nombre]
        .filter(Boolean)
        .join(" ")
        .trim() || "este estudiante";

    if (!alumnoId || !periodoId) {
      window.alert(
        "No se pudo identificar correctamente al estudiante o al período de FOTIA.",
      );
      return;
    }

    const confirmar = window.confirm(
      `¿Eliminar completamente a ${nombreCompleto} del período ${
        periodoActivo?.nombre || "actual"
      }?\n\n` +
        "Se eliminarán sus registros de participación en este período de FOTIA.\n\n" +
        "Las asignaturas previas ya acreditadas no volverán a Matrícula.\n\n" +
        "Esta acción no se puede deshacer.",
    );

    if (!confirmar) {
      return;
    }

    try {
      setErrorFotia("");

      const respuesta = await fetch(
        `/api/fotia/periodos/${periodoId}/estudiantes/${alumnoId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("tokenUsuario")}`,
          },
        },
      );

      const datos = await respuesta.json();

      if (!respuesta.ok) {
        throw new Error(
          datos.mensaje || "No se pudo eliminar al estudiante de FOTIA.",
        );
      }

      setInscripcionesFotia((anteriores) =>
        anteriores.filter((inscripcion) => {
          const idInscripcion =
            inscripcion.alumnoId?._id || inscripcion.alumnoId;

          return String(idInscripcion) !== String(alumnoId);
        }),
      );

      window.alert(
        `${datos.mensaje}\n\n` +
          `Registros eliminados: ${datos.cantidadEliminada || 0}`,
      );
    } catch (error) {
      console.error("Error al eliminar estudiante del período FOTIA:", error);

      setErrorFotia(
        error.message || "Ocurrió un error al eliminar al estudiante de FOTIA.",
      );
    }
  };

  const actualizarInscripcionEnPantalla = (inscripcionActualizada) => {
    if (!inscripcionActualizada?._id) return;

    setInscripcionesFotia((anteriores) => {
      const indiceExistente = anteriores.findIndex(
        (inscripcion) =>
          String(inscripcion._id) === String(inscripcionActualizada._id),
      );

      // Si ya existía, la actualizamos.
      if (indiceExistente !== -1) {
        return anteriores.map((inscripcion) =>
          String(inscripcion._id) === String(inscripcionActualizada._id)
            ? {
                ...inscripcion,
                ...inscripcionActualizada,
              }
            : inscripcion,
        );
      }

      // Si es una intervención FORTE recién creada,
      // todavía no existía en inscripcionesFotia:
      // la agregamos inmediatamente al estado.
      return [...anteriores, inscripcionActualizada];
    });
  };

  const [periodoEnEdicion, setPeriodoEnEdicion] = useState(null);

  return (
    <div
      style={{
        borderTop: "6px solid #7ea6d8",
        borderRadius: "18px",
        padding: "clamp(18px, 3vw, 28px)",
        background: "#ffffff",
        boxShadow: "0 8px 20px rgba(0,0,0,.08)",
        width: "100%",
        minWidth: 0,
      }}
    >
      {vistaActiva === "inicio" && (
        <>
          <h2
            style={{
              margin: "0 0 12px",
              color: "#23436d",
              textAlign: "center",
              fontSize: "clamp(24px, 3vw, 28px)",
            }}
          >
            📘 FOTIA - FORTE
          </h2>

          <p
            style={{
              textAlign: "center",
              fontSize: "clamp(16px, 2vw, 18px)",
              color: "#56657a",
              marginBottom: "28px",
            }}
          >
            Gestión del fortalecimiento de asignaturas pendientes.
          </p>

          <div
            style={{
              display: "grid",
              gridTemplateColumns:
                "repeat(auto-fit, minmax(min(100%, 220px), 1fr))",
              gap: "18px",
              marginTop: "30px",
              width: "100%",
            }}
          >
            <div
              style={{
                border: "2px solid #9bd8cb",
                borderRadius: "14px",
                padding: "20px",
                background: "#ffffff",
                boxShadow: "0 4px 10px rgba(0,0,0,.06)",
                display: "flex",
                flexDirection: "column",
                minHeight: "245px",
              }}
            >
              <h3
                style={{
                  margin: "0 0 14px",
                  color: "#23436d",
                  textAlign: "center",
                  fontSize: "21px",
                }}
              >
                📖 FOTIA · Alfabetización
              </h3>

              <p
                style={{
                  color: "#666",
                  lineHeight: 1.55,
                  textAlign: "center",
                  margin: 0,
                }}
              >
                Seguimiento de estudiantes que participan del dispositivo de
                alfabetización en Prácticas del Lenguaje.
              </p>

              <button
                type="button"
                onClick={() => {
                  setFiltroPrograma("FOTIA");
                  setVistaActiva("acreditaciones");
                }}
                style={{
                  marginTop: "auto",
                  alignSelf: "center",
                  padding: "10px 18px",
                  border: "none",
                  borderRadius: "10px",
                  background: "#148c84",
                  color: "#fff",
                  fontWeight: "700",
                  cursor: "pointer",
                  minWidth: "118px",
                  boxShadow: "0 4px 10px rgba(20, 140, 132, 0.18)",
                }}
              >
                Entrar
              </button>
            </div>

            <div
              style={{
                border: "2px solid #8fb5d9",
                borderRadius: "14px",
                padding: "20px",
                background: "#ffffff",
                boxShadow: "0 4px 10px rgba(0,0,0,.06)",
                display: "flex",
                flexDirection: "column",
                minHeight: "245px",
              }}
            >
              <h3
                style={{
                  margin: "0 0 14px",
                  color: "#23436d",
                  textAlign: "center",
                  fontSize: "21px",
                }}
              >
                📚 FORTE · Intensificación
              </h3>

              <p
                style={{
                  color: "#666",
                  lineHeight: 1.55,
                  textAlign: "center",
                  margin: 0,
                }}
              >
                Fortalecimiento y acreditación de asignaturas previas con
                seguimiento docente.
              </p>

              <button
                type="button"
                onClick={() => {
                  setFiltroPrograma("FORTE");
                  setVistaActiva("acreditaciones");
                }}
                style={{
                  marginTop: "auto",
                  alignSelf: "center",
                  padding: "10px 18px",
                  border: "none",
                  borderRadius: "10px",
                  background: "#148c84",
                  color: "#fff",
                  fontWeight: "700",
                  cursor: "pointer",
                  minWidth: "118px",
                  boxShadow: "0 4px 10px rgba(20, 140, 132, 0.18)",
                }}
              >
                Entrar
              </button>
            </div>

            <div
              style={{
                border: "2px solid #8fb5d9",
                borderRadius: "14px",
                padding: "20px",
                background: "#ffffff",
                boxShadow: "0 4px 10px rgba(0,0,0,.06)",
                display: "flex",
                flexDirection: "column",
                minHeight: "245px",
              }}
            >
              <h3
                style={{
                  margin: "0 0 14px",
                  color: "#23436d",
                  textAlign: "center",
                  fontSize: "21px",
                }}
              >
                Docentes responsables
              </h3>

              <p
                style={{
                  color: "#666",
                  lineHeight: 1.55,
                  textAlign: "center",
                  margin: 0,
                }}
              >
                Administración de docentes responsables del fortalecimiento.
              </p>

              <button
                type="button"
                onClick={() => setVistaActiva("docentes")}
                style={{
                  marginTop: "auto",
                  alignSelf: "center",
                  padding: "10px 18px",
                  border: "none",
                  borderRadius: "10px",
                  background: "#148c84",
                  color: "#fff",
                  fontWeight: "700",
                  cursor: "pointer",
                  minWidth: "118px",
                  boxShadow: "0 4px 10px rgba(20,140,132,.18)",
                }}
              >
                Entrar
              </button>
            </div>

            <div
              style={{
                border: "2px solid #8fb5d9",
                borderRadius: "14px",
                padding: "20px",
                background: "#ffffff",
                boxShadow: "0 4px 10px rgba(0,0,0,.06)",
                display: "flex",
                flexDirection: "column",
                minHeight: "245px",
              }}
            >
              <h3
                style={{
                  margin: "0 0 14px",
                  color: "#23436d",
                  textAlign: "center",
                  fontSize: "21px",
                }}
              >
                📅 Períodos
              </h3>

              <p
                style={{
                  color: "#666",
                  lineHeight: 1.55,
                  textAlign: "center",
                  margin: 0,
                }}
              >
                Crear, consultar y administrar períodos de FOTIA-FORTE.
              </p>

              <button
                type="button"
                onClick={() => setVistaActiva("periodos")}
                style={{
                  marginTop: "auto",
                  alignSelf: "center",
                  padding: "10px 18px",
                  border: "none",
                  borderRadius: "10px",
                  background: "#148c84",
                  color: "#fff",
                  fontWeight: "700",
                  cursor: "pointer",
                  minWidth: "118px",
                  boxShadow: "0 4px 10px rgba(20,140,132,.18)",
                }}
              >
                Entrar
              </button>
            </div>

            {[
              {
                titulo: "Historial FOTIA",
                icono: "📖",
                descripcion:
                  "Trayectorias de alfabetización que alcanzaron el objetivo.",
                onClick: () => setVistaActiva("historialFotia"),
              },
              {
                titulo: "Historial FORTE",
                icono: "✅",
                descripcion:
                  "Consulta de asignaturas previas acreditadas durante el fortalecimiento.",
                onClick: () => {
                  setFiltroPrograma("FORTE");
                  abrirHistorialFotia();
                },
              },
              {
                titulo: "Estadísticas",
                icono: "📊",
                descripcion:
                  "Indicadores institucionales del período FOTIA-FORTE.",
                onClick: () => setVistaActiva("estadisticas"),
              },
            ].map((modulo) => (
              <div
                key={modulo.titulo}
                style={{
                  border: "2px solid #a8c8ee",
                  borderRadius: "14px",
                  padding: "20px",
                  background: "#ffffff",
                  minHeight: "245px",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                }}
              >
                <h3
                  style={{
                    margin: "0 0 14px",
                    color: "#1d3557",
                    textAlign: "center",
                    fontSize: "21px",
                  }}
                >
                  {modulo.icono} {modulo.titulo}
                </h3>

                <p
                  style={{
                    color: "#66778a",
                    lineHeight: 1.55,
                    textAlign: "center",
                    margin: 0,
                  }}
                >
                  {modulo.descripcion}
                </p>

                <button
                  type="button"
                  onClick={modulo.onClick}
                  style={{
                    marginTop: "24px",
                    alignSelf: "center",
                    padding: "10px 28px",
                    background: "#1b9a96",
                    color: "#fff",
                    border: "none",
                    borderRadius: "10px",
                    cursor: "pointer",
                    fontWeight: "700",
                    fontSize: "15px",
                    boxShadow: "0 3px 10px rgba(0,0,0,0.15)",
                  }}
                >
                  Entrar
                </button>
              </div>
            ))}
          </div>
        </>
      )}

      {vistaActiva === "historialFotia" && (
        <div
          style={{
            width: "100%",
            minWidth: 0,
          }}
        >
          <button
            type="button"
            onClick={volverAlInicioFotia}
            style={{
              marginBottom: "20px",
              padding: "9px 14px",
              border: "1px solid #bfd4df",
              borderRadius: "9px",
              background: "#f3f8fa",
              color: "#315f6f",
              cursor: "pointer",
              fontWeight: "700",
            }}
          >
            ← Volver a FOTIA-FORTE
          </button>

          <HistorialAlfabetizacionFotia
            inscripciones={inscripcionesFotia}
            esAdmin={esAdmin}
            onReabrir={reabrirSeguimientoFotia}
          />
        </div>
      )}

      {vistaActiva === "periodos" && (
        <div
          style={{
            width: "100%",
            minWidth: 0,
          }}
        >
          <button
            type="button"
            onClick={volverAlInicioFotia}
            style={{
              marginBottom: "20px",
              padding: "9px 14px",
              border: "1px solid #bfd4df",
              borderRadius: "9px",
              background: "#f3f8fa",
              color: "#315f6f",
              cursor: "pointer",
              fontWeight: "700",
            }}
          >
            ← Volver a FOTIA-FORTE
          </button>

          <div
            style={{
              border: "2px solid #b9d4ea",
              borderRadius: "16px",
              padding: "clamp(18px, 3vw, 26px)",
              background: "linear-gradient(180deg, #f8fbfe 0%, #ffffff 100%)",
              boxShadow: "0 5px 16px rgba(41, 78, 112, 0.08)",
            }}
          >
            <div
              style={{
                textAlign: "center",
                marginBottom: "24px",
              }}
            >
              <p
                style={{
                  margin: "0 0 5px",
                  color: "#6b7f92",
                  fontSize: "12px",
                  fontWeight: "700",
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                }}
              >
                ADMINISTRACIÓN
              </p>

              <h2
                style={{
                  margin: "0 0 8px",
                  color: "#23436d",
                  fontSize: "27px",
                }}
              >
                📅 Períodos FOTIA-FORTE
              </h2>

              <p
                style={{
                  margin: 0,
                  color: "#607080",
                }}
              >
                Gestión de los períodos institucionales de fortalecimiento.
              </p>
            </div>

            {periodoActivo && !periodoEnEdicion && (
              <div
                style={{
                  padding: "20px",
                  border: "2px solid #b7ddd3",
                  borderRadius: "14px",
                  background: "#eef8f5",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    flexWrap: "wrap",
                    gap: "16px",
                  }}
                >
                  <div>
                    <span
                      style={{
                        display: "block",
                        marginBottom: "6px",
                        color: "#607080",
                        fontSize: "12px",
                        fontWeight: "700",
                        textTransform: "uppercase",
                      }}
                    >
                      Período activo
                    </span>

                    <h3
                      style={{
                        margin: "0 0 8px",
                        color: "#23436d",
                        fontSize: "21px",
                      }}
                    >
                      {periodoActivo.nombre}
                    </h3>

                    <div
                      style={{
                        color: "#566f86",
                        lineHeight: 1.6,
                      }}
                    >
                      <div>
                        Ciclo lectivo:{" "}
                        <strong>{periodoActivo.cicloLectivo}</strong>
                      </div>

                      <div>
                        Estado: <strong>{periodoActivo.estado}</strong>
                      </div>
                    </div>
                  </div>

                  {esAdmin && (
                    <button
                      type="button"
                      onClick={() => setPeriodoEnEdicion(periodoActivo)}
                      style={{
                        padding: "10px 18px",
                        border: "1px solid #8fb5d9",
                        borderRadius: "10px",
                        background: "#ffffff",
                        color: "#23436d",
                        fontWeight: "700",
                        cursor: "pointer",
                      }}
                    >
                      ✏️ Editar período
                    </button>
                  )}
                </div>
              </div>
            )}

            {periodoEnEdicion && (
              <FormularioPeriodoFotia
                periodoEditar={periodoEnEdicion}
                onCancelar={() => setPeriodoEnEdicion(null)}
                onPeriodoActualizado={(periodoActualizado) => {
                  setPeriodoActivo(periodoActualizado);

                  setPeriodoEnEdicion(null);

                  setErrorFotia("");
                }}
              />
            )}

            {!periodoActivo && !mostrarFormularioPeriodo && (
              <div
                style={{
                  textAlign: "center",
                  marginTop: "24px",
                }}
              >
                <p
                  style={{
                    color: "#607080",
                    marginBottom: "16px",
                  }}
                >
                  No existe un período activo.
                </p>

                {esAdmin && (
                  <button
                    type="button"
                    onClick={() => setMostrarFormularioPeriodo(true)}
                    style={{
                      padding: "11px 20px",
                      border: "none",
                      borderRadius: "10px",
                      background: "#148c84",
                      color: "#ffffff",
                      fontWeight: "700",
                      cursor: "pointer",
                    }}
                  >
                    ➕ Crear período
                  </button>
                )}
              </div>
            )}

            {mostrarFormularioPeriodo && !periodoActivo && (
              <FormularioPeriodoFotia
                onCancelar={() => setMostrarFormularioPeriodo(false)}
                onPeriodoCreado={(periodo) => {
                  periodoCreado(periodo);
                  setVistaActiva("periodos");
                }}
              />
            )}
          </div>
        </div>
      )}
      {vistaActiva === "acreditaciones" && (
        <div style={{ width: "100%", minWidth: 0 }}>
          <button
            type="button"
            onClick={volverAlInicioFotia}
            style={{
              marginBottom: "20px",
              padding: "9px 14px",
              border: "1px solid #bfd4df",
              borderRadius: "9px",
              background: "#f3f8fa",
              color: "#315f6f",
              cursor: "pointer",
              fontWeight: "700",
            }}
          >
            ← Volver a FOTIA-FORTE
          </button>

          <div
            style={{
              border: "2px solid #b9d4ea",
              borderRadius: "16px",
              padding: "clamp(18px, 3vw, 26px)",
              background: "linear-gradient(180deg, #f8fbfe 0%, #ffffff 100%)",
              boxShadow: "0 5px 16px rgba(41, 78, 112, 0.08)",
              width: "100%",
              minWidth: 0,
            }}
          >
            <div style={{ textAlign: "center", marginBottom: "24px" }}>
              <p
                style={{
                  margin: "0 0 5px",
                  color: "#6b7f92",
                  fontSize: "12px",
                  fontWeight: "700",
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                }}
              >
                {filtroPrograma === "FOTIA"
                  ? "FOTIA · ALFABETIZACIÓN"
                  : "FORTE · INTENSIFICACIÓN"}
              </p>

              <h2
                style={{
                  margin: "0 0 8px",
                  color: "#23436d",
                  fontSize: "clamp(22px, 3vw, 27px)",
                }}
              >
                {filtroPrograma === "FOTIA"
                  ? "Seguimiento de alfabetización"
                  : "Gestión del fortalecimiento"}
              </h2>

              <p
                style={{
                  margin: 0,
                  color: "#607080",
                  fontSize: "16px",
                  lineHeight: 1.5,
                }}
              >
                {filtroPrograma === "FOTIA"
                  ? "Seguimiento de estudiantes que participan del dispositivo de alfabetización en Prácticas del Lenguaje."
                  : "Administración de asignaturas previas, docentes responsables y trayectorias de intensificación."}
              </p>
            </div>

            <div
              style={{
                margin: "22px auto 30px",
                maxWidth: "680px",
                padding: "14px 18px",
                borderRadius: "12px",
                background: periodoActivo ? "#eef8f5" : "#fff8e8",
                border: periodoActivo
                  ? "1px solid #b7ddd3"
                  : "1px solid #e6cf9e",
                color: periodoActivo ? "#256b61" : "#8a5a16",
                textAlign: "center",
                fontWeight: "700",
                boxShadow: "0 3px 9px rgba(41, 78, 112, 0.05)",
              }}
            >
              {periodoActivo
                ? `Período activo: ${periodoActivo.nombre}`
                : "Todavía no hay un período activo de FOTIA."}
            </div>

            {esAdmin && !periodoActivo && !mostrarFormularioPeriodo && (
              <div
                style={{
                  margin: "20px 0 28px",
                  textAlign: "center",
                }}
              >
                <button
                  type="button"
                  onClick={() => setMostrarFormularioPeriodo(true)}
                  style={{
                    padding: "12px 22px",
                    border: "none",
                    borderRadius: "10px",
                    background: "#148c84",
                    color: "#ffffff",
                    fontSize: "15px",
                    fontWeight: "700",
                    cursor: "pointer",
                    boxShadow: "0 4px 10px rgba(20, 140, 132, 0.20)",
                  }}
                >
                  ➕ Crear período de FOTIA
                </button>
              </div>
            )}

            {esAdmin && mostrarFormularioPeriodo && (
              <FormularioPeriodoFotia
                onCancelar={cancelarFormularioPeriodo}
                onPeriodoCreado={periodoCreado}
              />
            )}

            <div
              style={{
                display: "grid",
                gridTemplateColumns:
                  "repeat(auto-fit, minmax(min(100%, 180px), 1fr))",
                gap: "14px",
              }}
            >
              {(filtroPrograma === "FOTIA"
                ? [
                    {
                      icono: "🎓",
                      titulo: "Estudiantes FOTIA",
                      valor: totalEstudiantesFotia,
                      descripcion:
                        "Participan del dispositivo de alfabetización.",
                    },
                    {
                      icono: "📖",
                      titulo: "En alfabetización",
                      valor: totalFotiaEnSeguimiento,
                      descripcion:
                        "Continúan actualmente con seguimiento de alfabetización.",
                    },
                    {
                      icono: "✅",
                      titulo: "Objetivo alcanzado",
                      valor: totalFotiaObjetivoAlcanzado,
                      descripcion:
                        "Estudiantes que alcanzaron el objetivo de alfabetización.",
                    },
                    {
                      icono: "📋",
                      titulo: "Docentes participantes",
                      valor: totalDocentesFotia,
                      descripcion:
                        "Docentes asignados al acompañamiento de alfabetización.",
                    },
                  ]
                : [
                    {
                      icono: "🎓",
                      titulo: "Estudiantes FORTE",
                      valor: totalEstudiantesForte,
                      descripcion:
                        "Estudiantes con asignaturas previas en intensificación.",
                    },
                    {
                      icono: "📚",
                      titulo: "Materias en fortalecimiento",
                      valor: totalMateriasForte,
                      descripcion:
                        "Asignaturas previas actualmente en proceso de fortalecimiento.",
                    },
                    {
                      icono: "📋",
                      titulo: "Docentes participantes",
                      valor: totalDocentesForte,
                      descripcion:
                        "Docentes responsables de las intervenciones FORTE.",
                    },
                    {
                      icono: "✅",
                      titulo: "Acreditaciones",
                      valor: totalAcreditaciones,
                      descripcion:
                        "Asignaturas previas acreditadas durante el período.",
                    },
                  ]
              ).map((tarjeta) => (
                <div
                  key={tarjeta.titulo}
                  style={{
                    padding: "14px 16px",
                    border: "2px solid #b9d4ea",
                    borderRadius: "12px",
                    background: "#ffffff",
                    textAlign: "center",
                    boxShadow: "0 3px 9px rgba(41, 78, 112, 0.05)",
                    minHeight: "145px",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                  }}
                >
                  <span
                    style={{
                      display: "block",
                      marginBottom: "8px",
                      fontSize: "22px",
                    }}
                  >
                    {tarjeta.icono}
                  </span>

                  <span
                    style={{
                      display: "block",
                      marginBottom: "8px",
                      color: "#6b7f92",
                      fontSize: "12px",
                      fontWeight: "700",
                      textTransform: "uppercase",
                      letterSpacing: "0.05em",
                    }}
                  >
                    {tarjeta.titulo}
                  </span>

                  <strong
                    style={{
                      display: "block",
                      color: "#23436d",
                      fontSize: "27px",
                    }}
                  >
                    {tarjeta.valor}
                  </strong>

                  <p
                    style={{
                      margin: "5px 0 0",
                      color: "#657585",
                      lineHeight: 1.35,
                      fontSize: "14px",
                    }}
                  >
                    {tarjeta.descripcion}
                  </p>
                </div>
              ))}
            </div>

            {cargandoFotia && (
              <p
                style={{
                  margin: "24px 0",
                  textAlign: "center",
                  color: "#607080",
                }}
              >
                Cargando período de fortalecimiento...
              </p>
            )}

            {errorFotia && (
              <p
                style={{
                  margin: "24px 0",
                  padding: "14px",
                  borderRadius: "10px",
                  background: "#fff1f1",
                  color: "#9b3d3d",
                  textAlign: "center",
                }}
              >
                {errorFotia}
              </p>
            )}

            {!cargandoFotia &&
              !errorFotia &&
              periodoActivo &&
              inscripcionesFotia.length === 0 && (
                <div
                  style={{
                    marginTop: "24px",
                    padding: "24px",
                    border: "2px dashed #bfd7ec",
                    borderRadius: "14px",
                    background: "#ffffff",
                    textAlign: "center",
                    color: "#566f86",
                  }}
                >
                  <strong
                    style={{
                      display: "block",
                      marginBottom: "8px",
                      color: "#23436d",
                      fontSize: "18px",
                    }}
                  >
                    Este período todavía no tiene estudiantes incorporados.
                  </strong>

                  <span>
                    Utilizá “Incorporar estudiante” para seleccionar quiénes
                    participarán y qué áreas se trabajarán.
                  </span>
                  {esAdmin && (
                    <button
                      type="button"
                      onClick={() => setMostrarIncorporacion(true)}
                      style={{
                        display: "block",
                        margin: "20px auto 0",
                        padding: "12px 22px",
                        border: "none",
                        borderRadius: "10px",
                        background: "#148c84",
                        color: "#ffffff",
                        fontSize: "15px",
                        fontWeight: "700",
                        cursor: "pointer",
                        boxShadow: "0 4px 10px rgba(20, 140, 132, 0.20)",
                      }}
                    >
                      ➕ Incorporar estudiante
                    </button>
                  )}
                </div>
              )}

            {esAdmin && mostrarIncorporacion && periodoActivo && (
              <IncorporarEstudianteFotia
                alumnosMatricula={fuenteAlumnos}
                docentesFotia={docentesFotia}
                periodoActivo={periodoActivo}
                onCerrar={() => setMostrarIncorporacion(false)}
                onIncorporacionCompletada={(nuevasInscripciones) => {
                  setInscripcionesFotia((anteriores) => [
                    ...anteriores,
                    ...nuevasInscripciones,
                  ]);

                  setMostrarIncorporacion(false);
                }}
              />
            )}
            {esAdmin &&
              periodoActivo &&
              !mostrarIncorporacion &&
              inscripcionesFotia.length > 0 && (
                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    marginTop: "24px",
                    marginBottom: "18px",
                  }}
                >
                  <button
                    type="button"
                    onClick={() => setMostrarIncorporacion(true)}
                    style={{
                      padding: "11px 20px",
                      border: "none",
                      borderRadius: "10px",
                      background: "#148c84",
                      color: "#ffffff",
                      fontSize: "15px",
                      fontWeight: "700",
                      cursor: "pointer",
                      boxShadow: "0 4px 10px rgba(20, 140, 132, 0.20)",
                    }}
                  >
                    ➕ Incorporar otro estudiante
                  </button>
                </div>
              )}

            <div
              ref={listadoFotiaRef}
              style={{
                width: "100%",
                maxWidth: "100%",
                minWidth: 0,
                boxSizing: "border-box",
                scrollMarginTop: "18px",
              }}
            >
              <ListadoInscripcionesFotia
                inscripciones={inscripcionesSegunPrograma}
                programaSeleccionado={filtroPrograma}
                docentesFotia={docentesFotia}
                esAdmin={esAdmin}
                onRetirar={retirarInscripcionFotia}
                onActualizada={actualizarInscripcionEnPantalla}
                onEliminarEstudiante={eliminarEstudiantePeriodo}
              />
            </div>
          </div>
        </div>
      )}
      {vistaActiva === "docentes" && (
        <GestionDocentesFotia
          docentesFotia={docentesFotia}
          onVolver={volverAlInicioFotia}
          onDocenteCreado={(nuevoDocente) => {
            setDocentesFotia((anteriores) => [...anteriores, nuevoDocente]);
          }}
          onDocenteActualizado={(docenteActualizado) => {
            setDocentesFotia((anteriores) =>
              anteriores.map((docente) =>
                docente._id === docenteActualizado._id
                  ? docenteActualizado
                  : docente,
              ),
            );
          }}
          onDocenteEliminado={(docenteEliminado) => {
            setDocentesFotia((anteriores) =>
              anteriores.filter(
                (docente) => docente._id !== docenteEliminado._id,
              ),
            );
          }}
        />
      )}

      {vistaActiva === "historial" && (
        <HistorialAcreditacionesFotia
          periodoActivo={periodoActivo}
          esAdmin={esAdmin}
          onVolver={volverAlInicioFotia}
          onAcreditacionRevertida={(inscripcionReabierta) => {
            // Actualizamos las inscripciones que utiliza FORTE.
            actualizarInscripcionEnPantalla(inscripcionReabierta);

            // También quitamos esa acreditación del
            // resumen estadístico superior.
            setAcreditacionesFotia((anteriores) =>
              anteriores.filter(
                (acreditacion) =>
                  String(acreditacion._id) !== String(inscripcionReabierta._id),
              ),
            );
          }}
        />
      )}

      {vistaActiva === "estadisticas" && (
        <EstadisticasFotia
          periodoActivo={periodoActivo}
          inscripcionesFotia={inscripcionesFotia}
          onVolver={volverAlInicioFotia}
        />
      )}
    </div>
  );
}
