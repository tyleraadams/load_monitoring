var assert = require('assert');

var alertManager = require('../app/managers/alerts');
var Uptime = require('../app/models/uptime');

describe('alertManager', function() {
  describe('#init()', function () {
    it('should create an alert if the average load for the last two minutes exceeds one', function () {

      var stub = [{value: 1.1}, {value: 1.6}, {value: 1.5}, {value: 1.6}, {value: 1.5},{value: 2}];
      assert.equal(alertManager(stub).init(),true);
      stub = [{value: 0.8}, {value: 0.1}, {value: 0.2}, {value: 0.4}, {value: 0.5}];
      // assert.equal(alertManager(stub).init(),false);
    });
  });
});
