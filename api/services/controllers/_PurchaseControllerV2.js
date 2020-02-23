var TAG = '[_PurchaseControllerV2]';
var req = require('rekuire');
var matrixx = req('Matrixx');
var constants = req('constants');
var rules = req('rules');

function _PurchaseControllerV2(req, options) {
  if (typeof req === 'undefined') {
    throw new Error('Please pass the request to the constructor.');
  }
  this.req = req;
  this.options = options;
};

_PurchaseControllerV2.prototype.getSubscriber = function (cb, result) {
  var ACTION = '[getSubscriber]';
  var obj = {
    type: 'AccessNumber',
    value: this.req.account ? this.req.account.profile.msisdn : this.req.body.msisdn,
  };
  matrixx.getSubscriber(obj, function(err, data) {
    cb(err, data);
  });
};

_PurchaseControllerV2.prototype.getIflixVoucher = function (cb, result) {
  var ACTION = '[getIflixVoucher]';
  console.log('getIflixVoucher');
  if (this.req.body.purchase_name.indexOf('big_bytes') < 0) {
    return cb();
  }
  IflixVoucher.purchase(this.req.params.id, 'big_bytes', function(err, data) {
    cb(err, data);
  });
};

_PurchaseControllerV2.prototype.getTopupRecipient = function (cb, result) {
  var ACTION = '[getTopupRecipient]';
  if (this.req.body.type == constants.topup.types.own) {
    return cb(null, {matrixx_id: this.req.account.matrixx_id});
  }
  var obj = {
    type: constants.subcriber_query.type.msisdn,
    value: _this.req.body.msisdn
  };
  matrixx.getSubscriber(obj, function(err, subscriber) {
    if (err) return cb(err);
    cb(null, {matrixx_id: subscriber.matrixx_id});
  });
};

_PurchaseControllerV2.prototype.topup = function (cb, result) {
  var ACTION = '[topup]';
  var obj = { offer : rules.topup.offer };
  //aayusin pa, brute force pa ito
  obj.offer.grant_amount = this.req.body.amount.value;
  obj.offer.validity_amount = obj.offer.grant_amount == '300' ? '75' : '120';
  if (this.req.body.validity) {
    obj.offer.validity_amount = this.req.body.validity.value;
    obj.offer.validity_unit = this.req.body.validity.unit;
  }
  obj.matrixx_id = result.getTopupRecipient.matrixx_id;
  matrixx.purchase(obj, function(err, result) {
    if (err) return cb(err);
    result.obj = obj.offer;
    cb(null, result);
  });
};

_PurchaseControllerV2.prototype.getPurchaseSender = function (cb, result) {
  var ACTION = '[getPurchaseSender]';
  console.log('getPurchaseSender');
  var _this = this;
  if (_this.req.account.profile.msisdn = _this.req.body.recipient) {
    return cb(null, false);
  }
  var obj = {
    type: constants.subcriber_query.type.msisdn,
    value: _this.req.account.profile.msisdn
  };
  matrixx.getSubscriber(obj, function(err, subscriber) {
    if (err) return cb(err);
    cb(null, subscriber);
  });
};

_PurchaseControllerV2.prototype.getPurchaseRecipient = function (cb, result) {
  var ACTION = '[getPurchaseRecipient]';
  console.log('getPurchaseRecipient');
  var _this = this;
  var obj = {
    type: constants.subcriber_query.type.msisdn,
    value: _this.req.body.recipient
  };
  matrixx.getSubscriber(obj, function(err, subscriber) {
    if (err) return cb(err);
    if (_this.req.body.type == constants.purchase.types.group.name && subscriber.role != constants.account.type.primary) {
      return cb(Errors.raise('ACCOUNT_MUST_BE_PRIMARY'));
    } 
    cb(null, subscriber);
  });
};

_PurchaseControllerV2.prototype.chargeSender = function (cb, result) {
  var ACTION = '[chargeSender]';
  console.log('chargeSender');
  var _this = this;
  var obj = { offer: JSON.parse(JSON.stringify(rules.purchase.offer)) };
  if (_this.req.body.type == constants.purchase.types.own.name) {
    return cb(null, false);
  }
  if (_this.req.body.type == constants.purchase.types.gift.name) {
    obj.matrixx_id = result.getPurchaseSender.matrixx_id;
  }
  if (_this.req.body.type == constants.purchase.types.group.name) {
    obj.matrixx_id = result.getPurchaseRecipient.matrixx_id;
  }
  obj.offer.external_id = _this.req.body.open_data.id;
  obj.offer.charge_amount = _this.req.body.amount.value;
  obj.offer.charge_unit = _this.req.body.amount.unit;
  obj.offer.impact = constants.purchase.types[_this.req.body.type].sender;
  obj.offer.grant_amount = 0;
  matrixx.purchase(obj, function(err, result) {
    cb(err, result);
  });
};

_PurchaseControllerV2.prototype.purchaseOffer = function (cb, result) {
  var ACTION = "[purchaseOffer]";
  console.log('purchaseOffer');
  var _this = this;
  var recipient = result.getPurchaseRecipient;
  var obj = {
    matrixx_id: (_this.req.body.type == 'group') ? recipient.parent_group_id : recipient.matrixx_id,
    offer: { 
      charge_unit: _this.req.body.amount.unit,
      impact: constants.purchase.types[_this.req.body.type].recipient,
      charge_amount: 0
    }
  };
  if (_this.req.body.type == constants.purchase.types.own.name) {
    obj.offer.charge_amount = _this.req.body.amount.value;
  }
  async.auto({
    purchaseOpen: function(callback) {
      if (_this.req.body.open_data == undefined) return callback();
      var offer = _this.req.body.open_data;
      obj.offer.external_id = offer.id;
      obj.offer.grant_amount = offer.grant_value;
      obj.offer.grant_unit = offer.grant_unit;
      obj.offer.validity_amount = offer.validity_value;
      obj.offer.validity_unit = offer.validity_unit;
      matrixx.purchase(obj, function(err, data) {
        callback(err, data);
      });
    },
    purchaseSmart: ['purchaseOpen', function(callback) {
      if (_this.req.body.smart_data == undefined) return callback();
      var offer = _this.req.body.smart_data;
      obj.offer.external_id = offer.id;
      obj.offer.grant_amount = offer.grant_value;
      obj.offer.grant_unit = offer.grant_unit;
      obj.offer.validity_amount = offer.validity_value;
      obj.offer.validity_unit = offer.validity_unit;

      // Needs clarification
      obj.offer.charge_amount = (rules.booster_type2.indexOf(offer.id) >= 0) ? _this.req.body.amount.value : 0;
      matrixx.purchase(obj, function(err, data) {
        callback(err, data);
      });
    }],
  }, function(err, result) {
    cb(err, result);
  });
};

module.exports = _PurchaseControllerV2;
