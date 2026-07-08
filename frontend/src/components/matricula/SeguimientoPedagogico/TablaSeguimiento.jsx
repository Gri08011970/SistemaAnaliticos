import { useState, useEffect } from "react";
import CeldaSemaforo from "./CeldaSemaforo";

export default function TablaSeguimiento({ curso, asignatura, alumnos }) {
 const [seguimiento, setSeguimiento] = useState(() => {
  const datosGuardados = localStorage.getItem("seguimientoPedagogico");

  if (datosGuardados) {
    return JSON.parse(datosGuardados);
  }

  return {};
});

 
useEffect(() => {
  localStorage.setItem(
    "seguimientoPedagogico",
    JSON.stringify(seguimiento)
  );
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

  return (
    <div
      style={{
        border: "1px solid #ddd",
        borderRadius: "10px",
        padding: "20px",
        background: "white",
      }}
    >
      <h3>
        {curso} - {asignatura}
      </h3>

      <table
        style={{
          width: "100%",
          borderCollapse: "collapse",
        }}
      >
        <thead>
          <tr>
            <th>Alumno</th>
            <th>Mayo</th>
            <th>1° Cuat.</th>
            <th>Octubre</th>
            <th>2° Cuat.</th>
          </tr>
        </thead>

        <tbody>
          {alumnosCurso.map((alumno) => (
            <tr key={alumno.dni}>
              <td>
                {alumno.apellido}, {alumno.nombre}
              </td>

              {["mayo", "primerCuat", "octubre", "segundoCuat"].map(
                (periodo) => {
                  const clave = obtenerClave(alumno._id, periodo);

                  return (
                    <td key={periodo}>
                      <CeldaSemaforo
                        valor={seguimiento[clave]?.conceptual || "-"}
                        nota={seguimiento[clave]?.nota || ""}
                        onChangeEstado={() =>
                          cambiarEstado(alumno._id, periodo)
                        }
                        onChangeNota={(nota) =>
                          cambiarNota(alumno._id, periodo, nota)
                        }
                      />
                    </td>
                  );
                },
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}