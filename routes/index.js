require("dotenv").config();
let express = require("express");
let router = express.Router();
const Propiedades = require("../controllers/propiedadesControllers");
const Usuario = require('../controllers/userControllers')
const { propiedadesModel } = require("../db/config"); 
const upload = require("../controllers/propiedadesControllers")


/* GET home page. */

// router.get("/", function (req, res, next) {
//   res.render("index", { title: "Sonia Gamero Propiedades" });
// });

router.get("/propiedades", function (req, res, next) {
  res.render("propiedades");
});

router.get("/admin", function (req, res, next) {
  res.render("admin", { title: "Sonia Gamero Propiedades" });
});

router.get('/detallePropiedad/:dato', function(req,res,next){
  
  res.render("detallePropiedad")
})

router.get('/detallePropiedadDate/:dato', function(req,res,next){
  const id = req.params.dato;
  localStorage.setItem('id', id);
  res.render("detallePropiedad")
})


//propiedades

router.get('/date', Propiedades.getPropiedadesByTipoDate)

router.get('/api/propiedades', Propiedades.getPropiedades, Propiedades.getPropiedadesBydate);

router.get('/', Propiedades.getPropiedadesBydate);

router.get('/api/propiedades/:dato', Propiedades.getPropiedadesByTipo);

router.get('/api/propiedad/:id', Propiedades.getPropiedadesById)




//propiedades temporales
router.get('/propiedadesDate', Propiedades.getPropiedadesDate)

router.get('/fechasPropiedades', Propiedades.getPropiedadesDateFechas)

router.get('/api/propiedadesDate/:id', Propiedades.getPropiedadesDateById)

router.get('/api/propiedadesDateJson/:id', Propiedades.getPropiedadesDateByIdJson)

router.get('/api/fechas', Propiedades.getFechas)

router.post('/api/propiedadesDate/reservar',Propiedades.deleteReservas )

//admin

router.post("/acceso-restringido", Usuario.userAuth);

router.post("/crear-propiedad",  Propiedades.postPropiedad)

router.post("/subir-fotos", Propiedades.postFotos);

router.delete('/eliminar-propiedad', Propiedades.deletePropiedad)

module.exports = router;
