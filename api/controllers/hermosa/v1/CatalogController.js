var TAG = '[hermosa][v1][CatalogController]';
var req = require('rekuire');
var _CatalogController = req('_CatalogController');

module.exports = {
  create: function(req, res) {
    var ACTION = '[create]';
    Catalog.create(req.body, function(err, data) {
      if (err) {
        Logger.log('error', TAG + ACTION, err);
        return res.error(Errors.raise('DB_ERROR'));
      }
      res.ok(data);
    });
  },

  get: function(req, res) {
    var ACTION = '[get]';
    Catalog.findOne({offer_name: req.params.id}, function(err, data) {
      if (err) {
        Logger.log('error', TAG + ACTION, err);
        return cb(Errors.raise('DB_ERROR'));
      }
      res.ok(data);
    });
  },

  update: function(req, res) {
    var ACTION = '[update]';
    Catalog.update({purchase_name: req.params.id}, req.body, function(err, data) {
      if (err) {
        Logger.log('error', TAG + ACTION, err);
        return res.error(Errors.raise('DB_ERROR'));
      } 
      res.ok(data);
    });
  },

  list: function(req, res) {
    var ACTION = '[list]';
    Logger.log('debug', TAG + ACTION + ' request query', req.query);
    req.query = Utility.getDefaultValues(req.query, 'catalog');
    var query_str = Utility.formQueryStr(req.query);
    var _catalogController = new _CatalogController(req, query_str);
    async.auto({
      queryTotal: _catalogController.queryTotal.bind(_catalogController),
      queryList: _catalogController.queryList.bind(_catalogController),
      parseResult: [ 'queryTotal', 'queryList', _catalogController.parseResult.bind(_catalogController)],
    }, function(err, results) {
      if (err) {
        return res.error(err);
      }
      res.ok(results.parseResult);
    });
  },

}