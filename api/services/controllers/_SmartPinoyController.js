var TAG = '[_SmartPinoyController]';
var req = require('rekuire');
var rules = req('rules');

function _SmartPinoyController(req, options) {
  if (typeof req === 'undefined') {
    throw new Error('Please pass the request to the constructor.');
  }
  this.req = req;
  this.options = options;
}

_SmartPinoyController.prototype.validate = function (cb, result) {
  var ACTION = '[validate]';
  var msisdn = '0'+this.req.body.mobile_number.toString();

  SmartPinoyNumber.findOne({where:{msisdn: msisdn}}, function(err, data) {
    if (err) {
      Logger.log('error', TAG + ACTION, err);
      return cb(Errors.raise('DB_ERROR'));
    } else if(!data) {
      return cb(Errors.raise('SMART_PINOY_INVALID_SUBS'));
    }

    return cb(null, data);
  });
};

_SmartPinoyController.prototype.addMapping = function (cb, result) {
  var ACTION = '[addMapping]';
  var _this = this;


  if (result.validate.error) {
    return cb(result.validate);
  }

  var msisdn = '0'+this.req.body.mobile_number.toString();

  SmartPinoyMapping.findOne({ or:[
    { msisdn: msisdn },
    { cilantro_id: this.req.account.cilantro_id }
  ] },function(err, data) {
    if (data) {
      Logger.log('error', TAG + ACTION, err);
      return cb(Errors.raise('SMART_PINOY_ACTIVATED'));
    }

    var info = {
      cilantro_id: _this.req.account.cilantro_id,
      msisdn: msisdn
    };

    SmartPinoyMapping.create(info, function(err, data){
      if (err) {
        Logger.log('error', TAG + ACTION, err);
        return cb(Errors.raise('DB_ERROR'));
      }

      return cb(null, data);
    });


  });
};

_SmartPinoyController.prototype.checkActivation = function (cb, result) {
  var ACTION = '[checkActivation]';

  SmartPinoyMapping.findOne({ where: { cilantro_id: this.req.account.cilantro_id } },function(err, data) {
    if (err) {
      Logger.log('error', TAG + ACTION, err);
      return res.error(Errors.raise('DB_ERROR'));
    }

    return cb(null,data);
  });
};



module.exports = _SmartPinoyController;
