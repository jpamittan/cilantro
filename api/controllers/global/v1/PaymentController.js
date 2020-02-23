var TAG = '[global][v1][PaymentController]';
var req = require('rekuire');
var Validation = req('Validation');
var constants = req('constants');
var _PaymentController = req('_PaymentController');

module.exports = {

  getServiceCharge : function(req, res) {
    var ACTION = '[getCreditCardToken]';
    var service_charge = JSON.parse(JSON.stringify(constants.service_charge));
  
    var response = {
      service_charge: service_charge.amount,
      currency: service_charge.currency,
      response_date: Math.floor(new Date().getTime() / 1000)
    };

    res.ok(response);
    
  },

  getPaymentTransactions: function(req, res) {
    var ACTION = '[getPaymentTransactions]';
    var _paymentController = new _PaymentController(req);

    Logger.log('debug', TAG + ACTION + ' request params ', req.params);

    async.auto({
      transactions: _paymentController.listTransactions.bind(_paymentController),
    }, function(err, result) {
      if (err) return res.error(err);

      result.response_date = Math.floor(new Date().getTime() / 1000);
      res.ok(result);
    });

  },

  convertCurrency: function(req,res) {
    var ACTION = '[convertCurrency]';
    var _paymentController = new _PaymentController(req);
    var validation = new Validation();

    Logger.log('debug', TAG + ACTION + ' request params ', req.params);
    var params = validation.containKeys(require('rekuire')('currency_converter'), req.params);
    if (!params.valid) {
      return res.error(params.error);
    }

    async.auto({
      result: _paymentController.convertCurrency.bind(_paymentController),
    }, function(err, result) {
      if (err) return res.error(err);

      result.response_date = Math.floor(new Date().getTime() / 1000);
      res.ok(result);
    });
  }

};