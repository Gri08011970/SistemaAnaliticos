import { useMemo } from "react";

const normalizarId = (valor) =>
  String(valor?._id || valor?.id || valor || "");

const normalizarTexto = (valor) =>
  String(valor || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();

const compararTexto = (valorA, valorB) =>
  normalizarTexto(valorA).localeCompare(
    normalizarTexto(valorB),
    "es",
    {
      numeric: true,
      sensitivity: "base",
    },
  );

const obtenerEstado = (inscripcion) =>
  String(inscripcion?.estado || "Incorporada").trim();

const incrementarMapa = (mapa, clave, cantidad = 1) => {
  const claveFinal = String(clave || "Sin informar").trim() || "Sin informar";
  mapa.set(claveFinal, (mapa.get(claveFinal) || 0) + cantidad);
};

const convertirMapaEnLista = (mapa) =>
  [...mapa.entries()]
    .map(([etiqueta, valor]) => ({
      etiqueta,
      valor,
    }))
    .sort((a, b) => {
      if (b.valor !== a.valor) {
        return b.valor - a.valor;
      }

      return compararTexto(a.etiqueta, b.etiqueta);
    });

export default function EstadisticasFotia({
  periodoActivo = null,
  inscripcionesFotia = [],
  onVolver,
}) {
  const datos = useMemo(() => {
    const periodoId = normalizarId(periodoActivo);

    const inscripcionesDelPeriodo = inscripcionesFotia.filter(
      (inscripcion) => {
        if (inscripcion?.activo === false) return false;

        if (!periodoId) return true;

        return (
          normalizarId(inscripcion?.periodoId) === periodoId
        );
      },
    );

    const estudiantesUnicos = new Set();
    const docentesParticipantes = new Set();

    const alumnosPorCurso = new Map();
    const alumnosUnicosPorCurso = new Map();
    const areasPorAsignatura = new Map();
    const areasPorDocente = new Map();
    const acreditacionesPorAsignatura = new Map();

    let acreditadas = 0;
    let incorporadas = 0;
    let enProceso = 0;
    let suspendidas = 0;
    let finalizadasSinAcreditar = 0;

    inscripcionesDelPeriodo.forEach((inscripcion) => {
      const alumnoId = normalizarId(inscripcion?.alumnoId);
      const docenteId = normalizarId(inscripcion?.docenteId);
      const curso = inscripcion?.curso || "Sin curso";
      const asignatura =
        inscripcion?.asignatura || "Sin asignatura";
      const docente =
        inscripcion?.docenteNombre || "Sin docente asignado";
      const estado = obtenerEstado(inscripcion);

      if (alumnoId) {
        estudiantesUnicos.add(alumnoId);

        if (!alumnosUnicosPorCurso.has(curso)) {
          alumnosUnicosPorCurso.set(curso, new Set());
        }

        alumnosUnicosPorCurso.get(curso).add(alumnoId);
      }

      if (docenteId) {
        docentesParticipantes.add(docenteId);
      }

      incrementarMapa(areasPorAsignatura, asignatura);
      incrementarMapa(areasPorDocente, docente);

      if (!acreditacionesPorAsignatura.has(asignatura)) {
        acreditacionesPorAsignatura.set(asignatura, {
          total: 0,
          acreditadas: 0,
        });
      }

      const resumenAsignatura =
        acreditacionesPorAsignatura.get(asignatura);

      resumenAsignatura.total += 1;

      if (estado === "Acreditada") {
        acreditadas += 1;
        resumenAsignatura.acreditadas += 1;
      } else if (estado === "En proceso") {
        enProceso += 1;
      } else if (estado === "Suspendida") {
        suspendidas += 1;
      } else if (
        estado === "Finalizada sin acreditar"
      ) {
        finalizadasSinAcreditar += 1;
      } else {
        incorporadas += 1;
      }
    });

    alumnosUnicosPorCurso.forEach((alumnos, curso) => {
      alumnosPorCurso.set(curso, alumnos.size);
    });

    const totalAreas = inscripcionesDelPeriodo.length;

    const enFortalecimiento =
      incorporadas + enProceso;

    const porcentajeAcreditacion =
      totalAreas > 0
        ? Math.round((acreditadas / totalAreas) * 100)
        : 0;

    const acreditacionPorAsignatura = [
      ...acreditacionesPorAsignatura.entries(),
    ]
      .map(([etiqueta, resumen]) => ({
        etiqueta,
        total: resumen.total,
        acreditadas: resumen.acreditadas,
        porcentaje:
          resumen.total > 0
            ? Math.round(
                (resumen.acreditadas / resumen.total) * 100,
              )
            : 0,
      }))
      .sort((a, b) => {
        if (b.porcentaje !== a.porcentaje) {
          return b.porcentaje - a.porcentaje;
        }

        if (b.total !== a.total) {
          return b.total - a.total;
        }

        return compararTexto(a.etiqueta, b.etiqueta);
      });

    return {
      resumen: {
        estudiantes: estudiantesUnicos.size,
        areas: totalAreas,
        acreditadas,
        enFortalecimiento,
        docentes: docentesParticipantes.size,
        incorporadas,
        enProceso,
        suspendidas,
        finalizadasSinAcreditar,
        porcentajeAcreditacion,
      },
      porCurso: convertirMapaEnLista(alumnosPorCurso),
      porAsignatura: convertirMapaEnLista(
        areasPorAsignatura,
      ),
      porDocente: convertirMapaEnLista(areasPorDocente),
      acreditacionPorAsignatura,
    };
  }, [inscripcionesFotia, periodoActivo]);

  const tarjetasPrincipales = [
    {
      icono: "🎓",
      titulo: "Estudiantes",
      valor: datos.resumen.estudiantes,
      detalle: "Participan del período activo.",
      borde: "#9fc7e8",
      fondo: "#f2f8fd",
      color: "#24577f",
    },
    {
      icono: "📚",
      titulo: "Áreas",
      valor: datos.resumen.areas,
      detalle: "Asignaturas incorporadas.",
      borde: "#a9d6cc",
      fondo: "#f1faf7",
      color: "#256b61",
    },
    {
      icono: "🏆",
      titulo: "Acreditadas",
      valor: datos.resumen.acreditadas,
      detalle: "Áreas acreditadas en el período.",
      borde: "#b8dcca",
      fondo: "#eef8f5",
      color: "#256b61",
    },
    {
      icono: "⏳",
      titulo: "En fortalecimiento",
      valor: datos.resumen.enFortalecimiento,
      detalle: "Continúan activas.",
      borde: "#ead29d",
      fondo: "#fff9ec",
      color: "#8a5a16",
    },
    {
      icono: "📋",
      titulo: "Docentes",
      valor: datos.resumen.docentes,
      detalle: "Con áreas asignadas.",
      borde: "#cbb8e8",
      fondo: "#f8f3fc",
      color: "#65428c",
    },
    {
      icono: "📈",
      titulo: "Acreditación",
      valor: `${datos.resumen.porcentajeAcreditacion}%`,
      detalle: "Sobre el total de áreas.",
      borde: "#e5b7c0",
      fondo: "#fff4f6",
      color: "#93475a",
    },
  ];

  const noHayDatos = datos.resumen.areas === 0;

  const imprimirEstadisticasFotia = () => {
    if (noHayDatos) {
      window.alert(
        "Todavía no hay datos del período para imprimir las estadísticas.",
      );
      return;
    }

    const fechaEmision = new Date().toLocaleDateString("es-AR");
    const nombrePeriodo =
      periodoActivo?.nombre || "Sin período informado";

    const crearFilas = (items) =>
      items
        .map(
          (item) => `
            <tr>
              <td>${item.etiqueta}</td>
              <td class="valor">${item.valor}</td>
            </tr>
          `,
        )
        .join("");

    const filasEstados = [
      { etiqueta: "Incorporadas", valor: datos.resumen.incorporadas },
      { etiqueta: "En proceso", valor: datos.resumen.enProceso },
      { etiqueta: "Acreditadas", valor: datos.resumen.acreditadas },
      { etiqueta: "Suspendidas", valor: datos.resumen.suspendidas },
      {
        etiqueta: "Finalizadas sin acreditar",
        valor: datos.resumen.finalizadasSinAcreditar,
      },
    ];

    const filasAcreditacion = datos.acreditacionPorAsignatura
      .map(
        (item) => `
          <tr>
            <td>${item.etiqueta}</td>
            <td class="valor">${item.acreditadas}</td>
            <td class="valor">${item.total}</td>
            <td class="valor">${item.porcentaje}%</td>
          </tr>
        `,
      )
      .join("");

    const ventana = window.open("", "_blank");

    if (!ventana) {
      window.alert(
        "El navegador bloqueó la ventana de impresión. Habilitá las ventanas emergentes e intentá nuevamente.",
      );
      return;
    }

    ventana.document.write(`
      <!DOCTYPE html>
      <html lang="es">
        <head>
          <meta charset="UTF-8" />
          <title>Estadísticas FOTIA</title>

          <style>
            @page {
              size: A4 portrait;
              margin: 12mm;
            }

            * {
              box-sizing: border-box;
            }

            body {
              margin: 0;
              font-family: Arial, sans-serif;
              color: #243b53;
              background: #ffffff;
              font-size: 10px;
            }

            .encabezado {
              text-align: center;
              margin-bottom: 12px;
              padding-bottom: 10px;
              border-bottom: 2px solid #6f879d;
            }

            .escuela {
              margin: 0 0 4px;
              font-size: 9px;
              font-weight: 700;
              text-transform: uppercase;
              letter-spacing: 0.03em;
            }

            h1 {
              margin: 0;
              color: #1e3a5f;
              font-size: 20px;
            }

            .subtitulo {
              margin: 5px 0 0;
              color: #607080;
              font-size: 9px;
            }

            .datos-generales {
              display: flex;
              justify-content: space-between;
              gap: 12px;
              margin-bottom: 12px;
              padding: 7px 9px;
              border: 1px solid #c6d4de;
              border-radius: 5px;
              background: #f7fafc;
              font-size: 9px;
            }

            .resumen {
              display: grid;
              grid-template-columns: repeat(3, 1fr);
              gap: 7px;
              margin-bottom: 14px;
            }

            .tarjeta {
              min-height: 58px;
              padding: 8px;
              border: 1px solid #bfd3e1;
              border-radius: 6px;
              background: #f7fafc;
              text-align: center;
              break-inside: avoid;
              page-break-inside: avoid;
            }

            .tarjeta strong {
              display: block;
              margin-bottom: 4px;
              color: #1e3a5f;
              font-size: 18px;
            }

            .tarjeta span {
              color: #536779;
              font-size: 9px;
              font-weight: 700;
            }

            .seccion {
              margin-top: 13px;
              break-inside: avoid;
              page-break-inside: avoid;
            }

            .seccion h2 {
              margin: 0 0 7px;
              padding: 7px 9px;
              border: 1px solid #bfd3e1;
              border-radius: 5px 5px 0 0;
              background: #eef5f8;
              color: #294d6b;
              font-size: 12px;
            }

            .dos-columnas {
              display: grid;
              grid-template-columns: 1fr 1fr;
              gap: 10px;
              align-items: start;
            }

            table {
              width: 100%;
              border-collapse: collapse;
              table-layout: fixed;
            }

            thead {
              display: table-header-group;
            }

            tr {
              break-inside: avoid;
              page-break-inside: avoid;
            }

            th,
            td {
              border: 1px solid #b9c9d5;
              padding: 6px 7px;
            }

            th {
              background: #f2f6f8;
              color: #294d6b;
              text-align: left;
              font-size: 8.5px;
            }

            td {
              font-size: 8.5px;
            }

            td.valor {
              width: 74px;
              text-align: center;
              font-weight: 700;
              color: #1e3a5f;
            }

            .pie {
              margin-top: 15px;
              padding-top: 8px;
              border-top: 1px solid #c8d5df;
              color: #667085;
              font-size: 8px;
              text-align: right;
            }
          </style>
        </head>

        <body>
          <header class="encabezado">
            <p class="escuela">
              Escuela de Educación Secundaria N.º 140
              “Florencio Molina Campos”
            </p>

            <h1>Estadísticas institucionales FOTIA</h1>

            <p class="subtitulo">
              Informe ejecutivo del período de fortalecimiento
            </p>
          </header>

          <div class="datos-generales">
            <span>
              Período:
              <strong>${nombrePeriodo}</strong>
            </span>

            <span>
              Fecha de emisión:
              <strong>${fechaEmision}</strong>
            </span>
          </div>

          <section class="resumen">
            <div class="tarjeta">
              <strong>${datos.resumen.estudiantes}</strong>
              <span>Estudiantes</span>
            </div>

            <div class="tarjeta">
              <strong>${datos.resumen.areas}</strong>
              <span>Áreas incorporadas</span>
            </div>

            <div class="tarjeta">
              <strong>${datos.resumen.docentes}</strong>
              <span>Docentes participantes</span>
            </div>

            <div class="tarjeta">
              <strong>${datos.resumen.acreditadas}</strong>
              <span>Áreas acreditadas</span>
            </div>

            <div class="tarjeta">
              <strong>${datos.resumen.enFortalecimiento}</strong>
              <span>En fortalecimiento</span>
            </div>

            <div class="tarjeta">
              <strong>${datos.resumen.porcentajeAcreditacion}%</strong>
              <span>Porcentaje de acreditación</span>
            </div>
          </section>

          <section class="seccion">
            <h2>Distribución de estados</h2>
            <table>
              <thead>
                <tr>
                  <th>Estado</th>
                  <th>Cantidad</th>
                </tr>
              </thead>
              <tbody>
                ${crearFilas(filasEstados)}
              </tbody>
            </table>
          </section>

          <div class="dos-columnas">
            <section class="seccion">
              <h2>Estudiantes por curso</h2>
              <table>
                <thead>
                  <tr>
                    <th>Curso</th>
                    <th>Cantidad</th>
                  </tr>
                </thead>
                <tbody>
                  ${crearFilas(datos.porCurso)}
                </tbody>
              </table>
            </section>

            <section class="seccion">
              <h2>Áreas por asignatura</h2>
              <table>
                <thead>
                  <tr>
                    <th>Asignatura</th>
                    <th>Cantidad</th>
                  </tr>
                </thead>
                <tbody>
                  ${crearFilas(datos.porAsignatura)}
                </tbody>
              </table>
            </section>
          </div>

          <section class="seccion">
            <h2>Intervenciones por docente</h2>
            <table>
              <thead>
                <tr>
                  <th>Docente</th>
                  <th>Áreas asignadas</th>
                </tr>
              </thead>
              <tbody>
                ${crearFilas(datos.porDocente)}
              </tbody>
            </table>
          </section>

          <section class="seccion">
            <h2>Acreditación por asignatura</h2>
            <table>
              <thead>
                <tr>
                  <th>Asignatura</th>
                  <th>Acreditadas</th>
                  <th>Total incorporadas</th>
                  <th>Porcentaje</th>
                </tr>
              </thead>
              <tbody>
                ${filasAcreditacion}
              </tbody>
            </table>
          </section>

          <footer class="pie">
            Documento generado por el Sistema de Gestión Institucional.
          </footer>
        </body>
      </html>
    `);

    ventana.document.close();

    ventana.onload = () => {
      ventana.focus();

      window.setTimeout(() => {
        ventana.print();
      }, 250);
    };

    ventana.onafterprint = () => {
      ventana.close();
    };
  };

  return (
    <section
      style={{
        border: "1px solid #b8ddd5",
        borderRadius: "16px",
        padding: "clamp(18px, 3vw, 28px)",
        background: "#ffffff",
        boxShadow: "0 5px 14px rgba(0,0,0,.07)",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: "10px",
          marginBottom: "18px",
          flexWrap: "wrap",
        }}
      >
        <button
          type="button"
          onClick={onVolver}
          style={{
            padding: "9px 14px",
            border: "1px solid #b9cad8",
            borderRadius: "9px",
            background: "#ffffff",
            color: "#365572",
            fontWeight: "700",
            cursor: "pointer",
          }}
        >
          ← Volver a FOTIA-FORTE
        </button>

        <button
          type="button"
          onClick={imprimirEstadisticasFotia}
          disabled={noHayDatos}
          style={{
            padding: "10px 16px",
            border: "none",
            borderRadius: "9px",
            background: noHayDatos ? "#aeb9c2" : "#148c84",
            color: "#ffffff",
            fontWeight: "700",
            cursor: noHayDatos ? "not-allowed" : "pointer",
            boxShadow: noHayDatos
              ? "none"
              : "0 4px 10px rgba(20, 140, 132, 0.18)",
          }}
        >
          🖨️ Imprimir estadísticas
        </button>
      </div>

      <header
        style={{
          textAlign: "center",
          marginBottom: "24px",
        }}
      >
        <span
          style={{
            display: "block",
            marginBottom: "6px",
            color: "#5e7287",
            fontSize: "12px",
            fontWeight: "700",
            letterSpacing: "0.06em",
            textTransform: "uppercase",
          }}
        >
          Indicadores institucionales
        </span>

        <h2
          style={{
            margin: "0 0 7px",
            color: "#23436d",
            fontSize: "clamp(25px, 3vw, 31px)",
          }}
        >
          📊 Estadísticas FOTIA-FORTE
        </h2>

        <p
          style={{
            margin: 0,
            color: "#607080",
            fontSize: "15px",
          }}
        >
          Lectura institucional del período activo de fortalecimiento.
        </p>

        <div
          style={{
            display: "inline-flex",
            marginTop: "15px",
            padding: "9px 14px",
            border: "1px solid #b7ddd3",
            borderRadius: "999px",
            background: "#eef8f5",
            color: "#256b61",
            fontSize: "13px",
            fontWeight: "700",
          }}
        >
          Período:{" "}
          {periodoActivo?.nombre || "Sin período activo"}
        </div>
      </header>

      <div
        style={{
          display: "grid",
          gridTemplateColumns:
            "repeat(auto-fit, minmax(min(100%, 190px), 1fr))",
          gap: "14px",
        }}
      >
        {tarjetasPrincipales.map((tarjeta) => (
          <article
            key={tarjeta.titulo}
            style={{
              minHeight: "150px",
              padding: "18px",
              border: `1px solid ${tarjeta.borde}`,
              borderRadius: "13px",
              background: tarjeta.fondo,
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              textAlign: "center",
            }}
          >
            <div
              style={{
                marginBottom: "7px",
                fontSize: "25px",
              }}
            >
              {tarjeta.icono}
            </div>

            <strong
              style={{
                color: tarjeta.color,
                fontSize: "31px",
                lineHeight: 1,
              }}
            >
              {tarjeta.valor}
            </strong>

            <h3
              style={{
                margin: "8px 0 5px",
                color: "#294d6b",
                fontSize: "15px",
              }}
            >
              {tarjeta.titulo}
            </h3>

            <p
              style={{
                margin: 0,
                color: "#68798a",
                fontSize: "12px",
                lineHeight: 1.4,
              }}
            >
              {tarjeta.detalle}
            </p>
          </article>
        ))}
      </div>

      <section
        style={{
          marginTop: "22px",
          padding: "15px",
          border: "1px solid #c8dceb",
          borderRadius: "13px",
          background: "#f7fafc",
        }}
      >
        <h3 style={estiloTituloSeccion}>
          Distribución de estados
        </h3>

        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              "repeat(auto-fit, minmax(min(100%, 150px), 1fr))",
            gap: "9px",
          }}
        >
          <ResumenEstado
            etiqueta="Incorporadas"
            valor={datos.resumen.incorporadas}
            icono="🟡"
          />

          <ResumenEstado
            etiqueta="En proceso"
            valor={datos.resumen.enProceso}
            icono="🔵"
          />

          <ResumenEstado
            etiqueta="Acreditadas"
            valor={datos.resumen.acreditadas}
            icono="✅"
          />

          <ResumenEstado
            etiqueta="Suspendidas"
            valor={datos.resumen.suspendidas}
            icono="⏸️"
          />

          <ResumenEstado
            etiqueta="Sin acreditar"
            valor={datos.resumen.finalizadasSinAcreditar}
            icono="🔴"
          />
        </div>
      </section>

      {noHayDatos ? (
        <div
          style={{
            marginTop: "22px",
            padding: "28px 18px",
            border: "1px dashed #c7d7e3",
            borderRadius: "12px",
            background: "#fafcfd",
            color: "#607080",
            textAlign: "center",
          }}
        >
          Todavía no hay datos suficientes para construir los indicadores
          detallados del período.
        </div>
      ) : (
        <>
          <div
            style={{
              display: "grid",
              gridTemplateColumns:
                "repeat(auto-fit, minmax(min(100%, 340px), 1fr))",
              gap: "18px",
              marginTop: "22px",
            }}
          >
            <PanelBarras
              titulo="🏫 Estudiantes por curso"
              descripcion="Cantidad de estudiantes únicos incorporados en cada curso."
              datos={datos.porCurso}
              vacio="No hay cursos registrados."
            />

            <PanelBarras
              titulo="📚 Áreas por asignatura"
              descripcion="Cantidad de intervenciones registradas por área."
              datos={datos.porAsignatura}
              vacio="No hay asignaturas registradas."
            />

            <PanelBarras
              titulo=" Intervenciones por docente"
              descripcion="Áreas asignadas a cada docente responsable."
              datos={datos.porDocente}
              vacio="Todavía no hay docentes asignados."
            />
          </div>

          <section
            style={{
              marginTop: "22px",
              padding: "18px",
              border: "1px solid #c8dceb",
              borderRadius: "13px",
              background: "#ffffff",
              boxShadow:
                "0 3px 10px rgba(41, 78, 112, 0.05)",
            }}
          >
            <h3 style={estiloTituloSeccion}>
              🏆 Acreditación por asignatura
            </h3>

            <p style={estiloDescripcionSeccion}>
              Porcentaje de áreas acreditadas sobre el total incorporado en
              cada asignatura.
            </p>

            <div
              style={{
                display: "grid",
                gap: "11px",
                marginTop: "16px",
              }}
            >
              {datos.acreditacionPorAsignatura.map(
                (item) => (
                  <FilaAcreditacion
                    key={item.etiqueta}
                    item={item}
                  />
                ),
              )}
            </div>
          </section>
        </>
      )}
    </section>
  );
}

function ResumenEstado({ etiqueta, valor, icono }) {
  return (
    <div
      style={{
        padding: "10px 11px",
        border: "1px solid #d4e0e8",
        borderRadius: "10px",
        background: "#ffffff",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: "9px",
        minHeight: "62px",
      }}
    >
      <span style={{ fontSize: "18px" }}>{icono}</span>

      <div>
        <strong
          style={{
            display: "block",
            color: "#23436d",
            fontSize: "20px",
            lineHeight: 1,
          }}
        >
          {valor}
        </strong>

        <span
          style={{
            display: "block",
            marginTop: "4px",
            color: "#68798a",
            fontSize: "11px",
            fontWeight: "700",
          }}
        >
          {etiqueta}
        </span>
      </div>
    </div>
  );
}

function PanelBarras({
  titulo,
  descripcion,
  datos,
  vacio,
}) {
  const maximo = Math.max(
    1,
    ...datos.map((item) => item.valor),
  );

  return (
    <section
      style={{
        padding: "18px",
        border: "1px solid #c8dceb",
        borderRadius: "13px",
        background: "#ffffff",
        boxShadow:
          "0 3px 10px rgba(41, 78, 112, 0.05)",
      }}
    >
      <h3 style={estiloTituloSeccion}>{titulo}</h3>

      <p style={estiloDescripcionSeccion}>
        {descripcion}
      </p>

      {datos.length === 0 ? (
        <p
          style={{
            margin: "16px 0 0",
            color: "#718193",
            fontSize: "13px",
            textAlign: "center",
          }}
        >
          {vacio}
        </p>
      ) : (
        <div
          style={{
            display: "grid",
            gap: "11px",
            marginTop: "16px",
          }}
        >
          {datos.map((item) => (
            <div key={item.etiqueta}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  gap: "10px",
                  marginBottom: "5px",
                  color: "#365572",
                  fontSize: "12px",
                  fontWeight: "700",
                }}
              >
                <span>{item.etiqueta}</span>
                <span>{item.valor}</span>
              </div>

              <div
                style={{
                  height: "12px",
                  borderRadius: "999px",
                  background: "#eaf0f4",
                  overflow: "hidden",
                }}
              >
                <div
                  style={{
                    width: `${Math.max(
                      5,
                      (item.valor / maximo) * 100,
                    )}%`,
                    height: "100%",
                    borderRadius: "999px",
                    background:
                      "linear-gradient(90deg, #78a8d8, #65b8ae)",
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

function FilaAcreditacion({ item }) {
  const color =
    item.porcentaje >= 70
      ? "#4fa884"
      : item.porcentaje >= 40
        ? "#d5a33f"
        : "#d56f70";

  const fondo =
    item.porcentaje >= 70
      ? "#eef8f5"
      : item.porcentaje >= 40
        ? "#fff8e8"
        : "#fff1f1";

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns:
          "minmax(160px, 1fr) minmax(180px, 2fr) auto",
        gap: "12px",
        alignItems: "center",
        padding: "11px 13px",
        border: "1px solid #d6e1e8",
        borderRadius: "10px",
        background: fondo,
      }}
    >
      <div>
        <strong
          style={{
            display: "block",
            color: "#294d6b",
            fontSize: "13px",
          }}
        >
          {item.etiqueta}
        </strong>

        <span
          style={{
            color: "#718193",
            fontSize: "11px",
          }}
        >
          {item.acreditadas} de {item.total} áreas
        </span>
      </div>

      <div
        style={{
          height: "13px",
          borderRadius: "999px",
          background: "#e5ebef",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            width: `${item.porcentaje}%`,
            height: "100%",
            borderRadius: "999px",
            background: color,
          }}
        />
      </div>

      <strong
        style={{
          minWidth: "48px",
          color,
          fontSize: "15px",
          textAlign: "right",
        }}
      >
        {item.porcentaje}%
      </strong>
    </div>
  );
}

const estiloTituloSeccion = {
  margin: "0",
  color: "#294d6b",
  fontSize: "18px",
  textAlign: "center",
};

const estiloDescripcionSeccion = {
  margin: "7px 0 0",
  color: "#68798a",
  fontSize: "12px",
  lineHeight: 1.45,
  textAlign: "center",
};