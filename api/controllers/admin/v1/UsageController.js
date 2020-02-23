var TAG = '[admin][v1][UsageController]';
var req = require('rekuire');
var matrixx = req('Matrixx');
var _UsageController = req('_UsageController');
var _AccountController = req('_AccountController');

module.exports = {

  usageSummary: function(req, res) {
    var ACTION = '[usageSummary]';
    var _usageController = new _UsageController(req);
    var _accountController = new _AccountController(req);
    Logger.log('debug', TAG + ACTION + ' request body ', req.body);
    async.auto({
      getUsage: _usageController.getUsage.bind(_usageController),
      getActiveAccounts: ['getUsage', _accountController.getActiveAccounts.bind(_usageController)],
      getSummary: ['getActiveAccounts', _usageController.getSummary.bind(_usageController)],
    }, function(err, results) {
      if (err) return res.error(err);
      res.ok(results.getSummary != '' ? results.getSummary : 'NO ACTIVE ACCOUNTS ON THESE DATES');
    });
  },

} 