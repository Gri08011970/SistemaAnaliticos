export default function FormularioAlumnoMatricula({
  esAdmin,
  nuevoAlumno,
  setNuevoAlumno,
  previaSeleccionada,
  setPreviaSeleccionada,
  anioPrevia,
  setAnioPrevia,
  asignaturas,
  aniosMateria,
  agregarPrevia,
  eliminarPrevia,
  guardarAlumnoMatricula,
  limpiarFormulario,
  guardando,
  alumnoEditando,
  estilos,
}) {
  if (!esAdmin) return null;

  return (
    <div
      id="formulario-matricula"
      className="formulario-alumno-matricula"
      style={estilos.formularioAlumno}
      className="no-print"
    >
      <input placeholder="Apellido" style={estilos.inputAlumno} value={nuevoAlumno.apellido} onChange={(e) => setNuevoAlumno({ ...nuevoAlumno, apellido: e.target.value })} />
      <input placeholder="Nombre" style={estilos.inputAlumno} value={nuevoAlumno.nombre} onChange={(e) => setNuevoAlumno({ ...nuevoAlumno, nombre: e.target.value })} />
      <input placeholder="DNI" style={estilos.inputAlumno} value={nuevoAlumno.dni} onChange={(e) => setNuevoAlumno({ ...nuevoAlumno, dni: e.target.value })} />
      <input placeholder="N° legajo" style={estilos.inputAlumno} value={nuevoAlumno.legajoNumero} onChange={(e) => setNuevoAlumno({ ...nuevoAlumno, legajoNumero: e.target.value })} />
      <input placeholder="Año legajo" style={estilos.inputAlumno} value={nuevoAlumno.legajoAnio} onChange={(e) => setNuevoAlumno({ ...nuevoAlumno, legajoAnio: e.target.value })} />

      <select style={estilos.inputAlumno} value={nuevoAlumno.nacionalidad} onChange={(e) => setNuevoAlumno({ ...nuevoAlumno, nacionalidad: e.target.value })}>
        <option value="">Nacionalidad</option>
        <option value="Argentina">Argentina</option>
        <option value="Boliviana">Boliviana</option>
        <option value="Paraguaya">Paraguaya</option>
        <option value="Peruana">Peruana</option>
        <option value="Chilena">Chilena</option>
        <option value="Otros">Otros</option>
      </select>

      <select style={estilos.inputAlumno} value={nuevoAlumno.sexo} onChange={(e) => setNuevoAlumno({ ...nuevoAlumno, sexo: e.target.value })}>
        <option value="">Sexo</option>
        <option value="Mujer">Mujer</option>
        <option value="Varón">Varón</option>
      </select>

      <input placeholder="Folio matriz" style={estilos.inputAlumno} value={nuevoAlumno.folioMatriz} onChange={(e) => setNuevoAlumno({ ...nuevoAlumno, folioMatriz: e.target.value })} />

      <input type="date" style={estilos.inputAlumno} value={nuevoAlumno.fechaNacimiento} onChange={(e) => setNuevoAlumno({ ...nuevoAlumno, fechaNacimiento: e.target.value })} />

      <div
         className="bloque-previas-responsive"
         style={estilos.bloquePrevias}>
        <select style={estilos.inputAlumno} value={previaSeleccionada} onChange={(e) => setPreviaSeleccionada(e.target.value)}>
          <option value="">Asignatura</option>
          {asignaturas.map((asignatura) => (
            <option key={asignatura} value={asignatura}>{asignatura}</option>
          ))}
        </select>

        <select style={estilos.inputAlumno} value={anioPrevia} onChange={(e) => setAnioPrevia(e.target.value)}>
          <option value="">Año</option>
          {aniosMateria.map((anio) => (
            <option key={anio} value={anio}>{anio}</option>
          ))}
        </select>

        <button type="button" style={estilos.botonAgregarPrevia} onClick={agregarPrevia}>
          Agregar previa
        </button>

        <div className="lista-previas-responsive" style={estilos.listaPreviasInline}>
          {nuevoAlumno.materiasPendientes.map((previa, index) => (
            <div key={index} style={estilos.chipPrevia}>
              {previa.asignatura} ({previa.anio})
              <button type="button" style={estilos.botonEliminar} onClick={() => eliminarPrevia(index)}>
                🗑️
              </button>
            </div>
          ))}
        </div>
      </div>

      <select
        value={nuevoAlumno.condicionFinal}
        onChange={(e) => setNuevoAlumno({ ...nuevoAlumno, condicionFinal: e.target.value })}
      >
        <option value="">Seleccionar condición</option>
        <option value="Ingresante">Ingresante al nivel</option>
        <option value="Reinscripto">Reinscripto</option>
        <option value="Prom">Prom</option>
        <option value="Rec">Rec</option>
      </select>

      <button style={estilos.botonAgregar} onClick={guardarAlumnoMatricula} disabled={guardando}>
        {guardando ? "Guardando..." : alumnoEditando ? "Guardar cambios" : "Agregar estudiante"}
      </button>

      <button style={estilos.botonVolver} onClick={limpiarFormulario}>
        Limpiar formulario
      </button>
    </div>
  );
}