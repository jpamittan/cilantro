var TAG = '[findAccount]';
var req = require('rekuire');
var Basil = req('Basil');

module.exports = function(req, res, next) {
  
  var id = req.params.id || req.body.auth_id || req.body.subs_id || req.body.id;

  if (id) {
    Basil.getAccount({ id: id, app_name: req.options.app_name}, function(err, data) {
      if (err) return res.error(err);
      req.account = data;
      req.account.app_name = req.options.app_name;
      return next();
    });
  } else {
    return next();
  }
};