var TAG = '[_AccountController]';
var req = require('rekuire');
var matrixx = req('Matrixx');
var rules = req('rules');
var constants = req('constants');
var Utility = req('Utility');
var Barley = req('Barley');
var Basil = req('Basil');
var uuid = require('node-uuid');
var _BalanceController = req('_BalanceController');


function _AccountController(req, options, query_str) {
  if (typeof req === 'undefined') {
    throw new Error('Please pass the request to the constructor.');
  }
  req.body = !req.body ? {} : req.body;
  req.params = !req.params ? {} : req.params;
  this.req = req;
  this.options = options;
  this.query_str = query_str;
};

//------------- HERMOSA

_AccountController.prototype.getSubscriber = function (cb, result) {
  var ACTION = '[getSubscriber]';
  msisdn = (this.req.account && this.req.account.profile.msisdn) || (this.req.body && this.req.body.msisdn);
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

_AccountController.prototype.purchasePreload = function (cb, result) {
  var ACTION = '[purchaseSubscriber]';
  var purchase_offers = JSON.parse(JSON.stringify(rules.activation_primary));
  if (result.getSubscriber.role != constants.account.type.primary) {
    purchase_offers = JSON.parse(JSON.stringify(rules.activation_supplemental));
  }
  async.eachSeries(purchase_offers, function iterator(offer, async_cb) {
    var obj = {
      subscriber: JSON.parse(JSON.stringify(result.getSubscriber)),
      offer: JSON.parse(JSON.stringify(offer)),
      request_reference_no: Utility.getRefNum()
    };
    obj.offer.charge_amount = 0;
    obj.offer.charge_unit = 'Peso';
    if (obj.offer.impact != 'Group'){
      obj.matrixx_id = obj.subscriber.matrixx_id;
    } else {
      obj.matrixx_id = obj.subscriber.parent_group_id;
    };
    matrixx.purchase(obj, function(err, data) {
      async_cb(err, data);
    });
  }, function(err, result) {
    cb(err, result);
  });
};











_AccountController.prototype.checkIfExists = function (cb) {
  var ACTION = '[checkIfExists]';
  Access.findOne({auth0_id: this.req.body.id}, function(err, data) {
    if (err) {
      return cb(null, false);
    } else {
      if (data == undefined) return cb(null, false);
      return cb(null, data);
    }
  });
};

_AccountController.prototype.findAccount = function (cb, result) {
  var ACTION = '[create]';
  if (!result.checkIfExists) {
    return cb(null, false);
  }
  var options = {
    url: sails.config.basil.url + '/v1/accounts/' + this.req.body.id + '/' + this.req.app_name,
    method: 'GET',
    json: true
  }
  var _this = this;
  var response_desc;
  var ref_num = Utility.getRefNum();  
  var requestclient = new RequestClient();
  requestclient.request.bind(requestclient);
  requestclient.request('BASIL', options, ref_num, function(err, result) {
    if (err) {
      return cb(_this.parseError(err, ref_num));
    } else {
      return cb(err, result);
    }
  });
};

_AccountController.prototype.create = function (cb, result) {
  var ACTION = '[create]';
  if (result.checkIfExists) {
    return cb(null, false);
  }
  var obj = this.req.body;
  obj.auth0_id = this.req.body.id;
  obj.app_name = this.req.app_name;
  delete obj.id;
  obj = JSON.parse(JSON.stringify(obj));
  var options = {
    url: sails.config.basil.url + '/v1/accounts',
    body: obj,
    method: 'POST',
    json: true
  }
  var _this = this;
  var response_desc;
  var ref_num = Utility.getRefNum();  
  var requestclient = new RequestClient();
  requestclient.request.bind(requestclient);
  requestclient.request('BASIL', options, ref_num, function(err, result) {
    if (err) {
      return cb(_this.parseError(err, ref_num));
    } else {
      return cb(err, result);
    }
  });
};

_AccountController.prototype.getGroupMembers = function (cb, result) {
  var ACTION = '[getGroup]';
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
        Activation.findOne({matrixx_id: subscriber.matrixx_id, app_name: 'hermosa'}, function(err, account) {
          if (err) {
            Logger.log('error', TAG + ACTION, err);
            return async_cb(Errors.raise('DB_ERROR'));
          } else {
            account = account ? account : {profile: {}};
            account.matrixx_id = subscriber.matrixx_id;
            account.profile.msisdn = subscriber.external_id;
            account.profile.activated = subscriber.activated;
            account.profile.role = subscriber.role;
            account.profile.load_protected = subscriber.load_protected;
            members.push(account);
            async_cb();
          }
        });
      });
    }, function(err, data) {
      cb(err, members);
    });
  });
};

_AccountController.prototype.validateCode = function (cb, result) {
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

_AccountController.prototype.checkAllowedActivation = function (cb, result) {
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

_AccountController.prototype.activateAccount = function (cb, result) {
  var ACTION = '[activate]';
  var _this = this.req.account;
  var obj = {
    matrixx_id: result.getSubscriber.matrixx_id, 
    msisdn: this.req.body.msisdn, 
  };
  var options = {
    url: sails.config.basil.url + '/v1/activation/' + _this.auth0_id + '/' + _this.app_name + '/activate' ,
    body: obj,
    method: 'PUT',
    json: true
  }
  var _this = this;
  var response_desc;
  var ref_num = Utility.getRefNum();  
  var requestclient = new RequestClient();
  requestclient.request.bind(requestclient);
  requestclient.request('BASIL', options, ref_num, function(err, result) {
    if (err) {
      return cb(_this.parseError(err, ref_num));
    } else {
      return cb(err, result);
    }
  });
};

_AccountController.prototype.activatePurchaseSubscriber = function (cb, result) {
  var ACTION = '[purchaseSubscriber]';
  var purchase_offers = JSON.parse(JSON.stringify(rules.activation_primary));
  if (result.getSubscriber.role != constants.account.type.primary) {
    purchase_offers = JSON.parse(JSON.stringify(rules.activation_supplemental));
  }
  async.eachSeries(purchase_offers, function iterator(offer, async_cb) {
    var obj = {
      subscriber: JSON.parse(JSON.stringify(result.getSubscriber)),
      offer: JSON.parse(JSON.stringify(offer)),
      request_reference_no: Utility.getRefNum()
    };
    obj.offer.charge_amount = 0;
    obj.offer.charge_unit = 'Peso';
    if (obj.offer.impact != 'Group'){
      obj.matrixx_id = obj.subscriber.matrixx_id;
    } else {
      obj.matrixx_id = obj.subscriber.parent_group_id;
    };
    matrixx.purchase(obj, function(err, data) {
      async_cb(err, data);
    });
  }, function(err, result) {
    cb(err, result);
  });
};

_AccountController.prototype.getIflixVoucher = function (cb, result) {
  var ACTION = '[getIflixVoucher]';
  if (result.getSubscriber.role != constants.account.type.primary) {
    return cb();
  }
  IflixVoucher.purchase(this.req.params.id, 'activation', function(err, data) {
    cb(err, data);
  });
};

_AccountController.prototype.loadProtectSubscriber = function (cb, result) {
  var ACTION = '[modifySubscriber]';
  var obj = {
    subscriber: result.getSubscriber
  };
  obj.subscriber.load_protected = (this.req.body.load_protect.toUpperCase() == 'YES') ? true : false;
  matrixx.modifySubscriber(obj, function(err, result) {
    cb(err, result);
  });
};

_AccountController.prototype.queryTotal = function (cb, result) {
  var ACTION = '[queryTotal]';
  Account.count(this.query_str, function(err, count) {
    if (err) {
      Logger.log('error', TAG + ACTION, err);
      return cb(Errors.raise('DB_ERROR'));
    }
    cb(err, count);
  });
};

_AccountController.prototype.queryList = function (cb, result) {
  var ACTION = '[queryList]';
  var paginate = {page: this.req.query.page, limit: this.req.query.limit};
  Account.find(this.query_str).paginate(paginate).exec(function(err, data) {
    if (err) {
      Logger.log('error', TAG + ACTION, err);
      return cb(Errors.raise('DB_ERROR'));
    }
    cb(null, data);
  });
};

_AccountController.prototype.parseResult = function (cb, result) {
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
      page: parseInt(param.page),
      total_page: max_page,
      limit: param.limit,
      records: result.queryList
    };
    cb(null, obj);
  }
};

// _AccountController.prototype.getGroup = function (cb, result) {
//   var ACTION = '[getGroup]';
//   var _balanceController = new _BalanceController(req);

//   result.getSubscriber = result.getSubscriber ? result.getSubscriber : result.getProfile.getSubscriber;
//   if (result.getProfile == undefined){
//     if (result.getSubscriber.role != constants.account.type.primary) {
//       return cb(null, false);
//     }
//   }
//   var obj = {
//     group_id: result.getSubscriber.parent_group_id,
//     request_reference_no: Utility.getRefNum()
//   };
//   matrixx.getGroup(obj, function(err, data) {
//     // TODO: parse data before callback
//     cb(err, data);
//   });
// };

_AccountController.prototype.getActiveAccounts = function (cb, result) {
  var ACTION = '[getActiveAccounts]';
  var start_date = new Date(this.req.body.start_date);
  var end_date = new Date(this.req.body.end_date);
  end_date.setDate(end_date.getDate() + 1);
  var accounts = {profile:{},account:{}}
  Activation.find({app_name: this.req.account.app_name, activated: true, created_at: { '>': start_date, '<': end_date}}, function(err, data) {
    if (err) {
       Logger.log('error', TAG + ACTION, err);
      return cb(Errors.raise('DB_ERROR'));
    }
    accounts.account = data;
    Account.find({created_at: { '>': start_date, '<': end_date}}, function(err, data) {
      if (err) {
         Logger.log('error', TAG + ACTION, err);
        return cb(Errors.raise('DB_ERROR'));
       }
       accounts.profile = data;
       cb(null, accounts);
     });
   });
};

//------------- ODYSSEY


_AccountController.prototype.findAccountViaMSISDN = function (cb, result) {
  var ACTION = '[findAccount]';
  var _this = this;
  Account.findOne({msisdn: _this.req.query.msisdn}, function(err, data) {
    if (err) {
      Logger.log('error', TAG + ACTION, err);
      return cb(Errors.raise('DB_ERROR'));
    } else {
      if (data == undefined) return cb(Errors.raise('NOT_FOUND'));
      cb(null, data);
    }
  });
};

_AccountController.prototype.getProfile = function (cb, result) {
  var ACTION = '[getProfile]';
  var _balanceController = new _BalanceController(req);
  var _this = this;
  var id = this.req.params.id || this.req.body.id;
  Account.findOne({id: id}, function(err, data) {
    if (err) {
      Logger.log('error', TAG + ACTION, err);
      return cb(Errors.raise('DB_ERROR'));
    } else {
      if (data == undefined) return cb(Errors.raise('NOT_FOUND'));
      data = JSON.parse(JSON.stringify(data));
      if (data.profile.msisdn == undefined || data.profile.msisdn == null) return cb(null, data);
      var obj = {
        type: 'AccessNumber',
        value: data.profile.msisdn
      };

      matrixx.getSubscriber(obj, function(err, subscriber) {
        if (err) return cb(err);
        data.getSubscriber = subscriber;
        data.profile.role = subscriber.role;
        data.profile.load_protected = subscriber.load_protected;
        data.balance = subscriber.balance;
        cb(null, data);
      });
    }
  });
};

_AccountController.prototype.getSubscriberFromCreate = function (cb, result) {
  var ACTION = '[getSubscriberFromCreate]';
  if (!this.req.body.msisdn && !this.req.query.msisdn) {
    return cb(null, {});
  }
  var obj = {
    type: 'AccessNumber',
    value: this.req.body.msisdn || this.req.query.msisdn,
    request_reference_no: Utility.getRefNum()
  };
  matrixx.getSubscriber(obj, function(err, data) {
    cb(err, data);
  });
};


_AccountController.prototype.activateSubscriber = function (cb, result) {
  var ACTION = '[modifyActivateSubscriber]';
  if (result.getSubscriber.activated) {
    return cb(Errors.raise('ACCOUNT_ALREADY_ACTIVATED'));
  }
  var obj = {
    subscriber: JSON.parse(JSON.stringify(result.getSubscriber))
  };
  obj.subscriber.activated = true;
  obj.subscriber.load_protected = true;
  matrixx.modifySubscriber(obj, function(err, result) {
    cb(err, result);
  });
};
  
_AccountController.prototype.createPurchase = function (cb, result) {
  var ACTION = '[createPurchase]';
  if (result.checkIfExists) {
    return cb(null, false);
  }
  var creation_offers = JSON.parse(JSON.stringify(rules.creation_subscriber));
  async.eachSeries(creation_offers, function iterator(offer, async_cb) {
    var obj = {
      offer: JSON.parse(JSON.stringify(offer)),
      matrixx_id: result.registerSubscriber.matrixx_id,
      request_reference_no: Utility.getRefNum()
    };
    matrixx.create(obj, function(err, data) {
      async_cb(err, data);
    });
  }, function(err, result) {
    cb(err, result);
  });
};

_AccountController.prototype.createDevice = function (cb, result) {
  var ACTION = '[createSubscriber]';
    var obj = {
      device_type: '0',
      imsi: result.getBarley.phone_number.msisdn,
      msisdn: result.getBarley.phone_number.msisdn,
      request_reference_no: Utility.getRefNum()
    };
  matrixx.createDevice(obj, function(err, result) {
    cb(err, result);
  });
};

_AccountController.prototype.updateAuth0 = function (cb, result) {
  var ACTION = '[updateAuth0]';
  return cb();
  var options = {
    url: sails.config.auth0.url + this.req.body.id,
    method: 'PATCH',
    json: true,
    headers: { Authorization: sails.config.auth0.authorization},
    body: {
      user_metadata: {
        msisdn: result.getBarley.phone_number.msisdn
      }
    }
  };
  Auth0.update(options, function(err, data){
    cb(err, data);
  });
};


_AccountController.prototype.getVirtualNumber = function (cb, result) {
  var ACTION = '[getVirtualNumber]';
  var _this = this;
  if (result.checkIfExists) {
    return cb(null, false);
  }
  var options = {
    body: {
      email: this.req.body.email,
      cilantro_identifier: _this.req.body.cilantro_id
    }
  };
  Barley.getNumber(options, function(err, data){
    if (err) return cb(err);
    Auth0.getClient().updateUserMetadata({id: _this.req.body.id}, {vmin: data}, function(err, user) {
      if (err) return cb(Errors.raise('AUTH0_SERVICE_ERROR'));
    });
    cb(null, data);
  });
};


module.exports = _AccountController;
