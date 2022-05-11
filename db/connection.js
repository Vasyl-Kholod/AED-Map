const mongoose = require('mongoose');
const {
  gridFSBucketService
} = require('../shared/services/grid-fs-bucket');

const MONGO_URL =
  process.env.MONGO_URL || 'mongodb://localhost:27017/';
const MONGO_DB = process.env.MONGO_DB || 'defibrillatorDB';

function createConnection() {
  mongoose.connect(`${MONGO_URL}${MONGO_DB}`, {
    dbName: MONGO_DB,
    useUnifiedTopology: true,
    useNewUrlParser: true,
    useFindAndModify: false,
    useCreateIndex: true
  });

  const connection = mongoose.connection;

  connection.on(
    'error',
    console.error.bind(console, 'connection error:')
  );
  connection.once('open', () => {
    gridFSBucketService.init(connection.db);

    console.log('connection to database established');
  });

  return connection;
}

module.exports = createConnection();
