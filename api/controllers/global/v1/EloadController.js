var TAG = '[global][v1][EloadController]';
var req = require('rekuire');
var Validation = req('Validation');
var constants = req('constants');
var _PaymentController = req('_PaymentController');
var _EloadController = req('_EloadController');
var _NotificationController = req('_NotificationControllerGlobal');

module.exports = {

  load: function(req, res) {
    var ACTION = '[load]';
    var _eloadController = new _EloadController(req);
    var _paymentController = new _PaymentController(req);
    var _notificationController = new _NotificationController(req, constants.notif.type.global_eload);
    var validation = new Validation();

    Logger.log('debug', TAG + ACTION + ' request params ', req.body);
    var payment_params = validation.containKeys(require('rekuire')('payment_charge'), req.body);
    if (!payment_params.valid) {
      return res.error(payment_params.error);
    }
    
    var eload_params = validation.containKeys(require('rekuire')('eload'), req.body);
    if (!eload_params.valid) {
      return res.error(eload_params.error);
    }

    async.auto({
      balance_request_id: _eloadController.generateRequestId.bind(_eloadController),
      balance: _eloadController.balance.bind(_eloadController),
      payment: ['balance',_paymentController.verifyPayment.bind(_paymentController)],
      request_id: _eloadController.generateRequestId.bind(_eloadController),
      load: ['request_id','payment',_eloadController.load.bind(_eloadController)],
      create_notification: ['load', _notificationController.createNotification.bind(_notificationController)],
    }, function(err, result) {
      if (err) return res.error(err);

      res.ok(result.load);
    });

  },

  validate: function(req, res) {
    var ACTION = '[validate]';
    var _eloadController = new _EloadController(req);
    var validation = new Validation();

    Logger.log('debug', TAG + ACTION + ' request params ', req.body);
    
    async.auto({
      result: _eloadController.validate.bind(_eloadController),
    }, function(err, result) {
      if (err) return res.error(err);

      var response = {
        status: "success",
        message: "Your form has been validated",
        response_date: Math.floor(new Date().getTime() / 1000)
      }

      res.ok(response);
    });

  },

  getProducts: function(req, res) {
    var ACTION = '[getProducts]';
    var _eloadController = new _EloadController(req);

    Logger.log('debug', TAG + ACTION + ' request params ', req.params);

    async.auto({
      request_id_sun: _eloadController.generateRequestId.bind(_eloadController),
      sun: ['request_id_sun',_eloadController.getProductsSun.bind(_eloadController)],
      request_id_smart: _eloadController.generateRequestId.bind(_eloadController),
      smart: ['request_id_smart',_eloadController.getProductsSmart.bind(_eloadController)],
      request_id_pldt: _eloadController.generateRequestId.bind(_eloadController),
      pldt: ['request_id_pldt',_eloadController.getProductsPLDT.bind(_eloadController)],
    }, function(err, result) {
      if (err) return res.error(err);

      var date = new Date();
      var merged_array = result.sun.concat(result.smart);
      if(result.pldt){
        merged_array = merged_array.concat(result.pldt);
      }
      var response = {
        products     : merged_array,
        response_date: Math.floor(new Date().getTime() / 1000)
      };

      res.ok(response);
    });

  },

  balance: function(req, res) {
    var ACTION = '[balance]';
    var _eloadController = new _EloadController(req);

    Logger.log('debug', TAG + ACTION + ' request params ', req.params);

    async.auto({
      request_id: _eloadController.generateRequestId.bind(_eloadController),
      result: ['request_id',_eloadController.balance.bind(_eloadController)],
    }, function(err, result) {
      if (err) return res.error(err);

      res.ok(result);
    });

  },

  getEloadTransactions: function(req, res) {
    var ACTION = '[getEloadTransactions]';
    var _eloadController = new _EloadController(req);

    Logger.log('debug', TAG + ACTION + ' request params ', req.params);

    async.auto({
      transactions: _eloadController.listTransactions.bind(_eloadController),
    }, function(err, result) {
      if (err) return res.error(err);
      
      result.response_date = Math.floor(new Date().getTime() / 1000);
      res.ok(result);
    });

  },

}