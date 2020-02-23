var TAG = '[admin][v1][PurchasesController]';
var req = require('rekuire');
var _PurchaseController = req('_PurchaseController');
var _AccountController = req('_AccountControllerHermosa');
var Validation = req('Validation');

module.exports = {

  topup: function(req, res) {
    var ACTION = '[topup]';
    Logger.log('debug', TAG + ACTION + ' request body ', req.body);
    var _purchase = new _PurchaseController(req);

    var validation = new Validation();
    var params = validation.containKeys(require('rekuire')('topup'), req.body);
    if (!params.valid) return res.error(params.error);

    async.auto({
      getSubscriber: _purchase.getRecipient.bind(_purchase),
      purchase: [ "getSubscriber", _purchase.matrixxTopup.bind(_purchase)],
      getBalance: [ "purchase", _purchase.getUpdatedBalance.bind(_purchase)],
      // saveTransaction: ['topup', _purchase.saveTransaction.bind(_purchase)]
    }, function(err, result) {
      if (err) return res.error(err);
      res.ok(result.getBalance);
    });
  },

  purchase: function(req, res) {
    var ACTION = '[purchase]';
    Logger.log('debug', TAG + ACTION + ' request body ', req.body);
    var _purchase = new _PurchaseController(req);

    var validation = new Validation();
    var params = validation.containKeys(require('rekuire')('purchase'), req.body);
    if (!params.valid) return res.error(params.error);

    async.auto({
      getSubscriber: _purchase.getRecipient.bind(_purchase),
      purchase: [ "getSubscriber", _purchase.matrixxPurchase.bind(_purchase)],
      getBalance: [ "purchase", _purchase.getUpdatedBalance.bind(_purchase)],
      // saveTransaction: ['purchase', _purchase.saveTransaction.bind(_purchase)]
    }, function(err, result) {
      if (err) return res.error(err);
      res.ok(result.getBalance);
    });
  },

  transfer: function(req, res) {
    var ACTION = '[transfer]';
    Logger.log('debug', TAG + ACTION + ' request body ', req.body);
    req.body.msisdn = req.body.source;
    var _purchase = new _PurchaseController(req);

    // var validation = new Validation();
    // var params = validation.containKeys(require('rekuire')('purchase'), req.body);
    // if (!params.valid) return res.error(params.error);

     // _purchase.getSubscriber.bind(_purchase, "639473371425");
     // res.ok({});

    async.auto({
      getSource: _purchase.getTransferSource.bind(_purchase),
      getTarget: _purchase.getTransferTarget.bind(_purchase),
      //getSourceWallet: [ "getTransferSource", "getTransferTarget", _purchase.getUpdatedBalance.bind(_purchase)]
    }, function(err, result) {
      if (err) return res.error(err);
      res.ok({});
    });
  },

}

