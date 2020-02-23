var TAG = '[_NotificationController]';
var req = require('rekuire');
var rules = req('rules');
var constants = req('constants');
var spiels = req('spiels');
var uuid = require('node-uuid');


function _NotificationControllerOdyssey(req, notification_type) {
  this.req = req;
  this.notification_type = notification_type;
};


_NotificationControllerOdyssey.prototype.createNotification = function (cb, result) {
  var ACTION = '[createNotification]';
  if (result.findAccount) return cb(null, false);

  var _this = this;
  var notification = result ? result : {title: 'No title', msg: 'No message'};
  var balance = {};
  var txn_type = 0;
  var transaction;
  switch (this.notification_type) {
    case (constants.notif.type.iflix):
      this.req.params.id = this.req.params.id ? this.req.params.id : this.req.body.id;
      notification = result.notification;
      message = notification.msg;
      break;
    case (constants.notif.type.nba):
      this.req.params.id = this.req.params.id ? this.req.params.id : this.req.body.id;
      notification = result.notification;
      message = notification.msg;
      break;
    case (constants.notif.type.odyssey_activate):
      this.req.params.id = this.req.params.id ? this.req.params.id : this.req.body.id;
      notification = spiels.activate_odyssey_notification;
      message = notification.msg;
      break;
    case (constants.notif.type.perks):
      notification = notification.notification;
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
  var temp = {
    id: uuid.v4(),
    cilantro_id: _this.req.account ? _this.req.account.cilantro_id : result.create.cilantro_id,
    type: _this.notification_type,
    name: notification.title,
    message: message,
    app_name: _this.req.account ? _this.req.account.app_name : this.req.options.app_name,
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

module.exports = _NotificationControllerOdyssey;
