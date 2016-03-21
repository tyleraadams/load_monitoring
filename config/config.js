const path = require('path');
const rootPath = path.normalize(__dirname + '/..');
const env = process.env.NODE_ENV || 'development';

const config = {
  development: {
    root: rootPath,
    app: {
      name: 'load-monitoring'
    },
    port: 3000,
    db: 'mongodb://localhost/load-monitoring-development'
  },

  test: {
    root: rootPath,
    app: {
      name: 'load-monitoring'
    },
    port: 3000,
    db: 'mongodb://localhost/load-monitoring-test'
  },

  production: {
    root: rootPath,
    app: {
      name: 'load-monitoring'
    },
    port: 3000,
    db: 'mongodb://localhost/load-monitoring-production'
  }
};

module.exports = config[env];
