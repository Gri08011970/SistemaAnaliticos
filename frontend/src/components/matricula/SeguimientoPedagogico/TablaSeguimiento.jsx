import { useEffect, useRef, useState } from "react";
import CeldaSemaforo from "./CeldaSemaforo";

export default function TablaSeguimiento({ curso, asignatura, alumnos }) {
  const [seguimiento, setSeguimiento] = useState({});

  const [cargando, setCargando] = useState(false);
  const [errorGuardado, setErrorGuardado] = useState("");

  const seguimientoRef = useRef(seguimiento);

  useEffect(() => {
  seguimientoRef.current = seguimiento;
}, [seguimiento]);

  const alumnosCurso = alumnos.filter((alumno) => alumno.curso === curso);

  const obtenerClave = (alumnoId, periodo) =>
    `${curso}-${asignatura}-${alumnoId}-${periodo}`;

  // =====================================
  // LEER REGISTROS DESDE MONGODB
  // =====================================

  useEffect(() => {
    async function obtenerSeguimientoDesdeMongo() {
      if (!curso || !asignatura) return;

      try {
        setCargando(true);
        setErrorGuardado("");

        const parametros = new URLSearchParams({
          curso,
          asignatura,
        });

        const respuesta = await fetch(
          `/api/seguimiento?${parametros.toString()}`,
        );

        if (!respuesta.ok) {
          throw new Error("No se pudo obtener el seguimiento pedagógico");
        }

        const registros = await respuesta.json();

        const registrosConvertidos = {};

        registros.forEach((registro) => {
          const clave = obtenerClave(registro.alumnoId, registro.periodo);

          registrosConvertidos[clave] = {
            conceptual: registro.conceptual || "-",
            nota: registro.nota || "",
            mongoId: registro._id,
          };
        });

        /*
          Conservamos temporalmente los registros del localStorage
          y MongoDB tiene prioridad cuando existe la misma clave.
        */
        setSeguimiento((datosAnteriores) => ({
          ...datosAnteriores,
          ...registrosConvertidos,
        }));
      } catch (error) {
        console.error("Error al obtener seguimiento desde MongoDB:", error);

        setErrorGuardado(
          "No se pudo conectar con la base. Se está usando el respaldo local.",
        );
      } finally {
        setCargando(false);
      }
    }

    obtenerSeguimientoDesdeMongo();
  }, [curso, asignatura]);

  // =====================================
  // GUARDAR UNA CELDA EN MONGODB
  // =====================================
  const guardarRegistroEnMongo = async ({
    alumnoId,
    periodo,
    conceptual,
    nota,
  }) => {
    try {
      setErrorGuardado("");

      const respuesta = await fetch("/api/seguimiento", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          alumnoId: String(alumnoId),
          curso,
          asignatura,
          periodo,
          conceptual: conceptual || "-",
          nota: nota ?? "",
        }),
      });

      const datos = await respuesta.json();

      if (!respuesta.ok) {
        throw new Error(datos.mensaje || "No se pudo guardar el seguimiento");
      }

      const clave = obtenerClave(alumnoId, periodo);

      setSeguimiento((datosAnteriores) => ({
        ...datosAnteriores,
        [clave]: {
          ...datosAnteriores[clave],
          conceptual: datos.conceptual || "-",
          nota: datos.nota || "",
          mongoId: datos._id,
        },
      }));
    } catch (error) {
      console.error("Error al guardar seguimiento en MongoDB:", error);

      setErrorGuardado(
        "El cambio quedó respaldado localmente, pero todavía no pudo guardarse en la base.",
      );
    }
  };

  

  // =====================================
  // CAMBIAR ESTADO CONCEPTUAL
  // =====================================

  const cambiarEstado = (alumnoId, periodo) => {
    const clave = obtenerClave(alumnoId, periodo);

    const registroActual = seguimientoRef.current[clave] || {};

    const valorActual = registroActual.conceptual || "-";

    let nuevoValor = "-";

    if (valorActual === "-") nuevoValor = "TEA";
    else if (valorActual === "TEA") nuevoValor = "TEP";
    else if (valorActual === "TEP") nuevoValor = "TED";

    const registroNuevo = {
      ...registroActual,
      conceptual: nuevoValor,
      nota: registroActual.nota || "",
    };

    setSeguimiento((datosAnteriores) => ({
      ...datosAnteriores,
      [clave]: registroNuevo,
    }));

    guardarRegistroEnMongo({
      alumnoId,
      periodo,
      conceptual: registroNuevo.conceptual,
      nota: registroNuevo.nota,
    });
  };

  // =====================================
  // CAMBIAR NOTA
  // =====================================

  const cambiarNota = (alumnoId, periodo, nota) => {
    const clave = obtenerClave(alumnoId, periodo);

    const registroActual = seguimientoRef.current[clave] || {};

    const registroNuevo = {
      ...registroActual,
      conceptual: registroActual.conceptual || "-",
      nota,
    };

    setSeguimiento((datosAnteriores) => ({
      ...datosAnteriores,
      [clave]: registroNuevo,
    }));

    guardarRegistroEnMongo({
      alumnoId,
      periodo,
      conceptual: registroNuevo.conceptual,
      nota: registroNuevo.nota,
    });
  };

  const periodos = [
    { clave: "mayo", etiqueta: "Mayo" },
    { clave: "primerCuat", etiqueta: "1° Cuat." },
    { clave: "octubre", etiqueta: "Octubre" },
    { clave: "segundoCuat", etiqueta: "2° Cuat." },
    { clave: "diciembre", etiqueta: "Dic." },
    { clave: "febrero", etiqueta: "Feb." },
    { clave: "marzo", etiqueta: "Mar." },
    { clave: "final", etiqueta: "Final" },
  ];

  const bordeVertical = (clave) => {
    if (
      clave === "primerCuat" ||
      clave === "segundoCuat" ||
      clave === "marzo"
    ) {
      return "4px solid #5f91b2";
    }

    return "1px solid #cfd8dc";
  };

  return (
    <div
      style={{
        border: "2px solid #bdd9e4",
        borderRadius: "16px",
        padding: "24px",
        background: "white",
        margin: "24px auto",
        maxWidth: "1100px",
        overflowX: "auto",
        overflowY: "auto",
        maxHeight: "650px",
        boxShadow: "0 8px 24px rgba(44, 84, 116, 0.14)",
        borderTop: "6px solid #5d86b0",
      }}
    >
      <h3>
        {curso} - {asignatura}
      </h3>
    
      {cargando && (
        <p
          style={{
            color: "#5d6d7e",
            fontSize: "13px",
            textAlign: "center",
          }}
        >
          Cargando registros compartidos...
        </p>
      )}

      {errorGuardado && (
        <p
          style={{
            background: "#fff3cd",
            border: "1px solid #f0d98c",
            borderRadius: "8px",
            color: "#856404",
            padding: "9px 12px",
            fontSize: "13px",
            textAlign: "center",
          }}
        >
          {errorGuardado}
        </p>
      )}

      <table
        style={{
          width: "100%",
          borderCollapse: "collapse",
          border: "2px solid #7fa6c2",
        }}
      >
        <thead>
          <tr>
            <th
              style={{
                padding: "12px",
                background: "#f5f7fa",
                border: "1px solid #cfd8dc",
                borderRight: "4px solid #5f91b2",
                position: "sticky",
                top: 0,
                left: 0,
                zIndex: 10,
              }}
            >
              Alumno
            </th>

            {periodos.map((periodo) => (
              <th
                key={periodo.clave}
                style={{
                  padding: "12px 8px",
                  position: "sticky",
                  top: 0,
                  zIndex: 6,
                  background: "#f5f7fa",
                  borderTop: "1px solid #cfd8dc",
                  borderLeft: "1px solid #cfd8dc",
                  borderBottom: "2px solid #9fb8c9",
                  borderRight: bordeVertical(periodo.clave),
                }}
              >
                {periodo.etiqueta}
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {alumnosCurso.map((alumno) => (
            <tr key={alumno._id || alumno.dni}>
              <td
                style={{
                  textAlign: "left",
                  padding: "10px 12px",
                  minWidth: "290px",
                  position: "sticky",
                  left: 0,
                  background: "white",
                  zIndex: 2,
                  borderTop: "1px solid #cfd8dc",
                  borderBottom: "2px solid #9fb8c9",
                  borderLeft: "1px solid #cfd8dc",
                  borderRight: "4px solid #5f91b2",
                  fontWeight: 400,
                  fontSize: "13px",
                  lineHeight: "1.2",
                  color: "#3f4f67",
                }}
              >
                {alumno.apellido}, {alumno.nombre}
              </td>

              {periodos.map((periodo) => {
                const clave = obtenerClave(alumno._id, periodo.clave);

                return (
                  <td
                    key={periodo.clave}
                    style={{
                      textAlign: "center",
                      padding: "8px 6px",
                      borderTop: "1px solid #cfd8dc",
                      borderBottom: "2px solid #9fb8c9",
                      borderLeft: "1px solid #cfd8dc",
                      borderRight: bordeVertical(periodo.clave),
                    }}
                  >
                    <CeldaSemaforo
                      valor={seguimiento[clave]?.conceptual || "-"}
                      nota={seguimiento[clave]?.nota || ""}
                      onChangeEstado={() =>
                        cambiarEstado(alumno._id, periodo.clave)
                      }
                      onChangeNota={(nota) =>
                        cambiarNota(alumno._id, periodo.clave, nota)
                      }
                    />
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div> 
  );
}
