var TAG = '[admin][v1][TokenController]';
var req = require('rekuire');
var tokenizer = req('Tokenizer');

module.exports = {

  generateToken: function(req, res) {
    var ACTION = '[generateToken]';
    Logger.log('debug', TAG + ACTION + ' request body ', req.body);

    // TODO: include access ID in all logs
    Authorization.findOne({ organization: req.body.organization }, function(err, data) {
      if (err) return res.error(Errors.raise('DB_ERROR'));
      if (data != undefined) return res.error(Errors.raise('ORGANIZATION_TOKEN_EXISTS'));
      var obj = {
        access_id: Utility.getRefNum(), 
        lifetime: req.body.lifetime || "infinite"
      };
      tokenizer.generateToken('organization_token', obj, function(err, token) {
        if (err) return res.error(err);
        Authorization.create({
          organization: req.body.organization,
          access_id: obj.access_id,
          token: token,
          expires_at: (obj.lifetime != "infinite") ? new Date((parseInt(obj.lifetime))*1000) : null
        }, function(err, data) {
          if (err) {
            Logger.log('error', TAG + ACTION, err);
            return res.error(Errors.raise('DB_ERROR'));
          }
          res.ok(data);
        });
      });

    });
  },

}
