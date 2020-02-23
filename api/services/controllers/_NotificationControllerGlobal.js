var TAG = '[_NotificationController]';
var req = require('rekuire');
var rules = req('rules');
var constants = req('constants');
var spiels = req('spiels');
var uuid = require('node-uuid');


function _NotificationControllerGlobal(req, notification_type) {
  this.req = req;
  this.notification_type = notification_type;
};


_NotificationControllerGlobal.prototype.createNotification = function (cb, result) {
  var ACTION = '[createNotification]';
  if (result.findAccount) return cb(null, false);

  var _this = this;
  var notification = result ? result : {title: 'No title', msg: 'No message'};
  var details = {};
  var txn_type = 0;
  var transaction;
  var message = '';
  switch (this.notification_type) {
  
    case (constants.notif.type.global_activate):
      this.req.params.id = this.req.params.id ? this.req.params.id : this.req.body.id;
      notification = spiels.activate_global_notification;
      message = notification.msg;
      break;

    case (constants.notif.type.global_bills):
      if (result.post && result.post.error) {
        return cb(null,null);
      }

      this.req.params.id = this.req.params.id ? this.req.params.id : this.req.body.id;
      notification = spiels.bills_payment_notification;
      message = this.req.body.description;

      var billDetails = JSON.parse(this.req.body.details);

      details = {
        transaction_no        : result.post['a:TransactionNo'],
        receipt_validation_no : result.post['a:ReceiptValidationNo'],
        account_no            : billDetails.AccountNo,
        amount_paid           : billDetails.AmountPaid,
        service_code          : this.req.body.service_code,
        transaction_date      : new Date()//result.post['a:TransactionDateTime']
      };

      break;
    case (constants.notif.type.global_eload):
      if (result.load && result.load.error) {
        return cb(null,null);
      }

      this.req.params.id = this.req.params.id ? this.req.params.id : this.req.body.id;
      notification = spiels.eload_notification;
      message = this.req.body.description;

      details = {
        transaction_code            : result.load.transactionCode,
        price                       : result.load.price,
        product_code                : this.req.body.product_code,
        mobile_number               : '0'+this.req.body.msisdn,
        fulfillment_reference_code  : result.load.fulfillmentReferenceCode,
        transaction_date            : new Date()
      };

      break;
    case (constants.notif.type.global_music_subs):
      if (result.payment && result.payment.error) {
        return cb(null,null);
      }

      this.req.params.id = this.req.params.id ? this.req.params.id : this.req.body.id;
      notification = spiels.music_subscription_notification;
      if (!this.req.body.subscription_id) {
        message = result.payment? notification.msg:notification.msg_free;

        if (result.payment) {
          details = {
            transaction_id        : result.payment.id,
            amount                : (result.payment.plan.amount/100),
            description           : result.payment.plan.name,
            currency              : result.payment.plan.currency.toUpperCase(),
            transaction_date      : new Date()
          };
        }
      } else {
        message = notification.msg;
        details = {
            transaction_id        : this.req.body.transaction_id,
            amount                : this.req.body.amount,
            description           : this.req.body.description,
            currency              : this.req.body.currency.toUpperCase(),
            transaction_date      : new Date()
          };
      }

      break;

    case (constants.notif.type.global_movie_subs):
      if (result.payment && result.payment.error) {
        return cb(null,null);
      }

      this.req.params.id = this.req.params.id ? this.req.params.id : this.req.body.id;
      notification = spiels.movie_subscription_notification;
      if (!this.req.body.subscription_id) {
        message = result.payment? notification.msg:notification.msg_free;

        if (result.payment) {
          details = {
            transaction_id        : result.payment.id,
            amount                : (result.payment.plan.amount/100),
            description           : result.payment.plan.name,
            currency              : result.payment.plan.currency.toUpperCase(),
            transaction_date      : new Date()
          };
        }
      } else {
        message = notification.msg;
        details = {
            transaction_id        : this.req.body.transaction_id,
            amount                : this.req.body.amount,
            description           : this.req.body.description,
            currency              : this.req.body.currency.toUpperCase(),
            transaction_date      : new Date()
          };
      }

      break;
    case (constants.notif.type.global_emags_subs):
      if (!result.payment || (result.payment && result.payment.err)) {
        return cb(null,null);
      }

      this.req.params.id = this.req.params.id ? this.req.params.id : this.req.body.id;
      notification = spiels.emags_subscription_notification;
      if (!this.req.body.subscription_id) {
        message = result.payment? notification.msg:notification.msg_free;

        if (result.payment) {
          details = {
            transaction_id        : result.payment.id,
            amount                : (result.payment.plan.amount/100),
            description           : result.payment.plan.name,
            currency              : result.payment.plan.currency.toUpperCase(),
            transaction_date      : new Date()
          };
        }
      } else {
        message = notification.msg;
        details = {
            transaction_id        : this.req.body.transaction_id,
            amount                : this.req.body.amount,
            description           : this.req.body.description,
            currency              : this.req.body.currency.toUpperCase(),
            transaction_date      : new Date()
          };
      }

      break;
  }

  // This removes unnecessary balance keys
  if (result.getSubscriber && result.getSubscriber.balance) {
    details = JSON.parse(JSON.stringify(result.getSubscriber.balance));
    for (key in details) {
      delete details[key].unit;
      delete details[key].value;
      delete details[key].date;
    }
  }

  var temp = {
    id: uuid.v4(),
    cilantro_id: _this.req.account ? _this.req.account.cilantro_id : result.create.cilantro_id,
    type: _this.notification_type,
    name: notification.title,
    message: message,
    app_name: _this.req.account ? _this.req.account.app_name : this.req.options.app_name,
    details: JSON.stringify(details),
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

module.exports = _NotificationControllerGlobal;
