// Ruta para crear una propiedad
const getTipoId = (tipo) => {
    switch (tipo) {
      case 'Casa':
        return 1;
      case 'Departamento':
        return 2;
      case 'Fideicomiso':
        return 3;
      case 'Proyecto':
        return 4;
      case 'Local':
        return 5;
      default:
        return 1;
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