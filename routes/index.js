require("dotenv").config();
let express = require("express");
let router = express.Router();
const Propiedades = require("../controllers/propiedadesControllers");
const Usuario = require('../controllers/userControllers')


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

router.get("/reservaok", function (req, res, next) {
  res.render("reservaok");
});


//propiedades



router.get('/api/propiedades', Propiedades.getPropiedades, Propiedades.getPropiedadesBydate);

router.get('/', Propiedades.getPropiedadesBydate);

router.get('/api/propiedades/:dato', Propiedades.getPropiedadesByTipo);

router.get('/api/propiedad/:id', Propiedades.getPropiedadesById)

router.patch('/api/modificarPropiedades',Propiedades.modificarPropiedad)


//propiedades temporales
router.get('/date', Propiedades.getPropiedadesByTipoDate)

router.get('/fechasPropiedades', Propiedades.getPropiedadesDateFechas)

router.get('/api/propiedadesDate/:id', Propiedades.getPropiedadesDateById)

router.get('/api/propiedadesDateJson/:id', Propiedades.getPropiedadesDateByIdJson)
router.get('/api/propiedadesDateJson', Propiedades.getPropiedadesDateJson)

router.get('/api/fechas', Propiedades.getFechas)

router.post('/api/propiedadesDate/reservar',Propiedades.generateReservas )

router.get('/api/obtenerReservas',Propiedades.getReservas )

router.post('/api/crearPropiedadesDate',Propiedades.crearPropiedadDate )

router.patch('/api/modificarPropiedadesDate',Propiedades.modificarPropiedadDate )

router.post('/api/crearFechas',Propiedades.createDates )

router.delete('/api/deletePropiedadesDate',Propiedades.deletePropiedadDate )

router.delete('/api/deleteFechas',Propiedades.deleteFechasDisponibles )

router.delete('/api/deleteReservas',Propiedades.deleteReservas )

router.post('/api/cancelReservas',Propiedades.cancelReservas )

router.post('/api/pagoReservas',Propiedades.pagoReservas)



//admin

router.post("/acceso-restringido", Usuario.userAuth);

router.post("/crear-propiedad",  Propiedades.postPropiedad)

router.post("/subir-fotos", Propiedades.postFotos);

router.post("/subir-fotosDate", Propiedades.postFotosDate);

router.delete('/eliminar-propiedad', Propiedades.deletePropiedad)

module.exports = router;
