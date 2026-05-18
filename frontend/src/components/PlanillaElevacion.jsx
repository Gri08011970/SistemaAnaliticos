export default function PlanillaElevacion({
  estudiantes
}) {
  const seleccionados = estudiantes.filter(
    (alumno) => alumno.seleccionado
  )

  if (seleccionados.length === 0) {
    return null
  }

  function imprimirPlanillaElevacion() {
    const filas = seleccionados.map((alumno, index) => `
      <tr>
        <td>${index + 1}</td>
        <td>${alumno.nombre || ""}</td>
        <td>${alumno.dni || ""}</td>
        <td>${alumno.ultimoAnio || ""}</td>
        <td>SECUNDARIA</td>
        <td>302/12</td>
        <td></td>
      </tr>
    `).join("")

    const ventana = window.open("", "_blank")

    ventana.document.write(`
      <html>
        <head>
          <title>Planilla de Elevación</title>

          <style>
            body {
              font-family: Arial;
              padding: 25px;
              color: black;
              font-size: 12px;
            }

            p {
              margin: 3px 0;
            }

            .encabezado {
              display: flex;
              justify-content: space-between;
              gap: 20px;
              margin-bottom: 30px;
            }

            .negrita {
              font-weight: bold;
            }

            .centro {
              text-align: center;
              margin: 30px 0;
              font-weight: bold;
            }

            table {
              width: 100%;
              border-collapse: collapse;
              margin-top: 20px;
            }

            th, td {
              border: 1px solid black;
              padding: 8px;
              text-align: center;
            }

            th {
              font-weight: bold;
            }

            .firmas {
              display: flex;
              justify-content: space-around;
              margin-top: 50px;
              font-weight: bold;
            }
          </style>
        </head>

        <body>
          <div class="encabezado">
            <div>
              <p>DIRECCIÓN GENERAL DE CULTURA Y EDUCACIÓN</p>
              <p>PROVINCIA DE BUENOS AIRES</p>
              <p>INSPECCIÓN DE EDUCACIÓN SECUNDARIA</p>
              <p class="negrita">E.E.S. N° 140</p>
              <p class="negrita">LOCALIDAD: RAFAEL CASTILLO, DISTRITO LA MATANZA</p>
            </div>

            <div>
              <p>FECHA DE ENTREGA: ____ / ____ / ______</p>
              <p>FECHA DE LEGALIZACIÓN: ____ / ____ / ______</p>
            </div>
          </div>

          <p>JEFATURA DISTRITAL - LA MATANZA - REGIÓN 3°</p>

          <div class="centro">
            <p>LA DIRECCIÓN DE LA ESCUELA DE EDUCACIÓN SECUNDARIA N° 140 DE LA MATANZA</p>
            <p>ELEVA A USTED, ANALÍTICOS PARCIALES PARA SU LEGALIZACIÓN, QUE A CONTINUACIÓN SE DETALLAN</p>
          </div>

          <table>
            <thead>
              <tr>
                <th>N°</th>
                <th>APELLIDO Y NOMBRE</th>
                <th>DNI</th>
                <th>Último Año Cursado</th>
                <th>MODALIDAD</th>
                <th>RESOLUCIÓN N°</th>
                <th>FIRMA Y ACLARACIÓN</th>
              </tr>
            </thead>

            <tbody>
              ${filas}
            </tbody>
          </table>

          <div class="firmas">
            <p>ESTABLECIMIENTO</p>
            <p>DIRECTIVO</p>
          </div>
        </body>
      </html>
    `)

    ventana.document.close()
    ventana.print()
  }

  return (
    <div style={contenedor}>

      <div style={encabezadoSuperior}>
        <div>
          <p style={textoChico}>DIRECCIÓN GENERAL DE CULTURA Y EDUCACIÓN</p>
          <p style={textoChico}>PROVINCIA DE BUENOS AIRES</p>
          <p style={textoChico}>INSPECCIÓN DE EDUCACIÓN SECUNDARIA</p>
          <p style={textoNegrita}>E.E.S. N° 140</p>
          <p style={textoNegrita}>
            LOCALIDAD: RAFAEL CASTILLO, DISTRITO LA MATANZA
          </p>
        </div>

        <div>
          <p style={textoChico}>FECHA DE ENTREGA: ____ / ____ / ______</p>
          <p style={textoChico}>FECHA DE LEGALIZACIÓN: ____ / ____ / ______</p>
        </div>
      </div>

      <p style={textoChico}>
        JEFATURA DISTRITAL - LA MATANZA - REGIÓN 3°
      </p>

      <div style={textoCentral}>
        <p>
          LA DIRECCIÓN DE LA ESCUELA DE EDUCACIÓN SECUNDARIA N° 140 DE LA MATANZA
        </p>

        <p>
          ELEVA A USTED, ANALÍTICOS PARCIALES PARA SU LEGALIZACIÓN,
          QUE A CONTINUACIÓN SE DETALLAN
        </p>
      </div>

      <button
        onClick={imprimirPlanillaElevacion}
        style={botonImprimir}
      >
        Imprimir / Guardar PDF
      </button>

      <table style={tabla}>
        <thead>
          <tr>
            <th style={celda}>N°</th>
            <th style={celda}>APELLIDO Y NOMBRE</th>
            <th style={celda}>DNI</th>
            <th style={celda}>Último Año Cursado</th>
            <th style={celda}>MODALIDAD</th>
            <th style={celda}>RESOLUCIÓN N°</th>
            <th style={celda}>FIRMA Y ACLARACIÓN</th>
          </tr>
        </thead>

        <tbody>
          {seleccionados.map((alumno, index) => (
            <tr key={alumno._id}>
              <td style={celda}>{index + 1}</td>
              <td style={celda}>{alumno.nombre}</td>
              <td style={celda}>{alumno.dni}</td>
              <td style={celda}>{alumno.ultimoAnio}</td>
              <td style={celda}>SECUNDARIA</td>
              <td style={celda}>302/12</td>
              <td style={celda}></td>
            </tr>
          ))}
        </tbody>
      </table>

      <div style={firmas}>
        <p>ESTABLECIMIENTO</p>
        <p>DIRECTIVO</p>
      </div>

    </div>
  )
}

const contenedor = {
  marginTop: "50px",
  backgroundColor: "white",
  padding: "30px",
  borderRadius: "10px",
  boxShadow: "0 0 10px rgba(0,0,0,0.1)",
  color: "black",
  fontFamily: "Arial",
  fontSize: "12px"
}

const encabezadoSuperior = {
  display: "flex",
  justifyContent: "space-between",
  gap: "20px",
  marginBottom: "30px"
}

const textoChico = {
  margin: "3px 0"
}

const textoNegrita = {
  margin: "3px 0",
  fontWeight: "bold"
}

const textoCentral = {
  textAlign: "center",
  margin: "30px 0",
  fontWeight: "bold"
}

const tabla = {
  width: "100%",
  borderCollapse: "collapse"
}

const celda = {
  border: "1px solid black",
  padding: "8px",
  textAlign: "center"
}

const firmas = {
  display: "flex",
  justifyContent: "space-around",
  marginTop: "50px",
  fontWeight: "bold"
}

const botonImprimir = {
  backgroundColor: "#1e3a5f",
  color: "white",
  border: "none",
  padding: "10px 15px",
  borderRadius: "8px",
  cursor: "pointer",
  marginBottom: "15px"
}