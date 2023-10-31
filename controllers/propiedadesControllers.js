const multer = require("multer");
const path = require("path");
const fs = require("fs");
const { Op } = require("sequelize");
const {
  propiedadesModel,
  tipoModel,
  condicionModel,
  fotoModel,
  propiedadesDateModel,
  fotoDateModel,
  disponibilidadModel,
  fechaModel,
  reservaModel,
} = require("../db/config");
const { getTipoId, getCondicionId } = require("../helpers/getTiposConditions");

const {
  fechaLimite,
  storage,
  transporter,
  mail,
} = require("../helpers/helpers");
const { Console } = require("console");

const upload = multer({ storage: storage });

class Propiedades {
  static async getPropiedades(req, res) {
    try {
      // Obtiene todas las propiedades con sus relaciones
      const propiedades = await propiedadesModel.findAll({
        include: [
          { model: tipoModel },
          { model: condicionModel },
          { model: fotoModel },
        ],
      });

      const propiedadesConFotos = propiedades.map((propiedad) => {
        const fotos = propiedad.fotos?.map((foto) => foto.nombre) || [];
        return {
          ...propiedad.toJSON(),
          fotos: fotos,
        };
      });

      // Devuelve las propiedades con relaciones en la respuesta
      res.json(propiedades);
    } catch (error) {
      console.error("Error al obtener las propiedades:", error);
      res.status(500).json({ error: "Error al obtener las propiedades" });
    }
  }

  static async getPropiedadesById(req, res) {
    const id = req.params.id;
    try {
      // Obtiene todas las propiedades con sus relaciones
      const propiedad = await propiedadesModel.findAll({
        include: [
          { model: tipoModel },
          { model: condicionModel },
          { model: fotoModel },
        ],
        where: {
          "$propiedades.id$": id,
        },
      });

      // Devuelve la propiedad con relaciones en la respuesta
      if (propiedad.length === 0) {
        // Maneja el caso cuando no hay propiedad encontradas
        res.render("detallePropiedad", { propiedad: null }); // o puedes pasar un mensaje de error
      } else {
        res.render("detallePropiedad", { propiedad });
        // res.json(propiedad)
      }
    } catch (error) {
      console.error("Error al obtener la propiedad:", error);
      res.status(500).json({ error: "Error al obtener la propiedad" });
    }
  }

  static async getPropiedadesByTipo(req, res) {
    const tipo = req.params.dato;
    try {
      // Obtiene todas las propiedades con sus relaciones
      const propiedades = await propiedadesModel.findAll({
        include: [
          { model: tipoModel },
          { model: condicionModel },
          { model: fotoModel },
        ],
        where: {
          "$tipo.nombre$": tipo,
        },
      });

      // Devuelve las propiedades con relaciones en la respuesta
      if (propiedades.length === 0) {
        // Maneja el caso cuando no hay propiedades encontradas
        res.render("propiedades", { propiedades: null }); // o puedes pasar un mensaje de error
      } else {
        // Devuelve las propiedades con relaciones en la respuesta
     
        res.render("propiedades", { propiedades });
        // res.json(propiedades)
      }
    } catch (error) {
      console.error("Error al obtener las propiedades:", error);
      res.status(500).json({ error: "Error al obtener las propiedades" });
    }
  }

  static async getPropiedadesBydate(req, res) {
    try {
      // Obtiene las últimas 4 propiedades creadas con sus relaciones
      const ultimasPropiedades = await propiedadesModel.findAll({
        include: [
          { model: tipoModel },
          { model: condicionModel },
          { model: fotoModel },
        ],

        order: [["createdAt", "DESC"]],
        limit: 6,
      });

      const value = 1;
      const featPropiedades = await propiedadesModel.findAll({
        include: [
          { model: tipoModel },
          { model: condicionModel },
          { model: fotoModel },
        ],
        limit: 4,
        where: {
          "$propiedades.esDestacado$": value,
        },
      });

      if (ultimasPropiedades.length && featPropiedades === 0) {
        // Maneja el caso cuando no hay propiedades encontradas
        res.render("propiedades", {
          ultimasPropiedades: null,
          featPropiedades: null,
        }); // o puedes pasar un mensaje de error
      } else {
        // Devuelve las propiedades con relaciones en la respuesta
   
        res.render("index", { ultimasPropiedades, featPropiedades });
        // res.json(ultimasPropiedades);
      }
    } catch (error) {
      console.error("Error al obtener las propiedades:", error);
      res.status(500).json({ error: "Error al obtener las propiedades" });
    }
  }

  static async postPropiedad(req, res) {
    try {
      const {
        nombre,
        descripcion,
        descripcioncorta,
        direccion,
        precio,
        esDestacado,
        mapa,
        tipo,
        condicion,
      } = req.body;

      const tipoId = getTipoId(tipo);
      const condicionId = getCondicionId(condicion);
      let esDestacadoValue = 0;

      if (esDestacado === true) {
        esDestacadoValue = 1;
      }

      if (tipoId === null || condicionId === null) {
        // Manejo de error si tipo o condicion no son válidos
        return res.status(400).json({ error: "Tipo o condicion inválido" });
      }

      // Crea la propiedad en la base de datos
      const propiedad = await propiedadesModel.create({
        nombre,
        descripcion,
        descripcioncorta,
        direccion,
        precio,
        esDestacado,
        mapa,
        tipoId,
        condicionId,
      });

      // Devuelve la propiedad creada como respuesta

      res.status(201).json(propiedad);
    } catch (error) {
      // Manejo de errores
      console.error("Error al crear la propiedad:", error);
      res.status(500).json({ error: "Error al crear la propiedad" });
    }
  }

  // Maneja la solicitud POST utilizando multer
  static async postFotos(req, res) {
    try {
      const propiedadesId = req.body.propiedadId;
      const fotos = req.files;

      for (let i = 0; i < fotos.length; i++) {
        const foto = fotos[i];
        const nombreFoto = foto.filename;
        const rutaFoto = foto.path;

        // Crea una nueva instancia de Foto con el nombre de la foto y el ID de la propiedad
        await fotoModel.create({
          nombre: nombreFoto,
          propiedadId: propiedadesId,
        });
      }

      res.status(200).json({ message: "Fotos almacenadas exitosamente" });
    } catch (error) {
      console.error("Error al almacenar las fotos:", error);
      res.status(500).json({ error: "Error al almacenar las fotos" });
    }
  }

  static async deletePropiedad(req, res) {
    try {
      const propiedadId = req.body.propiedadId;

      // Obtén la lista de nombres de imágenes asociadas a la propiedad desde la base de datos
      const fotos = await fotoModel.findAll({
        where: {
          propiedadId: propiedadId,
        },
        attributes: ["nombre"],
      });

      // Elimina las imágenes del sistema de archivos
      for (let i = 0; i < fotos.length; i++) {
        const foto = fotos[i];
        const rutaFoto = path.join(
          __dirname,
          "../public/images/propiedades",
          foto.nombre
        );

        try {
          // Verifica si la imagen existe en el sistema de archivos antes de eliminarla
          if (fs.existsSync(rutaFoto)) {
            // Elimina la imagen del sistema de archivos
            fs.unlinkSync(rutaFoto);
          }
        } catch (err) {
          console.error(
            "Error al eliminar la imagen del sistema de archivos:",
            err
          );
        }
      }

      // Elimina los registros de imágenes asociados a la propiedad de la base de datos
      await fotoModel.destroy({
        where: {
          propiedadId: propiedadId,
        },
      });

      // Elimina la propiedad de la base de datos
      await propiedadesModel.destroy({
        where: {
          id: propiedadId,
        },
      });

      res
        .status(200)
        .json({ message: "Propiedad y sus imágenes eliminadas correctamente" });
    } catch (error) {
      console.error("Error al eliminar la propiedad y sus imágenes:", error);
      res
        .status(500)
        .json({ error: "Error al eliminar la propiedad y sus imágenes" });
    }
  }

  //rutas para propiedades temporales

  static async getPropiedadesDate(req, res) {
    try {
      // Obtén todas las propiedades con su información asociada
      const propiedades = await propiedadesDateModel.findAll({
        include: [
          { model: tipoModel },
          { model: condicionModel },
          { model: fotoDateModel },
        ],
      });

      // Mapea cada propiedad para obtener sus fechas de disponibilidad
      const propiedadesConFechas = await Promise.all(
        propiedades.map(async (propiedad) => {
          const fechasDisponibilidad = await disponibilidadModel.findAll({
            where: { propiedadDateId: propiedad.id }, // Filtra por ID de propiedad
            include: [{ model: fechaModel, attributes: ["fecha"] }],
          });
          return {
            ...propiedad.toJSON(),
            fechasDisponibilidad,
          };
        })
      );

      res.json(propiedadesConFechas);
    } catch (error) {
      console.error("Error al obtener las propiedades:", error);
      res.status(500).json({ error: "Error al obtener las propiedades" });
    }
  }

  static async getPropiedadesDateById(req, res) {
    const id = req.params.id;
    try {
      // Obtiene todas las propiedades con sus relaciones
      const propiedad = await propiedadesDateModel.findAll({
        include: [
          { model: tipoModel },
          { model: condicionModel },
          { model: fotoDateModel },
        ],
        where: {
          "$propiedadDate.id$": id,
        },
      });

      const propiedadesConFechas = await Promise.all(
        propiedad.map(async (propiedad) => {
          const fechasDisponibilidad = await disponibilidadModel.findAll({
            where: { propiedadDateId: propiedad.id }, // Filtra por ID de propiedad
            // include: [{ model: fechaModel, attributes: ['fecha'] }],
          });
          return {
            ...propiedad.toJSON(),
            fechasDisponibilidad,
          };
        })
      );

      // Devuelve la propiedad con relaciones en la respuesta
      if (propiedad.length === 0) {
        // Maneja el caso cuando no hay propiedad encontradas
        res.render("detallePropiedadDate", { propiedad: null });
      } else {
        // Devuelve la propiedad con relaciones en la respuesta
        res.cookie("id", id);
        res.render("detallePropiedadDate", { propiedad: propiedadesConFechas });
      }
    } catch (error) {
      console.error("Error al obtener la propiedad:", error);
      res.status(500).json({ error: "Error al obtener la propiedad" });
    }
  }

  static async getPropiedadesDateByIdJson(req, res) {
    const id = req.params.id;
    try {
      // Obtiene todas las propiedades con sus relaciones
      const propiedad = await propiedadesDateModel.findAll({
        include: [
          { model: tipoModel },
          { model: condicionModel },
          { model: fotoDateModel },
        ],
        where: {
          "$propiedadDate.id$": id,
        },
      });

      const propiedadesConFechas = await Promise.all(
        propiedad.map(async (propiedad) => {
          const fechasDisponibilidad = await disponibilidadModel.findAll({
            where: { propiedadDateId: propiedad.id }, // Filtra por ID de propiedad
            // include: [{ model: fechaModel, attributes: ['fecha'] }],
          });
          return {
            ...propiedad.toJSON(),
            fechasDisponibilidad,
          };
        })
      );

      // Devuelve la propiedad con relaciones en la respuesta
      if (propiedad.length === 0) {
        // Maneja el caso cuando no hay propiedad encontradas
        res.status(404).json({ error: "no se encontraron propiedades" });
      } else {
        // Devuelve la propiedad con relaciones en la respuesta
        res.json(propiedadesConFechas);
      }
    } catch (error) {
      console.error("Error al obtener la propiedad:", error);
      res.status(500).json({ error: "Error al obtener la propiedad" });
    }
  }

  static async getPropiedadesByTipoDate(req, res) {
    const condicion = "Alquiler termporal";
    try {
      // Obtiene todas las propiedades con sus relaciones
      const propiedades = await propiedadesDateModel.findAll({
        include: [
          { model: tipoModel },
          { model: condicionModel },
          { model: fotoDateModel },
        ],
        where: {
          "$condicione.id$": 3,
        },
      });

      // Devuelve las propiedades con relaciones en la respuesta
      if (propiedades.length === 0) {
        // Maneja el caso cuando no hay propiedades encontradas
        res.render("propiedadesDate", { propiedades: null }); // o puedes pasar un mensaje de error
      } else {
        // Devuelve las propiedades con relaciones en la respuesta
        res.render("propiedadesDate", { propiedades });
        // res.json(propiedades)
      }
    } catch (error) {
      console.error("Error al obtener las propiedades:", error);
      res.status(500).json({ error: "Error al obtener las propiedades" });
    }
  }

  static async getPropiedadesDateFechas(req, res) {
    const propiedadIdDeseada = 1; // Reemplaza con el ID de la propiedad que deseas consultar

    disponibilidadModel
      .findAll({
        where: { propiedadDateId: propiedadIdDeseada },
        include: [
          {
            model: fechaModel, // Tabla que deseas unir
            attributes: ["fecha"], // Puedes seleccionar las columnas que deseas obtener de fechaModel
          },
        ],
      })
      .then((result) => {
        // El resultado contiene todas las fechas correspondientes a la propiedad
        res.json(result);
      })
      .catch((error) => {
        console.error("Error al buscar disponibilidades:", error);
      });
  }

  static async getFechas(req, res) {
    try {
      // Obtiene todas las propiedades con sus relaciones
      const fechas = await fechaModel.findAll({});
      res.json(fechas);
    } catch (error) {
      console.error("Error al obtener las fechas:", error);
      res.status(500).json({ error: "Error al obtener las fechas" });
    }
  }

  static async deleteReservas(req, res) {
    // Obtener los datos del formulario (si los hay)

    const body = req.body; // Suponiendo que los datos se envían en el cuerpo de la solicitud POST
    const propiedad = await propiedadesDateModel.findAll({
      include: [
        { model: tipoModel },
        { model: condicionModel },
        { model: fotoDateModel },
      ],
      where: { id: body.id }, // Filtra por ID de propiedad
    });
    let montoADepositar = (Math.round(propiedad[0].precio) * propiedad[0].reserva) / 100;
    let montoRestante = propiedad[0].precio - (Math.round(propiedad[0].precio) * propiedad[0].reserva) / 100;

    let fechas = body.fechas.toString();
    let id = propiedad[0].id;

    mail(propiedad, body)

    try {
      const reserva = await reservaModel.create({
        propiedadesDateId: id,
        fechas,
        montoADepositar,
        montoRestante,
      });

      res.json(reserva)
    } catch (error) {
      console.error("Error al crear la reserva:", error);
      res.status(500).json({ error: "Error al crear la reserva" });
    }
  }


  static async crearPropiedadDate ( req,res){

const {nombre,
  descripcion,
  descripcioncorta,
  ciudad,
  provincia,
  direccion,
  divisa,
  precio,
  distanciaAlCentro,
  distanciaAlMar,
  wifi,
  tv,
  cochera,
  mascotas,
  pileta,
  conBlanco,
  lavarropa,
  parrilla,
  esDestacado,
  cantidadPersonas,
  cantidadAmbientes,
  mapa,
  reserva,
  alias,
  titular,
  Cuenta,
tipo} = req.body

console.log(tipo)

const tipoId = getTipoId(tipo);
console.log(tipoId)


try {
  const propiedadDate = await propiedadesDateModel.create({
    nombre,
    descripcion,
    descripcioncorta,
    ciudad,
    provincia,
    direccion,
    divisa,
    precio,
    distanciaAlCentro,
    distanciaAlMar,
    wifi,
    tv,
    cochera,
    mascotas,
    pileta,
    conBlanco,
    lavarropa,
    parrilla,
    esDestacado,
    cantidadPersonas,
    cantidadAmbientes,
    mapa,
    reserva,
    alias,
    titular,
    Cuenta,
    tipoId,
    condicionId : 3
  })
  res.json(propiedadDate)
} catch (error) {
  console.error("Error al crear la propiedad NODE:", error);
      res.status(500).json({ error: "Error al crear la propidad" });
}

    
  }
}

(module.exports = Propiedades), upload;
