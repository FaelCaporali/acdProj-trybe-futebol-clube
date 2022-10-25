module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('users', {
      id: {
        primaryKey: true,
        type: Sequelize.INTEGER,
        autoIncrement: true,
      },
      username: {
        type: Sequelize.STRING(255),
        allowNull: false,
        unique: true,
      },
      role: {
        type: Sequelize.STRING(255),
      },
      email: {
        type: Sequelize.STRING(255),
        unique: true,
        allowNull: false,
      },
      password: {
        type: Sequelize.STRING(255),
      },
    });
  },
  down: async (queryInterface) => {
    await queryInterface.dropTable('users');
  },
};
