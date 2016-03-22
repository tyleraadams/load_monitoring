'use strict';
const assert = require('assert');
const AlertManager = require('../app/managers/alerts');
const calculateAverage = require('../app/helpers/calculateAverage');
const alertManager = new AlertManager();

describe('alertManager', function() {
  describe('#determineAlertState()', function () {
    it('should not create an alert if the average load for the last two minutes is less than one and there is no previous alert state in play', function () {

      const stub = [{ value: 1.0 }, { value: 0.7 }, { value: 0.5 }, { value: 0.9 }, { value: 0.5 },{ value: 0.99 }];
      const avg = calculateAverage(stub.map(function (item) { return item.value; }));
      alertManager.determineAlertState(avg);
      assert.equal(alertManager.isInAlertState,false);

      // assert.equal(alertManager(stub).init(),false);
    });

    it('should create an alert if the average load for the last two minutes exceeds one', function () {
      const stub = [{ value: 1.1 }, { value: 1.6 }, { value: 1.5 }, { value: 1.6 }, { value: 1.5 },{ value: 2 }];
      const avg = calculateAverage(stub.map(function (item) { return item.value; }));
      alertManager.determineAlertState(avg);
      assert.equal(alertManager.isInAlertState,true);

    });

     it('should resolve a previously created alert if the average load for the last two minutes drops below one and the current alert state is true', function () {
      let stub = [{ value: 1.1 }, { value: 1.6 }, { value: 1.5 }, { value: 1.6 }, { value: 1.5 },{ value: 2 }];
      let avg = calculateAverage(stub.map(function (item) { return item.value; }));
      alertManager.determineAlertState(avg);
      assert.equal(alertManager.isInAlertState,true);

      stub = [{ value: 0.8 }, { value: 0.1 }, { value: 0.2 }, { value: 0.4 }, { value: 0.5 }];
      avg = calculateAverage(stub.map(function (item) { return item.value; }));
      alertManager.determineAlertState(avg);
      assert.equal(alertManager.isInAlertState, false);
    });
  });
});
