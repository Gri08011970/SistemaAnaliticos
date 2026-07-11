export default function EdadesCursoMatricula({
  edadesDelCurso,
  estilos,
}) {
  const { bloqueEdades, grillaEdades, tarjetaEdad } = estilos;

  const edadesOrdenadas = Object.entries(edadesDelCurso).sort(
    (a, b) => Number(a[0]) - Number(b[0]),
  );

  if (edadesOrdenadas.length === 0) return null;

  return (
    <div style={bloqueEdades}>
      <h3 style={{ color: "#1e3a5f" }}>
        Edades del curso
      </h3>

      <div style={grillaEdades}>
        {edadesOrdenadas.map(([edad, cantidad]) => (
          <div key={edad} style={tarjetaEdad}>
            <strong>{edad} años</strong>
            <p>{cantidad}</p>
          </div>
        ))}
      </div>
    </div>
  );
}