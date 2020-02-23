var TAG = '[validateAuthToken]';
var jwt = require('jsonwebtoken');

module.exports = function(req, res, next) {
  
  if ((typeof req.headers !== 'undefined') && (typeof req.headers.authorization !== 'undefined')) {
    req.headers.authorization = req.headers.authorization.split("Bearer ")[1];
    var secret = new Buffer(sails.config.auth0.client_secret, 'base64');
    jwt.verify(req.headers.authorization, secret, function(err, decoded) {
      if (err || decoded == undefined) {
        Logger.log('error', TAG + '[verifyToken]', err);
        return res.error(Errors.raise('MALFORMED_TOKEN'));
      }
      var id = req.params.id || req.body.auth_id;
      if (id != decoded.sub) {
        return res.error(Errors.raise('PERMISSION_DENIED'));
      }
      // Auth0.getClient().getUser({id: result.verifyToken.sub},function(err, user) {});
      // req.params.id = decoded.sub;
      return next();
    });
  } else {
    return res.error(Errors.raise('UNAUTHORIZED'));
  }
};