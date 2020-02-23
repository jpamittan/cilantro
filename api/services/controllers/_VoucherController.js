var TAG = '[_VoucherController]';
var req = require('rekuire');
var matrixx = req('Matrixx');
var voucher_rules = req('voucher_rules');
var constants = req('constants');
var uuid = require('node-uuid');
var xmlParser = require('xml2json');
var spiels = req('spiels');
var _NotificationController = req('_NotificationController');


function _VoucherController(req, query_str) {
  this.req = req;
  this.query_str = query_str;
};

_VoucherController.prototype.odysseyActivate = function (cb, result) {
  var ACTION = '[odysseyActivate]';
  if (result.findAccount) return cb(null, false);
  
  var vouchers = voucher_rules.odyssey_activation;
  var voucher_list = [];
  var _this = this;
  var device = {
    device_os: _this.req.account.profile.device_os,
    device_arn: _this.req.account.profile.device_arn,
  };
  async.eachSeries(vouchers, function iterator(element, async_cb){
    var _notificationController = new _NotificationController(_this.req, element);
    Voucher.findOne({voucher_name: element, status: 'unclaimed'}, function(err, activation_voucher) {
      var type = 'odyssey_activation';
      var obj = {
        cilantro_id: _this.req.account ? _this.req.account.cilantro_id : 'test101',
        msisdn: _this.req.account ? _this.req.account.profile.msisdn : 'msisdn',
        event: type,
        status: 'claimed',
        purchased_at: new Date()
      };
      if (activation_voucher == undefined) { // No more iflix vouchers
        return cb();
      }
      Voucher.update({id: activation_voucher.id}, obj, function(err, voucher){
        if (err) {
          Logger.log('error', TAG + ACTION, err);
          return callback(Errors.raise('DB_ERROR'));
        }
        var notification = JSON.parse(JSON.stringify(spiels[element][type]));
        notification.msg = notification.msg.replace(/%voucher_code%/g, voucher[0].voucher_code);
        notification.cilantro_id = voucher[0].cilantro_id;
        notification[element] = element;
        _notificationController.createNotification(function(){}, {notification: notification});
        Notifier.notify(device, notification.msg);
        voucher_list.push(voucher[0]);
      });  
    })
    async_cb()
  });
  cb(null, voucher_list);
};

_VoucherController.prototype.purchase = function (cb, result) {
  var ACTION = '[purchase]';
  var voucher_list = [];
  var _this = this;
  var device = {
    device_os: _this.req.account.profile.device_os,
    device_arn: _this.req.account.profile.device_arn,
  };
  vouchers.forEach(function(element){
    var _notificationController = new _NotificationController(_this.req, element);
    Voucher.findOne({voucher_name: element, status: 'unclaimed'}, function(err, activation_voucher) {
      var type = 'activation';
      var obj = {
        cilantro_id: _this.req.account ? _this.req.account.cilantro_id : 'test101',
        msisdn: _this.req.account ? _this.req.account.profile.msisdn : 'msisdn',
        status: 'claimed',
        purchased_at: new Date()
      };
      if (activation_voucher == undefined) { // No more iflix vouchers
        return cb();
      }
      Voucher.update({id: activation_voucher.id}, obj, function(err, voucher){
        if (err) {
          Logger.log('error', TAG + ACTION, err);
          return callback(Errors.raise('DB_ERROR'));
        }
        var notification = JSON.parse(JSON.stringify(spiels.iflix_notification[type]));
        notification.msg = notification.msg.replace(/%voucher_code%/g, voucher[0].voucher_code);
        notification.cilantro_id = voucher[0].cilantro_id;
        _notificationController.createNotification(function(){}, {notification: notification});
        Notifier.notify(device, notification.msg);
        voucher_list.push(voucher[0]);
      });  
    })
  })
  cb(null, voucher_list);
};

_VoucherController.prototype.voucherUnclaimed = function (cb, result) {
  var ACTION = '[voucherUnclaimed]';
  Voucher.find({status: 'unclaimed'}, function(err, data) {
    if (err) {
      return cb(null, false);
    } else {
      if (data == undefined) return cb(null, false);
      return cb(null, data);
    }
  });
};

_VoucherController.prototype.voucherClaimed = function (cb, result) {
  var ACTION = '[voucherClaimed]';
  Voucher.find({status: 'claimed'}, function(err, data) {
    if (err) {
      return cb(null, false);
    } else {
      if (data == undefined) return cb(null, false);
      return cb(null, data);
    }
  });
};
module.exports = _VoucherController;
