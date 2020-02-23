var TAG = '[odyssey][v1][PerksController]';
var uuid = require('node-uuid');
var req = require('rekuire');
var _PerksController = req('_PerksController');
var _PrefixController = req('_PrefixController');
var Validation = req('Validation');
var sys = require('sys');
var exec = require('child_process').exec;

module.exports = {
  create: function(req, res) {
    var ACTION = '[create]';
    var _perksController = new _PerksController(req);
    Logger.log('debug', TAG + ACTION + ' request body ', req.body);
    async.auto({
      added: _perksController.add.bind(_perksController),
    }, function(err, result) {
      if (err) return res.error(err);
      res.ok(result);
    });
  },

  createBulk: function(req, res) {
    var ACTION = '[create]';
    var _perksController = new _PerksController(req);
    Logger.log('debug', TAG + ACTION + ' request body ', req.body);
    async.auto({
      added: _perksController.addBulk.bind(_perksController),
    }, function(err, result) {
      if (err) return res.error(err);
      res.ok(result);
    });
  },

  list: function(req, res) {
    var ACTION = '[list]';
    var _perksController = new _PerksController(req);
    Logger.log('debug', TAG + ACTION + ' request body ', req.body);
    async.auto({
      data: _perksController.list.bind(_perksController),
    }, function(err, result) {
      if (err) return res.error(err);
      res.ok(result);
    });
  },

  listAll: function(req, res) {
    var ACTION = '[listAll]';
    var _perksController = new _PerksController(req);
    Logger.log('debug', TAG + ACTION + ' request body ', req.body);
    async.auto({
      data: _perksController.listAll.bind(_perksController),
    }, function(err, result) {
      if (err) return res.error(err);
      res.ok(result);
    });
  },

  listAllExpired: function(req, res) {
    var ACTION = '[listAllExpired]';
    var _perksController = new _PerksController(req);
    Logger.log('debug', TAG + ACTION + ' request body ', req.body);
    async.auto({
      fetch: _perksController.addBulk.bind(_perksController),
      hide: ['fetch', _perksController.listAllExpired.bind(_perksController)],
      disable: ['hide', _perksController.listAllEmptyThreshold.bind(_perksController)],
    }, function(err, result) {
      if (err) return res.error(err);
      delete result.fetch;
      res.ok(result);
    });
  },

  generate: function(req, res) {
    var ACTION = '[generate]';
    var validation = new Validation();
    var _perks = new _PerksController(req);
    var _prefix = new _PrefixController(req);
    var _this = req.body;
    if(req.body.subs_id) {
      req.body.auth_id = req.body.subs_id;
      delete req.body.subs_id;
    }
    Logger.log('debug', TAG + ACTION + ' request body ', req.body);
    var params = validation.containKeys(require('rekuire')('perk_generate'), req.body);
    if (!params.valid) {
      return res.error(params.error);
    }
    async.auto({
      result: _prefix.check.bind(_prefix),
      code: ['result', _perks.generate.bind(_perks)],
    }, function(err, result) {
      if (err) return res.error(err);
      if (result.result == true) {
        var cmd = 'bash perks.sh '+_this.msisdn+' '+result.code+'';
        var child = exec(cmd, function (error, stdout, stderr) {
          console.log('stdout: ' + stdout);
          console.log('stderr: ' + stderr);
          if (error !== null) {
            console.log('exec error: ' + error);
          }
        });
      }
      result.msisdn = _this.msisdn;
      result.auth_id = _this.auth_id;
      res.ok(result);
    });
  },

  register: function(req, res) {
    var ACTION = '[register]';
    var _perksController = new _PerksController(req);
    Logger.log('debug', TAG + ACTION + ' request body ', req.body);
    var auth_id = req.body.auth_id;
    async.auto({
      perksCheck: _perksController.perksCheck.bind(_perksController),
      bcode: ['perksCheck', _perksController.bcode.bind(_perksController)],
      registered: ['bcode', _perksController.register.bind(_perksController)],
      updatePerk: ['registered', _perksController.updatePerk.bind(_perksController)],
    }, function(err, result) {
      req.body.auth_id = auth_id;
      if (err) return res.error(err);
      delete result.perksCheck;
      delete result.bcode;
      delete result.registered.auth_id;
      delete result.updatePerk;
      result.auth_id = auth_id;
      res.ok(result);
    });
  },

  claim: function(req, res) {
    var ACTION = '[claim]';
    var _perksController = new _PerksController(req);
    Logger.log('debug', TAG + ACTION + ' request body ', req.body);
    var auth_id = req.body.auth_id;
    async.auto({
      claimed: _perksController.claim.bind(_perksController),
    }, function(err, result) {
      if (err) return res.error(err);
      if (result.claimed.length == 1) delete result.claimed[0].auth_id;
      result.auth_id = auth_id;
      res.ok(result);
    });
  },

}