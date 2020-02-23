var TAG = '[_MessageController]';
var req = require('rekuire');
var matrixx = req('Matrixx');
var rules = req('rules');
var constants = req('constants');
var uuid = require('node-uuid');
var xmlParser = require('xml2json');


function _MessageController(req, query_str) {
  this.req = req;
  this.query_str = query_str;
};

_MessageController.prototype.queryTotal = function (cb, result) {
  var ACTION = '[queryTotal]';
  Notification.count(this.query_str, function(err, count) {
    if (err) {
      Logger.log('error', TAG + ACTION, err);
      return cb(Errors.raise('DB_ERROR'));
    }
    cb(err, count);
  });
};

_MessageController.prototype.queryList = function (cb, result) {
  var ACTION = '[queryList]';
  var paginate = {page: this.req.query.page, limit: this.req.query.limit};
  Notification.find(this.query_str).paginate(paginate).exec(function(err, data) {
    if (err) {
      Logger.log('error', TAG + ACTION, err);
      return cb(Errors.raise('DB_ERROR'));
    }
    cb(null, data);
  });
};

_MessageController.prototype.parseResult = function (cb, result) {
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

_MessageController.prototype.createNotification = function (cb, result) {
  var ACTION = '[createNotification]';

  var temp = {
    id: uuid.v4(),
    cilantro_id: this.req.account.cilantro_id,
    type: 'smartChat',
    name: 'SmartChat',
    message: 'Your SmartChat activation code is ' + this.req.body.activation_code + '.',
  };
  var device = {
    device_os: this.req.account.profile.device_os,
    device_arn: this.req.account.profile.device_arn
  };
  Notifier.notify(device, temp.message);
  Notification.create(temp, function(err, data){
    if (err) {
      Logger.log('error', TAG + ACTION, err);
      return cb(Errors.raise('DB_ERROR'));
    }
    cb(null, data);
  });



};

module.exports = _MessageController;
