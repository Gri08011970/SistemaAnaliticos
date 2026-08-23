import { useState } from "react";

const obtenerFechaHoy = () => {
  const hoy = new Date();
  const diferenciaZona = hoy.getTimezoneOffset() * 60000;

  return new Date(hoy.getTime() - diferenciaZona).toISOString().slice(0, 10);
};

export default function FormularioAcreditacionFotia({
  inscripcion,
  docentesFotia = [],
  onCancelar,
  onAcreditada,
}) {
  const [fechaAcreditacion, setFechaAcreditacion] = useState(obtenerFechaHoy());

  const [docenteId, setDocenteId] = useState(
    String(inscripcion.docenteId?._id || inscripcion.docenteId || ""),
  );

  const [observaciones, setObservaciones] = useState(
    inscripcion.observaciones || "",
  );

  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState("");

  const docentesActivos = docentesFotia.filter(
    (docente) => docente.activo !== false,
  );

  const confirmarAcreditacion = async (evento) => {
    evento.preventDefault();

    try {
      setError("");

      if (!fechaAcreditacion) {
        throw new Error("La fecha de acreditación es obligatoria.");
      }

      if (!docenteId) {
        throw new Error("Seleccioná el docente responsable.");
      }

      const confirmar = window.confirm(
        `¿Confirmar la acreditación de "${inscripcion.asignatura}"?\n\n` +
          "Esta acción registrará la acreditación en el historial institucional de FOTIA.\n\n" +
          "Luego podrá consultarse e imprimirse, pero ya no podrá modificarse desde la edición habitual.",
      );

      if (!confirmar) return;

      setGuardando(true);

      const respuesta = await fetch(
        `/api/fotia/inscripciones/${inscripcion._id}/acreditar`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("tokenUsuario")}`,
          },
          body: JSON.stringify({
            fechaAcreditacion,
            docenteId,
            observaciones: observaciones.trim(),
          }),
        },
      );

      const datos = await respuesta.json();

      if (!respuesta.ok) {
        throw new Error(
          datos.mensaje || "No se pudo confirmar la acreditación.",
        );
      }

      onAcreditada?.(datos.inscripcion);
    } catch (errorAcreditacion) {
      console.error("Error al acreditar la asignatura:", errorAcreditacion);

      setError(
        errorAcreditacion.message || "No se pudo confirmar la acreditación.",
      );
    } finally {
      setGuardando(false);
    }
  };

  return (
    <form
      onSubmit={confirmarAcreditacion}
      style={{
        marginTop: "16px",
        padding: "18px",
        border: "2px solid #b7ddd3",
        borderRadius: "12px",
        background: "#f5fbf9",
      }}
    >
      <div
        style={{
          marginBottom: "16px",
          textAlign: "center",
        }}
      >
        <h6
          style={{
            margin: "0 0 6px",
            color: "#256b61",
            fontSize: "18px",
          }}
        >
          ✅ Confirmar acreditación
        </h6>

        <p
          style={{
            margin: 0,
            color: "#607080",
            fontSize: "14px",
            fontWeight: "700",
          }}
        >
          {inscripcion.asignatura}
          {inscripcion.anio ? ` · ${inscripcion.anio} año` : ""}
        </p>

        <p
          style={{
            margin: "10px 0 0",
            color: "#6b7f92",
            fontSize: "13px",
            lineHeight: 1.5,
          }}
        >
          Una vez confirmada, la acreditación pasará a formar parte del
          historial institucional de FOTIA.
        </p>
      </div>
      <div
        style={{
          display: "grid",
          gridTemplateColumns:
            "repeat(auto-fit, minmax(min(100%, 210px), 1fr))",
          gap: "14px",
        }}
      >
        <label
          style={{
            display: "grid",
            gap: "6px",
            color: "#31465a",
            fontWeight: "700",
            fontSize: "13px",
          }}
        >
          Fecha de acreditación
          <input
            type="date"
            value={fechaAcreditacion}
            onChange={(evento) => setFechaAcreditacion(evento.target.value)}
            disabled={guardando}
            required
            style={{
              padding: "10px",
              border: "1px solid #bfd3df",
              borderRadius: "8px",
              background: "#ffffff",
              color: "#31465a",
              fontSize: "14px",
            }}
          />
        </label>

        <label
          style={{
            display: "grid",
            gap: "6px",
            color: "#31465a",
            fontWeight: "700",
            fontSize: "13px",
          }}
        >
          Docente responsable
          <select
            value={docenteId}
            onChange={(evento) => setDocenteId(evento.target.value)}
            disabled={guardando}
            required
            style={{
              padding: "10px",
              border: "1px solid #bfd3df",
              borderRadius: "8px",
              background: "#ffffff",
              color: "#31465a",
              fontSize: "14px",
            }}
          >
            <option value="">Seleccionar docente</option>

            {docentesActivos.map((docente) => (
              <option key={docente._id} value={docente._id}>
                {`${docente.apellido || ""} ${docente.nombre || ""}`.trim()}
              </option>
            ))}
          </select>
        </label>

        <label
          style={{
            display: "grid",
            gap: "6px",
            gridColumn: "1 / -1",
            color: "#31465a",
            fontWeight: "700",
            fontSize: "13px",
          }}
        >
          Observaciones institucionales
          <textarea
            value={observaciones}
            onChange={(evento) => setObservaciones(evento.target.value)}
            disabled={guardando}
            rows={3}
            placeholder="Agregar una observación institucional (opcional)"
            style={{
              padding: "10px",
              border: "1px solid #bfd3df",
              borderRadius: "8px",
              background: "#ffffff",
              color: "#31465a",
              fontSize: "14px",
              fontFamily: "inherit",
              resize: "vertical",
            }}
          />
        </label>
      </div>

      {error && (
        <div
          style={{
            marginTop: "14px",
            padding: "10px 12px",
            border: "1px solid #efb4b4",
            borderRadius: "8px",
            background: "#fff1f1",
            color: "#9b3d3d",
            fontWeight: "600",
          }}
        >
          {error}
        </div>
      )}

      <div
        style={{
          display: "flex",
          justifyContent: "flex-end",
          flexWrap: "wrap",
          gap: "10px",
          marginTop: "16px",
        }}
      >
        <button
          type="button"
          onClick={onCancelar}
          disabled={guardando}
          style={{
            padding: "9px 14px",
            border: "1px solid #d8e0e7",
            borderRadius: "8px",
            background: "#f6f8fa",
            color: "#708090",
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
            padding: "9px 15px",
            minWidth: "235px",
            border: "1px solid #70b7a8",
            borderRadius: "8px",
            background: "#148c84",
            color: "#ffffff",
            fontWeight: "700",
            cursor: guardando ? "not-allowed" : "pointer",
            opacity: guardando ? 0.7 : 1,
          }}
        >
          {guardando
            ? "Guardando acreditación..."
            : "✅ Confirmar acreditación"}
        </button>
      </div>
    </form>
  );
}
