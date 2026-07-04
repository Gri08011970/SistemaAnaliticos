import { useEffect, useState } from "react";
import axios from "axios";
import "./App.css";
import Busqueda from "./components/Busqueda";
import TablaEstudiantes from "./components/TablaEstudiantes";
import Estadisticas from "./components/Estadisticas";
import FormularioNuevo from "./components/FormularioNuevo";
import PlanillaElevacion from "./components/PlanillaElevacion";
import ImportarExcel from "./components/ImportarExcel";
import Login from "./components/Login";
import Matricula from "./components/Matricula";
import PortadaInstitucional from "./components/PortadaInstitucional";
import DomicilioTelefono from "./components/DomicilioTelefono";
import AutorizadosRetirar from "./components/AutorizadosRetirar";

export default function App() {
  const rolUsuario = localStorage.getItem("rolUsuario") || "consulta";
  const esAdmin = rolUsuario === "admin";
  const nombreUsuario = localStorage.getItem("nombreUsuario") || "Usuario";
  const ultimoAcceso = localStorage.getItem("ultimoAcceso");
  const [logueado, setLogueado] = useState(() => {
    return localStorage.getItem("rolUsuario") !== null;
  });
  const [dniBusqueda, setDniBusqueda] = useState("");
  const [apellidoBusqueda, setApellidoBusqueda] = useState("");
  const [estadoFiltro, setEstadoFiltro] = useState("Todos");
  const [estudiantes, setEstudiantes] = useState([]);
  const [alumnoEditando, setAlumnoEditando] = useState(null);
  const [modoImprimirLista, setModoImprimirLista] = useState(false);
  const [seccionActiva, setSeccionActiva] = useState("inicio");

  const [fechaDesde, setFechaDesde] = useState("");
  const [fechaHasta, setFechaHasta] = useState("");
  const [mostrarPortada, setMostrarPortada] = useState(true);
  const [alumnosMatricula, setAlumnosMatricula] = useState([]);
  const [mostrarDespedida, setMostrarDespedida] = useState(false);

  useEffect(() => {
    obtenerAlumnos();
  }, []);

  async function obtenerAlumnos() {
    try {
      const respuesta = await axios.get("/alumnos");
      setEstudiantes(Array.isArray(respuesta.data) ? respuesta.data : []);
    } catch (error) {
      console.log(error);
    }
  }

  async function importarEstudiantes(alumnosImportados) {
    try {
      await axios.post("/alumnos/importar", {
        alumnos: alumnosImportados,
      });

      obtenerAlumnos();
      setSeccionActiva("lista");
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    obtenerMatricula();
  }, []);

  async function obtenerMatricula() {
    try {
      const respuesta = await axios.get("/api/matricula");
      setAlumnosMatricula(Array.isArray(respuesta.data) ? respuesta.data : []);
    } catch (error) {
      console.log(error);
    }
  }

  async function agregarEstudiante(nuevoEstudiante) {
    try {
      await axios.post("/alumnos", nuevoEstudiante);
      obtenerAlumnos();
      setSeccionActiva("lista");
    } catch (error) {
      if (error.response?.status === 400) {
        alert(error.response.data.mensaje);
        return;
      }

      console.log(error);
      alert("Error al guardar el pedido");
    }
  }

  function cancelarFormulario() {
    setAlumnoEditando(null);
    setSeccionActiva("nuevo");
  }

  async function actualizarEstudianteEditado(id, datosActualizados) {
    try {
      await axios.put(`/alumnos/${id}`, datosActualizados);

      obtenerAlumnos();
      setAlumnoEditando(null);
      setSeccionActiva("lista");
    } catch (error) {
      console.log(error);
    }
  }

  async function actualizarEstado(id, nuevoEstado) {
    try {
      await axios.put(`/alumnos/${id}`, {
        estado: nuevoEstado,
      });

      obtenerAlumnos();
    } catch (error) {
      console.log(error);
    }
  }

  async function actualizarCarpeta(id, nuevaCarpeta) {
    try {
      await axios.put(`/alumnos/${id}`, {
        carpeta: nuevaCarpeta,
      });

      obtenerAlumnos();
    } catch (error) {
      console.log(error);
    }
  }

  async function eliminarEstudiante(id) {
    const confirmar = window.confirm(
      "¿Seguro que querés eliminar este pedido de analítico?\n\nEsta acción no se puede deshacer.",
    );

    if (!confirmar) return;

    try {
      await axios.delete(`/alumnos/${id}`);

      setEstudiantes((anteriores) =>
        anteriores.filter((alumno) => alumno._id !== id),
      );
    } catch (error) {
      console.log(error);
      console.log(error.response);

      alert(
        error.response?.data?.mensaje ||
          error.response?.data?.error ||
          error.message,
      );
    }
  }

  function editarEstudiante(alumno) {
    setAlumnoEditando(alumno);
    setSeccionActiva("formulario");
  }

  function seleccionarAlumno(id) {
    const estudiantesActualizados = estudiantes.map((alumno) => {
      if (alumno._id === id) {
        return {
          ...alumno,
          seleccionado: !alumno.seleccionado,
        };
      }

      return alumno;
    });

    setEstudiantes(estudiantesActualizados);
  }

  function generarPlanillaElevacion() {
    const listaEstudiantes = Array.isArray(estudiantes) ? estudiantes : [];

    const seleccionados = listaEstudiantes.filter(
      (alumno) => alumno.seleccionado,
    );

    if (seleccionados.length === 0) {
      alert("Seleccioná al menos un alumno para generar la planilla.");
      return;
    }

    setSeccionActiva("eleve");
  }

  const estudiantesPorPeriodo = estudiantes.filter((alumno) => {
    let fechaAlumno = "";

    if (alumno.fechaCarga) {
      fechaAlumno = alumno.fechaCarga.slice(0, 10);
    } else if (alumno.fecha) {
      const partes = alumno.fecha.split("/");
      fechaAlumno = `${partes[2]}-${partes[1]}-${partes[0]}`;
    }

    if (!fechaAlumno) return false;

    return (
      (!fechaDesde || fechaAlumno >= fechaDesde) &&
      (!fechaHasta || fechaAlumno <= fechaHasta)
    );
  });

  if (mostrarPortada) {
    return <PortadaInstitucional entrar={() => setMostrarPortada(false)} />;
  }

  const cursosManana = [
    "1°1°",
    "1°2°",
    "2°1°",
    "2°2°",
    "3°1°",
    "3°2°",
    "4°1°",
    "4°2°",
    "5°1°",
    "5°2°",
    "6°1°",
    "6°2°",
  ];

  const cursosTarde = [
    "1°3°",
    "1°4°",
    "2°3°",
    "2°4°",
    "3°3°",
    "3°4°",
    "4°3°",
    "4°4°",
    "5°3°",
    "5°4°",
    "6°3°",
    "6°4°",
  ];

  function contarPorSexo(curso, turno, sexo) {
    return alumnosMatricula.filter(
      (alumno) =>
        alumno.curso === curso &&
        alumno.turno === turno &&
        alumno.sexo === sexo,
    ).length;
  }

  function filaParteDiario(curso, turno) {
    const mujeres = contarPorSexo(curso, turno, "Mujer");
    const varones = contarPorSexo(curso, turno, "Varón");

    return {
      curso,
      mujeres,
      varones,
      total: mujeres + varones,
    };
  }

  function totalParteDiario(cursos, turno) {
    return cursos.reduce(
      (acumulador, curso) => {
        const fila = filaParteDiario(curso, turno);

        return {
          mujeres: acumulador.mujeres + fila.mujeres,
          varones: acumulador.varones + fila.varones,
          total: acumulador.total + fila.total,
        };
      },
      { mujeres: 0, varones: 0, total: 0 },
    );
  }

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

  if (!logueado) {
    return <Login setLogueado={setLogueado} />;
  }

  return (
    <div
      style={{
        backgroundColor: "#f4f6f8",
        minHeight: "100vh",
        padding: "40px",
        fontFamily: "Arial",
        position: "relative",
      }}
    >
      <div style={tarjetaUsuario}>
        <div style={datosUsuario}>
          <strong>{nombreUsuario}</strong>

          <span
            style={rolUsuario === "admin" ? insigniaAdmin : insigniaConsulta}
          >
            {rolUsuario === "admin" ? "Administrador" : "Consulta"}
          </span>

          {ultimoAcceso && (
            <span style={ultimoAccesoTexto}>
              🕒 Último acceso: {new Date(ultimoAcceso).toLocaleString("es-AR")}
            </span>
          )}

          <button
            style={botonSalirTarjeta}
            onClick={() => setMostrarDespedida(true)}
          >
            🚪 Cerrar sesión
          </button>
        </div>
      </div>
      <div
        style={{
          backgroundColor: "white",
          padding: "30px",
          paddingTop: seccionActiva === "formulario" ? "95px" : "30px",

          borderRadius: "15px",
          boxShadow: "0 0 10px rgba(0,0,0,0.1)",
        }}
      >
        {seccionActiva !== "inicio" &&
          seccionActiva !== "parteDiario" &&
          seccionActiva !== "documentacion" && (
            <>
              <h1 style={{ color: "#1e3a5f", marginBottom: "5px" }}>
                {seccionActiva === "matricula"
                  ? "Gestión de Matrícula"
                  : seccionActiva === "domicilioTelefono"
                    ? "Domicilio y teléfono"
                    : seccionActiva === "autorizadosRetirar"
                      ? "Autorizados a retirar"
                      : "Gestión de pedidos de Analíticos"}
              </h1>

              <p
                style={{
                  color: "#666",
                  marginBottom: "30px",
                }}
              >
                <br /> Escuela Educación Secundaria N°140 "Florencio Molina
                Campos"
              </p>
            </>
          )}

        {seccionActiva === "inicio" && (
          <div style={contenedorInicio}>
            <div style={tarjetaInicio} className="tarjeta-inicio">
              <h3>Gestión de pedidos de analíticos </h3>
              <p> carga, seguimiento, estados y planilla de eleve.</p>

              <button
                className="boton-sistema boton-principal"
                style={botonMenu}
                onClick={() => setSeccionActiva("nuevo")}
              >
                Entrar
              </button>
            </div>

            <div style={tarjetaInicio} className="tarjeta-inicio">
              <h3>Gestión de Matrícula</h3>
              <p>Cursos, turnos, estudiantes, previas y movimientos.</p>

              <button
                className="boton-sistema boton-principal"
                style={botonMenu}
                onClick={() => setSeccionActiva("matricula")}
              >
                Entrar
              </button>
            </div>

            <div style={tarjetaInicio} className="tarjeta-inicio">
              <h3>📋 Parte Diario Automático</h3>
              <p>Matrícula por turno, curso, sexo y totales institucionales.</p>
              

              <button
                className="boton-sistema boton-principal"
                style={botonMenu}
                onClick={() => setSeccionActiva("parteDiario")}
              >
                Ver parte
              </button>
            </div>

            <div style={tarjetaInicio} className="tarjeta-inicio">
              <h3>📁 Documentación</h3>
              <p>DNI, Partida de Nacimiento y Analítico parcial.</p>

              <button
                className="boton-sistema boton-principal"
                style={botonMenu}
                onClick={() => setSeccionActiva("documentacion")}
              >
                Entrar
              </button>
            </div>

            <div style={tarjetaInicio} className="tarjeta-inicio">
              <h3>🏠 Domicilio / Teléfono</h3>
              <p>Datos de contacto, domicilio y recorrido desde la escuela.</p>

              <button
                className="boton-sistema boton-principal"
                style={botonMenu}
                onClick={() => setSeccionActiva("domicilioTelefono")}
              >
                Entrar
              </button>
            </div>

            <div style={tarjetaInicio} className="tarjeta-inicio">
              <h3>👥 Autorizados a retirar</h3>
              <p>Adultos autorizados, vínculo y DNI de referencia.</p>

              <button
                className="boton-sistema boton-principal"
                style={botonMenu}
                onClick={() => setSeccionActiva("autorizadosRetirar")}
              >
                Entrar
              </button>
            </div>
          </div>
        )}

        {seccionActiva !== "inicio" &&
          seccionActiva !== "matricula" &&
          seccionActiva !== "parteDiario" &&
          seccionActiva !== "documentacion" &&
          seccionActiva !== "domicilioTelefono" &&
          seccionActiva !== "autorizadosRetirar" &&
          seccionActiva !== "formulario" && (
            <>
              <Busqueda
                dniBusqueda={dniBusqueda}
                setDniBusqueda={setDniBusqueda}
                apellidoBusqueda={apellidoBusqueda}
                setApellidoBusqueda={setApellidoBusqueda}
                irATabla={() => setSeccionActiva("lista")}
              />

              <div
                style={{
                  display: "flex",
                  gap: "10px",
                  flexWrap: "wrap",
                  marginTop: "25px",
                  marginBottom: "20px",
                }}
              >
                <button
                  className="boton-sistema boton-principal"
                  onClick={() => esAdmin && setSeccionActiva("formulario")}
                  disabled={!esAdmin}
                  title={
                    esAdmin
                      ? "Nuevo pedido de analítico"
                      : "Solo el administrador puede crear nuevos pedidos"
                  }
                  style={{
                    ...botonMenu,
                    opacity: esAdmin ? 1 : 0.45,
                    cursor: esAdmin ? "pointer" : "not-allowed",
                  }}
                >
                  Nuevo Pedido de Analítico
                </button>

                <button
                  className="boton-sistema boton-principal"
                  onClick={() => {
                    setDniBusqueda("");
                    setApellidoBusqueda("");
                    setEstadoFiltro("Todos");
                    setSeccionActiva("lista");
                  }}
                  style={botonMenu}
                >
                  Ver Lista Completa
                </button>

                <button
                  className="boton-sistema boton-principal"
                  onClick={generarPlanillaElevacion}
                  style={botonMenu}
                >
                  Planilla de Eleve
                </button>

                <button
                  className="boton-sistema boton-principal"
                  onClick={() => setSeccionActiva("estadisticas")}
                  style={botonMenu}
                >
                  Estadísticas
                </button>

                <button
                  className="boton-sistema boton-volver"
                  onClick={() => setSeccionActiva("inicio")}
                  style={botonVolver}
                >
                  Volver al inicio
                </button>
              </div>
            </>
          )}
        {(seccionActiva === "matricula" || seccionActiva === "parteDiario") && (
          <div style={{ marginBottom: "20px" }}>
            <button
              className="boton-sistema boton-volver"
              onClick={() => setSeccionActiva("inicio")}
              style={botonVolver}
            >
              Volver al inicio
            </button>
          </div>
        )}
        {seccionActiva === "parteDiario" && (
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
          </>
        )}

        {seccionActiva === "parteDiario" && (
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
                className="boton-sistema boton-imprimir"
                style={botonMenu}
                onClick={() => window.print()}
              >
                🖨️ Imprimir Parte Diario
              </button>
            </div>

            <h2 style={tituloParteDiario}>📋 Parte Diario Automático</h2>
              <p>
               Fecha de impresión:
               {new Date().toLocaleString("es-AR")}
              </p>
            <div style={grillaParteDiario}>
              <div>
                <h3 style={subtituloParte}>Turno Mañana</h3>

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
                    {cursosManana.map((curso) => {
                      const fila = filaParteDiario(curso, "Mañana");

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
                      <td style={celdaParteNegrita}>
                        {
                          totalParteDiario(
                            cursosManana.filter(esCicloBasico),
                            "Mañana",
                          ).mujeres
                        }
                      </td>
                      <td style={celdaParteNegrita}>
                        {
                          totalParteDiario(
                            cursosManana.filter(esCicloBasico),
                            "Mañana",
                          ).varones
                        }
                      </td>
                      <td style={celdaParteTotal}>
                        {
                          totalParteDiario(
                            cursosManana.filter(esCicloBasico),
                            "Mañana",
                          ).total
                        }
                      </td>
                    </tr>

                    <tr style={filaTotalSuperior}>
                      <td style={celdaParteNegrita}>TOTAL CICLO SUPERIOR</td>
                      <td style={celdaParteNegrita}>
                        {
                          totalParteDiario(
                            cursosManana.filter(esCicloSuperior),
                            "Mañana",
                          ).mujeres
                        }
                      </td>
                      <td style={celdaParteNegrita}>
                        {
                          totalParteDiario(
                            cursosManana.filter(esCicloSuperior),
                            "Mañana",
                          ).varones
                        }
                      </td>
                      <td style={celdaParteTotal}>
                        {
                          totalParteDiario(
                            cursosManana.filter(esCicloSuperior),
                            "Mañana",
                          ).total
                        }
                      </td>
                    </tr>

                    <tr style={filaTotalTurno}>
                      <td style={celdaParteTotal}>TOTAL TURNO MAÑANA</td>
                      <td style={celdaParteTotal}>
                        {totalParteDiario(cursosManana, "Mañana").mujeres}
                      </td>
                      <td style={celdaParteTotal}>
                        {totalParteDiario(cursosManana, "Mañana").varones}
                      </td>
                      <td style={celdaParteTotal}>
                        {totalParteDiario(cursosManana, "Mañana").total}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div>
                <h3 style={subtituloParte}>Turno Tarde</h3>

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
                    {cursosTarde.map((curso) => {
                      const fila = filaParteDiario(curso, "Tarde");

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
                      <td style={celdaParteNegrita}>
                        {
                          totalParteDiario(
                            cursosTarde.filter(esCicloBasico),
                            "Tarde",
                          ).mujeres
                        }
                      </td>
                      <td style={celdaParteNegrita}>
                        {
                          totalParteDiario(
                            cursosTarde.filter(esCicloBasico),
                            "Tarde",
                          ).varones
                        }
                      </td>
                      <td style={celdaParteTotal}>
                        {
                          totalParteDiario(
                            cursosTarde.filter(esCicloBasico),
                            "Tarde",
                          ).total
                        }
                      </td>
                    </tr>

                    <tr style={filaTotalSuperior}>
                      <td style={celdaParteNegrita}>TOTAL CICLO SUPERIOR</td>
                      <td style={celdaParteNegrita}>
                        {
                          totalParteDiario(
                            cursosTarde.filter(esCicloSuperior),
                            "Tarde",
                          ).mujeres
                        }
                      </td>
                      <td style={celdaParteNegrita}>
                        {
                          totalParteDiario(
                            cursosTarde.filter(esCicloSuperior),
                            "Tarde",
                          ).varones
                        }
                      </td>
                      <td style={celdaParteTotal}>
                        {
                          totalParteDiario(
                            cursosTarde.filter(esCicloSuperior),
                            "Tarde",
                          ).total
                        }
                      </td>
                    </tr>

                    <tr style={filaTotalTurno}>
                      <td style={celdaParteTotal}>TOTAL TURNO TARDE</td>
                      <td style={celdaParteTotal}>
                        {totalParteDiario(cursosTarde, "Tarde").mujeres}
                      </td>
                      <td style={celdaParteTotal}>
                        {totalParteDiario(cursosTarde, "Tarde").varones}
                      </td>
                      <td style={celdaParteTotal}>
                        {totalParteDiario(cursosTarde, "Tarde").total}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <div
              style={{
                marginTop: "20px",
                borderRadius: "10px",
                overflow: "hidden",
                display: "flex",
                justifyContent: "center",
              }}
            >
              <table
                style={{
                  ...tablaParte,
                  width: "70%",
                  minWidth: "450px",
                }}
              >
                <thead>
                  <tr
                    style={{
                      backgroundColor: "#5f7f99",
                      color: "white",
                    }}
                  >
                    <th style={{ padding: "10px" }}></th>
                    <th style={{ padding: "10px" }}>Turno Mañana</th>
                    <th style={{ padding: "10px" }}>Turno Tarde</th>
                    <th style={{ padding: "10px" }}>Total</th>
                  </tr>
                </thead>

                <tbody>
                  <tr
                    style={{
                      backgroundColor: "#1e3a5f",
                      color: "white",
                      fontWeight: "bold",
                      fontSize: "16px",
                    }}
                  >
                    <td style={{ padding: "14px", textAlign: "center" }}>
                      TOTAL GENERAL ESCUELA
                    </td>

                    <td style={{ padding: "14px", textAlign: "center" }}>
                      {totalParteDiario(cursosManana, "Mañana").total}
                    </td>

                    <td style={{ padding: "14px", textAlign: "center" }}>
                      {totalParteDiario(cursosTarde, "Tarde").total}
                    </td>

                    <td style={{ padding: "14px", textAlign: "center" }}>
                      {totalParteDiario(cursosManana, "Mañana").total +
                        totalParteDiario(cursosTarde, "Tarde").total}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}

        {seccionActiva === "documentacion" && (
          <Matricula
            modoDocumentacion={true}
            volverInicio={() => setSeccionActiva("inicio")}
          />
        )}

        {seccionActiva === "domicilioTelefono" && (
          <DomicilioTelefono
            volverInicio={() => setSeccionActiva("inicio")}
            esAdmin={esAdmin}
          />
        )}

        {seccionActiva === "autorizadosRetirar" && (
          <AutorizadosRetirar
            volverInicio={() => setSeccionActiva("inicio")}
            esAdmin={esAdmin}
          />
        )}

        {seccionActiva === "formulario" && (
          <>
            {esAdmin && (
              <ImportarExcel importarEstudiantes={importarEstudiantes} />
            )}

            <FormularioNuevo
              agregarEstudiante={agregarEstudiante}
              actualizarEstudianteEditado={actualizarEstudianteEditado}
              alumnoEditando={alumnoEditando}
              setAlumnoEditando={setAlumnoEditando}
              cancelarFormulario={cancelarFormulario}
            />
          </>
        )}

        {seccionActiva === "lista" && (
          <TablaEstudiantes
            dniBusqueda={dniBusqueda}
            apellidoBusqueda={apellidoBusqueda}
            estadoFiltro={estadoFiltro}
            setEstadoFiltro={setEstadoFiltro}
            estudiantes={estudiantes}
            actualizarEstado={actualizarEstado}
            actualizarCarpeta={actualizarCarpeta}
            eliminarEstudiante={eliminarEstudiante}
            editarEstudiante={editarEstudiante}
            seleccionarAlumno={seleccionarAlumno}
            modoImprimirLista={modoImprimirLista}
            setModoImprimirLista={setModoImprimirLista}
            fechaDesde={fechaDesde}
            setFechaDesde={setFechaDesde}
            fechaHasta={fechaHasta}
            setFechaHasta={setFechaHasta}
            estudiantesPorPeriodo={estudiantesPorPeriodo}
            esAdmin={esAdmin} 
          />
        )}
        {seccionActiva === "eleve" && (
          <PlanillaElevacion estudiantes={estudiantes} />
        )}

        {seccionActiva === "estadisticas" && (
          <Estadisticas estudiantes={estudiantes} />
        )}

        {seccionActiva === "matricula" && <Matricula />}
      </div>

      {mostrarDespedida && (
        <div style={fondoModal}>
          <div style={modalDespedida}>
            <h2 style={{ color: "#1e3a5f" }}>👋 Hasta pronto</h2>

            <p>Gracias por utilizar el Sistema de Gestión Institucional</p>

            <h3 style={{ color: "#1e3a5f" }}>E.E.S. N° 140</h3>

            <p>"Florencio Molina Campos"</p>

            <p
              style={{
                fontStyle: "italic",
                marginTop: "20px",
                color: "#555",
              }}
            >
              Educar es dejar huellas en el corazón de quienes aprenden.
            </p>

            <div style={{ marginTop: "25px" }}>
              <button
                style={botonVolverModal}
                onClick={() => setMostrarDespedida(false)}
              >
                Continuar trabajando
              </button>

              <button
                style={botonSalirModal}
                onClick={() => {
                  localStorage.removeItem("rolUsuario");
                  localStorage.removeItem("usuario");
                  setMostrarDespedida(false);
                  setLogueado(false);
                  setMostrarPortada(true);
                }}
              >
                Salir del sistema
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

const botonMenu = {
  backgroundColor: "#19766f",
  color: "white",
  border: "none",
  minHeight: "38px",
  padding: "10px 16px",
  borderRadius: "10px",
  cursor: "pointer",
  fontWeight: "bold",
  fontSize: "13px",
  transition: "all 0.25s ease",
  boxShadow: "0 3px 8px rgba(0,0,0,0.12)",
};

const botonVolver = {
  backgroundColor: "#9e7ac0",
  color: "white",
  border: "none",
  minHeight: "38px",
  padding: "10px 16px",
  borderRadius: "10px",
  cursor: "pointer",
  fontWeight: "bold",
  fontSize: "13px",
  transition: "all 0.25s ease",
  boxShadow: "0 3px 8px rgba(0,0,0,0.12)",
};

const contenedorInicio = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
  gap: "25px",
  marginTop: "110px",
};

const tarjetaInicio = {
  backgroundColor: "#f6fbfc",
  border: "2px solid #b9d6df",
  borderRadius: "18px",
  padding: "28px",
  boxShadow: "0 10px 24px rgba(22,58,95,0.18)",
  textAlign: "center",
};
const bloquePeriodo = {
  marginTop: "20px",
  padding: "18px",
  border: "1px solid #c7d2fe",
  borderRadius: "16px",
  backgroundColor: "#f8fbff",
  display: "flex",
  flexDirection: "column",
  gap: "10px",
  alignItems: "center",
};

const inputPeriodo = {
  padding: "10px",
  borderRadius: "8px",
  border: "1px solid #ccc",
  width: "220px",
};

const fondoModal = {
  position: "fixed",
  top: 0,
  left: 0,
  width: "100%",
  height: "100%",
  backgroundColor: "rgba(0,0,0,0.45)",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  zIndex: 9999,
};
const modalDespedida = {
  backgroundColor: "white",
  padding: "35px",
  borderRadius: "20px",
  width: "500px",
  textAlign: "center",
  boxShadow: "0 10px 30px rgba(0,0,0,0.25)",
  border: "2px solid #777171",
};
const botonVolverModal = {
  backgroundColor: "#dfeceb",
  color: "#1e3a5f",
  border: "none",
  padding: "10px 18px",
  borderRadius: "999px",
  marginRight: "10px",
  cursor: "pointer",
};
const botonSalirModal = {
  backgroundColor: "#5c8d89",
  color: "white",
  border: "none",
  padding: "10px 18px",
  borderRadius: "999px",
  cursor: "pointer",
};
const parteDiario = {
  backgroundColor: "#f7fafb",
  border: "2px solid #c7dde3",
  borderRadius: "20px",
  padding: "22px",
  marginTop: "25px",
  marginBottom: "28px",
  boxShadow: "0 8px 18px rgba(0,0,0,0.08)",
};

const tituloParteDiario = {
  color: "#1e3a5f",
  textAlign: "center",
  marginBottom: "20px",
};

const grillaParteDiario = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
  gap: "20px",
};

const subtituloParte = {
  backgroundColor: "#e8f4f1",
  borderLeft: "6px solid #0f766e",
  borderRadius: "8px",
  padding: "10px",
  color: "#1e3a5f",
  textAlign: "center",
};

const tablaParte = {
  width: "100%",
  borderCollapse: "collapse",
  backgroundColor: "white",
  borderRadius: "12px",
  overflow: "hidden",
  boxShadow: "0 3px 8px rgba(0,0,0,0.06)",
};

const celdaParteTitulo = {
  backgroundColor: "#1e3a5f",
  color: "white",
  padding: "10px",
  fontWeight: "bold",
  textAlign: "center",
};

const celdaParte = {
  border: "1px solid #dbe4ee",
  padding: "9px",
  textAlign: "center",
};

const celdaParteNegrita = {
  ...celdaParte,
  fontWeight: "bold",
  backgroundColor: "#eef7f6",
};
const filaTotalBasico = {
  backgroundColor: "#fff7ed",
  fontWeight: "bold",
  borderTop: "3px solid #d97706",
  borderBottom: "2px solid #d97706",
};

const filaTotalSuperior = {
  backgroundColor: "#eef7f6",
  fontWeight: "bold",
  borderTop: "3px solid #0f766e",
  borderBottom: "2px solid #0f766e",
};

const filaTotalTurno = {
  backgroundColor: "#dcefeb",
  fontWeight: "bold",
  boxShadow: "inset 0 3px 0 #1e3a5f, inset 0 -3px 0 #1e3a5f",
};
const celdaParteTotal = {
  ...celdaParte,
  fontWeight: "bold",
  backgroundColor: "#dcefeb",
  fontSize: "15px",
};

const parteDiarioRef = {
  backgroundColor: "white",
};
const tarjetaUsuario = {
  position: "absolute",
  top: "22px",
  right: "20px",
  background: "#f9fcfd",
  border: "2px solid #b9d6df",
  borderRadius: "18px",
  padding: "12px 14px",
  display: "flex",
  boxShadow: "0 10px 24px rgba(22,58,95,0.18)",
  color: "#1e3a5f",
  zIndex: 10,
  minWidth: "250px",
};

const datosUsuario = {
  display: "flex",
  flexDirection: "column",
  gap: "5px",
  fontSize: "12px",
  lineHeight: "1.3",
};

const insigniaAdmin = {
  backgroundColor: "#dcfce7",
  color: "#166534",
  padding: "3px 8px",
  borderRadius: "999px",
  fontWeight: "bold",
  width: "fit-content",
};

const insigniaConsulta = {
  backgroundColor: "#dbeafe",
  color: "#1d4ed8",
  padding: "3px 8px",
  borderRadius: "999px",
  fontWeight: "bold",
  width: "fit-content",
};

const ultimoAccesoTexto = {
  color: "#5f6f7a",
};

const botonSalirTarjeta = {
  marginTop: "4px",
  backgroundColor: "#5d7387",
  color: "white",
  border: "none",
  borderRadius: "999px",
  padding: "7px 12px",
  cursor: "pointer",
  fontWeight: "bold",
  fontSize: "12px",
};
