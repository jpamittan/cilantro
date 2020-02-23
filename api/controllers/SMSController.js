var TAG = '[SMSController]';
var uuid = require('node-uuid');
var req = require('rekuire');
var sys = require('sys');
var exec = require('child_process').exec;
var _PrefixController = req('_PrefixController');

module.exports = {
  send: function(req, res) {
    var ACTION = '[send]';
    var _prefixController = new _PrefixController(req);
    Logger.log('debug', TAG + ACTION + ' request body ', req.body);

    async.auto({
      result: _prefixController.check.bind(_prefixController),
    }, function(err, result) {
      if (err) return res.error(err);

      if (result.result == true) {
        var cmd = 'bash sms.sh '+req.body.msisdn+' "$@"'+req.body.title+'"$@" "$@"'+req.body.message+'"$@"';

        var child = exec(cmd, function (error, stdout, stderr) {
          console.log('stdout: ' + stdout);
          console.log('stderr: ' + stderr);
          if (error !== null) {
            console.log('exec error: ' + error);
          }
        });
      }

      res.ok(result);
    });
  }
}