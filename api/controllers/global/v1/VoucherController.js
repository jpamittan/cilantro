var TAG = '[global][v1][VoucherController]';
var req = require('rekuire');
var Validation = req('Validation');
var _VoucherControllerGlobal = req('_VoucherControllerGlobal');

module.exports = {

  redeemVoucher: function(req, res) {
    var ACTION = '[redeemVoucher]';
    var _voucherControllerGlobal = new _VoucherControllerGlobal(req);
    var validation = new Validation();

    Logger.log('debug', TAG + ACTION + ' request params ', req.body);
    var params = validation.containKeys(require('rekuire')('redeem_voucher_global'), req.body);
    if (!params.valid) {
      return res.error(params.error);
    }
    
    async.auto({
      validate: _voucherControllerGlobal.validate.bind(_voucherControllerGlobal),
      result: ['validate',_voucherControllerGlobal.redeemVoucher.bind(_voucherControllerGlobal)],
    }, function(err, result) {
      if (err) return res.error(err);

      var response = {
        status: "success",
        message: "Your have successfully redeemed your voucher!",
        response_date: Math.floor(new Date().getTime() / 1000)
      };

      res.ok(response);
    });

  },

  generateVouchers: function(req, res) {
    var ACTION = '[generateVouchers]';
    var _voucherControllerGlobal = new _VoucherControllerGlobal(req);

    async.auto({
      codes: _voucherControllerGlobal.generateCodes.bind(_voucherControllerGlobal),
      save: ['codes',_voucherControllerGlobal.saveVouchers.bind(_voucherControllerGlobal)],
    }, function(err, result) {
      if (err) return res.error(err);

      var response = {
        status: "success",
        message: "New vouchers has been created successfully!",
        response_date: Math.floor(new Date().getTime() / 1000)
      };

      res.ok(response);
    });

  }
};