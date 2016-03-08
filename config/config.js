var path = require('path'),
    rootPath = path.normalize(__dirname + '/..'),
    env = process.env.NODE_ENV || 'development';

var config = {
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
