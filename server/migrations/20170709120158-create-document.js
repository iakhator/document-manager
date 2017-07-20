module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.createTable('Document', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: Sequelize.INTEGER
    },
    title: {
      type: Sequelize.STRING,
      allowNull: false
    },
    content: {
      type: Sequelize.STRING,
      allowNull: false
    },
    access: {
      type: Sequelize.ENUM('public', 'private', 'role'),
      defaultValue: 'public',
      allowNull: false
    },
    userId: {
      type: Sequelize.INTEGER,
      references: {
        model: 'User',
        key: 'id',
        as: 'userId',
      }
    },
    createdAt: {
      allowNull: false,
      type: Sequelize.DATE
    },
    updatedAt: {
      allowNull: false,
      type: Sequelize.DATE
    },
  }),
  down: (queryInterface, Sequelize) => queryInterface.dropTable('Document')
};
