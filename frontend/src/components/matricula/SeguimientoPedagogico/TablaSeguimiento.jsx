import { useState, useEffect } from "react";
import CeldaSemaforo from "./CeldaSemaforo";

export default function TablaSeguimiento({ curso, asignatura, alumnos }) {
  const [seguimiento, setSeguimiento] = useState(() => {
    const datosGuardados = localStorage.getItem("seguimientoPedagogico");
    return datosGuardados ? JSON.parse(datosGuardados) : {};
  });

  useEffect(() => {
    localStorage.setItem("seguimientoPedagogico", JSON.stringify(seguimiento));
  }, [seguimiento]);

  const alumnosCurso = alumnos.filter((a) => a.curso === curso);

  const obtenerClave = (alumnoId, periodo) =>
    `${curso}-${asignatura}-${alumnoId}-${periodo}`;

  const cambiarEstado = (alumnoId, periodo) => {
    const clave = obtenerClave(alumnoId, periodo);
    const valorActual = seguimiento[clave]?.conceptual || "-";

    let nuevoValor = "-";
    if (valorActual === "-") nuevoValor = "TEA";
    else if (valorActual === "TEA") nuevoValor = "TEP";
    else if (valorActual === "TEP") nuevoValor = "TED";

    setSeguimiento({
      ...seguimiento,
      [clave]: {
        ...seguimiento[clave],
        conceptual: nuevoValor,
      },
    });
  };

  const cambiarNota = (alumnoId, periodo, nota) => {
    const clave = obtenerClave(alumnoId, periodo);

    setSeguimiento({
      ...seguimiento,
      [clave]: {
        ...seguimiento[clave],
        nota,
      },
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
        border:  "2px solid #bdd9e4",
        borderRadius: "16px",
        padding: "24px",
        background: "white",
        margin: "24px auto",
        maxWidth: "1100px",
        overflowX: "auto",
        overflowY: "auto",
        maxHeight: "650px",
        boxShadow:  "0 8px 24px rgba(44, 84, 116, 0.14)",
        borderTop: "6px solid #5d86b0",
      }}
    >
      <h3>
        {curso} - {asignatura}
      </h3>

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
            <tr key={alumno.dni}>
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
