const path = require('path');

const config = {
  mongodb: {
    databaseName: 'defibrillatorDB',
    url: 'mongodb://localhost:27017/',
    options: {
      useNewUrlParser: true,
      useUnifiedTopology: true
    }
  },
  migrationFileExtension: '.js',
  changelogCollectionName: 'changelog',
  migrationsDir: path.resolve(__dirname, 'db', 'migrations')
};

module.exports = config;
