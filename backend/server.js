import express from "express"
import mongoose from "mongoose"
import cors from "cors"
import dotenv from "dotenv"
import Alumno from "./models/Alumno.js"
import path from "path"
import { fileURLToPath } from "url"
import MatriculaAlumno from "./models/MatriculaAlumno.js"
import Usuario from "./models/Usuario.js"
import DomicilioTelefono from "./models/DomicilioTelefono.js"
import AutorizadoRetiro from "./models/AutorizadoRetiro.js";

dotenv.config()

const app = express()

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

app.use(cors())
app.use(express.json())

mongoose.connect(process.env.MONGO_URI)
  .then(async () => {
    console.log("Mongo conectado 🚀")
    await crearUsuariosIniciales()
  })
  .catch((error) => {
    console.log("Error al conectar Mongo:", error)
  })

  function limpiarDni(dni) {
  return dni?.toString().replace(/\D/g, "")
} 

async function crearUsuariosIniciales() {
  const usuariosIniciales = [
    {
      usuario: "gri",
      password: "140",
      nombre: "Usuario de consulta",
      rol: "consulta"
    },
    {
      usuario: "grichu",
      password: "140",
      nombre: "Griselda Molina",
      rol: "admin"
    }
  ]

  for (const usuario of usuariosIniciales) {
    const existe = await Usuario.findOne({ usuario: usuario.usuario })

    if (!existe) {
      await Usuario.create(usuario)
      console.log(`Usuario creado: ${usuario.usuario}`)
    }
  }
}

app.post("/login", async (req, res) => {
  try {
    const { usuario, password } = req.body

    const usuarioEncontrado = await Usuario.findOne({
      usuario: usuario.trim().toLowerCase(),
      activo: true
    })

    if (!usuarioEncontrado || usuarioEncontrado.password !== password.trim()) {
      return res.status(401).json({
        mensaje: "Usuario o contraseña incorrectos"
      })
    }

    usuarioEncontrado.ultimoAcceso = new Date()
    await usuarioEncontrado.save()

    res.json({
      usuario: usuarioEncontrado.usuario,
      nombre: usuarioEncontrado.nombre,
      rol: usuarioEncontrado.rol,
      ultimoAcceso: usuarioEncontrado.ultimoAcceso
    })
  } catch (error) {
    console.log(error)
    res.status(500).json({
      mensaje: "Error al iniciar sesión"
    })
  }
})
// ======================
// RUTAS API
// ======================

app.get("/alumnos", async (req, res) => {
  try {
    const alumnos = await Alumno.find()
    res.json(alumnos)
  } catch (error) {
    res.status(500).json({
      mensaje: "Error al obtener alumnos"
    })
  }
})

app.post("/alumnos", async (req, res) => {
  try {
    const dniLimpio = limpiarDni(req.body.dni)

    const alumnoExistente = await Alumno.findOne({ dni: dniLimpio })

    if (alumnoExistente) {
      return res.status(400).json({
        mensaje: "Ya existe un pedido de analítico con ese DNI"
      })
    }

    const nuevoAlumno = new Alumno({
      ...req.body,
      dni: dniLimpio
    })

    await nuevoAlumno.save()
    res.json(nuevoAlumno)

  } catch (error) {
    res.status(500).json({
      mensaje: "Error al guardar alumno"
    })
  }
})

app.post("/alumnos/importar", async (req, res) => {
  try {
    const alumnos = req.body.alumnos

    const alumnosGuardados = await Alumno.insertMany(alumnos)

    res.json(alumnosGuardados)
  } catch (error) {
    res.status(500).json({
      mensaje: "Error al importar alumnos"
    })
  }
})

app.delete("/alumnos/:id", async (req, res) => {
  try {
    await Alumno.findByIdAndDelete(req.params.id)

    res.json({
      mensaje: "Alumno eliminado correctamente"
    })
  } catch (error) {
    res.status(500).json({
      mensaje: "Error al eliminar alumno"
    })
  }
})

app.put("/alumnos/:id", async (req, res) => {
  try {
    const alumnoActualizado = await Alumno.findByIdAndUpdate(
      req.params.id,
      req.body,
      { returnDocument: "after" }
    )

    res.json(alumnoActualizado)
  } catch (error) {
    res.status(500).json({
      mensaje: "Error al actualizar alumno"
    })
  }
})

// OBTENER MATRÍCULA
app.get("/api/matricula", async (req, res) => {
  try {
    const alumnos = await MatriculaAlumno.find()

    res.json(alumnos)
  } catch (error) {
    res.status(500).json({
      mensaje: "Error al obtener matrícula"
    })
  }
})


// GUARDAR ESTUDIANTE

app.post("/api/matricula", async (req, res) => {
  try { 
    const dniLimpio = limpiarDni(req.body.dni)

    const alumnoExistente = await MatriculaAlumno.findOne({ dni: dniLimpio })

    if (alumnoExistente) {
      return res.status(400).json({
        mensaje: "Ya existe un estudiante de matrícula con ese DNI"
      })
    }

    const nuevoAlumno = new MatriculaAlumno({
      ...req.body,
      dni: dniLimpio
    })

    await nuevoAlumno.save()
    res.json(nuevoAlumno)

  } catch (error) {
    res.status(500).json({
      mensaje: "Error al guardar estudiante"
    })
  }
}) 

app.put("/api/matricula/:id", async (req, res) => {
  try {
    const alumnoActualizado = await MatriculaAlumno.findByIdAndUpdate(
      req.params.id,
      req.body,
      { returnDocument: "after" }
    )

    res.json(alumnoActualizado)
  } catch (error) {
    res.status(500).json({
      mensaje: "Error al actualizar estudiante de matrícula"
    })
  }
})

app.delete("/api/matricula/:id", async (req, res) => {
  try {
    await MatriculaAlumno.findByIdAndDelete(req.params.id)

    res.json({
      mensaje: "Estudiante eliminado de matrícula"
    })
  } catch (error) {
    res.status(500).json({
      mensaje: "Error al eliminar estudiante de matrícula"
    })
  }
})

// IMPORTAR MATRÍCULA DESDE EXCEL
app.post("/api/matricula/importar", async (req, res) => {
  try {
    const alumnos = req.body.alumnos

    const alumnosConRecursante = alumnos.map((alumno) => ({
      ...alumno,
      recursante:
        alumno.estadoInscripcion
          ?.toLowerCase()
          .includes("continúa mismo año de estudio") || false
    }))

    const alumnosGuardados = await MatriculaAlumno.insertMany(alumnosConRecursante)

    res.json(alumnosGuardados)
  } catch (error) {
    res.status(500).json({
      mensaje: "Error al importar matrícula"
    })
  }
})

// ======================
// DOMICILIOS Y TELÉFONOS
// ======================

app.get("/api/domicilios", async (req, res) => {
  try {
    const domicilios = await DomicilioTelefono.find().sort({
      curso: 1,
      apellidoNombre: 1
    })

    res.json(domicilios)
  } catch (error) {
    res.status(500).json({
      mensaje: "Error al obtener domicilios"
    })
  }
})

app.post("/api/domicilios", async (req, res) => {
  try {
    const nuevoDomicilio = new DomicilioTelefono(req.body)

    await nuevoDomicilio.save()

    res.json(nuevoDomicilio)
  } catch (error) {
    res.status(500).json({
      mensaje: "Error al guardar domicilio"
    })
  }
})

app.put("/api/domicilios/:id", async (req, res) => {
  try {
    const domicilioActualizado = await DomicilioTelefono.findByIdAndUpdate(
      req.params.id,
      req.body,
      { returnDocument: "after" }
    )

    res.json(domicilioActualizado)
  } catch (error) {
    res.status(500).json({
      mensaje: "Error al actualizar domicilio"
    })
  }
})

app.delete("/api/domicilios/:id", async (req, res) => {
  try {
    await DomicilioTelefono.findByIdAndDelete(req.params.id)

    res.json({
      mensaje: "Domicilio eliminado correctamente"
    })
  } catch (error) {
    res.status(500).json({
      mensaje: "Error al eliminar domicilio"
    })
  }
})

// ==============================
// AUTORIZADOS
// ==============================

app.get("/api/autorizados", async (req, res) => {
  const datos = await AutorizadoRetiro.find().sort({
    curso: 1,
    apellidoNombre: 1,
  });

  res.json(datos);
});

app.post("/api/autorizados", async (req, res) => {
  const nuevo = new AutorizadoRetiro(req.body);

  await nuevo.save();

  res.json(nuevo);
});

app.put("/api/autorizados/:id", async (req, res) => {
  const actualizado = await AutorizadoRetiro.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true }
  );

  res.json(actualizado);
});

app.delete("/api/autorizados/:id", async (req, res) => {
  await AutorizadoRetiro.findByIdAndDelete(req.params.id);

  res.json({ ok: true });
});

// ======================
// FRONTEND REACT
// ======================

app.use(
  express.static(
    path.join(__dirname, "../frontend/dist")
  )
)

app.use((req, res) => {
  res.sendFile(
    path.join(
      __dirname,
      "../frontend/dist/index.html" 
    )
  )
})

// ======================
// INICIAR SERVIDOR
const PORT = process.env.PORT || 3001

app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`)
})