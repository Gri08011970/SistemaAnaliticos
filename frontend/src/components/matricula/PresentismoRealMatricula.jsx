import { useEffect, useMemo, useState } from "react";

const MESES = [
  "Enero",
  "Febrero",
  "Marzo",
  "Abril",
  "Mayo",
  "Junio",
  "Julio",
  "Agosto",
  "Septiembre",
  "Octubre",
  "Noviembre",
  "Diciembre",
];

const CURSOS = Array.from({ length: 6 }, (_, indice) => {
  const anio = indice + 1;

  return [
    {
      curso: `${anio}°1°`,
      anio,
      seccion: 1,
      turno: "M",
    },
    {
      curso: `${anio}°2°`,
      anio,
      seccion: 2,
      turno: "M",
    },
    {
      curso: `${anio}°3°`,
      anio,
      seccion: 3,
      turno: "T",
    },
    {
      curso: `${anio}°4°`,
      anio,
      seccion: 4,
      turno: "T",
    },
  ];
}).flat();

export default function PresentismoRealMatricula({
  alumnosMatricula = [],
  onVolver,
}) {
  const fechaActual = new Date();

  const [mes, setMes] = useState(MESES[fechaActual.getMonth()]);

  const [anio, setAnio] = useState(fechaActual.getFullYear());

  const [diasEfectivos, setDiasEfectivos] = useState("");

  const [presentesReales, setPresentesReales] = useState({});

  const [cargandoPeriodo, setCargandoPeriodo] = useState(false);

  const [guardandoPeriodo, setGuardandoPeriodo] = useState(false);

  const [periodoGuardado, setPeriodoGuardado] = useState(false);

  const [mensajeGuardado, setMensajeGuardado] = useState("");

  useEffect(() => {
    const cargarPeriodo = async () => {
      if (!mes || !anio) return;

      setCargandoPeriodo(true);
      setMensajeGuardado("");

      try {
        const token = localStorage.getItem("tokenUsuario");

        const respuesta = await fetch(
          `/api/presentismo?mes=${encodeURIComponent(
            mes,
          )}&anio=${encodeURIComponent(anio)}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );

        const datos = await respuesta.json();

        if (!respuesta.ok) {
          throw new Error(datos.mensaje || "No se pudo consultar el período.");
        }

        if (!datos.presentismo) {
          // Ese mes todavía no existe en Mongo.
          setDiasEfectivos("");
          setPresentesReales({});
          setPeriodoGuardado(false);
          return;
        }

        const registro = datos.presentismo;

        setDiasEfectivos(String(registro.diasEfectivos ?? ""));

        const reales = {};

        (registro.filas || []).forEach((fila) => {
          reales[fila.curso] = fila.presentesReales ?? 0;
        });

        setPresentesReales(reales);
        setPeriodoGuardado(true);
      } catch (error) {
        console.error("Error al cargar presentismo:", error);

        setPeriodoGuardado(false);

        setMensajeGuardado(error.message || "No se pudo cargar el período.");
      } finally {
        setCargandoPeriodo(false);
      }
    };

    cargarPeriodo();
  }, [mes, anio]);

  const filas = useMemo(
    () =>
      CURSOS.map((item) => {
        const matricula = alumnosMatricula.filter(
          (alumno) => alumno.curso === item.curso,
        ).length;

        const dias = Number(diasEfectivos) || 0;

        const esperables = matricula * dias;

        const reales = Number(presentesReales[item.curso]) || 0;

        const porcentaje = esperables > 0 ? (reales / esperables) * 100 : 0;

        return {
          ...item,
          matricula,
          esperables,
          reales,
          porcentaje,
        };
      }),
    [alumnosMatricula, diasEfectivos, presentesReales],
  );

  const totalMatricula = filas.reduce(
    (total, fila) => total + fila.matricula,
    0,
  );

  const totalEsperables = filas.reduce(
    (total, fila) => total + fila.esperables,
    0,
  );

  const totalReales = filas.reduce((total, fila) => total + fila.reales, 0);

  const porcentajeInstitucional =
    totalEsperables > 0 ? (totalReales / totalEsperables) * 100 : 0;

  const actualizarPresentes = (curso, valor) => {
    if (valor === "") {
      setPresentesReales((anteriores) => ({
        ...anteriores,
        [curso]: "",
      }));

      setPeriodoGuardado(false);
      setMensajeGuardado("");

      return;
    }

    const numero = Math.max(0, Number(valor));

    setPresentesReales((anteriores) => ({
      ...anteriores,
      [curso]: numero,
    }));

    setPeriodoGuardado(false);
    setMensajeGuardado("");
  };

  const guardarPeriodo = async () => {
    if (!diasEfectivos) {
      window.alert("Ingresá la cantidad de días efectivos de clase.");
      return;
    }

    setGuardandoPeriodo(true);
    setMensajeGuardado("");

    try {
      const token = localStorage.getItem("tokenUsuario");

      const filasParaGuardar = filas.map((fila) => ({
        curso: fila.curso,
        anioCurso: fila.anio,
        seccion: fila.seccion,
        turno: fila.turno,
        matricula: fila.matricula,
        presentesReales: fila.reales,
      }));

      const respuesta = await fetch("/api/presentismo", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          mes,
          anio: Number(anio),
          diasEfectivos: Number(diasEfectivos),
          filas: filasParaGuardar,
        }),
      });

      const datos = await respuesta.json();

      if (!respuesta.ok) {
        throw new Error(datos.mensaje || "No se pudo guardar el presentismo.");
      }

      setPeriodoGuardado(true);

      setMensajeGuardado(datos.mensaje || "Período guardado correctamente.");
    } catch (error) {
      console.error("Error al guardar presentismo:", error);

      setMensajeGuardado(error.message || "No se pudo guardar el período.");
    } finally {
      setGuardandoPeriodo(false);
    }
  };

  return (
    <div
      style={{
        width: "100%",
        background: "#ffffff",
        borderRadius: "16px",
        padding: "22px",
        boxSizing: "border-box",
      }}
    >
      <button
        type="button"
        onClick={onVolver}
        style={{
          border: "none",
          borderRadius: "9px",
          padding: "9px 16px",
          background: "#607d8b",
          color: "#ffffff",
          fontWeight: "700",
          cursor: "pointer",
          marginBottom: "18px",
        }}
      >
        ← Volver
      </button>

      <div
        style={{
          textAlign: "center",
          marginBottom: "22px",
        }}
      >
        <h2
          style={{
            margin: "0 0 6px",
            color: "#1e3a5f",
          }}
        >
          📊 Presentismo real
        </h2>

        <p
          style={{
            margin: 0,
            color: "#667788",
          }}
        >
          Cálculo mensual de presentismo por curso
        </p>
      </div>

      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "14px",
          justifyContent: "center",
          alignItems: "end",
          padding: "18px",
          marginBottom: "22px",
          background: "#f7fafb",
          border: "1px solid #d8e2e8",
          borderRadius: "12px",
        }}
      >
        <label>
          <div
            style={{
              fontWeight: "700",
              marginBottom: "6px",
              color: "#40566b",
            }}
          >
            Mes
          </div>

          <select
            value={mes}
            onChange={(e) => setMes(e.target.value)}
            style={inputStyle}
          >
            {MESES.map((nombreMes) => (
              <option key={nombreMes} value={nombreMes}>
                {nombreMes}
              </option>
            ))}
          </select>
        </label>

        <label>
          <div
            style={{
              fontWeight: "700",
              marginBottom: "6px",
              color: "#40566b",
            }}
          >
            Año
          </div>

          <input
            type="number"
            value={anio}
            onChange={(e) => setAnio(e.target.value)}
            style={inputStyle}
          />
        </label>

        <label>
          <div
            style={{
              fontWeight: "700",
              marginBottom: "6px",
              color: "#40566b",
            }}
          >
            Días efectivos de clase
          </div>

          <input
            type="number"
            min="0"
            value={diasEfectivos}
            onChange={(e) => {
              setDiasEfectivos(e.target.value);
              setPeriodoGuardado(false);
              setMensajeGuardado("");
            }}
            placeholder="Ej.: 20"
            style={inputStyle}
          />
        </label>
      </div>

      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          gap: "14px",
          flexWrap: "wrap",
          margin: "-6px 0 22px",
        }}
      >
        <button
          type="button"
          onClick={guardarPeriodo}
          disabled={guardandoPeriodo || cargandoPeriodo}
          style={{
            border: "none",
            borderRadius: "9px",
            padding: "10px 22px",
            background:
              guardandoPeriodo || cargandoPeriodo ? "#9aabb4" : "#15978f",
            color: "#ffffff",
            fontWeight: "700",
            cursor:
              guardandoPeriodo || cargandoPeriodo ? "not-allowed" : "pointer",
            boxShadow: "0 4px 9px rgba(21, 151, 143, 0.18)",
          }}
        >
          {guardandoPeriodo ? "Guardando..." : "💾 Guardar período"}
        </button>

        <span
          style={{
            fontSize: "13px",
            fontWeight: "700",
            color: periodoGuardado ? "#2f7d68" : "#9a6b22",
          }}
        >
          {cargandoPeriodo
            ? "Consultando período..."
            : periodoGuardado
              ? "✓ Período guardado"
              : "Cambios sin guardar"}
        </span>
      </div>

      {mensajeGuardado && (
        <div
          style={{
            maxWidth: "650px",
            margin: "-10px auto 20px",
            padding: "10px 14px",
            borderRadius: "9px",
            background: periodoGuardado ? "#edf8f4" : "#fff4e8",
            color: periodoGuardado ? "#276957" : "#8a5a20",
            textAlign: "center",
            fontSize: "14px",
          }}
        >
          {mensajeGuardado}
        </div>
      )}

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
          gap: "12px",
          marginBottom: "22px",
        }}
      >
        <Resumen titulo="Matrícula total" valor={totalMatricula} />

        <Resumen titulo="Presentes esperables" valor={totalEsperables} />

        <Resumen titulo="Presentes reales" valor={totalReales} />

        <Resumen
          titulo="Presentismo institucional"
          valor={`${porcentajeInstitucional.toFixed(2)} %`}
        />
      </div>

      <div
        style={{
          overflowX: "auto",
          border: "1px solid #d8e2e8",
          borderRadius: "12px",
        }}
      >
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            minWidth: "850px",
          }}
        >
          <thead>
            <tr
              style={{
                background: "#eef4f7",
                color: "#29465b",
              }}
            >
              <Th>Curso</Th>
              <Th>Sección</Th>
              <Th>Turno</Th>
              <Th>Matrícula</Th>
              <Th fondo="#dff3e2">Días efectivos</Th>

              <Th fondo="#e3f1fa">Presentes esperables</Th>

              <Th fondo="#fff1bd">Presentes reales</Th>
              <Th>% Presentismo</Th>
            </tr>
          </thead>

          <tbody>
            {filas.map((fila) => {
              const finDeAnio = fila.seccion === 4;

              return (
                <tr
                  key={fila.curso}
                  style={{
                    borderBottom: finDeAnio
                      ? "3px solid #6f9fbd"
                      : "1px solid #e1e8ec",
                  }}
                >
                  <Td>{fila.anio}°</Td>

                  <Td>{fila.seccion}</Td>

                  <Td>{fila.turno}</Td>

                  <Td>
                    <strong>{fila.matricula}</strong>
                  </Td>

                  {/* DÍAS EFECTIVOS - DATO CARGADO */}
                  <Td fondo="#eef9ef">{diasEfectivos || "—"}</Td>

                  {/* PRESENTES ESPERABLES - CÁLCULO AUTOMÁTICO */}
                  <Td fondo="#edf6fc">
                    {diasEfectivos ? fila.esperables : "—"}
                  </Td>

                  {/* PRESENTES REALES - DATO CARGADO */}
                  <Td fondo="#fff8dc">
                    <input
                      type="number"
                      min="0"
                      value={presentesReales[fila.curso] ?? ""}
                      onChange={(e) =>
                        actualizarPresentes(fila.curso, e.target.value)
                      }
                      placeholder="0"
                      style={{
                        width: "90px",
                        padding: "7px",
                        border: "1px solid #e2bd61",
                        borderRadius: "7px",
                        textAlign: "center",
                        background: "#fffdf5",
                        boxSizing: "border-box",
                      }}
                    />
                  </Td>

                  <Td>
                    <strong>
                      {fila.esperables > 0
                        ? `${fila.porcentaje.toFixed(2)} %`
                        : "—"}
                    </strong>
                  </Td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <p
        style={{
          marginTop: "14px",
          color: "#71808d",
          fontSize: "13px",
          textAlign: "center",
        }}
      >
        {mes} {anio} · La matrícula se obtiene automáticamente del sistema.
      </p>
    </div>
  );
}

function Resumen({ titulo, valor }) {
  return (
    <div
      style={{
        padding: "15px",
        border: "1px solid #d6e2e8",
        borderRadius: "11px",
        textAlign: "center",
        background: "#fafcfd",
      }}
    >
      <div
        style={{
          color: "#647687",
          fontSize: "13px",
          marginBottom: "5px",
        }}
      >
        {titulo}
      </div>

      <strong
        style={{
          color: "#1e3a5f",
          fontSize: "21px",
        }}
      >
        {valor}
      </strong>
    </div>
  );
}

function Th({ children, fondo }) {
  return (
    <th
      style={{
        padding: "11px 8px",
        borderBottom: "2px solid #c7d7e0",
        fontSize: "13px",
        textAlign: "center",
        background: fondo || "transparent",
      }}
    >
      {children}
    </th>
  );
}

function Td({ children, fondo }) {
  return (
    <td
      style={{
        padding: "8px",
        textAlign: "center",
        background: fondo || "transparent",
      }}
    >
      {children}
    </td>
  );
}

const inputStyle = {
  minWidth: "150px",
  padding: "9px 10px",
  border: "1px solid #c7d4dd",
  borderRadius: "8px",
  background: "#ffffff",
};
