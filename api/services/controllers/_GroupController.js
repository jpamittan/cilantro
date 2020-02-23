var TAG = '[_GroupController]';
var req = require('rekuire');
var constants = req('constants');
var Utility = req('Utility');
var matrixx = req('Matrixx');
var _BalanceController = req('_BalanceController');

function _GroupController(req, options) {
  if (typeof req === 'undefined') {
    throw new Error('Please pass the request to the constructor.');
  }
  this.req = req;
  this.options = options;
};


_GroupController.prototype.getGroup = function (cb, result) {
  var ACTION = '[getGroup]';
  var _balanceController = new _BalanceController(req);

  result.getSubscriber = result.getSubscriber ? result.getSubscriber : result.getProfile.getSubscriber;
  // if (result.getProfile == undefined){
  //   if (result.getSubscriber.role != constants.account.type.primary) {
  //     console.log('*************');
  //     return cb(null, false);
  //   }
  // }
  var obj = {
    group_id: result.getSubscriber.parent_group_id,
    request_reference_no: Utility.getRefNum()
  };
  matrixx.getGroup(obj, function(err, data) {
    // TODO: parse data before callback
    cb(err, data);
  });
};

module.exports = _GroupController;