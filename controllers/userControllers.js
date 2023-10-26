class Usuario{

   static async userAuth (req, res)  {
        const { password } = req.body;
        const adminPassword = process.env.ADMIN_PASSWORD;
      
        if (password === adminPassword) {
          // Contraseña correcta, permite el acceso
          res.render('restricted');
        } else {
          // Contraseña incorrecta, muestra un mensaje de error
          res.send('Contraseña incorrecta');
        }
      }

}

module.exports= Usuario
