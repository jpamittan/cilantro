var TAG = '[adminToken]';
var req = require('rekuire');
var tokenizer = req('Tokenizer');
var constants = req('constants');

module.exports = function(req, res, next) {

  tokenizer.validateToken('client_token', req.headers.authorization, function(err, result) {
    if (err) return res.error(err);
    Authorization.findOne({ access_id: result.sid }, function(err, data) {
      if (err) return res.error(Errors.raise('EXPIRED_TOKEN'));
      if (data.organization != req.headers.organization) {
        return res.error(Errors.raise('EXPIRED_TOKEN'));
      }
      return next();
    });
  });

};
