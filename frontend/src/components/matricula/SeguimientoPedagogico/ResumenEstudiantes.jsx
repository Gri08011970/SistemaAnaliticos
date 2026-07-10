import {
  obtenerIndicePedagogico,
  obtenerEstadoPorIndice,
} from "./seguimientoResumenUtils";

export default function ResumenEstudiantes({
  alumnosCurso,
  asignaturasResumen,
  obtenerDato,
}) {
  const resumenEstudiantes = alumnosCurso
    .map((alumno) => {
      let tea = 0;
      let tep = 0;
      let ted = 0;

      asignaturasResumen.forEach((asignatura) => {
        const dato = obtenerDato(alumno._id, asignatura);

        if (dato.conceptual === "TEA") tea++;
        if (dato.conceptual === "TEP") tep++;
        if (dato.conceptual === "TED") ted++;
      });

      const indice = obtenerIndicePedagogico({ tea, tep, ted });
      const estado = obtenerEstadoPorIndice(indice);

      return {
        alumno,
        tea,
        tep,
        ted,
        indice,
        estado,
      };
    })
    .sort((a, b) => a.indice - b.indice);

  return (
    <div
      style={{
        margin: "16px 0",
        padding: "12px",
        border: "1px solid #cfe3ea",
        borderRadius: "14px",
        background: "#f9fcff",
      }}
    >
      <h4 style={{ margin: "0 0 12px" }}>
        🧑‍🎓 Índice pedagógico por estudiante
      </h4>

      {resumenEstudiantes.map((item) => (
        <div
          key={item.alumno._id || item.alumno.dni}
          style={{
            display: "grid",
            gridTemplateColumns: "1.8fr 80px 1fr",
            gap: "10px",
            alignItems: "center",
            padding: "8px",
            borderBottom: "1px solid #d7e5ec",
            fontSize: "12px",
          }}
        >
          <strong>
            {item.alumno.apellido}, {item.alumno.nombre}
          </strong>

          <strong>{item.indice}%</strong>

          <span>{item.estado}</span>
        </div>
      ))}
    </div>
  );
}