import { useState } from "react";
import FormularioEditarInscripcionFotia from "./FormularioEditarInscripcionFotia";

const CONFIGURACION_ESTADOS = {
  Incorporada: {
    icono: "🟡",
    fondo: "#fff8e8",
    color: "#8a5a16",
    borde: "#e6cf9e",
  },

  "En proceso": {
    icono: "🔵",
    fondo: "#eef5fb",
    color: "#365f82",
    borde: "#c8dceb",
  },

  Acreditada: {
    icono: "✅",
    fondo: "#eef8f5",
    color: "#256b61",
    borde: "#b7ddd3",
  },

  Suspendida: {
    icono: "⏸️",
    fondo: "#f3f4f6",
    color: "#667085",
    borde: "#d5dae0",
  },

  "Finalizada sin acreditar": {
    icono: "🔴",
    fondo: "#fff1f1",
    color: "#9b3d3d",
    borde: "#e8bcbc",
  },
};

const formatearFecha = (fecha) => {
  if (!fecha) return "Sin informar";

  const partes = String(fecha).split("-");

  if (partes.length !== 3) {
    return fecha;
  }

  const [anio, mes, dia] = partes;

  return `${dia}/${mes}/${anio}`;
};

export default function TarjetaAsignaturaFotia({
  asignatura,
  docentesFotia = [],
  onRetirar,
  onActualizada,
}) {
  const configuracionEstado =
    CONFIGURACION_ESTADOS[asignatura.estado] ||
    CONFIGURACION_ESTADOS.Incorporada;

  const [modoEdicion, setModoEdicion] = useState(false);

  return (
    <article
      style={{
        padding: "16px",
        border: "1px solid #c9dceb",
        borderRadius: "13px",
        background: "#ffffff",
        boxShadow: "0 3px 9px rgba(41, 78, 112, 0.05)",
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
        <div
          style={{
            minWidth: 0,
            flex: "1 1 260px",
          }}
        >
          <span
            style={{
              display: "block",
              marginBottom: "5px",
              color: "#6b7f92",
              fontSize: "11px",
              fontWeight: "700",
              textTransform: "uppercase",
              letterSpacing: "0.06em",
            }}
          >
            Área de fortalecimiento
          </span>

          <h5
            style={{
              margin: "0 0 6px",
              color: "#23436d",
              fontSize: "20px",
              fontWeight: "700",
            }}
          >
            📚 {asignatura.asignatura}
          </h5>

          <p
            style={{
              margin: 0,
              color: "#68798a",
              fontSize: "14px",
            }}
          >
            {asignatura.anio ? `${asignatura.anio} año` : "Año sin informar"}
          </p>
        </div>

        <span
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "6px",
            padding: "7px 11px",
            border: `1px solid ${configuracionEstado.borde}`,
            borderRadius: "999px",
            background: configuracionEstado.fondo,
            color: configuracionEstado.color,
            fontSize: "13px",
            fontWeight: "700",
            whiteSpace: "nowrap",
            alignSelf: "flex-start",
            marginTop: "0",
          }}
        >
          <span>{configuracionEstado.icono}</span>
          <span>{asignatura.estado || "Incorporada"}</span>
        </span>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns:
            "repeat(auto-fit, minmax(min(100%, 190px), 1fr))",
          gap: "12px",
          marginTop: "16px",
        }}
      >
        <Dato
          etiqueta="Fecha de incorporación"
          valor={formatearFecha(asignatura.fechaIncorporacion)}
        />

        <Dato
          etiqueta="Docente responsable"
          valor={asignatura.docenteNombre || "Sin docente asignado"}
        />

        <Dato
          etiqueta="Motivo de incorporación"
          valor={asignatura.motivoIncorporacion || "Sin informar"}
          ocuparTodo
        />

        {asignatura.observaciones && (
          <Dato
            etiqueta="Observaciones"
            valor={asignatura.observaciones}
            ocuparTodo
          />
        )}

        {asignatura.estado === "Acreditada" && (
          <Dato
            etiqueta="Fecha de acreditación"
            valor={formatearFecha(asignatura.fechaAcreditacion)}
          />
        )}
      </div>

      <div
        style={{
          display: "flex",
          justifyContent: "flex-end",
          flexWrap: "wrap",
          gap: "9px",
          marginTop: "16px",
          paddingTop: "14px",
          borderTop: "1px solid #e0e9f0",
        }}
      >
        <button
          type="button"
          onClick={() => setModoEdicion(true)}
          style={{
            padding: "8px 12px",
            border: "1px solid #f1c3b8",
            borderRadius: "8px",
            background: "#fff6f4",
            color: "#d26b56",
            fontWeight: "700",
            cursor: "pointer",
          }}
        >
          ✏️ Editar
        </button>

        <button
          type="button"
          onClick={() => {
            console.log("Clic en Retirar:", asignatura, onRetirar);

            onRetirar?.(asignatura);
          }}
          style={{
            padding: "8px 12px",
            border: "1px solid #e6cf9e",
            borderRadius: "8px",
            background: "#fff8e8",
            color: "#9a712a",
            fontWeight: "700",
            cursor: "pointer",
          }}
        >
          ⏸️ Retirar de FOTIA
        </button>
        <button
          type="button"
          disabled
          title="Disponible en la próxima etapa"
          style={{
            padding: "8px 12px",
            border: "1px solid #b7ddd3",
            borderRadius: "8px",
            background: "#eef8f5",
            color: "#4a8178",
            fontWeight: "700",
            cursor: "not-allowed",
            opacity: 0.72,
          }}
        >
          ✅ Acreditar
        </button>
      </div>

      {modoEdicion && (
        <FormularioEditarInscripcionFotia
          inscripcion={asignatura}
          docentesFotia={docentesFotia}
          onCancelar={() => setModoEdicion(false)}
          onGuardado={(inscripcionActualizada) => {
            onActualizada?.(inscripcionActualizada);
            setModoEdicion(false);
          }}
        />
      )}
    </article>
  );
}

function Dato({ etiqueta, valor, ocuparTodo = false }) {
  return (
    <div
      style={{
        padding: "8px 11px",
        border: "1px solid #dde7ee",
        borderRadius: "9px",
        background: "#f9fbfc",
        gridColumn: ocuparTodo ? "1 / -1" : "auto",
      }}
    >
      <span
        style={{
          display: "block",
          marginBottom: "5px",
          color: "#718193",
          fontSize: "10px",
          fontWeight: "700",
          textTransform: "uppercase",
          letterSpacing: "0.05em",
        }}
      >
        {etiqueta}
      </span>

      <span
        style={{
          display: "block",
          color: "#31465a",
          fontSize: "13px",
          fontWeight: "600",
          lineHeight: 1.45,
          whiteSpace: "pre-wrap",
          overflowWrap: "anywhere",
        }}
      >
        {valor}
      </span>
    </div>
  );
}
