// Importa las dependencias necesarias
require("dotenv").config();
const { Sequelize, DataTypes } = require('sequelize');

// Configura la conexión a la base de datos
const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASS, {
  host: 'localhost',
  dialect: 'mariadb',
});

const propiedadesModel = sequelize.define(
  'propiedades',
  {
    nombre: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    descripcion: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    descripcioncorta: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    direccion: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    precio: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    esDestacado: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    mapa: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
  },
  {
    // timestamps: false,
  }
);

const tipoModel = sequelize.define('tipos', {
  nombre: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  // timestamps: false,
});

const condicionModel = sequelize.define('condiciones', {
  nombre: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  // timestamps: false,
});

const fotoModel = sequelize.define('fotos', {
  nombre: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  // timestamps: false,
});

const propiedadesDateModel = sequelize.define(
  'propiedadDate',
  {
    nombre: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    descripcion: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    descripcioncorta: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    direccion: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    precio: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    esDestacado: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    cantidadPersonas:{
      type: DataTypes.INTEGER,
      allowNull:false,
    },
    mapa: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
  },
  {
    // timestamps: false,
  }
);
  

const fotoDateModel = sequelize.define('fotoDate', {
  nombre: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  // timestamps: false,
});

// const fechaModel = sequelize.define('fecha', {
//   fecha: {
//     type: DataTypes.DATEONLY, // Almacena solo la fecha (sin hora)
//     allowNull: false,
//   },  
//   precio: { 
//     type: DataTypes.DECIMAL(10, 2), // Decimal para el precio, ajusta según tus necesidades
//     allowNull: false,
//   },
// })
  

const disponibilidadModel = sequelize.define(
  'disponibilidad',
  {
    fecha: {
      type: DataTypes.DATEONLY, // Utiliza el tipo de datos adecuado para las fechas.
      allowNull: false,
    },
    estado: {
      type: DataTypes.BOOLEAN, // Puedes usar un booleano para representar si está disponible o no.
      allowNull: false,
      defaultValue: true, // Por defecto, una fecha puede considerarse disponible.
    },
  }
);

// Ahora, establecemos la relación entre propiedadesDateModel y Disponibilidad:
propiedadesDateModel.hasMany(disponibilidadModel, { as: 'disponibilidades' });
disponibilidadModel.belongsTo(propiedadesDateModel);

// Establece las relaciones entre los modelos
propiedadesModel.belongsTo(tipoModel, { foreignKey: 'tipoId' });
propiedadesModel.belongsTo(condicionModel, { foreignKey: 'condicionId' });
propiedadesModel.hasMany(fotoModel, { foreignKey: 'propiedadId' });

propiedadesDateModel.belongsTo(tipoModel, { foreignKey: 'tipoId' });
propiedadesDateModel.belongsTo(condicionModel, { foreignKey: 'condicionId' });
propiedadesDateModel.hasMany(fotoDateModel, { foreignKey: 'propiedadDateId' });

// disponibilidadModel.belongsTo(fechaModel, { foreignKey: 'fechaId', onDelete: 'CASCADE' });
// disponibilidadModel.belongsTo(propiedadesDateModel, { foreignKey: 'propiedadDateId', onDelete: 'CASCADE' });
// fechaModel.hasMany(disponibilidadModel, { foreignKey: 'fechaId' });
// propiedadesDateModel.hasMany(disponibilidadModel, { foreignKey: 'propiedadDateId' });

// Sincroniza los modelos con la base de datos
sequelize.sync()
  .then(() => {
    console.log('Modelos sincronizados correctamente');
  })
  .catch((error) => {
    console.error('Error al sincronizar los modelos:', error);
  });

// Exporta los modelos
module.exports = {
  propiedadesModel,
  propiedadesDateModel,
  tipoModel,
  condicionModel,
  fotoModel,
  fotoDateModel,
  disponibilidadModel,
  sequelize,
};

