var TAG = '[hermosa][v1][BalanceController]';
var req = require('rekuire');
var matrixx = req('Matrixx');
var _AccountController = req('_AccountControllerHermosa');

module.exports = {

  get: function(req, res) {
    var ACTION = '[get]';
    var _accountController = new _AccountController(req);
    
    Logger.log('debug', TAG + ACTION + ' request params ', req.params);
    async.auto({
      getSubscriber: _accountController.getSubscriber.bind(_accountController)
    }, function(err, result) {
        if (err) return res.error(err);
        //var obj = {balance: result.getSubscriber ? result.getSubscriber.total_balance : {}};
        var obj = {
          preload_balance: result.getSubscriber ? result.getSubscriber.preload_balance : {},
          balance: result.getSubscriber ? result.getSubscriber.balance : {}
        };
        res.ok(obj);
    });
  },
} 