var TAG = '[_PrefixController]';
var req = require('rekuire');
var uuid = require('node-uuid');

function _PrefixController(req) {
  this.req = req;
};

_PrefixController.prototype.check = function (cb, result) {
  _this = this.req;

  var ACTION = '[check]';
  var msisdn = this.req.body.msisdn;
  msisdn = msisdn.substring(0, 3);
  var result = false;
  
  Prefix.findOne({prefix: msisdn}, function(err, data) {
    if (err) {
      return cb(null, false);
    } else {
      if (data != undefined) {
        result= true;
      } else {
        PerksNos.create(_this.body, function(err, data) {

        });
      }
      if (!result) return cb(Errors.raise('PERK_INVALID_NUMBER'));
      cb(null, result);
    }
  });
};

module.exports = _PrefixController;