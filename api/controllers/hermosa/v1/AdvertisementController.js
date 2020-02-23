var TAG = '[hermosa][v1][AdvertisementController]';
var req = require('rekuire');

module.exports = {
  create: function(req, res) {
    var ACTION = '[create]';
    Advertisement.create(req.body, function(err, data) {
      if (err) {
        Logger.log('error', TAG + ACTION, err);
        return res.error(Errors.raise('DB_ERROR'));
      }
      res.ok(data);
    });
  },

  get: function(req, res) {
    var ACTION = '[get]';
    Advertisement.findOne(req.params.id, function(err, data) {
      if (err) {
        Logger.log('error', TAG + ACTION, err);
        return res.error(Errors.raise('DB_ERROR'));
      }
      res.ok(data);
    });
  },

  update: function(req, res) {
    var ACTION = '[update]';
    Advertisement.update({id: req.params.id}, req.body, function(err, data) {
      if (err) {
        Logger.log('error', TAG + ACTION, err);
        return res.error(Errors.raise('DB_ERROR'));
      } 
      res.ok(data);
    });
  },

  list: function(req, res) {
    var ACTION = '[list]';
    Advertisement.find({}, function(err, data) {
      if (err) {
        Logger.log('error', TAG + ACTION, err);
        return res.error(Errors.raise('DB_ERROR'));
      }
      res.ok(data);
    });
  },

}