import { useEffect, useMemo, useState } from "react";

export default function GestionAccesos({ volver }) {
  const [usuarios, setUsuarios] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");

  const [mostrarFormulario, setMostrarFormulario] = useState(false);

  const [nuevoUsuario, setNuevoUsuario] = useState({
    nombre: "",
    usuario: "",
    password: "",
    rol: "consulta",
    alumnoId: "",
    docenteId: "",
  });

  const [guardandoUsuario, setGuardandoUsuario] = useState(false);
  const [errorFormulario, setErrorFormulario] = useState("");

  const [docentesFotia, setDocentesFotia] = useState([]);
  const [alumnosMatricula, setAlumnosMatricula] = useState([]);
  const [cargandoVinculos, setCargandoVinculos] = useState(false);
  const [errorVinculos, setErrorVinculos] = useState("");
  const [busquedaEstudiante, setBusquedaEstudiante] = useState("");

  useEffect(() => {
    async function cargarUsuarios() {
      try {
        setCargando(true);
        setError("");

        const token = localStorage.getItem("tokenUsuario");

        const respuesta = await fetch("/api/usuarios", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const datos = await respuesta.json();

        if (!respuesta.ok) {
          throw new Error(
            datos.mensaje || "No se pudieron cargar los usuarios.",
          );
        }

        setUsuarios(datos.usuarios || []);
      } catch (error) {
        console.error("Error al cargar usuarios:", error);
        setError(error.message || "No se pudieron cargar los usuarios.");
      } finally {
        setCargando(false);
      }
    }

    cargarUsuarios();
  }, []);

  useEffect(() => {
    if (!mostrarFormulario) return;

    async function cargarVinculos() {
      try {
        setCargandoVinculos(true);
        setErrorVinculos("");

        const [respuestaDocentes, respuestaAlumnos] = await Promise.all([
          fetch("/api/fotia/docentes"),
          fetch("/api/matricula"),
        ]);

        if (!respuestaDocentes.ok) {
          throw new Error("No se pudieron cargar los docentes de FOTIA.");
        }

        if (!respuestaAlumnos.ok) {
          throw new Error(
            "No se pudieron cargar los estudiantes de Matrícula.",
          );
        }

        const docentes = await respuestaDocentes.json();
        const alumnos = await respuestaAlumnos.json();

        setDocentesFotia(
          Array.isArray(docentes)
            ? docentes.filter((docente) => docente.activo !== false)
            : [],
        );

        setAlumnosMatricula(Array.isArray(alumnos) ? alumnos : []);
      } catch (error) {
        console.error("Error al cargar vínculos para usuarios:", error);
        setErrorVinculos(
          error.message ||
            "No se pudieron cargar docentes y estudiantes para vincular cuentas.",
        );
      } finally {
        setCargandoVinculos(false);
      }
    }

    cargarVinculos();
  }, [mostrarFormulario]);

  function formatearRol(rol) {
    const roles = {
      admin: "Administrador",
      consulta: "Consulta",
      docente: "Docente",
      estudiante: "Estudiante",
    };

    return roles[rol] || rol || "Sin rol";
  }

  function formatearFecha(fecha) {
    if (!fecha) return "Sin accesos registrados";

    const valor = new Date(fecha);

    if (Number.isNaN(valor.getTime())) {
      return "Sin accesos registrados";
    }

    return valor.toLocaleString("es-AR");
  }

  function normalizarTexto(valor = "") {
    return String(valor)
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase()
      .trim();
  }

  function obtenerNombreCompletoAlumno(alumno) {
    const apellido =
      alumno?.apellido || alumno?.apellidos || alumno?.apellidoAlumno || "";

    const nombre =
      alumno?.nombre || alumno?.nombres || alumno?.nombreAlumno || "";

    const compuesto = `${apellido} ${nombre}`.trim();

    return compuesto || alumno?.estudiante || "Estudiante sin nombre";
  }

  function obtenerDniAlumno(alumno) {
    return String(
      alumno?.dni ||
        alumno?.DNI ||
        alumno?.documento ||
        alumno?.numeroDocumento ||
        "",
    );
  }

  function sugerirUsuarioDesdeNombre(nombre = "") {
    return normalizarTexto(nombre)
      .replace(/[^a-z0-9\s.-]/g, "")
      .replace(/\s+/g, ".")
      .replace(/\.+/g, ".")
      .replace(/^\./, "")
      .replace(/\.$/, "");
  }

  function limpiarFormulario() {
    setNuevoUsuario({
      nombre: "",
      usuario: "",
      password: "",
      rol: "consulta",
      alumnoId: "",
      docenteId: "",
    });

    setBusquedaEstudiante("");
    setErrorFormulario("");
  }

  const alumnosFiltrados = useMemo(() => {
    const termino = normalizarTexto(busquedaEstudiante);

    if (!termino) {
      return alumnosMatricula.slice(0, 30);
    }

    return alumnosMatricula
      .filter((alumno) => {
        const nombre = normalizarTexto(obtenerNombreCompletoAlumno(alumno));
        const dni = normalizarTexto(obtenerDniAlumno(alumno));

        return nombre.includes(termino) || dni.includes(termino);
      })
      .slice(0, 30);
  }, [alumnosMatricula, busquedaEstudiante]);

  async function crearCuenta() {
    if (!nuevoUsuario.nombre.trim()) {
      setErrorFormulario("Completá el nombre y apellido.");
      return;
    }

    if (!nuevoUsuario.usuario.trim()) {
      setErrorFormulario("Ingresá un nombre de usuario.");
      return;
    }

    if (!nuevoUsuario.password.trim()) {
      setErrorFormulario("Ingresá una contraseña inicial.");
      return;
    }

    if (nuevoUsuario.rol === "docente" && !nuevoUsuario.docenteId) {
      setErrorFormulario("Seleccioná el docente FOTIA que tendrá esta cuenta.");
      return;
    }

    if (nuevoUsuario.rol === "estudiante" && !nuevoUsuario.alumnoId) {
      setErrorFormulario(
        "Seleccioná el estudiante de Matrícula que tendrá esta cuenta.",
      );
      return;
    }

    try {
      setGuardandoUsuario(true);
      setErrorFormulario("");

      const token = localStorage.getItem("tokenUsuario");

      const respuesta = await fetch("/api/usuarios", {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },

        body: JSON.stringify(nuevoUsuario),
      });

      const datos = await respuesta.json();

      if (!respuesta.ok) {
        throw new Error(datos.mensaje || "No se pudo crear la cuenta.");
      }

      setUsuarios((anteriores) => [...anteriores, datos.usuario]);

      setMostrarFormulario(false);

      limpiarFormulario();

      window.alert(
        `✅ Cuenta creada correctamente.\n\nUsuario: ${datos.usuario.usuario}`,
      );
    } catch (error) {
      console.error("Error al crear cuenta:", error);

      setErrorFormulario(error.message || "No se pudo crear la cuenta.");
    } finally {
      setGuardandoUsuario(false);
    }
  }

  if (cargando) {
    return (
      <div style={pagina}>
        <div style={contenedor}>
          <div style={estadoInformativo}>⏳ Cargando cuentas de acceso...</div>
        </div>
      </div>
    );
  }

  return (
    <div style={pagina}>
      <div style={contenedor}>
        {volver && (
          <button type="button" onClick={volver} style={botonVolver}>
            ← Volver
          </button>
        )}

        <section style={encabezado}>
          <div style={iconoPrincipal}>🔐</div>

          <div>
            <div style={etiqueta}>ADMINISTRACIÓN</div>
            <h1 style={titulo}>Gestión de accesos</h1>
            <p style={subtitulo}>
              Usuarios habilitados para ingresar al sistema institucional.
            </p>
          </div>
        </section>

        {error && <div style={errorEstilo}>⚠️ {error}</div>}

        {!error && (
          <>
            <section style={resumen}>
              <div>
                <div style={etiqueta}>CUENTAS REGISTRADAS</div>
                <div style={totalUsuarios}>{usuarios.length}</div>
              </div>

              <button
                type="button"
                onClick={() => {
                  setMostrarFormulario(true);
                  setErrorFormulario("");
                }}
                style={botonCrear}
              >
                + Crear cuenta
              </button>
            </section>

            {mostrarFormulario && (
              <section style={formularioCuenta}>
                <div style={cabeceraFormulario}>
                  <div>
                    <div style={etiqueta}>NUEVA CUENTA</div>
                    <h2 style={tituloFormulario}>🔐 Crear acceso al sistema</h2>
                    <p style={textoFormulario}>
                      Completá los datos de la persona que tendrá acceso al
                      sistema.
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      setMostrarFormulario(false);
                      limpiarFormulario();
                    }}
                    style={botonCerrarFormulario}
                  >
                    ✕
                  </button>
                </div>

                <div style={grillaFormulario}>
                  <label style={grupoCampo}>
                    <span style={labelCampo}>Nombre y apellido *</span>
                    <input
                      type="text"
                      value={nuevoUsuario.nombre}
                      onChange={(evento) => {
                        setNuevoUsuario((anterior) => ({
                          ...anterior,
                          nombre: evento.target.value,
                        }));
                        setErrorFormulario("");
                      }}
                      placeholder="Ej.: María González"
                      style={inputCampo}
                      disabled={guardandoUsuario}
                    />
                  </label>

                  <label style={grupoCampo}>
                    <span style={labelCampo}>Usuario *</span>
                    <input
                      type="text"
                      value={nuevoUsuario.usuario}
                      onChange={(evento) => {
                        setNuevoUsuario((anterior) => ({
                          ...anterior,
                          usuario: evento.target.value
                            .toLowerCase()
                            .replace(/\s+/g, ""),
                        }));
                        setErrorFormulario("");
                      }}
                      placeholder="Ej.: maria.gonzalez"
                      style={inputCampo}
                      disabled={guardandoUsuario}
                    />
                  </label>

                  <label style={grupoCampo}>
                    <span style={labelCampo}>Contraseña inicial *</span>
                    <input
                      type="password"
                      value={nuevoUsuario.password}
                      onChange={(evento) => {
                        setNuevoUsuario((anterior) => ({
                          ...anterior,
                          password: evento.target.value,
                        }));
                        setErrorFormulario("");
                      }}
                      placeholder="Contraseña inicial"
                      style={inputCampo}
                      disabled={guardandoUsuario}
                    />
                  </label>

                  <label style={grupoCampo}>
                    <span style={labelCampo}>Tipo de cuenta *</span>
                    <select
                      value={nuevoUsuario.rol}
                      onChange={(evento) => {
                        const nuevoRol = evento.target.value;

                        setNuevoUsuario((anterior) => ({
                          ...anterior,
                          rol: nuevoRol,
                          alumnoId: "",
                          docenteId: "",
                        }));

                        setBusquedaEstudiante("");
                        setErrorFormulario("");
                      }}
                      style={inputCampo}
                      disabled={guardandoUsuario}
                    >
                      <option value="consulta">👤 Usuario de consulta</option>
                      <option value="admin">🛡️ Administrador</option>
                      <option value="docente">👩‍🏫 Docente</option>
                      <option value="estudiante">🎓 Estudiante</option>
                    </select>
                  </label>
                </div>

                {cargandoVinculos && (
                  <div style={estadoVinculos}>
                    ⏳ Cargando docentes y estudiantes...
                  </div>
                )}

                {errorVinculos && (
                  <div style={errorFormularioEstilo}>⚠️ {errorVinculos}</div>
                )}

                {nuevoUsuario.rol === "docente" && !cargandoVinculos && (
                  <div style={bloqueVinculo}>
                    <div style={cabeceraVinculo}>
                      <div style={iconoAvisoVinculo}>👩‍🏫</div>
                      <div>
                        <strong style={tituloAvisoVinculo}>
                          Vincular cuenta docente
                        </strong>
                        <p style={textoAvisoVinculo}>
                          Elegí un docente ya registrado en FOTIA. El sistema
                          guardará automáticamente su docenteId.
                        </p>
                      </div>
                    </div>

                    <label style={grupoCampo}>
                      <span style={labelCampo}>Docente FOTIA *</span>
                      <select
                        value={nuevoUsuario.docenteId}
                        onChange={(evento) => {
                          const docenteId = evento.target.value;
                          const docente = docentesFotia.find(
                            (item) => String(item._id) === String(docenteId),
                          );

                          const nombreCompleto = docente
                            ? `${docente.nombre || ""} ${docente.apellido || ""}`.trim()
                            : "";

                          setNuevoUsuario((anterior) => ({
                            ...anterior,
                            docenteId,
                            alumnoId: "",
                            nombre: nombreCompleto || "",
                            usuario: nombreCompleto
                              ? sugerirUsuarioDesdeNombre(nombreCompleto)
                              : "",
                          }));

                          setErrorFormulario("");
                        }}
                        style={inputCampo}
                        disabled={guardandoUsuario}
                      >
                        <option value="">Seleccionar docente...</option>

                        {docentesFotia.map((docente) => (
                          <option key={docente._id} value={docente._id}>
                            {`${docente.apellido || ""} ${docente.nombre || ""}`.trim()}
                            {docente.dni ? ` · DNI ${docente.dni}` : ""}
                          </option>
                        ))}
                      </select>
                    </label>

                    {docentesFotia.length === 0 && (
                      <div style={avisoSinResultados}>
                        No hay docentes activos registrados en FOTIA.
                      </div>
                    )}
                  </div>
                )}

                {nuevoUsuario.rol === "estudiante" && !cargandoVinculos && (
                  <div style={bloqueVinculo}>
                    <div style={cabeceraVinculo}>
                      <div style={iconoAvisoVinculo}>🎓</div>

                      <div>
                        <strong style={tituloAvisoVinculo}>
                          Vincular cuenta estudiante
                        </strong>

                        <p style={textoAvisoVinculo}>
                          Buscá al estudiante por nombre, apellido o DNI y
                          seleccioná su registro de Matrícula.
                        </p>
                      </div>
                    </div>

                    <label style={grupoCampo}>
                      <span style={labelCampo}>Buscar estudiante</span>

                      <input
                        type="text"
                        value={busquedaEstudiante}
                        onChange={(evento) => {
                          setBusquedaEstudiante(evento.target.value);

                          setNuevoUsuario((anterior) => ({
                            ...anterior,
                            alumnoId: "",
                          }));

                          setErrorFormulario("");
                        }}
                        placeholder="Ej.: Valentina, Aguero o DNI"
                        style={inputCampo}
                        disabled={guardandoUsuario}
                      />
                    </label>

                    {busquedaEstudiante.trim() && (
                      <div style={contenedorResultadosEstudiantes}>
                        <div style={tituloResultados}>COINCIDENCIAS</div>

                        {alumnosFiltrados.length === 0 ? (
                          <div style={avisoSinResultados}>
                            No encontramos estudiantes con esa búsqueda.
                          </div>
                        ) : (
                          alumnosFiltrados.map((alumno) => {
                            const seleccionado =
                              String(nuevoUsuario.alumnoId) ===
                              String(alumno._id);

                            return (
                              <button
                                key={alumno._id}
                                type="button"
                                onClick={() => {
                                  const nombreCompleto =
                                    obtenerNombreCompletoAlumno(alumno);

                                  setNuevoUsuario((anterior) => ({
                                    ...anterior,
                                    alumnoId: alumno._id,
                                    docenteId: "",
                                    nombre: nombreCompleto,
                                    usuario:
                                      sugerirUsuarioDesdeNombre(nombreCompleto),
                                  }));

                                  setErrorFormulario("");
                                }}
                                style={{
                                  ...resultadoEstudiante,
                                  ...(seleccionado
                                    ? resultadoEstudianteSeleccionado
                                    : {}),
                                }}
                              >
                                <div>
                                  <strong style={nombreResultadoEstudiante}>
                                    {obtenerNombreCompletoAlumno(alumno)}
                                  </strong>

                                  {obtenerDniAlumno(alumno) && (
                                    <div style={dniResultadoEstudiante}>
                                      DNI {obtenerDniAlumno(alumno)}
                                    </div>
                                  )}
                                </div>

                                <span style={marcaSeleccion}>
                                  {seleccionado ? "✓ Seleccionado" : "Elegir"}
                                </span>
                              </button>
                            );
                          })
                        )}
                      </div>
                    )}

                    {nuevoUsuario.alumnoId && (
                      <div style={estudianteSeleccionado}>
                        ✅ Estudiante vinculado correctamente.
                      </div>
                    )}
                  </div>
                )}

                {errorFormulario && (
                  <div style={errorFormularioEstilo}>⚠️ {errorFormulario}</div>
                )}

                <div style={accionesFormulario}>
                  <button
                    type="button"
                    onClick={crearCuenta}
                    disabled={guardandoUsuario}
                    style={
                      guardandoUsuario
                        ? botonGuardarDeshabilitado
                        : botonGuardar
                    }
                  >
                    {guardandoUsuario ? "Guardando..." : "💾 Crear cuenta"}
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setMostrarFormulario(false);
                      limpiarFormulario();
                    }}
                    style={botonCancelar}
                    disabled={guardandoUsuario}
                  >
                    Cancelar
                  </button>
                </div>
              </section>
            )}

            {usuarios.length === 0 ? (
              <div style={estadoInformativo}>No hay cuentas registradas.</div>
            ) : (
              <div style={grillaUsuarios}>
                {usuarios.map((usuario) => (
                  <article key={usuario._id} style={tarjetaUsuario}>
                    <div style={cabeceraTarjeta}>
                      <div style={avatar}>
                        {usuario.rol === "admin"
                          ? "🛡️"
                          : usuario.rol === "docente"
                            ? "👩‍🏫"
                            : usuario.rol === "estudiante"
                              ? "🎓"
                              : "👤"}
                      </div>

                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={nombreUsuario}>{usuario.nombre}</div>
                        <div style={usuarioLogin}>@{usuario.usuario}</div>
                      </div>

                      <span
                        style={{
                          ...estadoCuenta,
                          ...(usuario.activo === false
                            ? estadoInactivo
                            : estadoActivo),
                        }}
                      >
                        {usuario.activo === false ? "Inactivo" : "Activo"}
                      </span>
                    </div>

                    <div style={separador} />

                    <div style={datosCuenta}>
                      <div>
                        <span style={datoEtiqueta}>Rol</span>
                        <strong style={datoValor}>
                          {formatearRol(usuario.rol)}
                        </strong>
                      </div>

                      <div>
                        <span style={datoEtiqueta}>Último acceso</span>
                        <strong style={datoValor}>
                          {formatearFecha(usuario.ultimoAcceso)}
                        </strong>
                      </div>
                    </div>

                    {usuario.alumnoId && (
                      <div style={vinculo}>
                        🎓 Cuenta vinculada a un estudiante
                      </div>
                    )}

                    {usuario.docenteId && (
                      <div style={vinculo}>
                        👩‍🏫 Cuenta vinculada a un docente
                      </div>
                    )}

                    <div style={acciones}>
                      <button
                        type="button"
                        disabled
                        style={botonGestionarDeshabilitado}
                      >
                        Gestionar
                      </button>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

const pagina = {
  minHeight: "100vh",
  background: "#eef7f7",
  padding: "28px 18px",
  fontFamily: "Arial, sans-serif",
};

const contenedor = {
  width: "min(1120px, 100%)",
  margin: "0 auto",
};

const botonVolver = {
  border: "1px solid #bfd5dc",
  background: "#ffffff",
  color: "#173f68",
  borderRadius: "999px",
  padding: "9px 15px",
  fontWeight: "700",
  cursor: "pointer",
  marginBottom: "18px",
};

const encabezado = {
  display: "flex",
  alignItems: "center",
  gap: "18px",
  background: "#ffffff",
  border: "2px solid #c5dfe6",
  borderRadius: "20px",
  padding: "24px",
  marginBottom: "20px",
};

const iconoPrincipal = {
  width: "62px",
  height: "62px",
  borderRadius: "16px",
  background: "#e8f5f2",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontSize: "30px",
  flexShrink: 0,
};

const etiqueta = {
  color: "#607d8b",
  fontSize: "11px",
  letterSpacing: "1px",
  fontWeight: "800",
};

const titulo = {
  margin: "5px 0 6px",
  color: "#173f68",
  fontSize: "28px",
};

const subtitulo = {
  margin: 0,
  color: "#607d8b",
  lineHeight: 1.5,
};

const resumen = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  gap: "16px",
  flexWrap: "wrap",
  background: "#ffffff",
  border: "1px solid #cfe3ea",
  borderRadius: "16px",
  padding: "18px 20px",
  marginBottom: "18px",
};

const totalUsuarios = {
  color: "#087f72",
  fontSize: "30px",
  fontWeight: "800",
  marginTop: "3px",
};

const botonCrear = {
  border: "none",
  borderRadius: "999px",
  padding: "10px 16px",
  background: "#0f8b7f",
  color: "#ffffff",
  fontWeight: "800",
  cursor: "pointer",
  boxShadow: "0 4px 10px rgba(0,0,0,0.10)",
};

const grillaUsuarios = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 310px), 1fr))",
  gap: "16px",
};

const tarjetaUsuario = {
  background: "#ffffff",
  border: "2px solid #d5e5ea",
  borderRadius: "18px",
  padding: "18px",
  minWidth: 0,
};

const cabeceraTarjeta = {
  display: "flex",
  alignItems: "center",
  gap: "12px",
};

const avatar = {
  width: "46px",
  height: "46px",
  borderRadius: "13px",
  background: "#eaf5f3",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontSize: "22px",
  flexShrink: 0,
};

const nombreUsuario = {
  color: "#173f68",
  fontSize: "17px",
  fontWeight: "800",
  overflowWrap: "anywhere",
};

const usuarioLogin = {
  color: "#607d8b",
  fontSize: "13px",
  marginTop: "3px",
  overflowWrap: "anywhere",
};

const estadoCuenta = {
  borderRadius: "999px",
  padding: "6px 9px",
  fontSize: "11px",
  fontWeight: "800",
  flexShrink: 0,
};

const estadoActivo = {
  background: "#e8f7ee",
  color: "#157347",
};

const estadoInactivo = {
  background: "#fdecec",
  color: "#b42318",
};

const separador = {
  height: "1px",
  background: "#e3edf0",
  margin: "15px 0",
};

const datosCuenta = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(130px, 1fr))",
  gap: "14px",
};

const datoEtiqueta = {
  display: "block",
  color: "#78909c",
  fontSize: "11px",
  marginBottom: "4px",
};

const datoValor = {
  display: "block",
  color: "#173f68",
  fontSize: "13px",
};

const vinculo = {
  marginTop: "13px",
  padding: "9px 11px",
  borderRadius: "10px",
  background: "#f4f8fa",
  color: "#607d8b",
  fontSize: "12px",
};

const acciones = {
  display: "flex",
  justifyContent: "flex-end",
  marginTop: "16px",
};

const botonGestionarDeshabilitado = {
  border: "1px solid #d1dee3",
  background: "#eef3f5",
  color: "#8799a2",
  borderRadius: "999px",
  padding: "8px 13px",
  fontWeight: "700",
  cursor: "not-allowed",
};

const estadoInformativo = {
  background: "#ffffff",
  border: "1px solid #cfe3ea",
  borderRadius: "16px",
  padding: "24px",
  color: "#607d8b",
  textAlign: "center",
  fontWeight: "700",
};

const errorEstilo = {
  background: "#fff1f1",
  border: "1px solid #f1b4b4",
  borderRadius: "14px",
  padding: "14px",
  color: "#b42318",
  fontWeight: "700",
  textAlign: "center",
};

const formularioCuenta = {
  background: "#ffffff",
  border: "2px solid #c5dfe6",
  borderRadius: "18px",
  padding: "22px",
  marginBottom: "20px",
};

const cabeceraFormulario = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "flex-start",
  gap: "15px",
  marginBottom: "20px",
};

const tituloFormulario = {
  margin: "5px 0 5px",
  color: "#173f68",
  fontSize: "22px",
};

const textoFormulario = {
  margin: 0,
  color: "#607d8b",
  lineHeight: 1.5,
};

const botonCerrarFormulario = {
  width: "36px",
  height: "36px",
  borderRadius: "50%",
  border: "1px solid #d0dfe4",
  background: "#ffffff",
  color: "#607d8b",
  cursor: "pointer",
  fontWeight: "800",
  flexShrink: 0,
};

const grillaFormulario = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 230px), 1fr))",
  gap: "16px",
};

const grupoCampo = {
  display: "flex",
  flexDirection: "column",
  gap: "6px",
};

const labelCampo = {
  color: "#31556c",
  fontSize: "12px",
  fontWeight: "800",
};

const inputCampo = {
  width: "100%",
  boxSizing: "border-box",
  border: "1px solid #bfd5dc",
  borderRadius: "11px",
  padding: "11px 12px",
  fontSize: "14px",
  color: "#173f68",
  background: "#ffffff",
  outlineColor: "#0f8b7f",
};

const bloqueVinculo = {
  marginTop: "18px",
  padding: "16px",
  background: "#f3f8fa",
  border: "1px solid #d3e4e9",
  borderRadius: "13px",
};

const cabeceraVinculo = {
  display: "flex",
  gap: "12px",
  alignItems: "flex-start",
  marginBottom: "14px",
};

const iconoAvisoVinculo = {
  fontSize: "26px",
  flexShrink: 0,
};

const tituloAvisoVinculo = {
  color: "#173f68",
  fontSize: "14px",
};

const textoAvisoVinculo = {
  color: "#607d8b",
  fontSize: "13px",
  lineHeight: 1.5,
  margin: "5px 0 0",
};

const estadoVinculos = {
  marginTop: "18px",
  padding: "13px",
  borderRadius: "12px",
  background: "#f3f8fa",
  color: "#607d8b",
  textAlign: "center",
  fontWeight: "700",
};

const avisoSinResultados = {
  marginTop: "12px",
  padding: "11px 12px",
  borderRadius: "10px",
  background: "#fff9e8",
  border: "1px solid #ead7a2",
  color: "#80611a",
  fontSize: "13px",
  fontWeight: "700",
};

const ayudaBusqueda = {
  marginTop: "10px",
  color: "#718791",
  fontSize: "12px",
  lineHeight: 1.4,
};

const accionesFormulario = {
  display: "flex",
  gap: "10px",
  flexWrap: "wrap",
  marginTop: "20px",
};

const botonGuardarDeshabilitado = {
  border: "none",
  borderRadius: "999px",
  padding: "10px 16px",
  background: "#dfe8ec",
  color: "#82949d",
  fontWeight: "800",
  cursor: "not-allowed",
};

const botonCancelar = {
  border: "1px solid #bfd5dc",
  borderRadius: "999px",
  padding: "10px 16px",
  background: "#ffffff",
  color: "#31556c",
  fontWeight: "700",
  cursor: "pointer",
};

const errorFormularioEstilo = {
  marginTop: "16px",
  background: "#fff1f1",
  border: "1px solid #f1b4b4",
  borderRadius: "12px",
  padding: "12px",
  color: "#b42318",
  fontWeight: "700",
};
const contenedorResultadosEstudiantes = {
  marginTop: "14px",
  display: "flex",
  flexDirection: "column",
  gap: "8px",
};

const tituloResultados = {
  color: "#607d8b",
  fontSize: "11px",
  fontWeight: "800",
  letterSpacing: "1px",
};

const resultadoEstudiante = {
  width: "100%",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  gap: "12px",
  padding: "12px 14px",
  border: "1px solid #cfe0e6",
  borderRadius: "11px",
  background: "#ffffff",
  cursor: "pointer",
  textAlign: "left",
};

const resultadoEstudianteSeleccionado = {
  border: "2px solid #0f8b7f",
  background: "#edf9f6",
};

const nombreResultadoEstudiante = {
  color: "#173f68",
  fontSize: "14px",
};

const dniResultadoEstudiante = {
  color: "#607d8b",
  fontSize: "12px",
  marginTop: "4px",
};

const marcaSeleccion = {
  color: "#0f8b7f",
  fontSize: "12px",
  fontWeight: "800",
  flexShrink: 0,
};

const estudianteSeleccionado = {
  marginTop: "12px",
  padding: "10px 12px",
  borderRadius: "10px",
  background: "#e8f7ee",
  color: "#157347",
  fontWeight: "700",
  fontSize: "13px",
};
const botonGuardar = {
  border: "none",
  borderRadius: "999px",
  padding: "10px 16px",
  background: "#0f8b7f",
  color: "#ffffff",
  fontWeight: "800",
  cursor: "pointer",
  boxShadow:
    "0 4px 10px rgba(0,0,0,0.10)",
};