const nodemailer = require('nodemailer');
const multer = require("multer");
let fechaActual = new Date();

// Agrega 5 días a la fecha actual
fechaActual.setDate(fechaActual.getDate() + 5);

// Formatea la fecha en el formato deseado (por ejemplo, YYYY-MM-DD)
let yyyy = fechaActual.getFullYear();
let mm = String(fechaActual.getMonth() + 1).padStart(2, '0'); // Los mes van de 0 a 11
let dd = String(fechaActual.getDate()).padStart(2, '0');

// Crea la variable con la fecha correspondiente a 5 días a partir de hoy
let fechaLimite = `${dd}/${mm}/${yyyy}`;


let storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, path.join(__dirname, "public/images/propiedades"));
    },
    filename: function (req, file, cb) {
      cb(null, Date.now() + "_" + file.originalname);
    },
  });

  let transporter = nodemailer.createTransport({
    service: 'gmail', // Configura tus detalles de servidor SMTP o autenticación según tu caso
    auth: {
      user: 'corvattafranco@gmail.com', // Tu dirección de correo electrónico
      pass: 'bcut iauk gune qjuw', // Tu contraseña
    },
  });
module.exports = {fechaLimite, storage, transporter}