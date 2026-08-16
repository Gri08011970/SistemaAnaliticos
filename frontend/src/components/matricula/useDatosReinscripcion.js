import { useCallback, useEffect, useMemo, useState } from "react";
import axios from "axios";

const normalizarId = (valor) =>
  String(valor?._id || valor || "").trim();

const normalizarDni = (valor) =>
  String(valor || "").replace(/\D/g, "");

const esMarcaSinAutorizados = (registro) =>
  String(registro?.adultoAutorizado || "")
    .trim()
    .toUpperCase() === "NADIE" ||
  String(registro?.vinculo || "")
    .trim()
    .toUpperCase() === "NADIE";

export default function useDatosReinscripcion() {
  const [domicilios, setDomicilios] = useState([]);
  const [autorizados, setAutorizados] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let activo = true;

    async function cargarDatos() {
      try {
        setCargando(true);
        setError("");

        const [respuestaDomicilios, respuestaAutorizados] =
          await Promise.all([
            axios.get("/api/domicilios"),
            axios.get("/api/autorizados"),
          ]);

        if (!activo) return;

        setDomicilios(
          Array.isArray(respuestaDomicilios.data)
            ? respuestaDomicilios.data
            : []
        );

        setAutorizados(
          Array.isArray(respuestaAutorizados.data)
            ? respuestaAutorizados.data
            : []
        );
      } catch (errorCarga) {
        console.error(
          "Error cargando datos para reinscripción:",
          errorCarga
        );

        if (activo) {
          setError(
            "No se pudieron cargar domicilios, teléfonos o autorizados."
          );
        }
      } finally {
        if (activo) {
          setCargando(false);
        }
      }
    }

    cargarDatos();

    return () => {
      activo = false;
    };
  }, []);

  const domiciliosPorAlumno = useMemo(() => {
    const porId = new Map();
    const porDni = new Map();

    domicilios.forEach((registro) => {
      const alumnoId = normalizarId(registro.alumnoId);
      const dni = normalizarDni(registro.dni);

      if (alumnoId) porId.set(alumnoId, registro);
      if (dni) porDni.set(dni, registro);
    });

    return { porId, porDni };
  }, [domicilios]);

  const autorizadosPorAlumno = useMemo(() => {
    const porId = new Map();
    const porDni = new Map();

    autorizados.forEach((registro) => {
      const alumnoId = normalizarId(registro.alumnoId);
      const dni = normalizarDni(registro.dniAlumno);

      if (alumnoId) {
        const actuales = porId.get(alumnoId) || [];
        porId.set(alumnoId, [...actuales, registro]);
      }

      if (dni) {
        const actuales = porDni.get(dni) || [];
        porDni.set(dni, [...actuales, registro]);
      }
    });

    return { porId, porDni };
  }, [autorizados]);

  const obtenerDatosAlumno = useCallback(
    (alumno) => {
      const alumnoId = normalizarId(alumno?._id || alumno?.id);
      const dni = normalizarDni(alumno?.dni);

      const domicilio =
        domiciliosPorAlumno.porId.get(alumnoId) ||
        domiciliosPorAlumno.porDni.get(dni) ||
        null;

      const registrosAutorizados =
        autorizadosPorAlumno.porId.get(alumnoId) ||
        autorizadosPorAlumno.porDni.get(dni) ||
        [];

      const sinAutorizados =
        registrosAutorizados.some(esMarcaSinAutorizados);

      const personasAutorizadas =
        registrosAutorizados.filter(
          (registro) => !esMarcaSinAutorizados(registro)
        );

      return {
        domicilio: domicilio?.domicilio || "",
        telefono: domicilio?.telefono || "",
        nombreResponsable:
          domicilio?.nombreResponsable || "",
        vinculoResponsable:
          domicilio?.adultoResponsable || "",
        sinAutorizados,
        autorizados: personasAutorizadas,
      };
    },
    [domiciliosPorAlumno, autorizadosPorAlumno]
  );

  return {
    cargando,
    error,
    obtenerDatosAlumno,
  };
}