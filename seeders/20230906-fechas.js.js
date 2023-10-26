
const moment = require('moment');
const { fechaModel } = require('../db/config'); // Asegúrate de ajustar la ruta según tu estructura de archivos

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const startDate = moment('2023-09-01');
    const endDate = moment('2024-03-01');

    const datesToInsert = [];

    while (startDate.isBefore(endDate)) {
      datesToInsert.push({
        fecha: startDate.format('YYYY-MM-DD'),
        precio: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      startDate.add(1, 'days');
    }

    await queryInterface.bulkInsert('Fechas', datesToInsert, {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Fechas', null, {});
  },
};