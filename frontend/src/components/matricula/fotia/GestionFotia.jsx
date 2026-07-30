import { useEffect, useMemo, useState } from "react";
import TablaFotia from "./TablaFotia";
import {
  crearFilasFotia,
  ordenarFilasFotia,
  obtenerEstudiantesUnicosFotia,
} from "./fotiaUtils";
import FormularioPeriodoFotia from "./FormularioPeriodoFotia";
import IncorporarEstudianteFotia from "./IncorporarEstudianteFotia";
import ListadoInscripcionesFotia from "./ListadoInscripcionesFotia";
import GestionDocentesFotia from "./GestionDocentesFotia";

export default function GestionFotia({
  alumnosMatricula = [],
  alumnosParaExamen = [],
}) {
  const [vistaActiva, setVistaActiva] = useState("inicio");
  const [periodosFotia, setPeriodosFotia] = useState([]);

  const [periodoActivo, setPeriodoActivo] = useState(null);

  const [inscripcionesFotia, setInscripcionesFotia] = useState([]);

  const [docentesFotia, setDocentesFotia] = useState([]);

  const [cargandoFotia, setCargandoFotia] = useState(false);

  const [errorFotia, setErrorFotia] = useState("");

  const [estadosTemporales, setEstadosTemporales] = useState({});
  const [previasQuitadasDeFotia, setPreviasQuitadasDeFotia] = useState([]);

  const docentesTemporales = [
    {
      id: "docente-1",
      nombre: "Docente de prueba 1",
    },
    {
      id: "docente-2",
      nombre: "Docente de prueba 2",
    },
  ];

  const fuenteAlumnos =
    Array.isArray(alumnosMatricula) && alumnosMatricula.length > 0
      ? alumnosMatricula
      : alumnosParaExamen;

  const filasFotia = useMemo(
    () => ordenarFilasFotia(crearFilasFotia(fuenteAlumnos)),
    [fuenteAlumnos],
  );

  const filasVisibles = useMemo(
    () =>
      filasFotia.filter((fila) => !previasQuitadasDeFotia.includes(fila.id)),
    [filasFotia, previasQuitadasDeFotia],
  );

  const filasConEstado = useMemo(
    () =>
      filasVisibles.map((fila) => ({
        ...fila,
        ...(estadosTemporales[fila.id] || {}),
      })),
    [filasVisibles, estadosTemporales],
  );

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

  const actualizarFilaTemporal = (filaId, cambios) => {
    setEstadosTemporales((estadoAnterior) => ({
      ...estadoAnterior,
      [filaId]: {
        ...(estadoAnterior[filaId] || {}),
        ...cambios,
      },
    }));
  };

  const cambiarEstado = (fila, nuevoEstado) => {
    if (nuevoEstado === "Pendiente") {
      actualizarFilaTemporal(fila.id, {
        estado: "Pendiente",
        fechaAprobacion: "",
        docenteResponsableId: "",
        docenteResponsableNombre: "",
      });

      return;
    }

    actualizarFilaTemporal(fila.id, {
      estado: "Aprobada",
    });
  };

  const cambiarFecha = (fila, nuevaFecha) => {
    actualizarFilaTemporal(fila.id, {
      fechaAprobacion: nuevaFecha,
    });
  };

  const cambiarDocente = (fila, docenteId) => {
    const docenteSeleccionado = docentesTemporales.find(
      (docente) =>
        String(docente.id || docente._id || docente.nombre) ===
        String(docenteId),
    );

    actualizarFilaTemporal(fila.id, {
      docenteResponsableId: docenteId,
      docenteResponsableNombre: docenteSeleccionado?.nombre || "",
    });
  };

  const quitarDeFotiaTemporalmente = (fila) => {
    const confirmar = window.confirm(
      `¿Quitar "${fila.asignatura}" de FOTIA para ${fila.estudiante}?\n\nLa asignatura seguirá registrada como previa en Matrícula y en las demás listas institucionales.`,
    );

    if (!confirmar) return;

    setPreviasQuitadasDeFotia((anteriores) => [...anteriores, fila.id]);

    setEstadosTemporales((estadoAnterior) => {
      const copia = { ...estadoAnterior };
      delete copia[fila.id];
      return copia;
    });
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

        setPeriodosFotia(listaPeriodos);
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

  const cancelarFormularioPeriodo = () => {
    setMostrarFormularioPeriodo(false);
  };

  const periodoCreado = (periodo) => {
    setMostrarFormularioPeriodo(false);

    setPeriodosFotia((anteriores) => [periodo, ...anteriores]);

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

  const actualizarInscripcionEnPantalla = (inscripcionActualizada) => {
    setInscripcionesFotia((anteriores) =>
      anteriores.map((inscripcion) =>
        String(inscripcion._id) === String(inscripcionActualizada._id)
          ? inscripcionActualizada
          : inscripcion,
      ),
    );
  };

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
            📘 FOTIA
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
                ✓ Gestión del fortalecimiento
              </h3>

              <p
                style={{
                  color: "#666",
                  lineHeight: 1.55,
                  textAlign: "center",
                  margin: 0,
                }}
              >
                Administración de asignaturas pendientes, estados, fechas y
                docentes responsables.
              </p>

              <button
                type="button"
                onClick={() => setVistaActiva("acreditaciones")}
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
                👩‍🏫 Docentes responsables
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

            {[
              {
                titulo: "Historial",
                descripcion: "Consulta de acreditaciones realizadas.",
              },
              {
                titulo: "Estadísticas",
                descripcion: "Indicadores institucionales de acreditación.",
              },
            ].map((modulo) => (
              <div
                key={modulo.titulo}
                aria-disabled="true"
                style={{
                  border: "2px dashed #d6dde5",
                  borderRadius: "14px",
                  padding: "20px",
                  background: "#f7f8fa",
                  opacity: 0.68,
                  minHeight: "245px",
                }}
              >
                <h3
                  style={{
                    margin: "0 0 14px",
                    color: "#7b8794",
                    textAlign: "center",
                    fontSize: "21px",
                  }}
                >
                  🔒 {modulo.titulo}
                </h3>

                <p
                  style={{
                    color: "#8a94a6",
                    lineHeight: 1.55,
                    textAlign: "center",
                    margin: 0,
                  }}
                >
                  {modulo.descripcion}
                </p>

                <p
                  style={{
                    color: "#9aa5b1",
                    textAlign: "center",
                    fontSize: "14px",
                    marginTop: "20px",
                    fontWeight: "600",
                  }}
                >
                  Disponible en una próxima etapa.
                </p>
              </div>
            ))}
          </div>
        </>
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
           
            ← Volver al inicio de FOTIA
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
                FOTIA
              </p>

              <h2
                style={{
                  margin: "0 0 8px",
                  color: "#23436d",
                  fontSize: "clamp(22px, 3vw, 27px)",
                }}
              >
                Gestión del fortalecimiento
              </h2>

              <p
                style={{
                  margin: 0,
                  color: "#607080",
                  fontSize: "16px",
                  lineHeight: 1.5,
                }}
              >
                Administración de estudiantes, áreas, docentes y trayectorias
                dentro del período de fortalecimiento.
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

            {!periodoActivo && !mostrarFormularioPeriodo && (
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

            {mostrarFormularioPeriodo && (
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
              {[
                {
                  icono: "👨‍🎓",
                  titulo: "Estudiantes incorporados",
                  valor: totalEstudiantesIncorporados,
                  descripcion:
                    "Participan del período activo de fortalecimiento.",
                },
                {
                  icono: "📚",
                  titulo: "Áreas en fortalecimiento",
                  valor: totalAsignaturasFortalecimiento,
                  descripcion:
                    "Asignaturas seleccionadas para trabajar en FOTIA.",
                },
                {
                  icono: "👩‍🏫",
                  titulo: "Docentes participantes",
                  valor: totalDocentesParticipantes,
                  descripcion:
                    "Docentes asignados a intervenciones del período.",
                },
                {
                  icono: "✅",
                  titulo: "Acreditaciones",
                  valor: totalAcreditaciones,
                  descripcion: "Asignaturas acreditadas durante el período.",
                },
              ].map((tarjeta) => (
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
                </div>
              )}

            {mostrarIncorporacion && periodoActivo && (
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

            {periodoActivo && !mostrarIncorporacion &&  inscripcionesFotia.length > 0 && (
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

            <ListadoInscripcionesFotia
              inscripciones={inscripcionesFotia}
              docentesFotia={docentesFotia}
              onRetirar={retirarInscripcionFotia}
              onActualizada={actualizarInscripcionEnPantalla}
            />

            {/*  <TablaFotia
              filas={filasConEstado}
              docentes={docentesTemporales}
              onCambiarEstado={cambiarEstado}
              onCambiarFecha={cambiarFecha}
              onCambiarDocente={cambiarDocente}
              onQuitarDeFotia={quitarDeFotiaTemporalmente}
            />*/}

            {previasQuitadasDeFotia.length > 0 && (
              <p
                style={{
                  margin: "14px 0 0",
                  color: "#8a5a16",
                  fontSize: "13px",
                  textAlign: "center",
                }}
              >
                Las asignaturas quitadas de esta prueba sólo se ocultan de FOTIA
                y reaparecerán al recargar la página.
              </p>
            )}
          </div>
        </div>
      )}
       {vistaActiva === "docentes" && (
        <GestionDocentesFotia
          docentesFotia={docentesFotia}
          onVolver={volverAlInicioFotia}
        />
      )}
    </div>
  );
}
