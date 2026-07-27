import { useMemo } from "react";
import TarjetaEstudianteFotia from "./TarjetaEstudianteFotia";

export default function ListadoInscripcionesFotia({
  inscripciones = [],
   onRetirar,
}) {
  const estudiantesAgrupados = useMemo(() => {
    const grupos = new Map();

    inscripciones.forEach((inscripcion) => {
     if (inscripcion.activo === false) return;
     
      const alumnoId = String(
        inscripcion.alumnoId?._id ||
          inscripcion.alumnoId ||
          "",
      );

      if (!alumnoId) return;

      if (!grupos.has(alumnoId)) {
        grupos.set(alumnoId, {
          alumnoId,
          apellido: inscripcion.apellido || "",
          nombre: inscripcion.nombre || "",
          curso: inscripcion.curso || "",
          turno: inscripcion.turno || "",
          asignaturas: [],
        });
      }

      grupos.get(alumnoId).asignaturas.push(inscripcion);
    });

    return Array.from(grupos.values()).sort((a, b) => {
      const apellidoA = a.apellido || "";
      const apellidoB = b.apellido || "";

      const comparacionApellido = apellidoA.localeCompare(
        apellidoB,
        "es",
        {
          sensitivity: "base",
        },
      );

      if (comparacionApellido !== 0) {
        return comparacionApellido;
      }

      return (a.nombre || "").localeCompare(
        b.nombre || "",
        "es",
        {
          sensitivity: "base",
        },
      );
    });
  }, [inscripciones]);

  if (estudiantesAgrupados.length === 0) {
    return null;
  }

  return (
    <div
      style={{
        marginTop: "24px",
        display: "grid",
        gap: "16px",
      }}
    >
      <div
        style={{
          textAlign: "center",
        }}
      >
        <h3
          style={{
            margin: "0 0 6px",
            color: "#23436d",
            fontSize: "21px",
          }}
        >
          👨‍🎓 Estudiantes del período
        </h3>

        <p
          style={{
            margin: 0,
            color: "#607080",
          }}
        >
          Seguimiento de las áreas incorporadas al
          fortalecimiento.
        </p>
      </div>

      {estudiantesAgrupados.map((estudiante) => (
        <TarjetaEstudianteFotia
          key={estudiante.alumnoId}
          estudiante={estudiante}
          onRetirar={onRetirar}
        />
      ))}
    </div>
  );
}
