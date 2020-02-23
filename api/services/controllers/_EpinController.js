var TAG = '[_EpinController]';
var req = require('rekuire');
var uuid = require('node-uuid');
var spiels = req('spiels');
var constants = req('constants');

function _EpinController(req, query_str) {
  this.req = req;
  this.query_str = query_str;
};

_EpinController.prototype.check = function (cb, result) {
  var ACTION = '[check]';
  _this = this.req;
  var msisdn = this.req.body.msisdn;
  msisdn = msisdn.substring(0, 3);
  var result = false;
  
  Prefix.findOne({prefix: msisdn}, function(err, data) {
    if (err) {
      return cb(null, false);
    } else {
      if (data != undefined) {
        result = true;
      } else {
        PerksNos.create(_this.body, function(err, data) {});
      }
      return cb(null, result);
    }
  });
};

_EpinController.prototype.queryTotal = function (cb, result) {
  var ACTION = '[queryTotal]';
  Epin.count(this.query_str, function(err, count) {
    if (err) {
      Logger.log('error', TAG + ACTION, err);
      return cb(Errors.raise('DB_ERROR'));
    } 
    cb(err, count);
  });
};

_EpinController.prototype.queryList = function (cb, result) {
  var ACTION = '[queryList]';
  var paginate = {page: this.req.query.page, limit: this.req.query.limit};
  Epin.find(this.query_str).paginate(paginate).exec(function(err, data) {
    if (err) {
      Logger.log('error', TAG + ACTION, err);
      return cb(Errors.raise("DB_ERROR"));
    }
    cb(null, data);
  });
};

_EpinController.prototype.parseResult = function (cb, result) {
  var ACTION = '[parseResult]';
  var param = this.req.query;
  var max_page = Math.ceil(result.queryTotal / param.limit);
  if (param.page > max_page && param.page != 1) {
    var err_obj = Errors.raise('MISSING_INVALID_PARAMS');
    err_obj.error.params.push(Errors.getParam('page'));
    return cb(err_obj);
  } else {
    var obj = {
      total: result.queryTotal,
      page: param.page,
      limit: param.limit,
      records: result.queryList
    };
    cb(null, obj);
  }
};

_EpinController.prototype.checkMSISDN = function (cb, result) {
  var ACTION = '[checkMSISDN]';
  Utility.checkCarrier(this.req.body.msisdn, "SUN", function(err, data) {
    if (data) return cb(Errors.raise("MSISDN_NOT_ALLOWED"));
    cb();
  });
};


_EpinController.prototype.getEpin = function (cb, result) {
  var ACTION = '[getEpin]';
  // TODO: Add game_id query param
  Epin.findOne(
    {pin_denom_id: this.req.body.denom_id}
    ).exec(function(err, data) {
    if (err) {
      Logger.log('error', TAG + ACTION, err);
      return cb(Errors.raise("DB_ERROR"));
    }
    if (!data) return cb(Errors.raise("INVALID_DENOM_ID"));
    cb(null, data);
  });
};

_EpinController.prototype.chargeMSISDN = function (cb, result) {
  var ACTION = '[chargeMSISDN]';
  var obj = {
    token: this.req.headers.authorization,
    body: {
      msisdn: this.req.body.msisdn,
      amount: {
        value: result.getEpin.game_denomination,
        unit: "PHP"
      },
      item: {
        description: "Buy " + result.getEpin.game_name + " from " + result.getEpin.publisher_name,
        name: result.getEpin.game_name,
        type: result.getEpin.publisher_name
      }
    }
  }
  SmartPay.chargeMSISDN(obj, function(err, data) {
    return cb(err, data);
  });
};

_EpinController.prototype.saveTransaction = function (cb, result) {
  var ACTION = '[saveTransaction]';
  var item = {
    msisdn: this.req.body.msisdn,
    epin_details: {
      id: result.getEpin.id,
      pin_denom_id: result.getEpin.pin_denom_id,
      publisher_name: result.getEpin.publisher_name,
      game_id: this.req.body.game_id,
      game_name: result.getEpin.game_name
    },
    charge_details: result.chargeMSISDN
  };
  var obj = {
    id: result.chargeMSISDN.request_reference_num,
    cilantro_id: this.req.account.cilantro_id,
    app_name: this.req.options.app_name,
    type: "epin",
    item: JSON.stringify(item),
    description: "Smart Epin buy " + result.getEpin.game_name + " from " + result.getEpin.publisher_name,
    amount: result.getEpin.game_denomination,
    currency: 'PHP',
  };
  Transaction.create(obj, function(err, data) {
    if (err) {
      Logger.log('error', TAG + ACTION, err);
      return cb(Errors.raise("DB_ERROR"));
    }
    cb(null, data);
  });
};

_EpinController.prototype.verifyVCode = function (cb, result) {
  var ACTION = '[verifyVCode]';
  var obj = {
    token: this.req.headers.authorization,
    body: {
      request_reference_num: this.req.body.request_reference_num,
      pin: this.req.body.vcode
    }
  }
  SmartPay.verifyPin(obj, function(err, data) {
    return cb(err, data);
  });
};

_EpinController.prototype.requestSmartEpin = function (cb, result) {
  var ACTION = '[requestSmartEpin]';
  var _this = this;
  var request_id = result.verifyVCode.payment.operator_billing_reference_num;
  var obj = {
    form: {
      username: sails.config.epin.username,
      password_digest: Utility.digestPassword(request_id),
      msisdn: result.getTransaction.item.msisdn,
      request_id: request_id,
      denom_id: result.getTransaction.item.epin_details.pin_denom_id,
      game_id: result.getTransaction.item.epin_details.game_id
    }
  };
  EpinSmart.request(obj, function(err, data) {
    // TODO: Clean code, remove this notification
    if (err) {
      var msg = spiels.epin_notification.failed.msg;
      msg = msg.replace(/%request_id%/g, _this.req.body.request_reference_num);
      var obj = {
        id: uuid.v4(),
        cilantro_id: _this.req.account.cilantro_id,
        type: constants.notif.type.epin,
        name: spiels.epin_notification.failed.title,
        message: msg,
        app_name: _this.req.account ? _this.req.account.app_name : _this.req.options.app_name,
        details: JSON.stringify({
          operator_billing_reference_num: request_id,
          epin_request_id: err.error.details ? err.error.details.request_reference_no : "none"
        }),
        reference_number: _this.req.body.request_reference_num // ID of transaction entry in transaction table
      };
      Notification.create(obj, function(err, data) {
        if (err) Logger.log('error', TAG + ACTION, err);
      });
      Notifier.notify({
        device_os: _this.req.account.profile.device_os, 
        device_arn: _this.req.account.profile.device_arn
      }, msg);
    }
    return cb(err, data);
  });
};

_EpinController.prototype.getTransaction = function (cb, result) {
  var ACTION = '[getTransaction]';
  Transaction.findOne({id: this.req.body.request_reference_num}, function(err, data) {
    if (err) {
      Logger.log('error', TAG + ACTION, err);
      return cb(Errors.raise("DB_ERROR"));
    }
    if (!data) return cb(Errors.raise("RECORD_NOT_FOUND"));
    data.item = JSON.parse(data.item);
    cb(null, data);
  });
};

_EpinController.prototype.updateTransaction = function (cb, result) {
  var ACTION = '[updateTransaction]';
  var _this = this;
  var item = result.getTransaction.item;
  
  item.charge_details = result.verifyVCode.payment;
  item.charge_details.smartpay_txn_id = result.verifyVCode.id;
  item.charge_details.service_id = result.verifyVCode.item.service_id;
  item.charge_details.payment_status = result.verifyVCode.payment_status;

  delete result.requestSmartEpin.msisdn;
  delete result.requestSmartEpin.result_code;

  item.epin_details.smart_request = result.requestSmartEpin;

  Transaction.update(
      {id: _this.req.body.request_reference_num}, 
      {item: JSON.stringify(item)}, 
    function(err, data) {
    if (err) {
      Logger.log('error', TAG + ACTION, err);
      return cb(Errors.raise("DB_ERROR"));
    }
    var obj = JSON.parse(data[0].item);
    obj.amount = result.verifyVCode.amount;
    delete obj.charge_details.payment_status;
    delete obj.charge_details.msisdn;
    delete obj.charge_details.reference_num;
    delete obj.epin_details.id;
    cb(null, obj);
  });
};

_EpinController.prototype.createNotification = function (cb, result) {
  var ACTION = '[createNotification]';
  var _this = this;
  var msg = spiels.epin_notification.success.msg;
  msg = msg.replace(/%amount%/g, parseFloat(result.getTransaction.amount).toFixed(2));
  msg = msg.replace(/%game_name%/g, result.getTransaction.item.epin_details.game_name);
  msg = msg.replace(/%msisdn%/g, result.getTransaction.item.msisdn);
  
  msg = msg.replace(/%epin%/g, result.requestSmartEpin.epin_no);
  msg = msg.replace(/%card%/g, result.requestSmartEpin.card_no);
  msg = msg.replace(/%trans_id%/g, result.requestSmartEpin.trans_id);
  
  var obj = {
    id: uuid.v4(),
    cilantro_id: this.req.account.cilantro_id,
    type: constants.notif.type.epin,
    name: spiels.epin_notification.success.title,
    message: msg,
    app_name: _this.req.account ? _this.req.account.app_name : this.req.options.app_name,
    details: JSON.stringify(result.updateTransaction.epin_details),
    reference_number: this.req.body.request_reference_num // ID of transaction entry in transaction table
  };
  Notification.create(obj, function(err, data) {
    if (err) Logger.log('error', TAG + ACTION, err);
  });
  Notifier.notify({
    device_os: _this.req.account.profile.device_os, 
    device_arn: _this.req.account.profile.device_arn
  }, msg);
  cb();
};

module.exports = _EpinController;