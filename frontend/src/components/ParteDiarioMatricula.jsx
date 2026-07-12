function esCicloBasico(curso) {
  return (
    curso.startsWith("1") || curso.startsWith("2") || curso.startsWith("3")
  );
}

function esCicloSuperior(curso) {
  return (
    curso.startsWith("4") || curso.startsWith("5") || curso.startsWith("6")
  );
}

function contarPorSexo({ alumnosMatricula, curso, turno, sexo }) {
  return alumnosMatricula.filter(
    (alumno) =>
      alumno.estadoMatricula === "Activo" &&
      alumno.curso === curso &&
      alumno.turno === turno &&
      alumno.sexo === sexo,
  ).length;
}

function obtenerFila({ alumnosMatricula, curso, turno }) {
  const mujeres = contarPorSexo({
    alumnosMatricula,
    curso,
    turno,
    sexo: "Mujer",
  });

  const varones = contarPorSexo({
    alumnosMatricula,
    curso,
    turno,
    sexo: "Varón",
  });

  return {
    curso,
    mujeres,
    varones,
    total: mujeres + varones,
  };
}

function obtenerTotal({ alumnosMatricula, cursos, turno }) {
  return cursos.reduce(
    (acumulador, curso) => {
      const fila = obtenerFila({
        alumnosMatricula,
        curso,
        turno,
      });

      return {
        mujeres: acumulador.mujeres + fila.mujeres,
        varones: acumulador.varones + fila.varones,
        total: acumulador.total + fila.total,
      };
    },
    {
      mujeres: 0,
      varones: 0,
      total: 0,
    },
  );
}

function TablaTurno({ titulo, turno, cursos, alumnosMatricula, estilos }) {
  const {
    subtituloParte,
    tablaParte,
    celdaParteTitulo,
    celdaParte,
    celdaParteNegrita,
    celdaParteTotal,
    filaTotalBasico,
    filaTotalSuperior,
    filaTotalTurno,
  } = estilos;

  const cursosBasico = cursos.filter(esCicloBasico);
  const cursosSuperior = cursos.filter(esCicloSuperior);

  const totalBasico = obtenerTotal({
    alumnosMatricula,
    cursos: cursosBasico,
    turno,
  });

  const totalSuperior = obtenerTotal({
    alumnosMatricula,
    cursos: cursosSuperior,
    turno,
  });

  const totalTurno = obtenerTotal({
    alumnosMatricula,
    cursos,
    turno,
  });

  return (
    <div>
      <h3 style={subtituloParte}>{titulo}</h3>

      <table style={tablaParte}>
        <thead>
          <tr>
            <th style={celdaParteTitulo}>Curso</th>
            <th style={celdaParteTitulo}>Mujeres</th>
            <th style={celdaParteTitulo}>Varones</th>
            <th style={celdaParteTitulo}>Total</th>
          </tr>
        </thead>

        <tbody>
          {cursos.map((curso) => {
            const fila = obtenerFila({
              alumnosMatricula,
              curso,
              turno,
            });

            return (
              <tr key={curso}>
                <td style={celdaParte}>{fila.curso}</td>
                <td style={celdaParte}>{fila.mujeres}</td>
                <td style={celdaParte}>{fila.varones}</td>
                <td style={celdaParteNegrita}>{fila.total}</td>
              </tr>
            );
          })}

          <tr style={filaTotalBasico}>
            <td style={celdaParteNegrita}>TOTAL CICLO BÁSICO</td>
            <td style={celdaParteNegrita}>{totalBasico.mujeres}</td>
            <td style={celdaParteNegrita}>{totalBasico.varones}</td>
            <td style={celdaParteTotal}>{totalBasico.total}</td>
          </tr>

          <tr style={filaTotalSuperior}>
            <td style={celdaParteNegrita}>TOTAL CICLO SUPERIOR</td>
            <td style={celdaParteNegrita}>{totalSuperior.mujeres}</td>
            <td style={celdaParteNegrita}>{totalSuperior.varones}</td>
            <td style={celdaParteTotal}>{totalSuperior.total}</td>
          </tr>

          <tr style={filaTotalTurno}>
            <td style={celdaParteTotal}>TOTAL TURNO {turno.toUpperCase()}</td>
            <td style={celdaParteTotal}>{totalTurno.mujeres}</td>
            <td style={celdaParteTotal}>{totalTurno.varones}</td>
            <td style={celdaParteTotal}>{totalTurno.total}</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

export default function ParteDiarioMatricula({
  alumnosMatricula,
  cursosManana,
  cursosTarde,
  botonMenu,
  estilos,
}) {
  const { parteDiario, tituloParteDiario, grillaParteDiario } = estilos;

  const totalManana = obtenerTotal({
    alumnosMatricula,
    cursos: cursosManana,
    turno: "Mañana",
  });

  const totalTarde = obtenerTotal({
    alumnosMatricula,
    cursos: cursosTarde,
    turno: "Tarde",
  });

  const totalGeneral = {
    mujeres: totalManana.mujeres + totalTarde.mujeres,
    varones: totalManana.varones + totalTarde.varones,
    total: totalManana.total + totalTarde.total,
  };

  return (
    <>
      <h2
        style={{
          textAlign: "center",
          color: "#1e3a5f",
          marginBottom: "5px",
        }}
      >
        E.E.S. N° 140 "Florencio Molina Campos"
      </h2>

      <p
        style={{
          textAlign: "center",
          color: "#666",
          marginBottom: "25px",
        }}
      >
        Matrícula institucional actualizada automáticamente
      </p>

      <div id="parte-diario" style={parteDiario}>
        <div
          className="no-print"
          style={{
            display: "flex",
            justifyContent: "center",
            marginBottom: "15px",
          }}
        >
          <button
            type="button"
            className="boton-sistema boton-imprimir"
            style={botonMenu}
            onClick={() => window.print()}
          >
            🖨️ Imprimir Parte Diario
          </button>
        </div>

        <h2 style={tituloParteDiario}>📋 Parte Diario Automático</h2>

        <p>Fecha de impresión: {new Date().toLocaleString("es-AR")}</p>

        <div style={grillaParteDiario}>
          <TablaTurno
            titulo="Turno Mañana"
            turno="Mañana"
            cursos={cursosManana}
            alumnosMatricula={alumnosMatricula}
            estilos={estilos}
          />

          <TablaTurno
            titulo="Turno Tarde"
            turno="Tarde"
            cursos={cursosTarde}
            alumnosMatricula={alumnosMatricula}
            estilos={estilos}
          />
        </div>
        <div
          style={{
            marginTop: "20px",
            padding: "16px",
            border: "3px solid #1e5f5c",
            borderRadius: "14px",
            background: "#e6f4f2",
            boxShadow: "0 6px 16px rgba(22, 58, 95, 0.14)",
          }}
        >
          <h3
            style={{
              margin: "0 0 14px",
              textAlign: "center",
              color: "#1e3a5f",
              fontSize: "19px",
            }}
          >
            TOTAL GENERAL — AMBOS TURNOS
          </h3>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              gap: "12px",
              textAlign: "center",
            }}
          >
            <div>
              <strong>Mujeres</strong>
              <div
                style={{
                  marginTop: "5px",
                  fontSize: "22px",
                  fontWeight: "800",
                  color: "#1e3a5f",
                }}
              >
                {totalGeneral.mujeres}
              </div>
            </div>

            <div>
              <strong>Varones</strong>
              <div
                style={{
                  marginTop: "5px",
                  fontSize: "22px",
                  fontWeight: "800",
                  color: "#1e3a5f",
                }}
              >
                {totalGeneral.varones}
              </div>
            </div>

            <div>
              <strong>Total</strong>
              <div
                style={{
                  marginTop: "5px",
                  fontSize: "24px",
                  fontWeight: "900",
                  color: "#0f766e",
                }}
              >
                {totalGeneral.total}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
