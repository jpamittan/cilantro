var TAG = '[global][v1][MessageController]';
var req = require('rekuire');
var _MessageController = req('_MessageController');
var uuid = require('node-uuid');


module.exports = {

  list: function(req, res){
    var ACTION = '[list]';
    
    Logger.log('debug', TAG + ACTION + ' request query', req.query);
    req.query = Utility.getDefaultValues(req.query, 'message');
    req.query.cilantro_id = req.account.cilantro_id;
    req.query.app_name = req.options.app_name;
    
    var query_str = Utility.formQueryStr(req.query);
    var _messageController = new _MessageController(req, query_str);
    async.auto({
      queryTotal: _messageController.queryTotal.bind(_messageController),
      queryList: _messageController.queryList.bind(_messageController),
      parseResult: [ 'queryTotal', 'queryList', _messageController.parseResult.bind(_messageController)]
    }, function(err, results) {
      if (err) {
        return res.error(err);
      }
      res.ok(results.parseResult);
    });
  },
}