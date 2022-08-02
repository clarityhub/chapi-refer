module.exports = function (sequelize, Sequelize) {
  const IpAddress = sequelize.define('IpAddress', {
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
  }, {
    timestamps: true,
    paranoid: true,
  });

  return IpAddress;
}