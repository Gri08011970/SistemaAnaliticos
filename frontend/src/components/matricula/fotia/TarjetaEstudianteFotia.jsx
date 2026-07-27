import { useState } from "react";
import TarjetaAsignaturaFotia from "./TarjetaAsignaturaFotia";

export default function TarjetaEstudianteFotia({ 
  estudiante, 
  onRetirar, 
}) {
  const [expandida, setExpandida] = useState(true);

  const cantidadAsignaturas = estudiante?.asignaturas?.length || 0;

  const cantidadAcreditadas =
    estudiante?.asignaturas?.filter(
      (asignatura) => asignatura.estado === "Acreditada",
    ).length || 0;

  const cantidadEnProceso =
    estudiante?.asignaturas?.filter(
      (asignatura) =>
        asignatura.estado === "En proceso" ||
        asignatura.estado === "Incorporada",
    ).length || 0;

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
                display: "grid",
                gap: "3px",
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
              fondo="#eef5fb"
              color="#365f82"
              borde="#c8dceb"
            />

            {cantidadEnProceso > 0 && (
              <Indicador
                texto={`${cantidadEnProceso} en proceso`}
                fondo="#fff8e8"
                color="#8a5a16"
                borde="#e6cf9e"
              />
            )}

            {cantidadAcreditadas > 0 && (
              <Indicador
                texto={`${cantidadAcreditadas} ${
                  cantidadAcreditadas === 1 ? "acreditada" : "acreditadas"
                }`}
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
            {estudiante.asignaturas.map((asignatura) => (
              <TarjetaAsignaturaFotia
                key={asignatura._id ||
                   asignatura.materiaPendienteId
                  }
                asignatura={asignatura}
                 onRetirar={onRetirar}
              />
            ))}
          </div>
        </div>
      )}
    </article>
  );
}

function Indicador({ texto, fondo, color, borde }) {
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
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
      {texto}
    </span>
  );
}
