var TAG = '[hermosa][v1][ActivationcodeController]';

module.exports = {
  create: function(req, res) {
    var ACTION = '[create]';
    ActivationCode.create(req.body, function(err, data) {
      if (err) {
        Logger.log('error', TAG + ACTION, err);
        return res.error(Errors.raise('DB_ERROR'));
      }
      res.ok(data);
    });
  }
}