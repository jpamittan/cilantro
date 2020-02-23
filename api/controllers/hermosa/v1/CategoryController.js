var TAG = '[hermosa][v1][CategoryController]';
var uuid = require('node-uuid');
var req = require('rekuire');
var rules = req('rules');

module.exports = {
  create: function(req, res) {
    var ACTION = '[create]';
    Logger.log('debug', TAG + ACTION + ' request body ', req.body);
    req.body.id = uuid.v4();
    Category.create(req.body, function(err, data) {
      if (err) {
        Logger.log('error', TAG + ACTION, err);
        return res.error(Errors.raise('DB_ERROR'));
      } 
      res.ok(data);
    });
  },

  get: function(req, res) {
    var ACTION = '[get]';
    Category.findOne(req.params.id, function(err, data) {
      if (err) {
        Logger.log('error', TAG + ACTION, err);
        return res.error(Errors.raise('DB_ERROR'));
      } 
      res.ok(data);
    });
  },

  update: function(req, res) {
    var ACTION = '[update]';
    Category.update({id: req.params.id}, req.body, function(err, data) {
      if (err) {
        Logger.log('error', TAG + ACTION, err);
        return res.error(Errors.raise('DB_ERROR'));
      } 
      res.ok(data);
    });
  },

  list: function(req, res) {
    var ACTION = '[list]';
    Category.find({}, function(err, data) {
      if (err) {
        Logger.log('error', TAG + ACTION, err);
        return res.error(Errors.raise('DB_ERROR'));
      } 
      if (req.query.role) {
        data = _.filter(data, function (category) {
          if (rules.category[req.query.role.toLowerCase()].indexOf(category.name) >= 0) return true;
          return false;
        });
      }
      res.ok(data);
    });
  }
}