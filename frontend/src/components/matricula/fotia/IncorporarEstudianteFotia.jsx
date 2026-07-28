import { useMemo, useState } from "react";

const MOTIVO_INICIAL = "Derivación del equipo docente";

const obtenerNombreCompletoParaBusqueda = (alumno) => {
  const apellido = String(alumno?.apellido || "").trim();
  const nombre = String(alumno?.nombre || "").trim();
  const apellidoNombre = String(alumno?.apellidoNombre || "").trim();

  const nombreEsValido =
    nombre &&
    nombre.toLowerCase() !== "sin nombre";

  if (apellido && nombreEsValido) {
    return `${apellido} ${nombre}`.trim();
  }

  if (apellidoNombre) {
    return apellidoNombre;
  }

  return apellido;
};

const normalizarTexto = (valor = "") =>
  String(valor)
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();

const limpiarDni = (valor = "") =>
  String(valor).replace(/\D/g, "");

export default function IncorporarEstudianteFotia({
  alumnosMatricula = [],
  docentesFotia = [],
  periodoActivo,
  onCerrar,
  onIncorporacionCompletada,
}) {
  const [busqueda, setBusqueda] = useState("");

  const [alumnoSeleccionado, setAlumnoSeleccionado] =
    useState(null);

  const [materiasSeleccionadas, setMateriasSeleccionadas] =
    useState([]);

  const [fechaIncorporacion, setFechaIncorporacion] =
    useState(new Date().toISOString().slice(0, 10));

  const [motivoIncorporacion, setMotivoIncorporacion] =
    useState(MOTIVO_INICIAL);

  const [
    otroMotivoIncorporacion,
    setOtroMotivoIncorporacion,
  ] = useState("");

  const [docenteId, setDocenteId] = useState("");

  const [observaciones, setObservaciones] = useState("");

  const [guardando, setGuardando] = useState(false);

  const [errorGuardado, setErrorGuardado] = useState("");

  const alumnosDisponibles = useMemo(
    () =>
      alumnosMatricula.filter(
        (alumno) =>
          alumno?.estadoMatricula !== "Baja" &&
          Array.isArray(alumno?.materiasPendientes) &&
          alumno.materiasPendientes.length > 0,
      ),
    [alumnosMatricula],
  );

  const resultados = useMemo(() => {
    const termino = normalizarTexto(busqueda);
    const dniBuscado = limpiarDni(busqueda);

    if (!termino && !dniBuscado) {
      return [];
    }

    return alumnosDisponibles
      .filter((alumno) => {
        const nombreCompleto = normalizarTexto(
          obtenerNombreCompletoParaBusqueda(alumno),
        );

        const dniAlumno = limpiarDni(alumno?.dni);

        return (
          nombreCompleto.includes(termino) ||
          (dniBuscado &&
            dniAlumno.includes(dniBuscado))
        );
      })
      .slice(0, 12);
  }, [alumnosDisponibles, busqueda]);

  const seleccionarAlumno = (alumno) => {
    setAlumnoSeleccionado(alumno);
    setMateriasSeleccionadas([]);
    setMotivoIncorporacion(MOTIVO_INICIAL);
    setOtroMotivoIncorporacion("");
    setDocenteId("");
    setObservaciones("");
    setErrorGuardado("");
    setBusqueda("");
  };

  const quitarSeleccion = () => {
    setAlumnoSeleccionado(null);
    setMateriasSeleccionadas([]);
    setMotivoIncorporacion(MOTIVO_INICIAL);
    setOtroMotivoIncorporacion("");
    setDocenteId("");
    setObservaciones("");
    setErrorGuardado("");
    setBusqueda("");
  };

  const obtenerIdMateria = (materia) =>
    String(
      materia?._id ||
        `${materia?.asignatura || ""}-${
          materia?.anio || ""
        }`,
    );

  const cambiarSeleccionMateria = (materia) => {
    const materiaId = obtenerIdMateria(materia);

    setMateriasSeleccionadas((anteriores) =>
      anteriores.includes(materiaId)
        ? anteriores.filter(
            (id) => id !== materiaId,
          )
        : [...anteriores, materiaId],
    );
  };

  const seleccionarTodasLasMaterias = () => {
    const materias =
      alumnoSeleccionado?.materiasPendientes || [];

    setMateriasSeleccionadas(
      materias.map(obtenerIdMateria),
    );
  };

  const limpiarMateriasSeleccionadas = () => {
    setMateriasSeleccionadas([]);
  };

  const incorporarAFotia = async () => {
    try {
      setErrorGuardado("");

      if (!alumnoSeleccionado?._id) {
        throw new Error(
          "Primero tenés que seleccionar un estudiante.",
        );
      }

      if (!periodoActivo?._id) {
        throw new Error(
          "No hay un período activo de FOTIA.",
        );
      }

      if (materiasSeleccionadas.length === 0) {
        throw new Error(
          "Seleccioná al menos una asignatura.",
        );
      }

      if (!fechaIncorporacion) {
        throw new Error(
          "La fecha de incorporación es obligatoria.",
        );
      }

      const motivoFinal =
        motivoIncorporacion === "Otro"
          ? otroMotivoIncorporacion.trim()
          : motivoIncorporacion.trim();

      if (!motivoFinal) {
        throw new Error(
          "Seleccioná o escribí el motivo de incorporación.",
        );
      }

      const materiasAIncorporar =
        alumnoSeleccionado.materiasPendientes.filter(
          (materia) =>
            materiasSeleccionadas.includes(
              obtenerIdMateria(materia),
            ),
        );

      if (materiasAIncorporar.length === 0) {
        throw new Error(
          "No se encontraron asignaturas válidas para incorporar.",
        );
      }

      setGuardando(true);

      const inscripcionesGuardadas = [];

      for (const materia of materiasAIncorporar) {
        if (!materia?._id) {
          throw new Error(
            `La asignatura "${
              materia?.asignatura || "sin nombre"
            }" no tiene un identificador válido.`,
          );
        }

        const respuesta = await fetch(
          "/api/fotia/inscripciones",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              periodoId: periodoActivo._id,
              alumnoId: alumnoSeleccionado._id,
              materiaPendienteId: materia._id,
              docenteId: docenteId || null,
              fechaIncorporacion,
              motivoIncorporacion: motivoFinal,
              observaciones: observaciones.trim(),
            }),
          },
        );

        const datos = await respuesta.json();

        if (!respuesta.ok) {
          throw new Error(
            datos?.mensaje ||
              datos?.error ||
              `No se pudo incorporar ${
                materia?.asignatura || "la asignatura"
              }.`,
          );
        }

        inscripcionesGuardadas.push(
          datos.inscripcion || datos,
        );
      }

      onIncorporacionCompletada?.(
        inscripcionesGuardadas,
      );

      setAlumnoSeleccionado(null);
      setMateriasSeleccionadas([]);
      setMotivoIncorporacion(MOTIVO_INICIAL);
      setOtroMotivoIncorporacion("");
      setDocenteId("");
      setObservaciones("");
      setBusqueda("");
      setErrorGuardado("");
    } catch (error) {
      console.error(
        "Error al incorporar estudiante a FOTIA:",
        error,
      );

      setErrorGuardado(
        error?.message ||
          "No se pudo completar la incorporación.",
      );
    } finally {
      setGuardando(false);
    }
  };

  return (
    <div
      style={{
        marginTop: "24px",
        padding: "clamp(18px, 3vw, 24px)",
        border: "2px solid #b9d4ea",
        borderRadius: "16px",
        background: "#ffffff",
        boxShadow: "0 5px 16px rgba(41, 78, 112, 0.08)",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "14px",
          marginBottom: "22px",
        }}
      >
        <div>
          <h3
            style={{
              margin: "0 0 6px",
              color: "#23436d",
              fontSize: "22px",
            }}
          >
            👨‍🎓 Incorporar estudiante
          </h3>

          <p
            style={{
              margin: 0,
              color: "#607080",
            }}
          >
            Período: <strong>{periodoActivo?.nombre || "Sin período"}</strong>
          </p>
        </div>

        <button
          type="button"
          onClick={onCerrar}
          style={{
            padding: "9px 14px",
            border: "1px solid #bfd4df",
            borderRadius: "9px",
            background: "#f3f8fa",
            color: "#315f6f",
            cursor: "pointer",
            fontWeight: "700",
          }}
        >
          ✕ Cerrar
        </button>
      </div>

      {!alumnoSeleccionado && (
        <>
          <label
            style={{
              display: "block",
              marginBottom: "8px",
              color: "#365b7d",
              fontWeight: "700",
            }}
          >
            Buscar estudiante
          </label>

          <input
            type="text"
            value={busqueda}
            onChange={(evento) => setBusqueda(evento.target.value)}
            placeholder="Apellido, nombre o DNI"
            autoFocus
            style={{
              width: "100%",
              boxSizing: "border-box",
              padding: "12px 14px",
              border: "2px solid #bfd4df",
              borderRadius: "10px",
              background: "#ffffff",
              color: "#31465a",
              fontSize: "16px",
              outline: "none",
            }}
          />

          {!busqueda.trim() && (
            <p
              style={{
                margin: "12px 0 0",
                color: "#748596",
                fontSize: "14px",
                textAlign: "center",
              }}
            >
              Escribí parte del apellido, nombre o DNI.
            </p>
          )}

          {busqueda.trim() && resultados.length === 0 && (
            <div
              style={{
                marginTop: "16px",
                padding: "18px",
                border: "2px dashed #c5d9ea",
                borderRadius: "12px",
                background: "#f8fbfe",
                color: "#607080",
                textAlign: "center",
              }}
            >
              No se encontraron estudiantes con asignaturas pendientes que
              coincidan con la búsqueda.
            </div>
          )}

          {resultados.length > 0 && (
            <div
              style={{
                display: "grid",
                gap: "10px",
                marginTop: "16px",
              }}
            >
              {resultados.map((alumno) => (
                <button
                  key={alumno._id}
                  type="button"
                  onClick={() => seleccionarAlumno(alumno)}
                  style={{
                    width: "100%",
                    padding: "14px 16px",
                    border: "1px solid #c3d9eb",
                    borderRadius: "11px",
                    background: "#ffffff",
                    cursor: "pointer",
                    textAlign: "left",
                    boxShadow: "0 3px 8px rgba(41, 78, 112, 0.05)",
                  }}
                >
                  <strong
                    style={{
                      display: "block",
                      color: "#23436d",
                      fontSize: "16px",
                    }}
                  >
                    {alumno.apellido} {alumno.nombre}
                  </strong>

                  <span
                    style={{
                      display: "block",
                      marginTop: "5px",
                      color: "#657585",
                      fontSize: "14px",
                    }}
                  >
                    {alumno.curso || "Curso sin informar"}
                    {alumno.turno ? ` · Turno ${alumno.turno}` : ""}
                    {alumno.dni ? ` · DNI ${alumno.dni}` : ""}
                  </span>

                  <span
                    style={{
                      display: "block",
                      marginTop: "5px",
                      color: "#148c84",
                      fontSize: "13px",
                      fontWeight: "700",
                    }}
                  >
                    {alumno.materiasPendientes.length}{" "}
                    {alumno.materiasPendientes.length === 1
                      ? "asignatura pendiente"
                      : "asignaturas pendientes"}
                  </span>
                </button>
              ))}
            </div>
          )}
        </>
      )}

      {alumnoSeleccionado && (
        <div
          style={{
            padding: "18px",
            border: "2px solid #b7ddd3",
            borderRadius: "14px",
            background: "#f2faf7",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
              flexWrap: "wrap",
              gap: "14px",
            }}
          >
            <div>
              <span
                style={{
                  color: "#5b7185",
                  fontSize: "12px",
                  fontWeight: "700",
                  textTransform: "uppercase",
                  letterSpacing: "0.06em",
                }}
              >
                Estudiante seleccionado
              </span>

              <h4
                style={{
                  margin: "6px 0",
                  color: "#23436d",
                  fontSize: "20px",
                }}
              >
                {alumnoSeleccionado.apellido} {alumnoSeleccionado.nombre}
              </h4>

              <p
                style={{
                  margin: 0,
                  color: "#607080",
                }}
              >
                {alumnoSeleccionado.curso}
                {alumnoSeleccionado.turno
                  ? ` · Turno ${alumnoSeleccionado.turno}`
                  : ""}
                {alumnoSeleccionado.dni
                  ? ` · DNI ${alumnoSeleccionado.dni}`
                  : ""}
              </p>
            </div>

            <button
              type="button"
              onClick={quitarSeleccion}
              style={{
                padding: "8px 12px",
                border: "1px solid #bfd4df",
                borderRadius: "8px",
                background: "#ffffff",
                color: "#315f6f",
                cursor: "pointer",
                fontWeight: "700",
              }}
            >
              Cambiar estudiante
            </button>
          </div>

          <div
            style={{
              marginTop: "20px",
              padding: "18px",
              border: "1px solid #c5d9ea",
              borderRadius: "13px",
              background: "#ffffff",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                flexWrap: "wrap",
                gap: "12px",
                marginBottom: "16px",
              }}
            >
              <div>
                <h4
                  style={{
                    margin: "0 0 5px",
                    color: "#23436d",
                    fontSize: "18px",
                  }}
                >
                  📚 Asignaturas para fortalecer
                </h4>

                <p
                  style={{
                    margin: 0,
                    color: "#607080",
                    lineHeight: 1.4,
                  }}
                >
                  Seleccioná solamente las asignaturas que formarán parte de
                  este período de FOTIA.
                </p>
              </div>

              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: "8px",
                }}
              >
                <button
                  type="button"
                  onClick={seleccionarTodasLasMaterias}
                  style={{
                    padding: "8px 12px",
                    border: "1px solid #b7ddd3",
                    borderRadius: "8px",
                    background: "#eef8f5",
                    color: "#256b61",
                    cursor: "pointer",
                    fontWeight: "700",
                  }}
                >
                  Seleccionar todas
                </button>

                <button
                  type="button"
                  onClick={limpiarMateriasSeleccionadas}
                  style={{
                    padding: "8px 12px",
                    border: "1px solid #d4dce4",
                    borderRadius: "8px",
                    background: "#f6f8fa",
                    color: "#56697a",
                    cursor: "pointer",
                    fontWeight: "700",
                  }}
                >
                  Limpiar selección
                </button>
              </div>
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns:
                  "repeat(auto-fit, minmax(min(100%, 230px), 1fr))",
                gap: "12px",
              }}
            >
              {alumnoSeleccionado.materiasPendientes.map((materia) => {
                const materiaId = obtenerIdMateria(materia);

                const seleccionada = materiasSeleccionadas.includes(materiaId);

                return (
                  <label
                    key={materiaId}
                    style={{
                      display: "flex",
                      alignItems: "flex-start",
                      gap: "11px",
                      padding: "14px",
                      border: seleccionada
                        ? "2px solid #74b9aa"
                        : "2px solid #d7e3ed",
                      borderRadius: "11px",
                      background: seleccionada ? "#eef8f5" : "#ffffff",
                      cursor: "pointer",
                      transition: "all 0.15s ease",
                    }}
                  >
                    <input
                      type="checkbox"
                      checked={seleccionada}
                      onChange={() => cambiarSeleccionMateria(materia)}
                      style={{
                        marginTop: "3px",
                        width: "18px",
                        height: "18px",
                        cursor: "pointer",
                      }}
                    />

                    <span>
                      <strong
                        style={{
                          display: "block",
                          color: "#23436d",
                          fontSize: "16px",
                        }}
                      >
                        {materia.asignatura}
                      </strong>

                      <span
                        style={{
                          display: "block",
                          marginTop: "4px",
                          color: "#68798a",
                          fontSize: "14px",
                        }}
                      >
                        {materia.anio
                          ? `${materia.anio} año`
                          : "Año sin informar"}
                      </span>
                    </span>
                  </label>
                );
              })}
            </div>

            <div
              style={{
                marginTop: "16px",
                padding: "11px 14px",
                borderRadius: "9px",
                background:
                  materiasSeleccionadas.length > 0 ? "#eef8f5" : "#fff8e8",
                color: materiasSeleccionadas.length > 0 ? "#256b61" : "#8a5a16",
                textAlign: "center",
                fontWeight: "700",
              }}
            >
              {materiasSeleccionadas.length === 0
                ? "Todavía no seleccionaste ninguna asignatura." 
                : `${materiasSeleccionadas.length} ${
                    materiasSeleccionadas.length === 1
                      ? "asignatura seleccionada"
                      : "asignaturas seleccionadas"
                  } para el fortalecimiento.`}
            </div>
          </div>
          <div
            style={{
              marginTop: "20px",
              padding: "18px",
              border: "1px solid #c5d9ea",
              borderRadius: "13px",
              background: "#ffffff",
            }}
          >
            <div
              style={{
                marginBottom: "18px",
              }}
            >
              <h4
                style={{
                  margin: "0 0 5px",
                  color: "#23436d",
                  fontSize: "18px",
                }}
              >
                📝 Datos de la incorporación
              </h4>

              <p
                style={{
                  margin: 0,
                  color: "#607080",
                  lineHeight: 1.4,
                }}
              >
                Registrá el motivo, la fecha y el docente responsable del
                fortalecimiento.
              </p>
              {errorGuardado && (
                <p
                  style={{
                    margin: "16px 0 0",
                    padding: "12px 14px",
                    borderRadius: "10px",
                    background: "#fff1f1",
                    color: "#9b3d3d",
                    textAlign: "center",
                    fontWeight: "600",
                  }}
                >
                  {errorGuardado}
                </p>
              )}

            </div>

            <div
              style={{ 
                display: "grid",
                gridTemplateColumns:
                  "repeat(auto-fit, minmax(min(100%, 230px), 1fr))",
                gap: "16px",
              }}
            >
              <label
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "7px",
                }}
              >
                <span style={estiloEtiqueta}>Fecha de incorporación *</span>

                <input
                  type="date"
                  value={fechaIncorporacion}
                  onChange={(evento) =>
                    setFechaIncorporacion(evento.target.value)
                  }
                  style={estiloControl}
                />
              </label>

              <label
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "7px",
                }}
              >
                <span style={estiloEtiqueta}>Docente responsable</span>

                <select
                  value={docenteId}
                  onChange={(evento) => setDocenteId(evento.target.value)}
                  style={estiloControl}
                >
                  <option value="">Sin docente asignado</option>

                  {docentesFotia
                    .filter((docente) => docente.activo !== false)
                    .map((docente) => (
                      <option key={docente._id} value={docente._id}>
                        {docente.apellido} {docente.nombre}
                      </option>
                    ))}
                </select>
              </label>

              <label
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "7px",
                  gridColumn: "1 / -1",
                }}
              >
                <span style={estiloEtiqueta}>Motivo de incorporación *</span>

                <select
                  value={motivoIncorporacion}
                  onChange={(evento) => {
                    setMotivoIncorporacion(evento.target.value);

                    if (evento.target.value !== "Otro") {
                      setOtroMotivoIncorporacion("");
                    }
                  }}
                  style={estiloControl}
                >
                  <option value="">Seleccionar motivo</option>

                  <option value="Derivación del equipo docente">
                    Derivación del equipo docente
                  </option>

                  <option value="Trayectoria educativa discontinua">
                    Trayectoria educativa discontinua
                  </option>

                  <option value="Necesita fortalecer contenidos">
                    Necesita fortalecer contenidos
                  </option>

                  <option value="Solicitud del Equipo de Orientación">
                    Solicitud del Equipo de Orientación
                  </option>

                  <option value="Solicitud del estudiante o la familia">
                    Solicitud del estudiante o la familia
                  </option>

                  <option value="Disponibilidad de recursos humanos">
                    Disponibilidad de recursos humanos
                  </option>

                  <option value="Otro">Otro</option>
                </select>
              </label>

              {motivoIncorporacion === "Otro" && (
                <label
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "7px",
                    gridColumn: "1 / -1",
                  }}
                >
                  <span style={estiloEtiqueta}>Especificar otro motivo *</span>

                  <input
                    type="text"
                    value={otroMotivoIncorporacion}
                    onChange={(evento) =>
                      setOtroMotivoIncorporacion(evento.target.value)
                    }
                    placeholder="Escribí el motivo de incorporación"
                    style={estiloControl}
                  />
                </label>
              )}

              <label
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "7px",
                  gridColumn: "1 / -1",
                }}
              >
                <span style={estiloEtiqueta}>Observaciones</span>

                <textarea
                  value={observaciones}
                  onChange={(evento) => setObservaciones(evento.target.value)}
                  rows={3}
                  placeholder="Información adicional sobre la incorporación."
                  style={{
                    ...estiloControl,
                    minHeight: "90px",
                    resize: "vertical",
                  }}
                />
              </label>
            </div>

            {docentesFotia.length === 0 && (
              <>
                <p
                  style={{
                    margin: "14px 0 0",
                    padding: "11px 13px",
                    borderRadius: "9px",
                    background: "#fff8e8",
                    color: "#8a5a16",
                    textAlign: "center",
                    fontSize: "14px",
                  }}
                >
                  Todavía no hay docentes registrados en FOTIA. Podrás incorporar
                  al estudiante y asignar el docente posteriormente.
                </p>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    marginTop: "24px",
                    paddingTop: "16px",
                    borderTop: "1px solid #d8e6ee",
                  }}
                >
                  <button
                    type="button"
                    onClick={incorporarAFotia}
                    disabled={
                      guardando ||
                      materiasSeleccionadas.length === 0
                    }
                    style={{
                      padding: "12px 24px",
                      border: "none",
                      borderRadius: "10px",
                      background:
                        materiasSeleccionadas.length === 0
                          ? "#b7c3cc"
                          : "#148c84",
                      color: "#ffffff",
                      fontSize: "15px",
                      fontWeight: "700",
                      cursor:
                        guardando ||
                        materiasSeleccionadas.length === 0
                          ? "not-allowed"
                          : "pointer",
                      opacity: guardando ? 0.72 : 1,
                      boxShadow:
                        materiasSeleccionadas.length === 0
                          ? "none"
                          : "0 4px 10px rgba(20, 140, 132, 0.20)",
                    }}
                  >
                    {guardando
                      ? "Guardando incorporación..."
                      : "💾 Incorporar a FOTIA"}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

const estiloEtiqueta = {
  color: "#365b7d",
  fontWeight: "700",
  fontSize: "14px",
};

const estiloControl = {
  width: "100%",
  boxSizing: "border-box",
  padding: "11px 12px",
  border: "1px solid #bfd4df",
  borderRadius: "9px",
  background: "#ffffff",
  color: "#31465a",
  fontSize: "15px",
  outline: "none",
};
