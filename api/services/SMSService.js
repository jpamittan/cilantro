var TAG = '[SMSService]';
var fs = require('fs');
var path = require('path');
var uuid = require('node-uuid');
var req = require('rekuire');
var sys = require('sys');
var exec = require('child_process').exec;
var _PrefixController = req('_PrefixController');

module.exports = {

  send: function(options, cb) {
    var ACTION = '[send]';
    var _this = this;
    var _prefixController = new _PrefixController(options);

    Logger.log('debug', TAG + ACTION + ' request body ', options);

    Prefix.findOne({prefix: options.msisdn.substring(2).substring(0,3)}, function(err,data) {
      if (err) {
        Logger.log('error', TAG + ACTION, err);
        return cb(Errors.raise('DB_ERROR'));
      }
      if (data != undefined) {
        var cmd = 'bash sms.sh '+options.msisdn.substring(2)+' "$@"'+options.title.replace(/ /g, "\\ ")+'"$@" "$@"'+options.message.replace(/ /g, "\\ ")+'"$@"';
        var child = exec(cmd, function (error, stdout, stderr) {
          if (error) {
            Logger.log('error', TAG + ACTION, error);
            return cb(_this.parseError(error));
          }
        });
        Logger.log('debug', TAG + ACTION + ' SMS sent ', {msisdn: options.msisdn});
        cb(null, {message: "SMS successful!"});
      } else {
        cb(Errors.raise('MSISDN_NOT_VALID'));
      }
    });
  },

  sendSMS: function(options, cb) {
    var ACTION = '[sendSMS]';
    var _this = this;
    var response_desc;
    var ref_num = Utility.getRefNum();

    var certFile = path.resolve(__dirname, 'ssl/Root.pem');
    var keyFile = path.resolve(__dirname, 'ssl/Intermediate.pem');
    var caFile = path.resolve(__dirname, 'ssl/certificate.pem');

    console.log(__dirname);

    options.url = 'https://stg.apis.smart.com.ph:7443/1/smsmessaging/outbound/406705/requests';
    options.method = 'POST';
    options.json = true;
    options.headers = {
      'Authorization': 'WSSE realm="SDP",profile="UsernameToken"',
      'Content-Type': 'application/json',
      'X-WSSE': 'UsernameToken Username="900002", PasswordDigest="jm+Pt/h2fI9Vrc3AoUrJEFMVBAQ=", Nonce="MTM3NzI0OTYwNDYzNA==", Created="2016-03-10T10:00:00Z"',
      'X-RequestHeader': 'request TransId="200903241230451000000000000000",ServiceId="9000020000000001"',
      'Content-Length': '156',
      'Accept-Encoding': 'gzip,deflate',
      'Accept': 'application/json'
    };

    options.cert = fs.readFileSync(certFile);
    options.key = fs.readFileSync(keyFile);
    options.ca = fs.readFileSync(caFile);

    var requestclient = new RequestClient();
    requestclient.request.bind(requestclient);
    requestclient.request('SmartSMS', options, ref_num, function(err, result) {
      if (err) {
        console.log(err);
        cb(err, err);
      } else {
        cb(err, result);
      }
    });
  },

  parseError: function(error, ref_num) {
    var err_obj = Errors.raise('SMSC_SERVICE_ERROR');
    if (error.error && error.error.code) {
      if (error.error.code == Errors.raise('SMSC_SERVICE_ERROR').error.code) {
        return error;
      }
      switch (error.error.code) {
        default:
          err_obj.error.details = {
            response_code: error.error.code || 'xxx',
            response_desc: error.error.message || 'xxx',
            request_reference_no: ref_num || 'xxx'
          };
      }
    }
    return err_obj;
  },
}
