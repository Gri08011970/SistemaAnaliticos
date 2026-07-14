import { useState } from "react";
import {
  obtenerAsignaturasPorCurso,
  COLORES_SEGUIMIENTO,
} from "./seguimientoConstants";

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

const colorConceptual = (conceptual) => {
  return (
    COLORES_SEGUIMIENTO[conceptual]?.fondoClaro ||
    COLORES_SEGUIMIENTO["-"].fondoClaro
  );
};

export default function FichaSeguimientoAlumno({ alumnos = [] }) {
  const [busqueda, setBusqueda] = useState("");
  const [alumnoSeleccionado, setAlumnoSeleccionado] = useState(null);

  const seguimiento = JSON.parse(
    localStorage.getItem("seguimientoPedagogico") || "{}"
  );

  const resultados = alumnos.filter((a) => {
    const texto = `${a.apellido} ${a.nombre} ${a.dni}`.toLowerCase();
    return texto.includes(busqueda.toLowerCase());
  });

  const asignaturas = alumnoSeleccionado
    ? obtenerAsignaturasPorCurso(alumnoSeleccionado.curso)
    : [];

  const obtenerDato = (asignatura, periodo) => {
    const clave = `${alumnoSeleccionado.curso}-${asignatura}-${alumnoSeleccionado._id}-${periodo}`;
    return seguimiento[clave] || {};
  };

  const imprimirFicha = () => {
    const contenido = document.getElementById("ficha-seguimiento-imprimir").innerHTML;
    const ventana = window.open("", "_blank");

    ventana.document.write(`
      <html>
        <head>
          <title>Ficha pedagógica</title>
          <style>
            @page { size: A4 portrait; margin: 10mm; }
            body { font-family: Arial, sans-serif; color: #222; }
            h2, h3 { text-align: center; }
            table { width: 100%; border-collapse: collapse; margin-bottom: 14px; font-size: 10px; }
            th, td { border: 2px solid #999; padding: 5px; text-align: center; }
            th { background: #eef3f7; }
            .materia { margin-top: 16px; font-weight: bold; color: #1d4f73; }
            button, input { display: none; }
          </style>
        </head>
        <body>${contenido}</body>
      </html>
    `);

    ventana.document.close();
    ventana.focus();
    ventana.print();
    ventana.close();
  };

  return (
  <div
    className="ficha-seguimiento-contenedor"
    style={{
      border: "3px solid #cfe3ea",
      borderRadius: "16px",
      padding: "24px",
      background: "white",
      margin: "24px auto",
      maxWidth: "1100px",
      boxShadow: "0 4px 14px rgba(0,0,0,0.08)",
    }}
  >
    <div style={{ textAlign: "center", marginBottom: "25px" }}>
      <input
        className="buscador-ficha-seguimiento"
        type="text"
        placeholder="Buscar por apellido, nombre o DNI..."
        value={busqueda}
        onChange={(e) => {
          setBusqueda(e.target.value);
          setAlumnoSeleccionado(null);
        }}
        style={{
          width: "420px",
          padding: "10px",
          borderRadius: "8px",
          border: "3px solid #cfd8dc",
        }}
      />
    </div>

    {busqueda !== "" && !alumnoSeleccionado && (
      <div
        style={{
          maxHeight: "220px",
          overflowY: "auto",
          border: "3px solid #d8e3ea",
          borderRadius: "10px",
          marginBottom: "25px",
        }}
      >
        {resultados.map((alumno) => (
          <div
            key={alumno._id || alumno.dni}
            onClick={() => setAlumnoSeleccionado(alumno)}
            style={{
              padding: "10px 15px",
              cursor: "pointer",
              borderBottom: "2px solid #ececec",
            }}
          >
            <strong>
              {alumno.apellido}, {alumno.nombre}
            </strong>

            <br />

            DNI: {alumno.dni} | Curso: {alumno.curso}
          </div>
        ))}
      </div>
    )}

    {alumnoSeleccionado && (
      <>
        <div
          id="ficha-seguimiento-imprimir"
          className="ficha-seguimiento-imprimir"
          style={{
            border: "2px solid #bcd8ea",
            borderRadius: "12px",
            padding: "18px",
            background: "#f9fcff",
          }}
        >
          <h3 style={{ marginTop: 0 }}>
            E.E.S 140 - Seguimiento Pedagógico
          </h3>

          <h2>
            {alumnoSeleccionado.apellido},{" "}
            {alumnoSeleccionado.nombre}
          </h2>

          <p style={{ textAlign: "center" }}>
            <strong>DNI:</strong> {alumnoSeleccionado.dni}
            &nbsp; | &nbsp;
            <strong>Curso:</strong> {alumnoSeleccionado.curso}
          </p>

          <hr style={{ margin: "20px 0" }} />

          <div className="ficha-seguimiento-desktop">
            {asignaturas.map((asignatura) => (
              <div key={asignatura}>
                <h4 className="materia">
                  {asignatura}
                </h4>

                <div className="tabla-scroll-mobile">
                  <table
                    style={{
                      width: "100%",
                      borderCollapse: "collapse",
                      marginBottom: "18px",
                      boxShadow:
                        "0 2px 8px rgba(0,0,0,0.05)",
                    }}
                  >
                    <thead>
                      <tr>
                        {periodos.map((periodo) => (
                          <th
                            key={periodo.clave}
                            style={{
                              border:
                                "2px solid #cfd8dc",
                              padding: "6px",
                              background: "#eef3f7",
                              fontSize: "12px",
                            }}
                          >
                            {periodo.etiqueta}
                          </th>
                        ))}
                      </tr>
                    </thead>

                    <tbody>
                      <tr>
                        {periodos.map((periodo) => {
                          const dato = obtenerDato(
                            asignatura,
                            periodo.clave,
                          );

                          return (
                            <td
                              key={periodo.clave}
                              style={{
                                border:
                                  "2px solid #cfd8dc",
                                padding: "7px",
                                textAlign: "center",
                                background:
                                  colorConceptual(
                                    dato.conceptual,
                                  ),
                                fontWeight: "700",
                                fontSize: "12px",
                              }}
                            >
                              {dato.conceptual
                                ? `${dato.conceptual}${
                                    dato.nota
                                      ? ` ${dato.nota}`
                                      : ""
                                  }`
                                : "—"}
                            </td>
                          );
                        })}
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            ))}
          </div>

          <div className="ficha-seguimiento-mobile">
            {asignaturas.map((asignatura) => (
              <div
                key={`mobile-${asignatura}`}
                className="tarjeta-materia-seguimiento"
              >
                <h4 className="materia materia-mobile">
                  {asignatura}
                </h4>

                <div className="periodos-mobile">
                  {periodos.map((periodo) => {
                    const dato = obtenerDato(
                      asignatura,
                      periodo.clave,
                    );

                    return (
                      <div
                        key={`mobile-${asignatura}-${periodo.clave}`}
                        className="fila-periodo-mobile"
                      >
                        <span className="nombre-periodo-mobile">
                          {periodo.etiqueta}
                        </span>

                        <span
                          className="valor-periodo-mobile"
                          style={{
                            background:
                              colorConceptual(
                                dato.conceptual,
                              ),
                          }}
                        >
                          {dato.conceptual
                            ? `${dato.conceptual}${
                                dato.nota
                                  ? ` ${dato.nota}`
                                  : ""
                              }`
                            : "—"}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div
          style={{
            textAlign: "center",
            marginTop: "25px",
          }}
        >
          <button
            type="button"
            onClick={imprimirFicha}
            style={{
              padding: "10px 18px",
              borderRadius: "10px",
              border: "1px solid #c8d5e5",
              background: "#f8f9fc",
              cursor: "pointer",
              fontWeight: "600",
            }}
          >
            🖨️ Imprimir ficha
          </button>
        </div>
      </>
    )}
  </div>
);
}
