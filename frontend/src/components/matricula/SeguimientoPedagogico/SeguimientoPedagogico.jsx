import { useState } from "react";
import TablaSeguimiento from "./TablaSeguimiento";
import ResumenCurso from "./ResumenCurso";
import FichaSeguimientoAlumno from "./FichaSeguimientoAlumno";

const cursos = [
  "1°1°", "1°2°", "1°3°", "1°4°",
  "2°1°", "2°2°", "2°3°", "2°4°",
  "3°1°", "3°2°", "3°3°", "3°4°",
  "4°1°", "4°2°", "4°3°", "4°4°",
  "5°1°", "5°2°", "5°3°", "5°4°",
  "6°1°", "6°2°", "6°3°", "6°4°",
];

function obtenerAsignaturasPorCurso(curso) {
  if (curso.startsWith("1°")) {
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

  if (curso.startsWith("2°") || curso.startsWith("3°")) {
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

  if (curso.startsWith("4°")) {
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

  if (curso.startsWith("5°")) {
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

  if (curso.startsWith("6°")) {
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

export default function SeguimientoPedagogico({ alumnos }) {
  const [vistaActiva, setVistaActiva] = useState("carga");
  const [cursoSeleccionado, setCursoSeleccionado] = useState("");
  const [asignaturaSeleccionada, setAsignaturaSeleccionada] = useState("");

  const asignaturasDisponibles = obtenerAsignaturasPorCurso(cursoSeleccionado);

  return (
    <div className="seguimiento-encabezado-responsive" className="seguimiento-container">
      <h2>🚦 Seguimiento Pedagógico</h2> 

      <div className="seguimiento-botones-responsive"
        style={{
          display: "flex",
          justifyContent: "center",
          gap: "16px",
          margin: "20px 0 30px",
          flexWrap: "wrap",
          
        }}
      >
        <button type="button" onClick={() => setVistaActiva("carga")}>
          📝 Carga por asignatura
        </button>

        <button type="button" onClick={() => setVistaActiva("resumen")}>
          📊 Resumen del curso
        </button>

        <button type="button" onClick={() => setVistaActiva("detalle")}>
          👤 Ficha del estudiante
        </button>
      </div>

      <div  className="filtros-seguimiento-responsive" style={{ marginBottom: "20px" }}>
        <label>Curso:&nbsp;</label>

        <select
          className="select-seguimiento-responsive"
          value={cursoSeleccionado}
          onChange={(e) => {
            setCursoSeleccionado(e.target.value);
            setAsignaturaSeleccionada("");
          }}
        >
          <option value="">Seleccionar curso</option>

          {cursos.map((curso) => (
            <option key={curso} value={curso}>
              {curso}
            </option>
          ))}
        </select>
      </div>

      {vistaActiva === "carga" && (
        <>
          <div style={{ marginBottom: "20px" }}>
            <label>Asignatura:&nbsp;</label>

            <select
              value={asignaturaSeleccionada}
              onChange={(e) => setAsignaturaSeleccionada(e.target.value)}
            >
              <option value="">Seleccionar asignatura</option>

              {asignaturasDisponibles.map((asignatura) => (
                <option key={asignatura} value={asignatura}>
                  {asignatura}
                </option>
              ))} 
            </select>
          </div>

          {cursoSeleccionado && asignaturaSeleccionada ? (
            <TablaSeguimiento
              curso={cursoSeleccionado}
              asignatura={asignaturaSeleccionada}
              alumnos={alumnos}
            />
          ) : (
            <p style={{ color: "#666", marginTop: "20px" }}>
              Seleccioná curso y asignatura para cargar la planilla.
            </p>
          )}
        </>
      )}

      {vistaActiva === "resumen" &&
        (cursoSeleccionado ? (
          <ResumenCurso curso={cursoSeleccionado} alumnos={alumnos} />
        ) : (
          <p style={{ color: "#666", marginTop: "20px" }}>
            Seleccioná un curso para ver el resumen.
          </p>
        ))}

      {vistaActiva === "detalle" && (
        <FichaSeguimientoAlumno alumnos={alumnos} />
      )}
    </div>
  );
}