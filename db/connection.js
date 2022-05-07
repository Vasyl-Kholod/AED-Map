const mongoose = require('mongoose');
const {
  gridFSBucketService
} = require('../shared/services/grid-fs-bucket');

function createConnection() {
  mongoose.connect(
    'mongodb://localhost:27017/defibrillatorDB',
    {
      dbName: 'defibrillatorDB',
      useUnifiedTopology: true,
      useNewUrlParser: true,
      useFindAndModify: false,
      useCreateIndex: true
    }
  );

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
