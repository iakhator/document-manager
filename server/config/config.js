require('dotenv').config();

module.exports = {
  development: {
    username: 'andeladeveloper',
    password: null,
    database: 'docmanager-dev',
    host: '127.0.0.1',
    port: 5432,
    dialect: 'postgres'
  },
  test: {
    use_env_variable: 'TEST_DB'
  },
  production: {
    use_env_variable: 'PRODUCTION_DB',
    dialect: 'postgres'
  }
};
