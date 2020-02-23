var TAG = '[_NotificationController]';
var req = require('rekuire');
var rules = req('rules');
var constants = req('constants');
var spiels = req('spiels');
var uuid = require('node-uuid');


function _NotificationController(req, notification_type) {
  this.req = req;
  this.notification_type = notification_type;
};

function createTransaction(body, notif_type) {
  var ACTION = '[createTransaction]';
  var _this = this;
  var obj = {
    id: body.transaction_id,
    cilantro_id: body.cilantro_id,
    app_name: body.app_name,
    type: notif_type,
    item: body.item,
    description: body.description ? body.description : '',
    amount: body.charge_amount ? body.charge_amount : body.amount.value,
    currency: body.charge_unit ? body.charge_unit : body.amount.unit,
    checkout_id : body.checkout_id,
  };
  Transaction.create(obj, function(err, data) {
    if (err) {
      Logger.log('error', TAG + ACTION + ' Transaction.create id:' + transaction_id, err);
      Logger.log('error', TAG + ACTION + ' Transaction.create id:' + transaction_id, obj);
    }
  });
}

_NotificationController.prototype.createNotification = function (cb, result) {
  var ACTION = '[createNotification]';
  if (result.findAccount) return cb(null, false);

  var _this = this;
  var notification = {title: 'No title', msg: 'No message'};
  var balance = {};
  var txn_type = 0;
  var transaction;
  switch (this.notification_type) {
    case (constants.notif.type.purchase):
      if (_this.req.body.purchase_name != undefined) {
        var purchase_type = _this.req.body.purchase_name;
        notification = spiels.purchase_notification[purchase_type];
        if (rules.booster_name.indexOf(_this.req.body.purchase_name) >= 0){
          booster_index = rules.booster_name.indexOf(_this.req.body.purchase_name);
          booster = _.where(result.getSubscriber.all_balance, { Name: rules.booster_type[booster_index] });
          end_date = booster[0].EndTime;
        } else if (rules.shared_name.indexOf(_this.req.body.purchase_name) >= 0){
          end_date = result.getSubscriber.group_balance.open_data.date;
        } else {
          end_date = result.getSubscriber.balance.open_data.date;
        }
        date = Utility.formatDate(end_date);
        message = notification.msg.replace(/%date%/g, date);
        message = message + notification.msg2;
        notification.title = spiels.purchase_notification.title;
      } else {
        notification = spiels.purchase_notification;
        var date = Utility.formatDate(result.getSubscriber.balance.open_data.date);
        var open_data = _this.req.body.open_data;
        var smart_data = _this.req.body.smart_data;
        open_data = open_data ? open_data.grant_value + open_data.grant_unit : 0;
        smart_data = smart_data ? smart_data.grant_value + smart_data.grant_unit : 0;
        message = notification.msg.replace(/%open_data%/g, open_data);
        message = message.replace(/%smart_data%/g, smart_data);
        message = message.replace(/%date%/g, date);
      };
      txn_type = 1;
      break;
    case (constants.notif.type.topup):
      notification = spiels.topup_notification;
      date = Utility.formatDate(result.getSubscriber.balance.peso.date);
      message = notification.msg.replace(/%amount%/g, _this.req.body.amount.value);
      message = message.replace(/%date%/g, date);
      txn_type = 1;
      break;
    case (constants.notif.type.iflix):
      this.req.params.id = this.req.params.id ? this.req.params.id : this.req.body.id;
      notification = result.notification;
      message = notification.msg;
      break;
    case (constants.notif.type.activate_account):
      var role = constants.account.type.primary.toLowerCase();
      if (result.getSubscriber.role) {
        role = result.getSubscriber.role.toLowerCase();
      }
      notification = spiels.activate_notification[role];
      message = notification.msg;
      break;
    case (constants.notif.type.odyssey_activate):
      this.req.params.id = this.req.params.id ? this.req.params.id : this.req.body.id;
      notification = spiels.activate_odyssey_notification;
      message = notification.msg;
      break;  
    }

  // This removes unnecessary balance keys
  if (result.getSubscriber && result.getSubscriber.balance) {
    balance = JSON.parse(JSON.stringify(result.getSubscriber.balance));
    for (key in balance) {
      delete balance[key].unit;
      delete balance[key].value;
      delete balance[key].date;
    }
  }

  if (txn_type == 1) {
    body = _this.req.body.amount ? _this.req.body : result.checkIfPackageExists;
    body.transaction_id = uuid.v4();
    body.cilantro_id = _this.req.account.cilantro_id;
    body.app_name = _this.req.account.app_name;
    body.item = result.checkIfPackageExists ? result.checkIfPackageExists.purchase_name : _this.notification_type + '_' + body.amount.value,
    message = message + ' Your reference number is ' + body.transaction_id.slice(-12) + '.';
    createTransaction(body, _this.notification_type);
  }

  var temp = {
    id: uuid.v4(),
    cilantro_id: _this.req.account ? _this.req.account.cilantro_id : this.req.params.id,
    type: _this.notification_type,
    name: notification.title,
    message: message,
    app_name: 'hermosa',
    details: JSON.stringify(balance),
    reference_number: transaction ? transaction.id : null
  };

  Notification.create(temp, function(err, data){
    if (err) {
      Logger.log('error', TAG + ACTION, err);
      return cb(Errors.raise('DB_ERROR'));
    }
    cb(null, data);
  });
};

module.exports = _NotificationController;
