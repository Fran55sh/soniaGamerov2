// Importa las dependencias necesarias
require("dotenv").config();
const { Sequelize, DataTypes } = require("sequelize");

// Configura la conexión a la base de datos
const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASS,
  {
    host: "localhost",
    dialect: "mariadb",
  }
);

const propiedadesModel = sequelize.define(
  "propiedades",
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

const tipoModel = sequelize.define("tipos", {
  nombre: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  // timestamps: false,
});

const condicionModel = sequelize.define("condiciones", {
  nombre: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  // timestamps: false,
});

const fotoModel = sequelize.define("fotos", {
  nombre: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  // timestamps: false,
});

const propiedadesDateModel = sequelize.define(
  "propiedadDate",
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
    ciudad: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    provincia: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    direccion: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    precio: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    divisa: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    wifi: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    tv: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    cochera: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    mascotas: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    pileta: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    conBlanco: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    lavarropa: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    parrilla: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    distanciaAlCentro: {
      type: DataTypes.TEXT,
      allowNull: false,
      defaultValue: false,
    },
    distanciaAlMar: {
      type: DataTypes.TEXT,
      allowNull: false,
      defaultValue: false,
    },
    esDestacado: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    cantidadPersonas: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    cantidadAmbientes: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    mapa: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    reserva: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: false,
    },
    diasMinimos: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: false,
    },
    plazo: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: false,
    },
    titular: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    alias: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    Cuenta: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
  },
  {
    // timestamps: false,
  }
);

const fotoDateModel = sequelize.define("fotoDate", {
  nombre: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  // timestamps: false,
});

const disponibilidadModel = sequelize.define("disponibilidad", {
  fecha: {
    type: DataTypes.DATEONLY, // Utiliza el tipo de datos adecuado para las fechas.
    allowNull: false,
  },
  estado: {
    type: DataTypes.BOOLEAN, // Puedes usar un booleano para representar si está disponible o no.
    allowNull: false,
    defaultValue: true, // Por defecto, una fecha puede considerarse disponible.
  },
});

const reservaModel = sequelize.define("reserva", {
  fechas: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  montoADepositar: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  montoRestante: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  datosCliente: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
});

// Ahora, establecemos la relación entre propiedadesDateModel y Disponibilidad:
propiedadesDateModel.hasMany(disponibilidadModel, { as: "disponibilidades" });
disponibilidadModel.belongsTo(propiedadesDateModel);

// Establece las relaciones entre los modelos
propiedadesModel.belongsTo(tipoModel, { foreignKey: "tipoId" });
propiedadesModel.belongsTo(condicionModel, { foreignKey: "condicionId" });
propiedadesModel.hasMany(fotoModel, { foreignKey: "propiedadId" });

propiedadesDateModel.belongsTo(tipoModel, { foreignKey: "tipoId" });
propiedadesDateModel.belongsTo(condicionModel, { foreignKey: "condicionId" });
propiedadesDateModel.hasMany(fotoDateModel, { foreignKey: "propiedadDateId" });

reservaModel.belongsTo(propiedadesDateModel, {
  foreignKey: "propiedadesDateId", // Nombre de la clave externa en la tabla reservaModel
  constraints: true,
  onDelete: "CASCADE", // Esto determina el comportamiento al eliminar un registro relacionado
});

// Sincroniza los modelos con la base de datos
sequelize
  .sync()
  .then(() => {
    console.log("Modelos sincronizados correctamente");
  })
  .catch((error) => {
    console.error("Error al sincronizar los modelos:", error);
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
  reservaModel,
  sequelize,
};
