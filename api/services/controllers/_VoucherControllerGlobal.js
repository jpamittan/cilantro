var TAG = '[_VoucherControllerGlobal]';
var req = require('rekuire');
var rules = req('rules');

function _VoucherControllerGlobal(req, options) {
  if (typeof req === 'undefined') {
    throw new Error('Please pass the request to the constructor.');
  }
  this.req = req;
  this.options = options;
}


_VoucherControllerGlobal.prototype.generateCodes = function (cb, result) {
  var ACTION = '[generateCodes]';
  var codeLength = new Array(20);
  var _sym = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890';
  var generatedCode = '';
  var voucherCodes = [];
  var voucherCount = 20;

  for(var i=0; i < voucherCount; i++){
    generatedCode = '';
    for (var j = 0; j < codeLength.length; j++) {
        generatedCode +=  _sym[parseInt(Math.random() * (_sym.length))];
    }
    voucherCodes.push(generatedCode);
  }

  return cb(null, voucherCodes);
};

_VoucherControllerGlobal.prototype.saveVouchers = function (cb, result) {
  var ACTION = '[saveVouchers]';
  var voucherCodes = result.codes;
  var vouchers = [];

  for(i=0; i<voucherCodes.length; i++){
    var voucherInfo = {
      voucher_name: "1-month Subscription Voucher",
      voucher_code: voucherCodes[i]
    };

    vouchers.push(voucherInfo);
  }

  SubscriptionVouchers.create(vouchers, function(err, data){
    if (err) {
      Logger.log('error', TAG + ACTION, err);
      return cb(Errors.raise('DB_ERROR'));
    }

    return cb(null, data);
  });
};

_VoucherControllerGlobal.prototype.validate = function (cb, result) {
  var ACTION = '[validate]';

  var voucherCode = this.req.body.voucher_code;

  SubscriptionVouchers.findOne({where:{voucher_code: voucherCode, is_redeemed: 1}}, function(err, data) {
    if (err) {
      Logger.log('error', TAG + ACTION, err);
      return cb(Errors.raise('DB_ERROR'));
    }else if(data){
      return cb(Errors.raise('VOUCHER_USED'));
    }

    console.log(data);

    return cb(null, data);
  });
};

_VoucherControllerGlobal.prototype.redeemVoucher = function (cb, result) {
  var ACTION = '[redeemVoucher]';

  if(result.validate && result.validate.error){
    return cb(result.validate);
  }

  var info = {
    is_redeemed: 1,
    cilantro_id: this.req.account.cilantro_id,
    date_redeemed: new Date()
  };

  var voucherCode = this.req.body.voucher_code;


  SubscriptionVouchers.update({voucher_code: voucherCode},info).exec(function(err, data) {
    if (err) {
      Logger.log('error', TAG + ACTION, err);
      return cb(Errors.raise('DB_ERROR'));
    }

    return cb(null, data);
  });

};


module.exports = _VoucherControllerGlobal;
