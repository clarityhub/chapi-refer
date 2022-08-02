module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable(
      'SignUps',
      {
        id: {
          type: Sequelize.BIGINT,
          primaryKey: true,
          autoIncrement: true,
        },

        email: {
          type: Sequelize.STRING,
          validate: {
            notEmpty: true,
            isEmail: true,
          },
        },

        shortId: {
          type: Sequelize.STRING,
          allowNull: false,
          unique: 'shortIdIndex',
          validate: {
            notEmpty: true,
          }
        },

        referrerId: {
          type: Sequelize.BIGINT,
          allowNull: true,
        },

        createdAt: Sequelize.DATE,
        updatedAt: Sequelize.DATE,
        deletedAt: Sequelize.DATE,
      }
    );
  },
  down: (queryInterface) => {
    return queryInterface.dropTable('SignUps');
  },
};
