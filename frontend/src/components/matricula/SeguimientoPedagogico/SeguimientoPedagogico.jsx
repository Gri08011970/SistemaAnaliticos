import { useState } from "react";
import TablaSeguimiento from "./TablaSeguimiento";

export default function SeguimientoPedagogico({ alumnos }) {
  const [cursoSeleccionado, setCursoSeleccionado] = useState("");
  const [asignaturaSeleccionada, setAsignaturaSeleccionada] = useState("");

  return (
    <div className="seguimiento-container">
      <h2>🚦 Seguimiento Pedagógico</h2>

      <div style={{ marginBottom: "20px" }}>
        <label>Curso:&nbsp;</label>

        <select
          value={cursoSeleccionado}
          onChange={(e) => setCursoSeleccionado(e.target.value)}
        >
          <option value="">Seleccionar curso</option>

          <option value="1°1°">1°1°</option>
          <option value="1°2°">1°2°</option>

          <option value="2°1°">2°1°</option>
          <option value="2°2°">2°2°</option>

          <option value="3°1°">3°1°</option>
          <option value="3°2°">3°2°</option>

          <option value="4°1°">4°1°</option>
          <option value="4°2°">4°2°</option>

          <option value="5°1°">5°1°</option>
          <option value="5°2°">5°2°</option>

          <option value="6°1°">6°1°</option>
          <option value="6°2°">6°2°</option>

           <option value="1°3°">1°3°</option>
          <option value="1°4°">1°4°</option>

          <option value="2°3°">2°3°</option>
          <option value="2°4°">2°4°</option>

          <option value="3°3°">3°3°</option>
          <option value="3°4°">3°4°</option>

          <option value="4°3°">4°3°</option>
          <option value="4°4°">4°4°</option>

          <option value="5°3°">5°3°</option>
          <option value="5°4°">5°4°</option>

          <option value="6°3°">6°3°</option>
          <option value="6°4°">6°4°</option>
        </select>
      </div>
      <div style={{ marginBottom: "20px" }}>
        <label>Asignatura:&nbsp;</label>

        <select
          value={asignaturaSeleccionada}
          onChange={(e) => setAsignaturaSeleccionada(e.target.value)}
        >
          <option value="">Seleccionar asignatura</option>
          <option value="Prácticas del Lenguaje">Prácticas del Lenguaje</option>
          <option value="Matemática">Matemática</option>
          <option value="Ciencias Sociales">Ciencias Sociales</option>
          <option value="Ciencias Naturales">Ciencias Naturales</option>
          <option value="Inglés">Inglés</option>
          <option value="Educación Artística">Educación Artística</option>
          <option value="Educación Física">Educación Física</option>
          <option value="Construcción de Ciudadanía">
            Construcción de Ciudadanía
          </option>
        </select>
      </div>

      {cursoSeleccionado && asignaturaSeleccionada && (
        <TablaSeguimiento
          curso={cursoSeleccionado}
          asignatura={asignaturaSeleccionada}
          alumnos={alumnos}
        />
      )}
    </div>
  );
}
