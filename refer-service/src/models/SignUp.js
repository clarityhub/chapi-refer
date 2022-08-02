const { VALID, INVALID } = require('../enums/status');

module.exports = function (sequelize, Sequelize) {
  const SignUp = sequelize.define('SignUp', {
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

    status: {
      type: Sequelize.ENUM([VALID, INVALID]),
      allowNull: false,
      defaultValue: VALID,
      validate: {
        notEmpty: true,
      }
    },

    createdAt: Sequelize.DATE,
    updatedAt: Sequelize.DATE,
    deletedAt: Sequelize.DATE,
  }, {
    timestamps: true,
    paranoid: true,
  });

  return SignUp;
};
