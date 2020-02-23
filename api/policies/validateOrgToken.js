var TAG = '[validateOrgToken]';
var req = require('rekuire');
var tokenizer = req('Tokenizer');

module.exports = function(req, res, next) {

  if ((typeof req.headers.organization !== 'undefined') && (typeof req.headers.authorization !== 'undefined')) {
    tokenizer.validateToken('organization_token', req.headers.authorization, function(err, decoded) {
      if (err) return res.error(err);
      Authorization.findOne({
        access_id: decoded.access_id,
        organization: req.headers.organization
        }, function(err, data) {
        if (err || !data) return res.error(Errors.raise('UNAUTHORIZED'));
        req.access = {
          access_id: data.access_id,
          organization: data.organization,
          by: ' accessed by [' + data.organization + ']'
        };
        return next();
      });
    });
  } else {
    return res.error(Errors.raise('UNAUTHORIZED'));
  }
};
