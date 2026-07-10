import { useState } from "react";

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

function obtenerAsignaturasPorCurso(curso) {
  if (curso?.startsWith("1°")) {
    return [
      "Prácticas del Lenguaje",
      "Matemática",
      "Ciencias Sociales",
      "Ciencias Naturales",
      "Inglés",
      "Educación Artística",
      "Educación Física",
      "Construcción de Ciudadanía",
    ];
  }

  if (curso?.startsWith("2°") || curso?.startsWith("3°")) {
    return [
      "Prácticas del Lenguaje",
      "Matemática",
      "Historia",
      "Geografía",
      "Biología",
      "Fisicoquímica",
      "Inglés",
      "Educación Artística",
      "Educación Física",
      "Construcción de Ciudadanía",
    ];
  }

  if (curso?.startsWith("4°")) {
    return [
      "Literatura",
      "Matemática Ciclo Superior",
      "Historia",
      "Geografía",
      "Biología",
      "Introducción a la Física",
      "Introducción a la Química",
      "NTICX",
      "Salud y Adolescencia",
      "Inglés",
      "Educación Física",
      "Producción y Análisis de Imágenes",
    ];
  }

  if (curso?.startsWith("5°")) {
    return [
      "Literatura",
      "Matemática Ciclo Superior",
      "Historia",
      "Geografía",
      "Política y Ciudadanía",
      "Inglés",
      "Educación Física",
      "Imagen y Nuevos Medios",
      "Art. Leng. Danza",
    ];
  }

  if (curso?.startsWith("6°")) {
    return [
      "Literatura",
      "Matemática Ciclo Superior",
      "Historia",
      "Geografía",
      "Inglés",
      "Educación Física",
      "Imagen y Procedimientos Constructivos",
      "Art. Leng. Danza",
    ];
  }

  return [];
}

function colorConceptual(conceptual) {
  if (conceptual === "TEA") return "#d9f5d6";
  if (conceptual === "TEP") return "#fff1b8";
  if (conceptual === "TED") return "#ffd1d1";
  return "#ffffff";
}

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
            th, td { border: 1px solid #999; padding: 5px; text-align: center; }
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
      style={{
        border: "1px solid #cfe3ea",
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
            border: "1px solid #cfd8dc",
          }}
        />
      </div>

      {busqueda !== "" && !alumnoSeleccionado && (
        <div
          style={{
            maxHeight: "220px",
            overflowY: "auto",
            border: "1px solid #d8e3ea",
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
                borderBottom: "1px solid #ececec",
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
            style={{
              border: "1px solid #bcd8ea",
              borderRadius: "12px",
              padding: "18px",
              background: "#f9fcff",
            }}
          >
            <h3 style={{ marginTop: 0 }}>
              E.E.S 140 - Seguimiento Pedagógico
            </h3>

            <h2>
              {alumnoSeleccionado.apellido}, {alumnoSeleccionado.nombre}
            </h2>

            <p style={{ textAlign: "center" }}>
              <strong>DNI:</strong> {alumnoSeleccionado.dni} &nbsp; | &nbsp;
              <strong>Curso:</strong> {alumnoSeleccionado.curso}
            </p>

            <hr style={{ margin: "20px 0" }} />

            {asignaturas.map((asignatura) => (
              <div key={asignatura}>
                <h4 className="materia">{asignatura}</h4>

                <table
                  style={{
                    width: "100%",
                    borderCollapse: "collapse",
                    marginBottom: "18px",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
                  }}
                >
                  <thead>
                    <tr>
                      {periodos.map((periodo) => (
                        <th
                          key={periodo.clave}
                          style={{
                            border: "1px solid #cfd8dc",
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
                        const dato = obtenerDato(asignatura, periodo.clave);

                        return (
                          <td
                            key={periodo.clave}
                            style={{
                              border: "1px solid #cfd8dc",
                              padding: "7px",
                              textAlign: "center",
                              background: colorConceptual(dato.conceptual),
                              fontWeight: "700",
                              fontSize: "12px",
                            }}
                          >
                            {dato.conceptual
                              ? `${dato.conceptual}${dato.nota ? ` ${dato.nota}` : ""}`
                              : "-"}
                          </td>
                        );
                      })}
                    </tr>
                  </tbody>
                </table>
              </div>
            ))}
          </div>

          <div style={{ textAlign: "center", marginTop: "25px" }}>
            <button
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