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

      <AvancePedagogicoCurso
        estadisticas={estadisticas}
        curso={alumnosCurso[0]?.curso || "—"}
        periodoSeleccionado={periodoSeleccionado}
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

function AvancePedagogicoCurso({
  estadisticas,
  curso,
  periodoSeleccionado,
}) {
  const tea = Number(estadisticas?.tea || 0);
  const tep = Number(estadisticas?.tep || 0);
  const ted = Number(estadisticas?.ted || 0);
  const totalCargados =
    Number(estadisticas?.totalCargados) || tea + tep + ted;

  const puntosObtenidos = tea * 3 + tep * 2 + ted;
  const maximoPosible = totalCargados * 3;

  const porcentajeExacto =
    maximoPosible > 0
      ? (puntosObtenidos / maximoPosible) * 100
      : 0;

  const porcentajeRedondeado =
    Number.isFinite(Number(estadisticas?.indice))
      ? Number(estadisticas.indice)
      : Math.round(porcentajeExacto);

  const porcentajeVisible = porcentajeExacto.toLocaleString(
    "es-AR",
    {
      minimumFractionDigits: 1,
      maximumFractionDigits: 1,
    },
  );

  const estado =
    porcentajeRedondeado >= 70
      ? "🟢 Evolución favorable"
      : porcentajeRedondeado >= 40
        ? "🟡 Requiere seguimiento"
        : "🔴 Intervención pedagógica prioritaria";

  const colorPrincipal =
    porcentajeRedondeado >= 70
      ? "#3f9f68"
      : porcentajeRedondeado >= 40
        ? "#c08b20"
        : "#c44d56";

  const fondoPrincipal =
    porcentajeRedondeado >= 70
      ? "#eef9f2"
      : porcentajeRedondeado >= 40
        ? "#fff8e6"
        : "#fff0f1";

  const explicacion = obtenerExplicacionPedagogica({
    porcentaje: porcentajeRedondeado,
    tea,
    tep,
    ted,
    totalCargados,
  });

  const imprimirDiagnostico = () => {
    const contenido = document.getElementById(
      "avance-pedagogico-curso-imprimir",
    )?.outerHTML;

    if (!contenido) return;

    const ventana = window.open("", "_blank");

    if (!ventana) return;

    ventana.document.write(`
      <!DOCTYPE html>
      <html lang="es">
        <head>
          <meta charset="UTF-8" />
          <title>Porcentaje de avance pedagógico</title>

          <style>
            @page {
              size: A4 portrait;
              margin: 14mm;
            }

            * {
              box-sizing: border-box;
            }

            body {
              margin: 0;
              font-family: Arial, sans-serif;
              color: #243b53;
              background: #ffffff;
            }

            button {
              display: none !important;
            }
          </style>
        </head>

        <body>
          ${contenido}
        </body>
      </html>
    `);

    ventana.document.close();

    ventana.onload = () => {
      ventana.focus();

      window.setTimeout(() => {
        ventana.print();
      }, 250);
    };

    ventana.onafterprint = () => {
      ventana.close();
    };
  };

  return (
    <section
      id="avance-pedagogico-curso-imprimir"
      style={{
        margin: "22px auto",
        padding: "22px",
        maxWidth: "760px",
        border: "2px solid #bcd7e3",
        borderRadius: "16px",
        background: "#fbfdff",
        boxShadow: "0 5px 14px rgba(44, 84, 116, 0.10)",
      }}
    >
      <header
        style={{
          textAlign: "center",
          marginBottom: "18px",
        }}
      >
        <h3
          style={{
            margin: "0 0 7px",
            color: "#43506f",
            fontSize: "21px",
          }}
        >
          📊 Porcentaje de avance pedagógico
        </h3>

        <p
          style={{
            margin: 0,
            color: "#667085",
            fontSize: "13px",
          }}
        >
          Curso: <strong>{curso}</strong>
          {" · "}
          Período: <strong>{periodoSeleccionado}</strong>
        </p>
      </header>

      <div
        style={{
          padding: "18px",
          border: `1px solid ${colorPrincipal}`,
          borderRadius: "14px",
          background: fondoPrincipal,
          textAlign: "center",
        }}
      >
        <div
          style={{
            fontSize: "38px",
            lineHeight: 1,
            fontWeight: "800",
            color: colorPrincipal,
          }}
        >
          {porcentajeRedondeado}%
        </div>

        <div
          style={{
            marginTop: "9px",
            color: "#43506f",
            fontSize: "18px",
            fontWeight: "700",
          }}
        >
          {estado}
        </div>

        <p
          style={{
            margin: "10px 0 0",
            color: "#667085",
            fontSize: "13px",
            lineHeight: 1.5,
          }}
        >
          Calculado según la distribución de registros TEA, TEP y TED del
          período.
        </p>
      </div>

      <div
        style={{
          marginTop: "18px",
          padding: "18px",
          border: "1px solid #d7e5ec",
          borderRadius: "13px",
          background: "#ffffff",
        }}
      >
        <h4
          style={{
            margin: "0 0 14px",
            color: "#43506f",
            fontSize: "16px",
            textAlign: "center",
          }}
        >
          Cálculo automático del curso
        </h4>

        {totalCargados === 0 ? (
          <p
            style={{
              margin: 0,
              color: "#667085",
              textAlign: "center",
              lineHeight: 1.6,
            }}
          >
            Todavía no hay registros TEA, TEP o TED cargados para calcular el
            porcentaje.
          </p>
        ) : (
          <div
            style={{
              display: "grid",
              gap: "12px",
              color: "#344054",
              fontSize: "14px",
              lineHeight: 1.6,
            }}
          >
            <div
              style={{
                padding: "12px 14px",
                borderRadius: "10px",
                background: "#f8fafc",
                textAlign: "center",
                fontWeight: "700",
              }}
            >
              ({tea} TEA × 3) + ({tep} TEP × 2) + ({ted} TED × 1)
              <br />
              = <strong>{puntosObtenidos} puntos obtenidos</strong>
            </div>

            <div
              style={{
                padding: "12px 14px",
                borderRadius: "10px",
                background: "#f8fafc",
                textAlign: "center",
              }}
            >
              <strong>Máximo posible, si todos los registros fueran TEA:</strong>
              <br />
              {totalCargados} registros × 3 ={" "}
              <strong>{maximoPosible} puntos</strong>
            </div>

            <div
              style={{
                padding: "12px 14px",
                borderRadius: "10px",
                background: fondoPrincipal,
                textAlign: "center",
                fontWeight: "700",
                color: colorPrincipal,
              }}
            >
              {puntosObtenidos} ÷ {maximoPosible} × 100 = {porcentajeVisible}%
              <br />
              Porcentaje de avance pedagógico:{" "}
              <strong>{porcentajeRedondeado}%</strong>
            </div>
          </div>
        )}
      </div>

      {totalCargados > 0 && (
        <div
          style={{
            marginTop: "18px",
            padding: "16px 18px",
            border: "1px solid #d7e5ec",
            borderRadius: "13px",
            background: "#f9fcff",
          }}
        >
          <h4
            style={{
              margin: "0 0 8px",
              color: "#43506f",
              fontSize: "15px",
            }}
          >
            🧠 Lectura pedagógica
          </h4>

          <p
            style={{
              margin: 0,
              color: "#4b5563",
              fontSize: "14px",
              lineHeight: 1.65,
            }}
          >
            {explicacion}
          </p>
        </div>
      )}

      <div
        style={{
          marginTop: "16px",
          textAlign: "center",
        }}
      >
        <button
          type="button"
          onClick={imprimirDiagnostico}
          style={{
            padding: "9px 15px",
            borderRadius: "9px",
            border: "1px solid #c8d5e5",
            background: "#f8f9fc",
            color: "#344054",
            fontWeight: "700",
            cursor: "pointer",
          }}
        >
          🖨️ Imprimir diagnóstico
        </button>
      </div>
    </section>
  );
}

function obtenerExplicacionPedagogica({
  porcentaje,
  tea,
  tep,
  ted,
  totalCargados,
}) {
  const porcentajeTEA = Math.round((tea / totalCargados) * 100);
  const porcentajeTEP = Math.round((tep / totalCargados) * 100);
  const porcentajeTED = Math.round((ted / totalCargados) * 100);

  if (porcentaje >= 70) {
    return `La evolución del curso resulta favorable porque el porcentaje de avance pedagógico alcanza el ${porcentaje}%. El ${porcentajeTEA}% de los registros corresponde a trayectorias avanzadas (TEA) y el ${porcentajeTEP}% se encuentra en proceso (TEP). Aunque el resultado general es positivo, deben sostenerse acciones de acompañamiento para el ${porcentajeTED}% registrado como trayectoria discontinua (TED).`;
  }

  if (porcentaje >= 40) {
    return `El curso requiere seguimiento porque el porcentaje de avance pedagógico alcanza el ${porcentaje}%. La distribución muestra un ${porcentajeTEP}% de registros en proceso (TEP) y un ${porcentajeTED}% de trayectorias discontinuas (TED), por lo que resulta necesario sostener y revisar las intervenciones pedagógicas para favorecer el pasaje hacia trayectorias avanzadas.`;
  }

  return `El curso requiere una intervención pedagógica prioritaria porque el porcentaje de avance pedagógico es del ${porcentaje}%. La presencia de trayectorias en proceso y discontinuas representa el ${porcentajeTEP + porcentajeTED}% de los registros, por lo que se recomienda intensificar las estrategias de acompañamiento, enseñanza y seguimiento institucional.`;
}
