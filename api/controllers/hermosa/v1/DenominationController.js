var TAG = '[DenominationController]';
var req = require('rekuire');

module.exports = {
  create: function(req, res) {
    var ACTION = '[create]';
    var obj = {
      amount_value: req.body.amount.value,
      amount_unit: req.body.amount.unit
    };
    Denomination.create(obj, function(err, data) {
      if (err) {
        Logger.log('error', TAG + ACTION, err);
        return res.error(Errors.raise('DB_ERROR'));
      }
      res.ok(data);
    });
  },

  get: function(req, res) {
    var ACTION = '[get]';
    Denomination.findOne(req.params.id, function(err, data) {
      if (err) {
        Logger.log('error', TAG + ACTION, err);
        return cb(Errors.raise('DB_ERROR'));
      }
      res.ok(JSON.parse(JSON.stringify(data)));
    });
  },

  update: function(req, res) {
    var ACTION = '[update]';
    Denomination.update({id: req.params.id}, req.body, function(err, data) {
      if (err) {
        Logger.log('error', TAG + ACTION, err);
        return res.error(Errors.raise('DB_ERROR'));
      } 
      res.ok(data);
    });
  },

  list: function(req, res) {
    var ACTION = '[list]';
    Denomination.find({}, function(err, data) {
      if (err) {
        Logger.log('error', TAG + ACTION, err);
        return cb(Errors.raise('DB_ERROR'));
      }
      res.ok(JSON.parse(JSON.stringify(data)));
    });
  },

}