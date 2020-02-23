var TAG = '[_CatalogController]';
var req = require('rekuire');
var matrixx = req('Matrixx');
var rules = req('rules');
var constants = req('constants');


function _CatalogController(req, query_str) {
  this.req = req;
  this.query_str = query_str;
};

_CatalogController.prototype.queryTotal = function (cb, result) {
  var ACTION = '[queryTotal]';
  Catalog.count(this.query_str, function(err, count) {
    if (err) {
      Logger.log('error', TAG + ACTION, err);
      return cb(Errors.raise('DB_ERROR'));
    } 
    cb(err, count);
  });
};

_CatalogController.prototype.queryList = function (cb, result) {
  var ACTION = '[queryList]';
  var paginate = {page: this.req.query.page, limit: this.req.query.limit};
  Catalog.find(this.query_str).paginate(paginate).exec(function(err, data) {
    if (err) {
      Logger.log('error', TAG + ACTION, err);
      return cb(Errors.raise("DB_ERROR"));
    }
    cb(null, data);
  });
};

_CatalogController.prototype.parseResult = function (cb, result) {
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

module.exports = _CatalogController;
