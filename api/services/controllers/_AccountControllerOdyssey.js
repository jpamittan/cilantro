var TAG = '[_AccountController]';
var req = require('rekuire');
var matrixx = req('Matrixx');
var Basil = req('Basil');
var rules = req('rules');
var constants = req('constants');
var Utility = req('Utility');
var uuid = require('node-uuid');
var _BalanceController = req('_BalanceController');


function _AccountControllerOdyssey(req, options, query_str) {
  if (typeof req === 'undefined') {
    throw new Error('Please pass the request to the constructor.');
  }
  req.body = !req.body ? {} : req.body;
  req.params = !req.params ? {} : req.params;
  this.req = req;
  this.options = options;
  this.query_str = query_str;
};


_AccountControllerOdyssey.prototype.findAccount = function (cb, result) {
  var ACTION = '[findAccount]';

  Basil.getAccount({ 
    id: this.req.body.id, 
    app_name: this.req.options.app_name 
  }, function(err, data) {
    if (err) {err = null;}
    return cb(err, data);
  });
};

_AccountControllerOdyssey.prototype.getVirtualNumber = function (cb, result) {
  var ACTION = '[getVirtualNumber]';
  var _this = this;

  if (result.findAccount) return cb(null, false);
  var options = {
    body: {
      email: result.create.profile.email,
      cilantro_identifier: result.create.cilantro_id
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

_AccountControllerOdyssey.prototype.create = function (cb, result) {
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

_AccountControllerOdyssey.prototype.update = function (cb, result) {
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

module.exports = _AccountControllerOdyssey;
