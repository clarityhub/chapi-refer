module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn(
      'SignUps',
      'status',
      {
        type: Sequelize.ENUM(['valid', 'invalid']),
        defaultValue: 'valid',
      }
    );
  },
  down: (queryInterface) => {
    return queryInterface.removeColumn(
      'SignUps',
      'status'
    );
  },
};
