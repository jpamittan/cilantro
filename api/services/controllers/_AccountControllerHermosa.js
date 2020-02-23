var TAG = '[_AccountController]';
var req = require('rekuire');
var matrixx = req('Matrixx');
var Basil = req('Basil');
var rules = req('rules');
var constants = req('constants');
var Utility = req('Utility');
var uuid = require('node-uuid');
var _BalanceController = req('_BalanceController');


function _AccountControllerHermosa(req, options, query_str) {
  if (typeof req === 'undefined') {
    throw new Error('Please pass the request to the constructor.');
  }
  req.body = !req.body ? {} : req.body;
  req.params = !req.params ? {} : req.params;
  this.req = req;
  this.options = options;
  this.query_str = query_str;
};

_AccountControllerHermosa.prototype.findAccount = function (cb, result) {
  var ACTION = '[findAccount]';
  Basil.getAccount({ 
    id: this.req.body.id, 
    app_name: this.req.options.app_name 
  }, function(err, data) {
    if (err) {err = null;}
    return cb(err, data);
  });
};

_AccountControllerHermosa.prototype.create = function (cb, result) {
  var ACTION = '[create]';

  if (result.findAccount) return cb(null, false);

  var body = this.req.body;
  body = JSON.parse(JSON.stringify(body));
  body.auth0_id = this.req.body.id;
  body.app_name = this.req.options.app_name;

  delete body.id;

  Basil.createAccount({ body: body }, function(err, data) {
    return cb(err, data);
  });
};

_AccountControllerHermosa.prototype.update = function (cb, result) {
  var ACTION = '[update]';

  if (!result.findAccount) return cb(null, false);

  var body = this.req.body;
  body = JSON.parse(JSON.stringify(body));
  body.auth0_id = this.req.body.id;
  body.app_name = this.req.options.app_name;

  delete body.id;
  
  Basil.updateAccount({ body: body }, function(err, data) {
    return cb(err, data);
  });
};

_AccountControllerHermosa.prototype.getSubscriber = function (cb, result) {
  var ACTION = '[getSubscriber]';
  msisdn = (this.req.body && this.req.body.msisdn) || (this.req.account && this.req.account.profile.msisdn) || (result.findAccount && result.findAccount.profile.msisdn) ;
  var obj = {
    type: 'AccessNumber',
    value: msisdn
  };
  if (obj.value == undefined || obj.value == null) return cb();
  matrixx.getSubscriber(obj, function(err, data) {
    if (err) return cb(err);
    cb(null, data);
  });
};

_AccountControllerHermosa.prototype.getDevice = function (cb, result) {
  var ACTION = '[getDevice]';
  msisdn = (this.req.body && this.req.body.msisdn) || (this.req.account && this.req.account.profile.msisdn) || (result.findAccount && result.findAccount.profile.msisdn) ;
  var obj = {
    type: 'AccessNumber',
    value: msisdn
  };
  if (obj.value == undefined || obj.value == null) return cb();
  matrixx.getDevice(obj, function(err, data) {
    if (err) return cb(err);
    cb(null, data);
  });
};

_AccountControllerHermosa.prototype.createSubscriber = function (cb, result) {
  var ACTION = '[createSubscriber]';
  var obj = {
    subscriber_status: 1,
    creation_date: new Date().toISOString(),
    shelf_life: new Date('12/31/9999').toISOString(),
    time_zone: 'Asia/Manila',
    device_type: 0,
    device_status: 11,
    account_brand: 'SmartBro Prepaid',
    external_id: this.req.body.msisdn,
    imsi: this.req.body.imsi,
  };
  matrixx.registerSubscriber(obj, function(err, result) {
    cb(err, result);
  });
};

_AccountControllerHermosa.prototype.updateMSISDN = function (cb, result) {
  var ACTION = '[updateMSISDN]';
  var _this = this;
  if (!result.findAccount) return cb(null, false);

  _this.req.body.id = _this.req.body.new_id;
  delete _this.req.body.new_id;

  var obj = {
    id: (_this.req.body.new_id_type == 'msisdn') ? result.findAccount.profile.msisdn : result.findAccount.auth0_id,
    body: _this.req.body
  };
  Basil.updateMSISDN(obj, function(err, obj) {
    if (err) return cb(err, null);
    obj = JSON.parse(JSON.stringify(obj));
    return cb(null, obj);
  });
};

_AccountControllerHermosa.prototype.changeIMSI = function (cb, result) {
  var ACTION = '[modifySubscriber]';
  var obj = {
    device_type: 0,
    device_status: 1,
    external_id: this.req.body.msisdn,
    imsi: this.req.body.new_imsi,
  };
  matrixx.changeIMSI(obj, function(err, result) {
    cb(err, result);
  });
};

_AccountControllerHermosa.prototype.getGroupMembers = function (cb, result) {
  var ACTION = '[getGroupMembers]';
  var members = [];
  var _this = this;

  // if no need to get subscriber members, skip get group
  if (!this.req.query.members) return cb();
  if (!result.getSubscriber) return cb(null, members); 

  matrixx.getGroup({group_id: result.getSubscriber.parent_group_id}, function(err, group) {
    async.eachSeries(group.subscriber_members, function iterator(member_id, async_cb) {
      if (member_id == _this.req.account.matrixx_id) return async_cb();
      var obj = {
        type: 'ObjectId',
        value: member_id
      };
      matrixx.getSubscriber(obj, function(err, subscriber) {
        if (err) return async_cb(err);
        return async_cb();
        
        Basil.getAccount({ 
          id: subscriber.external_id, 
          app_name: _this.req.options.app_name 
        }, function(err, account) {
          if (err) return async_cb(err);
            account = account ? account : {profile: {}};
            account.matrixx_id = subscriber.matrixx_id;
            account.profile.msisdn = subscriber.external_id;
            account.profile.activated = subscriber.activated;
            account.profile.role = subscriber.role;
            members.push(account);
            return async_cb();
        });
      });
    }, function(err, data) {
      cb(err, members);
    });
  });
};

_AccountControllerHermosa.prototype.loadProtectSubscriber = function (cb, result) {
  var ACTION = '[modifySubscriber]';
  var obj = {
    subscriber: result.getSubscriber
  };
  obj.subscriber.load_protected = (this.req.body.load_protect.toUpperCase() == 'YES') ? true : false;
  matrixx.modifySubscriber(obj, function(err, result) {
    cb(err, result);
  });
};

_AccountControllerHermosa.prototype.preactiveSubscriber = function (cb, result) {
  var ACTION = '[preactiveSubscriber]';
  var obj = {
    subscriber: result.getSubscriber
  };
  obj.subscriber.device_status = 4;
  matrixx.modifyDevice(obj, function(err, result) {
    cb(err, result);
  });
};

_AccountControllerHermosa.prototype.generateCode = function (cb, result) {
  var ACTION = '[generateCode]';
  var activation_code = Utility.generateCode();
  msisdn = this.req.body.msisdn;
  obj = {
    msisdn: msisdn,
    activation_code: activation_code
  };

  ActivationCode.findOne({msisdn: msisdn}, function(err, data) {
    if (err) {
      Logger.log('error', TAG + ACTION, err);
      return cb(Errors.raise('DB_ERROR'));
    } else {
      if (data != undefined) {
        ActivationCode.update({msisdn: msisdn}, obj, function(err, data) {
          if (err) {
            Logger.log('error', TAG + ACTION, err);
            return cb(Errors.raise('DB_ERROR'));
          }
        });
      } else {
        ActivationCode.create(obj, function(err, data) {
          if (err) {
            Logger.log('error', TAG + ACTION, err);
            return cb(Errors.raise('DB_ERROR'));
          }
        });
      }
    }
  });
  return cb(null, obj);
};

_AccountControllerHermosa.prototype.sendCode = function (cb, result) {
  var ACTION = '[sendCode]';

  var sms_obj = {
    msisdn: msisdn,
    title: 'SmartLife',
    message: result.generateCode.activation_code
  };
  SMSService.send(sms_obj, function(err, result) {
    if (err) Logger.log('error', TAG + ACTION, err);
    return cb(err, result);
  });
};

_AccountControllerHermosa.prototype.validateCode = function (cb, result) {
  var ACTION = '[validateCode]';
  var _this = this;
  if (_this.req.account.profile.activated != 0) {
    return cb(Errors.raise('ACCOUNT_ALREADY_ACTIVATED'));
  }
  if (sails.config.skip_activation_code) {
    return cb(null, true);
  }
  ActivationCode.findOne({activation_code: _this.req.body.code, msisdn: _this.req.body.msisdn}, function(err, data) {
    if (err) {
      Logger.log('error', TAG + ACTION, err);
      return cb(Errors.raise('DB_ERROR'));
    } else {
      if (data != undefined) return cb(null, true);
      cb(Errors.raise('INCORRECT_ACTIVATION_CODE'));
    }
  });
};

_AccountControllerHermosa.prototype.checkAllowedActivation = function (cb, result) {
  var ACTION = '[checkAllowedActivation]';
  var allowed = true;
  if (result.getSubscriber.role == constants.account.type.primary) {
    return cb();
  }
  matrixx.getGroup({group_id: result.getSubscriber.parent_group_id}, function(err, group) {
    async.eachSeries(group.subscriber_members, function iterator(member_id, async_cb) {
      var obj = {
        type: 'ObjectId',
        value: member_id
      };
      matrixx.getSubscriber(obj, function(err, subscriber) {
        if (err) return async_cb(err);
        if (subscriber.role == constants.account.type.primary) {
          if (subscriber.activated == true) return cb();
          return cb(Errors.raise('ACCOUNT_CANNOT_ACTIVATE'));
        }
        async_cb(null, subscriber);
      });
    }, function(err, data) {
      cb(err);
    });
  }); 
};

_AccountControllerHermosa.prototype.activateSubscriber = function (cb, result) {
  var ACTION = '[modifyActivateSubscriber]';
  var obj = {
    subscriber: JSON.parse(JSON.stringify(result.getSubscriber))
  };
  obj.subscriber.activated = true;
  obj.subscriber.load_protected = true;
  matrixx.modifySubscriber(obj, function(err, result) {
    cb(err, result);
  });
};

_AccountControllerHermosa.prototype.activateAccount = function (cb, result) {
  var ACTION = '[activateAccount]';
  Basil.activateAccount({
    account_id: this.req.account.auth0_id,
    body: {
      matrixx_id: result.getSubscriber.mtx_device_id, 
      msisdn: this.req.body.msisdn,
      app_name: this.req.options.app_name
    }
  }, function(err, account) {
    return cb(err, account);
  });
};

_AccountControllerHermosa.prototype.activatePurchaseSubscriber = function (cb, result) {
  var ACTION = '[purchaseSubscriber]';
  var activation_offers = JSON.parse(JSON.stringify(rules.activation));
  async.eachSeries(activation_offers, function iterator(offer, async_cb) {
    var obj = {
      subscriber: JSON.parse(JSON.stringify(result.getSubscriber)),
      offer: JSON.parse(JSON.stringify(offer)),
      request_reference_no: Utility.getRefNum()
    };
    matrixx.purchase(obj, function(err, data) {
      async_cb(err, data);
    });
  }, function(err, result) {
    cb(err, result);
  });
};

_AccountControllerHermosa.prototype.getIflixVoucher = function (cb, result) {
  var ACTION = '[getIflixVoucher]';
  if (result.getSubscriber.role != constants.account.type.primary) {
    return cb();
  }
  IflixVoucher.purchase(this.req.account.cilantro_id, 'activation', function(err, data) {
    cb(err, data);
  });
};






























module.exports = _AccountControllerHermosa;