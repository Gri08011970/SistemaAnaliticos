import { useState } from "react";

const MOTIVOS_INCORPORACION = [
  "Derivación del equipo docente",
  "Trayectoria educativa discontinua",
  "Necesita fortalecer contenidos",
  "Solicitud del Equipo de Orientación",
  "Solicitud del estudiante o la familia",
  "Disponibilidad de recursos humanos",
  "Otro",
];

const obtenerDocenteIdInicial = (inscripcion) =>
  String(inscripcion?.docenteId?._id || inscripcion?.docenteId || "");

const esMotivoPredefinido = (motivo = "") =>
  MOTIVOS_INCORPORACION.filter((opcion) => opcion !== "Otro").includes(motivo);

export default function FormularioEditarInscripcionFotia({
  inscripcion,
  docentesFotia = [],
  onCancelar,
  onGuardado,
}) {
  const esForteAutomatico = inscripcion?.origenAutomaticoForte === true;

  const tieneIntervencionGuardada =
    Boolean(inscripcion?._id) && !String(inscripcion._id).startsWith("forte-");
  const motivoActual = inscripcion?.motivoIncorporacion || "";

  const motivoInicial = esMotivoPredefinido(motivoActual)
    ? motivoActual
    : motivoActual
      ? "Otro"
      : "";

  const [asignatura, setAsignatura] = useState(inscripcion?.asignatura || "");

  const [anio, setAnio] = useState(String(inscripcion?.anio || ""));

  const [fechaIncorporacion, setFechaIncorporacion] = useState(
    inscripcion?.fechaIncorporacion
      ? String(inscripcion.fechaIncorporacion).slice(0, 10)
      : "",
  );

  const [docenteId, setDocenteId] = useState(
    obtenerDocenteIdInicial(inscripcion),
  );

  const [estado, setEstado] = useState(
    inscripcion?.estado === "En proceso" ? "En proceso" : "Incorporada",
  );

  const [motivoIncorporacion, setMotivoIncorporacion] = useState(motivoInicial);

  const [otroMotivoIncorporacion, setOtroMotivoIncorporacion] = useState(
    motivoInicial === "Otro" ? motivoActual : "",
  );

  const [observaciones, setObservaciones] = useState(
    inscripcion?.observaciones || "",
  );

  const [guardando, setGuardando] = useState(false);
  const [errorGuardado, setErrorGuardado] = useState("");

  const guardarCambios = async (evento) => {
    evento.preventDefault();

    try {
      setErrorGuardado("");

      const asignaturaLimpia = asignatura.trim();

      if (!asignaturaLimpia) {
        throw new Error("La asignatura es obligatoria.");
      }

      if (!fechaIncorporacion) {
        throw new Error("La fecha de incorporación es obligatoria.");
      }

      const anioFinal = esForteAutomatico
        ? String(inscripcion?.anio || "").trim()
        : anio.trim();

      if (!esForteAutomatico && !anioFinal) {
        throw new Error("El año de la asignatura es obligatorio.");
      }

      const motivoFinal = esForteAutomatico
        ? "Asignatura previa - FORTE"
        : motivoIncorporacion === "Otro"
          ? otroMotivoIncorporacion.trim()
          : motivoIncorporacion.trim();

      if (!esForteAutomatico && !motivoFinal) {
        throw new Error("Seleccioná o escribí el motivo de incorporación.");
      }

      setGuardando(true);

      let respuesta;

      if (esForteAutomatico && !tieneIntervencionGuardada) {
        respuesta = await fetch("/api/fotia/inscripciones", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("tokenUsuario")}`,
          },
          body: JSON.stringify({
            periodoId: inscripcion.periodoId,
            alumnoId: inscripcion.alumnoId?._id || inscripcion.alumnoId,
            tipoOrigen: "Previa",
            materiaPendienteId: inscripcion.materiaPendienteId,
            asignatura: asignaturaLimpia,
            anio: anioFinal,
            docenteId: docenteId || null,
            fechaIncorporacion,
            estado,
            motivoIncorporacion: motivoFinal,
            observaciones: observaciones.trim(),
          }),
        });
      } else {
        if (!inscripcion?._id) {
          throw new Error("La inscripción no tiene un identificador válido.");
        }

        respuesta = await fetch(`/api/fotia/inscripciones/${inscripcion._id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("tokenUsuario")}`,
          },
          body: JSON.stringify({
            asignatura: asignaturaLimpia,
            anio: anioFinal,
            tipoOrigen: inscripcion.tipoOrigen,
            fechaIncorporacion,
            docenteId: docenteId || null,
            estado,
            motivoIncorporacion: motivoFinal,
            observaciones: observaciones.trim(),
          }),
        });
      }

      const datos = await respuesta.json();

      if (!respuesta.ok) {
        throw new Error(
          datos.mensaje || datos.error || "No se pudo guardar la intervención.",
        );
      }

      const inscripcionActualizada = datos.inscripcion || datos;

      onGuardado?.(inscripcionActualizada);
    } catch (error) {
      console.error("Error al guardar la intervención FOTIA-FORTE:", error);

      setErrorGuardado(error.message || "No se pudieron guardar los cambios.");
    } finally {
      setGuardando(false);
    }
  };

  return (
    <form
      onSubmit={guardarCambios}
      style={{
        marginTop: "16px",
        padding: "18px",
        border: "2px solid #b9d4ea",
        borderRadius: "13px",
        background: "#f7fbfe",
        boxShadow: "0 4px 12px rgba(41, 78, 112, 0.07)",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          flexWrap: "wrap",
          gap: "12px",
          marginBottom: "18px",
        }}
      >
        <div>
          <span
            style={{
              display: "block",
              marginBottom: "4px",
              color: "#6b7f92",
              fontSize: "11px",
              fontWeight: "700",
              letterSpacing: "0.06em",
              textTransform: "uppercase",
            }}
          >
            {esForteAutomatico && !tieneIntervencionGuardada
              ? "Iniciando intervención FORTE"
              : "Editando área de fortalecimiento"}
          </span>

          <h6
            style={{
              margin: 0,
              color: "#23436d",
              fontSize: "18px",
            }}
          >
            ✏️ {inscripcion?.asignatura}
          </h6>
        </div>

        <button
          type="button"
          onClick={onCancelar}
          disabled={guardando}
          style={{
            padding: "7px 11px",
            border: "1px solid #c7d7e3",
            borderRadius: "8px",
            background: "#ffffff",
            color: "#52697d",
            fontWeight: "700",
            cursor: guardando ? "not-allowed" : "pointer",
          }}
        >
          ✕ Cancelar
        </button>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns:
            "repeat(auto-fit, minmax(min(100%, 220px), 1fr))",
          gap: "15px",
        }}
      >
        {!esForteAutomatico && (
          <label style={estiloLabel}>
            <span style={estiloEtiqueta}>Asignatura *</span>

            <input
              type="text"
              value={asignatura}
              onChange={(evento) => setAsignatura(evento.target.value)}
              disabled={guardando}
              placeholder="Ej.: Prácticas del Lenguaje"
              style={estiloControl}
            />
          </label>
        )}

        {!esForteAutomatico && (
          <label style={estiloLabel}>
            <span style={estiloEtiqueta}>Año de la asignatura *</span>

            <select
              value={anio}
              onChange={(evento) => setAnio(evento.target.value)}
              disabled={guardando}
              style={estiloControl}
            >
              <option value="">Seleccionar año</option>
              <option value="1">1.º año</option>
              <option value="2">2.º año</option>
              <option value="3">3.º año</option>
              <option value="4">4.º año</option>
              <option value="5">5.º año</option>
              <option value="6">6.º año</option>
            </select>
          </label>
        )}

        <label style={estiloLabel}>
          <span style={estiloEtiqueta}>Origen</span>

          <input
            type="text"
            value={
              inscripcion?.tipoOrigen === "Previa"
                ? "Asignatura previa"
                : "Asignatura del año en curso"
            }
            readOnly
            style={{
              ...estiloControl,
              background: "#eef2f5",
              color: "#67798a",
              cursor: "not-allowed",
            }}
          />
        </label>

        <label style={estiloLabel}>
          <span style={estiloEtiqueta}>Fecha de incorporación *</span>

          <input
            type="date"
            value={fechaIncorporacion}
            onChange={(evento) => setFechaIncorporacion(evento.target.value)}
            disabled={guardando}
            style={estiloControl}
          />
        </label>

        <label style={estiloLabel}>
          <span style={estiloEtiqueta}>Estado de la intervención</span>

          <select
            value={estado}
            onChange={(evento) => setEstado(evento.target.value)}
            disabled={guardando}
            style={estiloControl}
          >
            <option value="Incorporada">Incorporada</option>

            <option value="En proceso">En proceso</option>
          </select>
        </label>

        <label style={estiloLabel}>
          <span style={estiloEtiqueta}>Docente responsable</span>

          <select
            value={docenteId}
            onChange={(evento) => setDocenteId(evento.target.value)}
            disabled={guardando}
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
        {!esForteAutomatico && (
          <label
            style={{
              ...estiloLabel,
              gridColumn: "1 / -1",
            }}
          >
            <span style={estiloEtiqueta}>Motivo de incorporación *</span>

            <select
              value={motivoIncorporacion}
              onChange={(evento) => {
                const nuevoMotivo = evento.target.value;

                setMotivoIncorporacion(nuevoMotivo);

                if (nuevoMotivo !== "Otro") {
                  setOtroMotivoIncorporacion("");
                }
              }}
              disabled={guardando}
              style={estiloControl}
            >
              <option value="">Seleccionar motivo</option>

              {MOTIVOS_INCORPORACION.map((motivo) => (
                <option key={motivo} value={motivo}>
                  {motivo}
                </option>
              ))}
            </select>
          </label>
        )}

        {!esForteAutomatico && motivoIncorporacion === "Otro" && (
          <label
            style={{
              ...estiloLabel,
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
              disabled={guardando}
              placeholder="Escribí el motivo"
              style={estiloControl}
            />
          </label>
        )}

        <label
          style={{
            ...estiloLabel,
            gridColumn: "1 / -1",
          }}
        >
          <span style={estiloEtiqueta}>Observaciones</span>

          <textarea
            value={observaciones}
            onChange={(evento) => setObservaciones(evento.target.value)}
            disabled={guardando}
            rows={3}
            placeholder="Información adicional sobre la intervención."
            style={{
              ...estiloControl,
              minHeight: "88px",
              resize: "vertical",
            }}
          />
        </label>
      </div>

      <p
        style={{
          margin: "14px 0 0",
          padding: "10px 12px",
          borderRadius: "9px",
          background: "#fff8e8",
          color: "#805c1c",
          fontSize: "12px",
          lineHeight: 1.45,
        }}
      >
        El origen no se modifica desde esta pantalla. Para cambiar una
        asignatura de “Previa” a “En curso”, o al revés, retirala de FOTIA y
        volvé a incorporarla correctamente.
      </p>

      {errorGuardado && (
        <p
          style={{
            margin: "15px 0 0",
            padding: "11px 13px",
            borderRadius: "9px",
            background: "#fff1f1",
            color: "#9b3d3d",
            fontWeight: "600",
            textAlign: "center",
          }}
        >
          {errorGuardado}
        </p>
      )}

      <div
        style={{
          display: "flex",
          justifyContent: "flex-end",
          flexWrap: "wrap",
          gap: "9px",
          marginTop: "17px",
          paddingTop: "14px",
          borderTop: "1px solid #d7e4ed",
        }}
      >
        <button
          type="button"
          onClick={onCancelar}
          disabled={guardando}
          style={{
            padding: "9px 14px",
            border: "1px solid #ccd7df",
            borderRadius: "8px",
            background: "#ffffff",
            color: "#56697a",
            fontWeight: "700",
            cursor: guardando ? "not-allowed" : "pointer",
          }}
        >
          Cancelar
        </button>

        <button
          type="submit"
          disabled={guardando}
          style={{
            padding: "9px 16px",
            border: "none",
            borderRadius: "8px",
            background: guardando ? "#8eb8b4" : "#148c84",
            color: "#ffffff",
            fontWeight: "700",
            cursor: guardando ? "not-allowed" : "pointer",
            boxShadow: "0 3px 8px rgba(20, 140, 132, 0.18)",
          }}
        >
          {guardando
            ? "Guardando..."
            : esForteAutomatico && !tieneIntervencionGuardada
              ? "💾 Iniciar intervención"
              : "💾 Guardar cambios"}
        </button>
      </div>
    </form>
  );
}

const estiloLabel = {
  display: "flex",
  flexDirection: "column",
  gap: "7px",
};

const estiloEtiqueta = {
  color: "#365b7d",
  fontSize: "12px",
  fontWeight: "700",
  letterSpacing: "0.04em",
  textTransform: "uppercase",
};

const estiloControl = {
  width: "100%",
  boxSizing: "border-box",
  padding: "10px 11px",
  border: "1px solid #bfd4df",
  borderRadius: "8px",
  background: "#ffffff",
  color: "#31465a",
  fontSize: "14px",
  outline: "none",
};
