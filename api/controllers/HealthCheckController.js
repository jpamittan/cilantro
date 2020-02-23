var TAG = '[HealthCheckController]';

module.exports = {
  check: function (req, res) {
    var ACTION = '[check]';
    Logger.log('debug', TAG + ACTION, {});

    var models = sails.models;
    var models_list = Object.keys(sails.models);

    async.map(models_list, function (modelName, callback) {
      var done = false;

      var check_model = setTimeout(function () {
        if (!done) {
          var out = {
            modelName: modelName,
            modelConn: models[modelName].connection,
            message: 'Connection timed out!'
          };
          return callback(null, out);
        }
      }, sails.config.health_check.timeout || 3000);

      models[modelName].count({}, function (err, data) {
        done = true;
        clearTimeout(check_model);
        callback(err, {})
      });
    }, function (err, results) {
      if (err) {
        Logger.log('error', TAG + ACTION, err);
        res.error(err);
      } else {
        var output = {
          status: 200,
          summary: []
        };
        for (var i in results) {
          if (Object.keys(results[i]).length > 0) {
            output.status = 500;
            output.summary.push(results[i]);
          }
        }
        res.ok({error: output.summary});
      }
    })
  }
}
