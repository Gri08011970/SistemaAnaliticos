import { useState } from "react";
import TarjetaAsignaturaFotia from "./TarjetaAsignaturaFotia";

export default function TarjetaEstudianteFotia({
  estudiante,
  docentesFotia = [],
  esAdmin = false,
  onRetirar,
  onActualizada,
  onEliminarEstudiante,
}) {
  const [expandida, setExpandida] = useState(false);

  const asignaturas = estudiante?.asignaturas || [];

  const cantidadAsignaturas = asignaturas.length;

  const cantidadIncorporadas = asignaturas.filter(
    (asignatura) => asignatura.estado === "Incorporada",
  ).length;

  const cantidadEnProceso = asignaturas.filter(
    (asignatura) => asignatura.estado === "En proceso",
  ).length;

  const cantidadAcreditadas = asignaturas.filter(
    (asignatura) => asignatura.estado === "Acreditada",
  ).length;

  return (
    <article
      style={{
        border: "2px solid #b9d4ea",
        borderLeft: "8px solid #1f5d99",
        borderRadius: "15px",
        background: "#ffffff",
        boxShadow: "0 5px 14px rgba(41, 78, 112, 0.08)",
        overflow: "hidden",
      }}
    >
      <button
        type="button"
        onClick={() => setExpandida((valorActual) => !valorActual)}
        style={{
          width: "100%",
          padding: "18px 20px",
          border: "none",
          background: expandida ? "#f4f9fc" : "#ffffff",
          cursor: "pointer",
          textAlign: "left",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: "16px",
            flexWrap: "wrap",
          }}
        >
          <div
            style={{
              minWidth: 0,
              flex: "1 1 320px",
            }}
          >
            <span
              style={{
                display: "block",
                marginBottom: "5px",
                color: "#6b7f92",
                fontSize: "12px",
                fontWeight: "700",
                letterSpacing: "0.06em",
                textTransform: "uppercase",
              }}
            >
              Estudiante incorporado
            </span>

            <h4
              style={{
                margin: "0 0 7px",
                color: "#23436d",
                fontSize: "20px",
                fontWeight: "700",
                lineHeight: 1.25,
              }}
            >
              {[estudiante.apellido, estudiante.nombre]
                .filter(
                  (valor) =>
                    valor &&
                    valor.trim() &&
                    valor.trim().toLowerCase() !== "sin nombre",
                )
                .join(" ")}
            </h4>

            <div
              style={{
                display: "flex",
                alignItems: "center",
                flexWrap: "wrap",
                gap: "8px 16px",
                color: "#607080",
                fontSize: "14px",
                lineHeight: 1.4,
              }}
            >
              <span>🎓 {estudiante.curso || "Curso sin informar"}</span>

              <span>
                🕘{" "}
                {estudiante.turno
                  ? `Turno ${estudiante.turno}`
                  : "Turno sin informar"}
              </span>
            </div>
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "flex-end",
              flexWrap: "wrap",
              gap: "8px",
            }}
          >
            <Indicador
              texto={`${cantidadAsignaturas} ${
                cantidadAsignaturas === 1 ? "área" : "áreas"
              }`}
              icono="📚"
              fondo="#eef5fb"
              color="#365f82"
              borde="#c8dceb"
            />

            {cantidadIncorporadas > 0 && (
              <Indicador
                texto={`${cantidadIncorporadas} ${
                  cantidadIncorporadas === 1
                    ? "incorporada"
                    : "incorporadas"
                }`}
                icono="🟡"
                fondo="#fff8e8"
                color="#8a5a16"
                borde="#e6cf9e"
              />
            )}

            {cantidadEnProceso > 0 && (
              <Indicador
                texto={`${cantidadEnProceso} en proceso`}
                icono="🔵"
                fondo="#eef5fb"
                color="#365f82"
                borde="#c8dceb"
              />
            )}

            {cantidadAcreditadas > 0 && (
              <Indicador
                texto={`${cantidadAcreditadas} ${
                  cantidadAcreditadas === 1
                    ? "acreditada"
                    : "acreditadas"
                }`}
                icono="🟢"
                fondo="#eef8f5"
                color="#256b61"
                borde="#b7ddd3"
              />
            )}

            <span
              style={{
                minWidth: "118px",
                color: "#315f6f",
                fontSize: "14px",
                fontWeight: "700",
                textAlign: "right",
              }}
            >
              {expandida ? "▲ Ocultar áreas" : "▼ Ver áreas"}
            </span>
          </div>
        </div>
      </button>

      {esAdmin && (
        <div
          style={{
            padding: "0 18px 14px",
            display: "flex",
            justifyContent: "flex-end",
          }}
        >
          <button
            type="button"
            onClick={() => onEliminarEstudiante?.(estudiante)}
            style={{
              padding: "8px 13px",
              border: "1px solid #e1bcbc",
              borderRadius: "8px",
              background: "#fff1f1",
              color: "#a64949",
              fontWeight: "700",
              cursor: "pointer",
            }}
          >
            🗑️ Eliminar de FOTIA
          </button>
        </div>
      )}

      {expandida && (
        <div
          style={{
            padding: "0 18px 18px",
            background: "#ffffff",
          }}
        >
          <div
            style={{
              paddingTop: "16px",
              borderTop: "1px solid #d9e6ef",
              display: "grid",
              gap: "12px",
            }}
          >
            {asignaturas.map((asignatura) => (
              <TarjetaAsignaturaFotia
                key={asignatura._id || asignatura.materiaPendienteId}
                asignatura={asignatura}
                docentesFotia={docentesFotia}
                esAdmin={esAdmin}
                onRetirar={onRetirar}
                onActualizada={onActualizada}
              />
            ))}
          </div>
        </div>
      )}
    </article>
  );
}

function Indicador({ texto, icono, fondo, color, borde }) {
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "5px",
        padding: "5px 9px",
        border: `1px solid ${borde}`,
        borderRadius: "999px",
        background: fondo,
        color,
        fontSize: "12px",
        fontWeight: "700",
        whiteSpace: "nowrap",
      }}
    >
      {icono && (
        <span
          aria-hidden="true"
          style={{
            fontSize: "11px",
          }}
        >
          {icono}
        </span>
      )}

      <span>{texto}</span>
    </span>
  );
}