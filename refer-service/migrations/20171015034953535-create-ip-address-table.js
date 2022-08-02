module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable(
      'IpAddresses',
      {
        id: {
          type: Sequelize.BIGINT,
          primaryKey: true,
          autoIncrement: true,
        },

        ipAddress: {
          type: Sequelize.STRING,
          validate: {
            notEmpty: true,
          },
        },

        numberOfSignUps: {
          type: Sequelize.INTEGER,
          defaultValue: 1,
        },

        createdAt: Sequelize.DATE,
        updatedAt: Sequelize.DATE,
        deletedAt: Sequelize.DATE,
      }
    );
  },
  down: (queryInterface) => {
    return queryInterface.dropTable('IpAddresses');
  },
};
