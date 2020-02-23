var TAG = '[odyssey][v1][PrefixController]';
var uuid = require('node-uuid');
var req = require('rekuire');
var _PrefixController = req('_PrefixController');

module.exports = {
  create: function(req, res) {
    var ACTION = '[create]';
    Logger.log('debug', TAG + ACTION + ' request body ', req.body);

    Prefix.create(req.body, function(err, data) {
      if (err) {
        Logger.log('error', TAG + ACTION, err);
        return res.error(Errors.raise('DB_ERROR'));
      } 
      res.ok(data);
    });
  },

  get: function(req, res) {
    var ACTION = '[get]';
    Logger.log('debug', TAG + ACTION + ' request body ', req.body);

    Prefix.findOne(req.params.prefix, function(err, data) {
      if (err) {
        Logger.log('error', TAG + ACTION, err);
        return res.error(Errors.raise('DB_ERROR'));
      } 
      res.ok(data);
    });
  },

  list: function(req, res) {
    var ACTION = '[list]';
    Logger.log('debug', TAG + ACTION + ' request body ', req.body);

    Prefix.find({}, function(err, data) {
      if (err) {
        Logger.log('error', TAG + ACTION, err);
        return res.error(Errors.raise('DB_ERROR'));
      } 
      res.ok(data);
    });
  },

  update: function(req, res) {
    var ACTION = '[update]';
    Logger.log('debug', TAG + ACTION + ' request body ', req.body);

    Prefix.update({id: req.params.id}, req.body, function(err, data) {
      if (err) {
        Logger.log('error', TAG + ACTION, err);
        return res.error(Errors.raise('DB_ERROR'));
      } 
      res.ok(data);
    });
  },

  check: function(req, res) {
    var ACTION = '[list]';
    var _prefixController = new _PrefixController(req);
    Logger.log('debug', TAG + ACTION + ' request body ', req.body);

    async.auto({
      result: _prefixController.check.bind(_prefixController),
    }, function(err, result) {
      if (err) return res.error(err);
      res.ok(result);
    });
  }
}