import DiagnosticoCurso from "./DiagnosticoCurso";
import AnalisisAutomatico from "./AnalisisAutomatico";
import TarjetasEstadisticas from "./TarjetasEstadisticas";
import ResumenAsignaturas from "./ResumenAsignaturas";
import ResumenEstudiantes from "./ResumenEstudiantes";
import EvolucionCurso from "./EvolucionCurso";

export default function PanelAnalisisCurso({
  estadisticas,
  fechaAnalisis,
  alumnosCurso,
  asignaturasResumen,
  periodoSeleccionado,
  observacionesSistema,
  estadisticasPorAsignatura,
  obtenerDato,
  seguimiento,
  onVolver,
}) {
  return (
    <div
      style={{
        margin: "24px auto",
        padding: "20px",
        maxWidth: "1120px",
        border: "1px solid #cfe3ea",
        borderRadius: "16px",
        background: "#ffffff",
        boxShadow: "0 4px 14px rgba(0,0,0,0.08)",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: "12px",
          marginBottom: "18px",
          flexWrap: "wrap",
        }}
      >
        <button
          type="button"
          onClick={onVolver}
          style={{
            padding: "9px 14px",
            borderRadius: "10px",
            border: "1px solid #c8d5e5",
            background: "#f8f9fc",
            fontWeight: "600",
            cursor: "pointer",
          }}
        >
          ← Volver al resumen
        </button>

        <h3
          style={{
            margin: 0,
            color: "#43506f",
          }}
        >
          📊 Panel de análisis del curso
        </h3>

        <div style={{ width: "145px" }} />
      </div>

      <p
        style={{
          marginTop: 0,
          marginBottom: "18px",
          textAlign: "center",
          color: "#667085",
          fontSize: "14px",
        }}
      >
        Curso: <strong>{alumnosCurso[0]?.curso || "—"}</strong>
        {" · "}
        Período: <strong>{periodoSeleccionado}</strong>
      </p>

      <DiagnosticoCurso
        indice={estadisticas.indice}
        estadoCurso={estadisticas.estadoCurso}
      />

      <AnalisisAutomatico
        fechaAnalisis={fechaAnalisis}
        alumnosCurso={alumnosCurso}
        asignaturasResumen={asignaturasResumen}
        periodoSeleccionado={periodoSeleccionado}
        observacionesSistema={observacionesSistema}
      />

      <TarjetasEstadisticas estadisticas={estadisticas} />

      <ResumenAsignaturas
        estadisticasPorAsignatura={estadisticasPorAsignatura}
      />
      <EvolucionCurso
        curso={alumnosCurso[0]?.curso || ""}
        alumnosCurso={alumnosCurso}
        asignaturasResumen={asignaturasResumen}
        seguimiento={seguimiento}
      />

      <ResumenEstudiantes
        alumnosCurso={alumnosCurso}
        asignaturasResumen={asignaturasResumen}
        obtenerDato={obtenerDato}
      />
    </div>
  );
}
