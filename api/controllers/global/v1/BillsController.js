var TAG = '[global][v1][BillsController]';
var req = require('rekuire');
var Validation = req('Validation');
var constants = req('constants');
var _BillsController = req('_BillsController');
var _PaymentController = req('_PaymentController');
var _NotificationController = req('_NotificationControllerGlobal');

module.exports = {
  getBillers: function(req, res) {
    var ACTION = '[getBillers]';
    var _billsController = new _BillsController(req);
    
    Logger.log('debug', TAG + ACTION + ' request params ', req.params);

    async.auto({
      result: _billsController.getBillers.bind(_billsController),
    }, function(err, result) {
      if (err) return res.error(err);

      res.ok(result.result);
    });

  },

  getBillerForm: function(req, res) {
    var ACTION = '[getBillerForm]';
    var _billsController = new _BillsController(req);
    
    Logger.log('debug', TAG + ACTION + ' request params ', req.params);

    async.auto({
      result: _billsController.getBillerForm.bind(_billsController),
    }, function(err, result) {
      if (err) return res.error(err);
      
      var response = result.result.result;
      response.response_date = Math.floor(new Date().getTime() / 1000);

      res.ok(response);
    });

  },

  validate: function(req, res) {
    var ACTION = '[getBillerForm]';
    var _billsController = new _BillsController(req);
    var validation = new Validation();

    Logger.log('debug', TAG + ACTION + ' request params ', req.body);
    var params = validation.containKeys(require('rekuire')('bills_payment'), req.body);
    if (!params.valid) {
      return res.error(params.error);
    }

    async.auto({
      sequence_no: _billsController.generateSequenceNo.bind(_billsController),
      soap_request: ['sequence_no',_billsController.generateSoapRequest.bind(_billsController)],
      validate: ['soap_request',_billsController.validateForm.bind(_billsController)],
    }, function(err, result) {
      if (err) return res.error(err);
      
      var response = {
        status                : "success",
        message               : "Form was successfully validated.",
        response_date         : Math.floor(new Date().getTime() / 1000)
      };

      res.ok(response);
    });

  },

  postPayment: function(req, res) {
    var ACTION = '[getBillerForm]';
    var _billsController = new _BillsController(req);
    var _paymentController = new _PaymentController(req);
    var _notificationController = new _NotificationController(req, constants.notif.type.global_bills);
    var validation = new Validation();

    Logger.log('debug', TAG + ACTION + ' request params ', req.body);
    var params = validation.containKeys(require('rekuire')('bills_payment'), req.body);
    if (!params.valid) {
      return res.error(params.error);
    }
    var paymentParams = validation.containKeys(require('rekuire')('payment_charge'), req.body);
    if (!paymentParams.valid) {
      return res.error(paymentParams.error);
    }
    
    async.auto({
      //payment: _paymentController.charge.bind(_paymentController), //For STRIPE
      payment: _paymentController.verifyPayment.bind(_paymentController),
      sequence_no: _billsController.generateSequenceNo.bind(_billsController),
      soap_request: ['sequence_no',_billsController.generateSoapRequest.bind(_billsController)],
      post: ['soap_request','payment',_billsController.postPayment.bind(_billsController)],
      create_notification: ['post', _notificationController.createNotification.bind(_notificationController)],
    }, function(err, result) {
      if (err) return res.error(err);
      
      var response = {
        status                : "success",
        message               : result.post['a:ResultMessage'],
        transaction_no        : result.post['a:TransactionNo'],
        receipt_validation_no : result.post['a:ReceiptValidationNo'],
        transaction_date      : result.post['a:TransactionDateTime'],
        response_date         : Math.floor(new Date().getTime() / 1000)
      };

      res.ok(response);
    });

  },

  getBillsTransactions: function(req, res) {
    var ACTION = '[getPaymentTransactions]';
    var _billsController = new _BillsController(req);

    Logger.log('debug', TAG + ACTION + ' request params ', req.params);

    async.auto({
      transactions: _billsController.listTransactions.bind(_billsController),
    }, function(err, result) {
      if (err) return res.error(err);
      
      result.response_date = Math.floor(new Date().getTime() / 1000);
      res.ok(result);
    });

  },

}