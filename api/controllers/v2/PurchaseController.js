var TAG = '[v2][PurchasesController]';
var req = require('rekuire');
var _PurchaseController = req('_PurchaseControllerV2');
var _NotificationController = req('_NotificationController');
var Validation = req('Validation');
var constants = req('constants');

module.exports = {
  topup: function(req, res) {
    var ACTION = '[topup]';
    var _purchaseController = new _PurchaseController(req);
    var _notificationController = new _NotificationController(req, constants.notif.type.topup);
    Logger.log('debug', TAG + ACTION + ' request body ', req.body);

    var validation = new Validation();
    var params = validation.containKeys(require('rekuire')('topupV2'), req.body);
    if (!params.valid) {
      return res.error(params.error);
    }

    async.auto({
      getTopupRecipient: _purchaseController.getTopupRecipient.bind(_purchaseController),
      topup: ['getTopupRecipient', _purchaseController.topup.bind(_purchaseController)],
      getSubscriber: ['topup', _purchaseController.getSubscriber.bind(_purchaseController)],
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
    Logger.log('debug', TAG + ACTION + ' request body ', req.body);
    
    var validation = new Validation();
    var params = validation.containKeys(require('rekuire')('purchaseV2'), req.body);
    if (!params.valid) {
      return res.error(params.error);
    }

    async.auto({
      getPurchaseSender: _purchaseController.getPurchaseSender.bind(_purchaseController),
      getPurchaseRecipient: ['getPurchaseSender', _purchaseController.getPurchaseRecipient.bind(_purchaseController)],
      chargeSender: ['getPurchaseRecipient', _purchaseController.chargeSender.bind(_purchaseController)],
      puchaseOffer: ['chargeSender', _purchaseController.purchaseOffer.bind(_purchaseController)],
      getSubscriber: ['puchaseOffer', _purchaseController.getSubscriber.bind(_purchaseController)],
      createNotification: ['getSubscriber', _notificationController.createNotification.bind(_notificationController)]
    }, function(err, result) {
        if (err) return res.error(err);
        res.ok({ success: 'Purchase', balance: result.getSubscriber.balance});
    });
  },

}

