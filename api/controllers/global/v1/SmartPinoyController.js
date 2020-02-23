var TAG = '[global][v1][SmartPinoyController]';
var req = require('rekuire');
var Validation = req('Validation');
var _SmartPinoyController = req('_SmartPinoyController');

module.exports = {

  addMapping: function(req, res) {
    var ACTION = '[validate]';
    var _smartPinoyController = new _SmartPinoyController(req);
    var validation = new Validation();

    Logger.log('debug', TAG + ACTION + ' request params ', req.body);
    var params = validation.containKeys(require('rekuire')('smart_pinoy'), req.body);
    if (!params.valid) {
      return res.error(params.error);
    }
    async.auto({
      validate: _smartPinoyController.validate.bind(_smartPinoyController),
      result: ['validate',_smartPinoyController.addMapping.bind(_smartPinoyController)],
    }, function(err, result) {
      if (err) return res.error(err);

      var response = {
        status: "success",
        message: "Your number has been activated!",
        response_date: Math.floor(new Date().getTime() / 1000)
      };

      res.ok(response);
    });

  },

  getStatus: function(req, res) {
    var ACTION = '[getStatus]';
    var _smartPinoyController = new _SmartPinoyController(req);

    async.auto({
      result: _smartPinoyController.checkActivation.bind(_smartPinoyController),
    }, function(err, result) {
      if (err) return res.error(err);

      var response = {
        status: result.result? "Active" : "Inactive",
        response_date: Math.floor(new Date().getTime() / 1000)
      };

      res.ok(response);
    });
  },

  addNumber: function(req, res) {
    var ACTION = '[addNumber]';

    var mobileNumber = req.body.mobile_number;

    SmartPinoyNumber.create({msisdn: mobileNumber}, function(err, data) {
      if (err) {
        Logger.log('error', TAG + ACTION, err);
        var errObj = Errors.raise('DB_ERROR');
        errObj.error.spiel = err.invalidAttributs.msisdn[0].message;
        return res.error(errObj);
      }

      res.ok(data);
    });
  }
};