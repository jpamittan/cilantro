var TAG = '[v2][VoucherController]';
var req = require('rekuire');
var IflixVoucher = req('IflixVoucher');
var _VoucherController = req('_VoucherController');
var _NotificationController = req('_NotificationController');


module.exports = {
  
  add: function(req, res) {
    var ACTION = '[add]';
    Logger.log('debug', TAG + ACTION + ' request body ', req.body);
    var voucher = [];
    req.body.voucher_code.forEach(function(element){
      var voucher_detail = {
        user_name: req.body.user_name,
        voucher_name: req.body.voucher_name,
        voucher_code: element
      };
      voucher.push(voucher_detail);
    });
    Voucher.create(voucher, function(err, data) {
      res.ok(data);
    });
  },

  activate: function(req, res) {
    var ACTION = '[activate]';
    var _voucherController = new _VoucherController(req);
    async.auto({
      activate: _voucherController.odysseyActivate.bind(_voucherController),
    }, function(err, result) {
      if (err) return res.error(err);
      res.ok(result);
    });
  },

  get: function(req, res) {
    var ACTION = '[get]';
    Logger.log('debug', TAG + ACTION + ' request query', req.query);
    Voucher.find({account_id: req.params.id}, function(err, data) {
      if (err) {
        Logger.log('error', TAG + ACTION, err);
        return cb(Errors.raise('DB_ERROR'));
      }
      if (data == '') {
        res.error(Errors.raise('NOT_FOUND'));
      } else {
        data.forEach(function(voucher){
          delete voucher.voucher_code;
          delete voucher.updated_at;
        })
        res.ok(data);
      }
    });
  },

  resend: function(req, res) {
    var ACTION = '[resend]';
    var _notificationController = new _NotificationController(_this.req, element);
    Logger.log('debug', TAG + ACTION + ' request query', req.query);
    Voucher.find({id: req.params.id}, function(err, data) {
      if (err) {
        Logger.log('error', TAG + ACTION, err);
        return cb(Errors.raise('DB_ERROR'));
      }
      res.ok(data);
    });
  },

  purchase: function(account_id, type, callback) {
    var ACTION = '[purchase]';
    var _voucherController = new _VoucherController(req);
    async.auto({
      purchase: _voucherController.purchase.bind(_voucherController),
    }, function(err, result) {
      if (err) return res.error(err);
      res.ok(result);
    });
  },

  purchase: function(req, res) {
    var ACTION = '[purchase]';
    var _notificationController = new _NotificationController({params: {id: account_id}}, constants.notif.type.iflix);
    Logger.log('debug', TAG + ACTION + ' request body ', req.body);
    IflixVoucher.purchase(req.body.account_id, 'big_bytes', function(err, data) {
      res.ok(data);
    });
  },

  list: function(req, res) {
    var ACTION = '[list]';
    var _voucherController = new _VoucherController(req);
    Logger.log('debug', TAG + ACTION + ' request query', req.query);
    async.auto({
      voucherUnclaimed: _voucherController.voucherUnclaimed.bind(_voucherController),
      voucherClaimed: ['voucherUnclaimed', _voucherController.voucherClaimed.bind(_voucherController)],
    }, function(err, result) {
      if (err) return res.error(err);
      var unclaimed = _.countBy(result.voucherUnclaimed, 'voucher_name');
      var claimed = _.countBy(result.voucherClaimed, 'voucher_name');
      var obj = {
        claimed_vouchers: claimed,
        unclaimed_vouchers: unclaimed
      }
      obj = JSON.parse(JSON.stringify(obj));
      res.ok(obj);
    });
  },

};