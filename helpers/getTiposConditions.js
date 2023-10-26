// Ruta para crear una propiedad
const getTipoId = (tipo) => {
    switch (tipo) {
      case 'Casas':
        return 1;
      case 'Departamentos':
        return 2;
      case 'Fideicomisos':
        return 3;
      case 'Proyectos':
        return 4;
      case 'Locales':
        return 5;
      default:
        return null;
    }
  };
  
  const getCondicionId = (condicion) => {
    switch (condicion) {
      case 'Venta':
        return 1;
      case 'Alquiler':
        return 2;
        case 'Alquiler Temporal':
        return 3;
      default:
        return null;
    }
  };

  module.exports = {
    getCondicionId, 
    getTipoId
  }