import { useEffect, useState } from "react";

export default function GestionAccesos({ volver }) {
  const [usuarios, setUsuarios] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");

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

        setError(
          error.message || "No se pudieron cargar los usuarios.",
        );
      } finally {
        setCargando(false);
      }
    }

    cargarUsuarios();
  }, []);

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
    if (!fecha) {
      return "Sin accesos registrados";
    }

    const valor = new Date(fecha);

    if (Number.isNaN(valor.getTime())) {
      return "Sin accesos registrados";
    }

    return valor.toLocaleString("es-AR");
  }

  if (cargando) {
    return (
      <div style={pagina}>
        <div style={contenedor}>
          <div style={estadoInformativo}>
            ⏳ Cargando cuentas de acceso...
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={pagina}>
      <div style={contenedor}>
        {volver && (
          <button
            type="button"
            onClick={volver}
            style={botonVolver}
          >
            ← Volver
          </button>
        )}

        <section style={encabezado}>
          <div style={iconoPrincipal}>🔐</div>

          <div>
            <div style={etiqueta}>ADMINISTRACIÓN</div>

            <h1 style={titulo}>
              Gestión de accesos
            </h1>

            <p style={subtitulo}>
              Usuarios habilitados para ingresar al sistema institucional.
            </p>
          </div>
        </section>

        {error && (
          <div style={errorEstilo}>
            ⚠️ {error}
          </div>
        )}

        {!error && (
          <>
            <section style={resumen}>
              <div>
                <div style={etiqueta}>
                  CUENTAS REGISTRADAS
                </div>

                <div style={totalUsuarios}>
                  {usuarios.length}
                </div>
              </div>

              <button
                type="button"
                disabled
                style={botonCrearDeshabilitado}
              >
                + Crear cuenta
              </button>
            </section>

            {usuarios.length === 0 ? (
              <div style={estadoInformativo}>
                No hay cuentas registradas.
              </div>
            ) : (
              <div style={grillaUsuarios}>
                {usuarios.map((usuario) => (
                  <article
                    key={usuario._id}
                    style={tarjetaUsuario}
                  >
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
                        <div style={nombreUsuario}>
                          {usuario.nombre}
                        </div>

                        <div style={usuarioLogin}>
                          @{usuario.usuario}
                        </div>
                      </div>

                      <span
                        style={{
                          ...estadoCuenta,
                          ...(usuario.activo === false
                            ? estadoInactivo
                            : estadoActivo),
                        }}
                      >
                        {usuario.activo === false
                          ? "Inactivo"
                          : "Activo"}
                      </span>
                    </div>

                    <div style={separador} />

                    <div style={datosCuenta}>
                      <div>
                        <span style={datoEtiqueta}>
                          Rol
                        </span>

                        <strong style={datoValor}>
                          {formatearRol(usuario.rol)}
                        </strong>
                      </div>

                      <div>
                        <span style={datoEtiqueta}>
                          Último acceso
                        </span>

                        <strong style={datoValor}>
                          {formatearFecha(
                            usuario.ultimoAcceso,
                          )}
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

const botonCrearDeshabilitado = {
  border: "none",
  borderRadius: "999px",
  padding: "10px 16px",
  background: "#dfe8ec",
  color: "#82949d",
  fontWeight: "800",
  cursor: "not-allowed",
};

const grillaUsuarios = {
  display: "grid",
  gridTemplateColumns:
    "repeat(auto-fit, minmax(min(100%, 310px), 1fr))",
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
  gridTemplateColumns:
    "repeat(auto-fit, minmax(130px, 1fr))",
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