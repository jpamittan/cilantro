var TAG = '[hermosa][v1][PurchasesController]';
var req = require('rekuire');
var _PurchaseController = req('_PurchaseController');
var _NotificationController = req('_NotificationController');
var _AccountController = req('_AccountControllerHermosa');
var Validation = req('Validation');
var constants = req('constants');

module.exports = {
  topup: function(req, res) {
    var ACTION = '[topup]';
    var _purchaseController = new _PurchaseController(req);
    var _notificationController = new _NotificationController(req, constants.notif.type.topup);
    var _accountController = new _AccountController(req);
    Logger.log('debug', TAG + ACTION + ' request body ', req.body);

    var validation = new Validation();
    var params = validation.containKeys(require('rekuire')('topup'), req.body);
    if (!params.valid) {
      return res.error(params.error);
    }

    async.auto({
      confirmCheckoutId: _purchaseController.confirmCheckoutId.bind(_purchaseController),
      confirmPaymaya: [ 'confirmCheckoutId', _purchaseController.confirmPaymaya.bind(_purchaseController)],
      getRecipient: [ 'confirmPaymaya', _purchaseController.getTopupRecipient.bind(_purchaseController)],
      topup: ['getTopupRecipient', _purchaseController.topup.bind(_purchaseController)],
      getSubscriber: ['topup', _accountController.getSubscriber.bind(_accountController)],
      createNotification: ['getSubscriber', _notificationController.createNotification.bind(_notificationController)]
    }, function(err, result) {
      if (err) return res.error(err);
      res.ok({ success: 'Topup', balance: result.getSubscriber.balance });
    });
  },

  purchase: function(req, res) {
    var ACTION = '[purchase]';
    var _purchaseController = new _PurchaseController(req);
    var _notificationController = new _NotificationController(req, constants.notif.type.purchase);
    var _accountController = new _AccountController(req);
    Logger.log('debug', TAG + ACTION + ' request body ', req.body);
    
    var validation = new Validation();
    var params = validation.containKeys(require('rekuire')('purchase'), req.body);
    if (!params.valid) {
      return res.error(params.error);
    }
    async.auto({
      checkIfPackageExists: _purchaseController.checkIfPackageExists.bind(_purchaseController),
      getRecipient: ['checkIfPackageExists', _purchaseController.getRecipient.bind(_purchaseController)],
      // getPurchaseRecipient: ['getPurchaseSender', _purchaseController.getPurchaseRecipient.bind(_purchaseController)],
      // chargeSender: ['getPurchaseRecipient', _purchaseController.chargeSender.bind(_purchaseController)],
      matrixxPurchase: ['getRecipient', _purchaseController.matrixxPurchase.bind(_purchaseController)],
      // getIflixVoucher: ['purchaseOffer', _purchaseController.getIflixVoucher.bind(_purchaseController)],
      getSubscriber: ['matrixxPurchase', _accountController.getSubscriber.bind(_purchaseController)],
      createNotification: ['matrixxPurchase', _notificationController.createNotification.bind(_notificationController)]
    }, function(err, result) {
        if (err) return res.error(err);
        res.ok({ success: 'Purchase', balance: result.getSubscriber.balance});
    });
  },

}

