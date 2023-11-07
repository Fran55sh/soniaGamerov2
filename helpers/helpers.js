const nodemailer = require("nodemailer");
const multer = require("multer");
let fechaActual = new Date();
require("dotenv").config();

// Agrega 5 días a la fecha actual
fechaActual.setDate(fechaActual.getDate() + 5);

// Formatea la fecha en el formato deseado (por ejemplo, YYYY-MM-DD)
let yyyy = fechaActual.getFullYear();
let mm = String(fechaActual.getMonth() + 1).padStart(2, "0"); // Los mes van de 0 a 11
let dd = String(fechaActual.getDate()).padStart(2, "0");

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


// // Configuración del transporte
// let transporter = nodemailer.createTransport({
//     host: 'mail.soniagameropropiedades.com', // Servidor de correo
//     port: 465, // Puerto SMTP
//     secure: true, // true para conexiones seguras
//     auth: {
//         user: process.env.EMAILUSER, // Tu dirección de correo
//         pass: process.env.APIKEY // Tu contraseña de correo
//     }
// });

let transporter = nodemailer.createTransport({
  service: "gmail", // Configura tus detalles de servidor SMTP o autenticación según tu caso
  auth: {
    user: process.env.GOOGLEUSER, // Tu dirección de correo electrónico
    pass: process.env.APIKEY_GOOGLE, // Tu contraseña
  },
});

function mail(propiedad, body) {
  let montoADepositar =
    (Math.round(propiedad[0].precio) * propiedad[0].reserva) / 100;
  let montoRestante =
    propiedad[0].precio -
    (Math.round(propiedad[0].precio) * propiedad[0].reserva) / 100;

  const mailOptions = {
    from: "tu_correo@gmail.com",
    to: body.email,
    subject: `Confirmacion de reserva ${body.codigoUnico}`,
    html: `
      

      Gracias por elegir nuestro servicio! Este correo es para confirmar que hemos recibido tu reserva para la propiedad ${
        propiedad[0].nombre
      } en la ciudad de ${
      propiedad[0].ciudad
    }. Para asegurar tu reserva, te pedimos que realices un depósito en la siguiente cuenta bancaria:<br>
      <br>
      Número de cuenta: ${propiedad[0].Cuenta}<br>
      ${propiedad[0].alias ? `Alias: ${propiedad[0].alias}<br>` : ""} 
      Nombre del titular: ${propiedad[0].titular}<br>
      Monto a depositar: ${montoADepositar}<br>
      Monto Restante: ${montoRestante}<br>
      <br>
      Por favor, asegúrate de realizar el depósito antes de la fecha ${fechaLimite}. Una vez realizado el depósito, envíanos una confirmación por correo electrónico junto con los detalles de la transacción para verificar la reserva.<br>
      <br>
      Tu código de reserva es ${
        body.codigoUnico
      }. Con este código vas a poder hacernos consultas sobre el estado de tu reserva.<br>
      Si tienes alguna pregunta o necesitas más información, no dudes en contactarnos!<br>
      <br>
      Saludos cordiales,<br>
      <br>
      Sonia Gamero Propiedades<br>
      
      `,
  };

  // Enviar el correo electrónico
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error("Error al enviar el correo electrónico:", error);
    } else {
      console.log("Correo electrónico enviado:", info.response);
      res.redirect('/reservaok');
    }
  });
}

module.exports = { fechaLimite, storage, transporter, mail };
