require('./connection');
const { up, database } = require('migrate-mongo');

const emptyFn = () => null;

const DEV_ENV = 'development';

async function bootstrap(callback = emptyFn) {
  const env = process.env.NODE_ENV || DEV_ENV;

  if (env === DEV_ENV) {
    const { db, client } = await database.connect();

    await up(db, client);
  }

  callback();
}

module.exports = bootstrap;
