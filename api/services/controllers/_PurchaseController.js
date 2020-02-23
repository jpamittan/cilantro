var TAG = '[_PurchaseController]';
var req = require('rekuire');
var _BalanceController = req('_BalanceController');
var matrixx = req('Matrixx');
var constants = req('constants');
var rules = req('rules');

function _PurchaseController(req, options) {
  if (typeof req === 'undefined') {
    throw new Error('Please pass the request to the constructor.');
  }
  this.req = req;
  this.options = options;
};

_PurchaseController.prototype.saveTransaction = function (cb, result) {
  var ACTION = '[saveTransaction]';
  cb();
};

_PurchaseController.prototype.confirmCheckoutId = function (cb, result) {
  var ACTION = '[confirmCheckoutId]';
  cb();
};

_PurchaseController.prototype.confirmPaymaya = function (cb, result) {
  var ACTION = '[confirmPaymaya]';
  cb();
};

_PurchaseController.prototype.checkIfPackageExists = function (cb, result) {
  var ACTION = '[checkIfPackageExists]';
  Catalog.findOne({offer_name: this.req.body.offer_name}, function(err, data) {
    if (err) {
      Logger.log('error', TAG + ACTION, err);
      return cb(Errors.raise('DB_ERROR'));
    }
    cb(null, data);
  });
  };

_PurchaseController.prototype.getRecipient = function (cb, result) {
  var ACTION = '[getRecipient]';
  var obj = {
    type: constants.subcriber_query.type.msisdn,
    value: this.req.body.msisdn
  };
  matrixx.getSubscriber(obj, function(err, result) {
    if (err) return cb(err);
    cb(null, result);
  });
};

_PurchaseController.prototype.matrixxTopup = function (cb, result) {
  var ACTION = '[matrixxTopup]';
  var obj = { 
    offer : {
      external_id: this.req.body.offer_name
    },
    matrixx_id: result.getSubscriber.matrixx_id
  };
  matrixx.purchase(obj, function(err, result) {
    if (err) return cb(err);
    cb(null, result);
  });
};

_PurchaseController.prototype.matrixxPurchase = function (cb, result) {
  var ACTION = '[matrixxPurchase]';
  
  var obj = { 
    offer : {
      external_id: this.req.body.offer_name,
      fund_source: this.req.body.fund_source,
      channel_name: this.req.body.channel_name
    },
    mtx_device_id: (result.getSubscriber ? result.getSubscriber.mtx_device_id : result.getRecipient.mtx_device_id )
  };
  matrixx.purchase(obj, function(err, result) {
    if (err) return cb(err);
    cb(null, result);
  });
};

_PurchaseController.prototype.getUpdatedBalance = function (cb, result) {
  var ACTION = '[getUpdatedBalance]';
  var _balance = new _BalanceController();
  var obj = {
    type: constants.subcriber_query.type.msisdn,
    value: this.req.body.msisdn,
    balance_list: result.purchase.balance_list
  };
  matrixx.getSubscriberPurchaseBalance(obj, function(err, subscriber) {
    if (err) return cb(err);
    cb(null, {balance: subscriber});
  });
};

_PurchaseController.prototype.getTransferSource = function (cb, result) {
  var ACTION = '[getTransferSource]';
  var obj = {
    type: constants.subcriber_query.type.msisdn,
    value: this.req.body.source,
    format_type: "all_balance_no_format"
  };
  matrixx.getSubscriber(obj, function(err, subscriber) {
    if (err) return cb(err);
    cb(null, {matrixx_id: subscriber.matrixx_id});
  });
};

_PurchaseController.prototype.getTransferTarget = function (cb, result) {
  var ACTION = '[getTransferTarget]';
  var obj = {
    type: constants.subcriber_query.type.msisdn,
    value: this.req.body.target,
    format_type: "all_balance_no_format"
  };
  matrixx.getSubscriber(obj, function(err, subscriber) {
    if (err) return cb(err);
    var transfer_wallet = _.where(subscriber.balance, { Name: "Transferred Data" })[0];
    if (!transfer_wallet) {
      return cb(Errors.raise("UNABLE_TO_TRANSFER_DATA"));
    }
    var obj = subscriber;
    delete obj.balance;
    obj.transfer_wallet = transfer_wallet;
    console.log(obj);
    cb(null, obj);
  });
};



// _PurchaseController.prototype.getPurchaseSender = function (cb, result) {
//   var ACTION = '[getPurchaseSender]';
//   var _this = this;
//   if (_this.req.body.type != constants.purchase.types.gift.name) {
//     return cb(null, false);
//   }
//   var obj = {
//     type: constants.subcriber_query.type.msisdn,
//     value: _this.req.account.profile.msisdn
//   };
//   matrixx.getSubscriber(obj, function(err, subscriber) {
//     if (err) return cb(err);
//     cb(null, subscriber);
//   });
// };

// _PurchaseController.prototype.getPurchaseRecipient = function (cb, result) {
//   var ACTION = '[getPurchaseRecipient]';
//   var _this = this;
//   if (_this.req.body.type != constants.purchase.types.gift.name) {
//     _this.req.body.msisdn = _this.req.account.profile.msisdn;
//   }
//   var obj = {
//     type: constants.subcriber_query.type.msisdn,
//     value: _this.req.body.msisdn
//   };
//   matrixx.getSubscriber(obj, function(err, subscriber) {
//     if (err) return cb(err);
//     if (_this.req.body.type == constants.purchase.types.group.name && subscriber.role != constants.account.type.primary) {
//       return cb(Errors.raise('ACCOUNT_MUST_BE_PRIMARY'));
//     } 
//     cb(null, subscriber);
//   });
// };

// _PurchaseController.prototype.chargeSender = function (cb, result) {
//   var ACTION = '[chargeSender]';
//   var _this = this;
//   var obj = { offer: JSON.parse(JSON.stringify(rules.purchase.offer)) };
//   if (_this.req.body.type == constants.purchase.types.own.name) {
//     return cb(null, false);
//   }
//   if (_this.req.body.type == constants.purchase.types.gift.name) {
//     obj.matrixx_id = result.getPurchaseSender.matrixx_id;
//   }
//   if (_this.req.body.type == constants.purchase.types.group.name) {
//     obj.matrixx_id = result.getPurchaseRecipient.matrixx_id;
//   }
//   obj.offer.external_id = result.checkIfPackageExists.open_external_id;
//   obj.offer.charge_amount = result.checkIfPackageExists.charge_amount;
//   obj.offer.charge_unit = result.checkIfPackageExists.charge_unit;
//   obj.offer.impact = constants.purchase.types[_this.req.body.type].sender;
//   obj.offer.grant_amount = 0;
//   matrixx.purchase(obj, function(err, result) {
//     cb(err, result);
//   });
// };

// _PurchaseController.prototype.purchaseOffer = function (cb, result) {
//   var ACTION = "[purchaseOffer]";
//   var _this = this;
//   var offer = result.checkIfPackageExists;
//   var recipient = result.getPurchaseRecipient;
//   var obj = {
//     matrixx_id: (_this.req.body.type == 'group') ? recipient.parent_group_id : recipient.matrixx_id,
//     offer: { charge_unit: offer.charge_unit }
//   };
//   if (_this.req.body.type != constants.purchase.types.own.name) {
//     obj.offer.impact = constants.purchase.types[_this.req.body.type].recipient;
//     obj.offer.charge_amount = 0;
//   } else {
//     obj.offer.impact = offer.impact;
//     obj.offer.charge_amount = offer.charge_amount;
//   }
  
//   matrixx.purchase(obj, function(err, data) {
//     cb(err, data);
//   });
// };


module.exports = _PurchaseController;
