function TarjetaMateriaFotia({
  materia,
  seleccionada,
  onCambiarSeleccion,
}) {
  const esPrevia = materia.tipoOrigen === "Previa";

  return (
    <label
      style={{
        display: "flex",
        alignItems: "flex-start",
        gap: "11px",
        padding: "14px",
        border: seleccionada
          ? esPrevia
            ? "2px solid #d4a94f"
            : "2px solid #74b9aa"
          : esPrevia
            ? "2px solid #ead9b8"
            : "2px solid #cfe4df",
        borderRadius: "11px",
        background: seleccionada
          ? esPrevia
            ? "#fff8e8"
            : "#eef8f5"
          : "#ffffff",
        cursor: "pointer",
        transition: "all 0.15s ease",
      }}
    >
      <input
        type="checkbox"
        checked={seleccionada}
        onChange={() => onCambiarSeleccion(materia)}
        style={{
          marginTop: "3px",
          width: "18px",
          height: "18px",
          cursor: "pointer",
        }}
      />

      <span>
        <strong
          style={{
            display: "block",
            color: "#23436d",
            fontSize: "16px",
          }}
        >
          {materia.asignatura}
        </strong>

        <span
          style={{
            display: "block",
            marginTop: "4px",
            color: esPrevia ? "#8a5a16" : "#256b61",
            fontSize: "13px",
            fontWeight: "700",
          }}
        >
          {esPrevia ? "📕 Previa" : "📘 En curso"}
        </span>

        <span
          style={{
            display: "block",
            marginTop: "3px",
            color: "#68798a",
            fontSize: "14px",
          }}
        >
          {materia.anio
            ? `${materia.anio}° año`
            : "Año sin informar"}
        </span>
      </span>
    </label>
  );
}

function GrupoMateriasFotia({
  titulo,
  descripcion,
  materias,
  materiasSeleccionadas,
  obtenerIdMateria,
  onCambiarSeleccion,
  mensajeVacio,
}) {
  return (
    <section style={{ marginBottom: "24px" }}>
      <h4
        style={{
          margin: "0 0 8px",
          color: "#23436d",
          fontSize: "17px",
          textAlign: "left",
        }}
      >
        {titulo}
      </h4>

      <p
        style={{
          margin: "0 0 14px",
          color: "#68798a",
          fontSize: "14px",
          textAlign: "left",
        }}
      >
        {descripcion}
      </p>

      {materias.length === 0 ? (
        <div
          style={{
            padding: "14px",
            borderRadius: "10px",
            background: "#f6f8fa",
            color: "#68798a",
            textAlign: "center",
            fontWeight: "700",
          }}
        >
          {mensajeVacio}
        </div>
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              "repeat(auto-fit, minmax(min(100%, 230px), 1fr))",
            gap: "12px",
          }}
        >
          {materias.map((materia) => {
            const materiaId = obtenerIdMateria(materia);

            return (
              <TarjetaMateriaFotia
                key={materiaId}
                materia={materia}
                seleccionada={materiasSeleccionadas.includes(
                  materiaId,
                )}
                onCambiarSeleccion={onCambiarSeleccion}
              />
            );
          })}
        </div>
      )}
    </section>
  );
}

export default function ListadoMateriasFotia({
  materiasPreviasDisponibles = [],
  materiasEnCursoDisponibles = [],
  materiasSeleccionadas = [],
  obtenerIdMateria,
  onCambiarSeleccion,
  onSeleccionarTodas,
  onLimpiarSeleccion,
}) {
  return (
    <div
      style={{
        marginTop: "20px",
        padding: "18px",
        border: "1px solid #c5d9ea",
        borderRadius: "13px",
        background: "#ffffff",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "12px",
          marginBottom: "18px",
        }}
      >
        <div>
          <h4
            style={{
              margin: "0 0 5px",
              color: "#23436d",
              fontSize: "18px",
            }}
          >
            📚 Asignaturas para fortalecer
          </h4>

          <p
            style={{
              margin: 0,
              color: "#607080",
              lineHeight: 1.4,
            }}
          >
            Seleccioná solamente las asignaturas que formarán
            parte de este período de FOTIA.
          </p>
        </div>

        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "8px",
          }}
        >
          <button
            type="button"
            onClick={onSeleccionarTodas}
            style={{
              padding: "8px 12px",
              border: "1px solid #b7ddd3",
              borderRadius: "8px",
              background: "#eef8f5",
              color: "#256b61",
              cursor: "pointer",
              fontWeight: "700",
            }}
          >
            Seleccionar todas
          </button>

          <button
            type="button"
            onClick={onLimpiarSeleccion}
            style={{
              padding: "8px 12px",
              border: "1px solid #d4dce4",
              borderRadius: "8px",
              background: "#f6f8fa",
              color: "#56697a",
              cursor: "pointer",
              fontWeight: "700",
            }}
          >
            Limpiar selección
          </button>
        </div>
      </div>

      <GrupoMateriasFotia
        titulo="📕 Asignaturas previas"
        descripcion="Asignaturas pendientes de años anteriores."
        materias={materiasPreviasDisponibles}
        materiasSeleccionadas={materiasSeleccionadas}
        obtenerIdMateria={obtenerIdMateria}
        onCambiarSeleccion={onCambiarSeleccion}
        mensajeVacio="El estudiante no posee asignaturas previas."
      />

      <GrupoMateriasFotia
        titulo="📘 Asignaturas del año en curso"
        descripcion="Saberes que el estudiante necesita fortalecer durante el año que está cursando."
        materias={materiasEnCursoDisponibles}
        materiasSeleccionadas={materiasSeleccionadas}
        obtenerIdMateria={obtenerIdMateria}
        onCambiarSeleccion={onCambiarSeleccion}
        mensajeVacio="No se encontraron asignaturas para el curso informado."
      />

      <div
        style={{
          marginTop: "4px",
          padding: "11px 14px",
          borderRadius: "9px",
          background:
            materiasSeleccionadas.length > 0
              ? "#eef8f5"
              : "#fff8e8",
          color:
            materiasSeleccionadas.length > 0
              ? "#256b61"
              : "#8a5a16",
          textAlign: "center",
          fontWeight: "700",
        }}
      >
        {materiasSeleccionadas.length === 0
          ? "Todavía no seleccionaste ninguna asignatura."
          : `${materiasSeleccionadas.length} ${
              materiasSeleccionadas.length === 1
                ? "asignatura seleccionada"
                : "asignaturas seleccionadas"
            } para el fortalecimiento.`}
      </div>
    </div>
  );
}