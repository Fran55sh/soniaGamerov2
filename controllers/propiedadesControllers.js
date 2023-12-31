const multer = require("multer");
const path = require("path");
const fs = require("fs");
const moment = require('moment');
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

  static async  modificarPropiedad(req, res) {
    console.log("aqui")
    const {
      propiedadId,
      nombre,
      descripcion,
      descripcioncorta,
      direccion,
      divisa,
      precio,
      tipo,
    } = req.body;
  
    try {
      const propiedadExistente = await propiedadesModel.findByPk(propiedadId);
  
      if (!propiedadExistente) {
        return res.status(404).json({ error: "La propiedad no existe" });
      }
  
      
      const updatedPropiedadDate = await propiedadExistente.update({
        propiedadId,
      nombre,
      descripcion,
      descripcioncorta,
      direccion,
      divisa,
      precio,
      tipo,
      });
  
      res.json(updatedPropiedadDate);
    } catch (error) {
      console.error("Error al modificar la propiedad:", error);
      res.status(500).json({ error: "Error al modificar la propiedad" });
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
        divisa,
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
        divisa,
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

  static async postFotosDate(req, res) {
  console.log(req.body)
    if (req.files) {
      try {
        const propiedadDateId = req.body.propiedadDateId;
        const fotosDate = req.files;
        console.log(fotosDate)

        for (let i = 0; i < fotosDate.length; i++) {
          const fotoDate = fotosDate[i];
          const nombreFoto = fotoDate.filename;
          const rutaFoto = fotoDate.path;

          // Crea una nueva instancia de Foto con el nombre de la foto y el ID de la propiedad
          await fotoDateModel.create({
            nombre: nombreFoto,
            propiedadDateId: propiedadDateId,
          });
        }
        res.status(200).json({ message: "Fotos almacenadas exitosamente" });
      } catch (error) {
        console.error("Error al almacenar las fotos:", error);
        res.status(500).json({ error: "Error al almacenar las fotos" });
      }
    } else {
      console.log("algo pasa");
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

  static async getPropiedadesDateJson(req, res) {
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
          "$condicione.id$": 3,
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

  static async generateReservas(req, res) {

    const codigoUnico = req.body.codigoUnico
    console.log(req.body.nombre)
    const array = [req.body.nombre,req.body.telefono,req.body.email];
    const datosCliente = array.join(",")


    const body = req.body; // Suponiendo que los datos se envían en el cuerpo de la solicitud POST
    const propiedad = await propiedadesDateModel.findAll({
      include: [
        { model: tipoModel },
        { model: condicionModel },
        { model: fotoDateModel },
      ],
      where: { id: body.id }, // Filtra por ID de propiedad
    });
    let montoADepositar =
      (Math.round(propiedad[0].precio) * propiedad[0].reserva) / 100;
    let montoRestante =
      propiedad[0].precio -
      (Math.round(propiedad[0].precio) * propiedad[0].reserva) / 100;

    let fechas = body.fechas.toString();
    let id = propiedad[0].id;

    mail(propiedad, body);
    try {
      const propiedadDateId = req.body.id; // Asegúrate de obtener el ID de la propiedad
    
      // Divide el string de fechas en un array
      const fechasArray = req.body.fechas
    
      // Elimina las fechas coincidentes del modelo 'disponibilidad' para el ID de la propiedad específico
      await disponibilidadModel.destroy({ where: { fecha: fechasArray, propiedadDateId: propiedadDateId } });
    
      // Verifica el resultado y envía una respuesta apropiada al cliente
      // res.status(200).json({ message: "reserva y fechas asociadas eliminadas correctamente" });
    } catch (error) {
      console.error("Error al eliminar la reserva y las fechas asociadas", error);
      res.status(500).json({ error: "Error al eliminar la reserva y las fechas asociadas:" });
    }
    

    try {
      const reserva = await reservaModel.create({
        propiedadesDateId: id,
        fechas,
        montoADepositar,
        montoRestante,
        datosCliente,
        codigoUnico
      });

      res.json(reserva);
    } catch (error) {
      console.error("Error al crear la reserva:", error);
      res.status(500).json({ error: "Error al crear la reserva" });
    }

    
  
  
  }

  

  static async crearPropiedadDate(req, res) {
    const {
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
      diasMinimos, 
      plazo,
      alias,
      titular,
      Cuenta,
      tipo,
    } = req.body;

    console.log(tipo);

    const tipoId = getTipoId(tipo);
    console.log(tipoId);

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
        diasMinimos,
        plazo,
        alias,
        titular,
        Cuenta,
        tipoId,
        condicionId: 3,
      });
      res.json(propiedadDate);
    } catch (error) {
      console.error("Error al crear la propiedad NODE:", error);
      res.status(500).json({ error: "Error al crear la propidad" });
    }
  }

  static async modificarPropiedadDate(req, res) {
    const {
      propiedadDateId,
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
      diasMinimos, 
      plazo,
      alias,
      titular,
      Cuenta,
      tipo,
    } = req.body;
  
    try {
      const propiedadExistente = await propiedadesDateModel.findByPk(propiedadDateId);
  
      if (!propiedadExistente) {
        return res.status(404).json({ error: "La propiedad no existe" });
      }
  
      const updatedFields = {};
  
      if (nombre) updatedFields.nombre = nombre;
      if (descripcion) updatedFields.descripcion = descripcion;
      if (descripcioncorta) updatedFields.descripcioncorta = descripcioncorta;
      if (ciudad) updatedFields.ciudad = ciudad;
      if (provincia) updatedFields.provincia = provincia;
      if (direccion) updatedFields.direccion = direccion;
      if (divisa) updatedFields.divisa = divisa;
      if (precio) updatedFields.precio = precio;
      if (distanciaAlCentro) updatedFields.distanciaAlCentro = distanciaAlCentro;
      if (distanciaAlMar) updatedFields.distanciaAlMar = distanciaAlMar;
      if (mapa) updatedFields.mapa = mapa;
      if (reserva) updatedFields.reserva = reserva;
      if (diasMinimos) updatedFields.diasMinimos = diasMinimos;
      if (plazo) updatedFields.plazo = plazo;
      if (alias) updatedFields.alias = alias;
      if (titular) updatedFields.titular = titular;
      if (Cuenta) updatedFields.Cuenta = Cuenta;
      if (tipo) updatedFields.tipoId = getTipoId(tipo);
      if (cantidadPersonas) updatedFields.cantidadPersonas = cantidadPersonas;
      if (cantidadAmbientes) updatedFields.cantidadAmbientes = cantidadAmbientes;
  
      // Comparar y actualizar campos booleanos
      if (wifi !== undefined && propiedadExistente.wifi !== wifi) {
        updatedFields.wifi = wifi;
      }
      if (tv !== undefined && propiedadExistente.tv !== tv) {
        updatedFields.tv = tv;
      }
      if (cochera !== undefined && propiedadExistente.cochera !== cochera) {
        updatedFields.cochera = cochera;
      }
      if (mascotas !== undefined && propiedadExistente.mascotas !== mascotas) {
        updatedFields.mascotas = mascotas;
      }
      if (pileta !== undefined && propiedadExistente.pileta !== pileta) {
        updatedFields.pileta = pileta;
      }
      if (conBlanco !== undefined && propiedadExistente.conBlanco !== conBlanco) {
        updatedFields.conBlanco = conBlanco;
      }
      if (lavarropa !== undefined && propiedadExistente.lavarropa !== lavarropa) {
        updatedFields.lavarropa = lavarropa;
      }
      if (parrilla !== undefined && propiedadExistente.parrilla !== parrilla) {
        updatedFields.parrilla = parrilla;
      }
      if (esDestacado !== undefined && propiedadExistente.esDestacado !== esDestacado) {
        updatedFields.esDestacado = esDestacado;
      }
  console.log(updatedFields)
      const updatedPropiedadDate = await propiedadExistente.update(updatedFields);
  
      res.json(updatedPropiedadDate);
    } catch (error) {
      console.error("Error al modificar la propiedad:", error);
      res.status(500).json({ error: "Error al modificar la propiedad" });
    }
  }
  
  
  static async createDates(req, res) {
    async function crearEntradasDesdeHasta(inicio, fin, propiedadDateId) {
      const fechas = [];
      const fechaInicio = moment(inicio);
      const fechaFin = moment(fin);

      while (fechaInicio.isSameOrBefore(fechaFin)) {
        fechas.push(fechaInicio.format("YYYY-MM-DD"));
        fechaInicio.add(1, "days");
      }

      try {
        await Promise.all(
          fechas.map(async (fecha) => {
            await disponibilidadModel.create({
              fecha: fecha,
              propiedadDateId: propiedadDateId,
            });
          })


          
        );
        res.status(200).json({ message: "fechas creadas correctamente", reloadPage: true });;
        console.log("¡Entradas creadas exitosamente!");
      } catch (error) {
        console.error("Ha ocurrido un error al crear las entradas:", error);
      }
    }

    // Llama a la función con tus valores deseados
    const inicio = req.body.inicio;
    const fin = req.body.fin;
    const propiedadDateId = req.body.propiedadDateId; // Reemplaza con el valor que desees

    crearEntradasDesdeHasta(inicio, fin, propiedadDateId);
    

   
  }

  static async deletePropiedadDate(req, res) {
    try {
      const propiedadId = req.body.propiedadDateId;

      // Obtén la lista de nombres de imágenes asociadas a la propiedad desde la base de datos
      const fotos = await fotoDateModel.findAll({
        where: {
          propiedadDateId: propiedadId,
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
      await fotoDateModel.destroy({
        where: {
          propiedadDateId: propiedadId,
        },
      });

      // Elimina la propiedad de la base de datos
      await propiedadesDateModel.destroy({
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

  static async deleteFechasDisponibles(req, res) {
    try {
      const propiedadId = req.body.propiedadDateId;
  
      const result = await disponibilidadModel.destroy({ where: { propiedadDateId: propiedadId } });
  
      // Verifica el resultado y envía una respuesta apropiada al cliente
      res
        .status(200)
        .json({ message: "Fechas eliminadas correctamente" });
    } catch (error) {
      console.error("Error al eliminar las fechas:", error);
      res
        .status(500)
        .json({ error: "Error al eliminar las fechas:" });
    } 
  }

  static async getReservas(req, res) {
    try {
      const reservas = await reservaModel.findAll({
        include: [{
          model: propiedadesDateModel, // Suponiendo que propiedadDateModel es el modelo de la tabla propiedadDate
          attributes: ['nombre'], // Asegúrate de incluir los atributos que necesitas de la tabla propiedadDate
        }]
      });
      res.status(200).json({ reservas });
    } catch (error) {
      res.status(500).json({ error: "Error al obtener las reservas:" });
    }
  }
  
  static async deleteReservas(req, res) {
    try {
      const reservaId = req.body.reservaId;
  
      const result = await reservaModel.destroy({ where: { id: reservaId } });
  
      // Verifica el resultado y envía una respuesta apropiada al cliente
      res.status(200).json({ message: "reserva eliminada correctamente", reloadPage: true });;
    } catch (error) {
      console.error("Error al eliminar la reserva", error);
      res
        .status(500)
        .json({ error: "Error al eliminar la reserva:" });
    } 

    
  }

  static async cancelReservas(req, res) {
    console.log("aqui")
    const fechasString = req.body.fechas;
    const reservaId = req.body.reservaId;
    const propiedadDateId = req.body.propiedadDateId;
  
    try {
      const result = await reservaModel.destroy({ where: { id: reservaId } });
  
      const fechasArray = fechasString.split(",");
      const inicio = fechasArray[0];
      const fin = fechasArray[fechasArray.length - 1];
  
      // Llama a la función con tus valores deseados
      await crearEntradasDesdeHasta(inicio, fin, propiedadDateId);
  
      // Verifica el resultado y envía una respuesta apropiada al cliente
      res.status(200).json({ message: "reserva eliminada correctamente" });
    } catch (error) {
      console.error("Error al eliminar la reserva", error);
      res.status(500).json({ error: "Error al eliminar la reserva:" , reloadPage: true});
    }
  
    async function crearEntradasDesdeHasta(inicio, fin, propiedadDateId) {
      const fechas = [];
      const fechaInicio = moment(inicio);
      const fechaFin = moment(fin);
  
      while (fechaInicio.isSameOrBefore(fechaFin)) {
        fechas.push(fechaInicio.format("YYYY-MM-DD"));
        fechaInicio.add(1, "days");
      }
  
      try {
        await Promise.all(
          fechas.map(async (fecha) => {
            await disponibilidadModel.create({
              fecha: fecha,
              propiedadDateId: propiedadDateId,
            });
          })
        );
  
        console.log("¡Entradas creadas exitosamente!");
      } catch (error) {
        console.error("Ha ocurrido un error al crear las entradas:", error);
      }
    }
  }

  static async pagoReservas(req, res) {
    try {
      const reservaId = req.body.reservaId;
  
      const result = await reservaModel.update({ estado: 'Reserva abonada' }, { where: { id: reservaId } });
  
      // Verifica el resultado y envía una respuesta apropiada al cliente
      res.status(200).json({ message: "pago procesado correctamente", reloadPage: true });;
    } catch (error) {
      console.error("Error al procesar el pago", error);
      res
        .status(500)
        .json({ error: "Error al procesar el pago:" });
    } 

    
  }
  
}



(module.exports = Propiedades), upload;
