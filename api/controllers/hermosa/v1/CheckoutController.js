var TAG = '[hermosa][v1][CheckoutController]';
var req = require('rekuire');
var _PurchaseController = req('_PurchaseController');
var _NotificationController = req('_NotificationController');
var Validation = req('Validation');
var constants = req('constants');

module.exports = {
  
  redirect: function(req, res) {
    // TODO: Remove this controller, refactore paymaya implementation to ensure paymaya
    if (req.query.status == 'success') {
      return res.ok({success: 'Payment Successful'});
    }
    if (req.query.status == 'failure') {
      return res.error({status: 503, error: 'Payment Error'});
    }
    if (req.query.status == 'cancel') {
      return res.ok({success: 'Payment Cancel'});
    }
    
  },

  result: function(req, res) {
    var ACTION = '[result]';
    Logger.log('debug', TAG + ACTION + ' request body checkout', req.body);

    if (req.query.status == 'success' && req.body.paymentStatus == 'PAYMENT_SUCCESS') {
      var checkout_id = req.body.id;
      req.body = req.body.metadata;
      req.body.checkout_id = checkout_id;
      var _purchaseController = new _PurchaseController(req);
      var _notificationController = new _NotificationController(req, constants.notif.type.topup);

      var validation = new Validation();
      var params = validation.containKeys(require('rekuire')('topup'), req.body);
      if (!params.valid) {
        return res.error(params.error);
      }

      async.auto({
        findAccount: function(cb) {
          Account.findOne({msisdn: req.body.msisdn}, function(err, data) {
            if (err) {
              Logger.log('error', TAG, err);
              return cb(Errors.raise('DB_ERROR'));
            } else {
              if (data == undefined) return cb(Errors.raise('NOT_FOUND'));
              req.query = !req.query ? {} : req.query;
              req.query.msisdn = data.msisdn;
              req.query.object_id = data.object_id;
              req.query.account_id = data.id;
              cb();
            }
          });
        },
        confirmCheckoutId: ['findAccount' ,_purchaseController.confirmCheckoutId.bind(_purchaseController)],
        confirmPaymaya: [ 'confirmCheckoutId', _purchaseController.confirmPaymaya.bind(_purchaseController)],
        getTopupRecipient: ['confirmPaymaya' ,_purchaseController.getTopupRecipient.bind(_purchaseController)],
        topup: ['getTopupRecipient', _purchaseController.topup.bind(_purchaseController)],
        getSubscriber: ['topup', _purchaseController.getSubscriber.bind(_purchaseController)],
        createNotification: ['getSubscriber', _notificationController.createNotification.bind(_notificationController)]
      }, function(err, result) {
        if (err) return res.error(err);
        return res.ok({ success: 'Payment Successful', balance: result.getSubscriber.balance });
      });

    } else {
      res.redirect(sails.config.paymaya.callback_failure);
    }
  },
}