var https = require("https");
var http = require("http");
var xmlParser= require("xml2json");
var TAG = "[XMLClient]";
var req = require('rekuire');
var Parser = req('Parser');

module.exports = {

  getReqClient : function () {
    if (sails.config.matrixx.https) {
      return https;
    } else {
      return http;
    }
  },

  request: function(options, body, ref_num, callback) {
    var ACTION = "[request]";
    var _this = this;
    options.rejectUnauthorized = false,
    options.headers = !options.headers ? {} : options.headers;
    options.headers['Content-Type'] = 'text/xml';
    Logger.log("debug", TAG + ACTION + " request_reference_no " + ref_num + " request", {options: options, body: body.replace(/\t/g, '').replace(/\n/g, '')});
    var req = _this.getReqClient().request(options, function(res) {
      var msg = "";
      res.on("data", function(chunk) {
        msg += chunk;
      });
      res.on("end", function() {
        try {
          var result = JSON.parse(xmlParser.toJson(msg));
          Logger.log("debug", TAG + ACTION + " request_reference_no " + ref_num + " response", result);
          if (result[Object.keys(result)[0]]["Result"] == 0) {
            return callback(null, result);
          } else {
            Parser.translateResponseError(result, function(error) {
              error.error.details.request_reference_no = ref_num;
              var matrixx_err = Parser.parseErrorMsg(error.error.details.response_code);
              if (matrixx_err) {
                error = matrixx_err;
              }
              return callback(error);
            });
          }
        } catch (e) {
          Logger.log("error", TAG + ACTION + "[Matrixx]", msg + " \n[TryCatch] " + e);
          return callback(Errors.raise("MATRIXX_SERVER_ERROR"));
        } 
      });
    });

    //assign a socket connection timeout of 5 seconds
    req.on('socket', function (socket) {
      socket.setTimeout(sails.config.matrixx.timeout);  
      socket.on('timeout', function() {
        var error = Errors.raise("MATRIXX_SERVICE_ERROR");
        error.error.details.response_code = "0000";
        error.error.details.response_desc = "Connection timed out.";
        error.error.details.request_reference_no = ref_num;
        callback(error);
      });
    });

    req.on('error', function(error){
      Logger.log('error', TAG + ACTION + " reference number: " + ref_num, error);
      var err = Errors.raise("MATRIXX_SERVICE_ERROR");
      if (error.code == "ETIMEDOUT") {
        err.error.details.response_code = "0000";
        err.error.details.response_desc = "Connection timed out.";
      }
      if (error.code == "ECONNRESET") {
        err.error.details.response_code = "0001";
        err.error.details.response_desc = "Connection reset.";
      }
      if (error.code == "ECONNREFUSED") {
        err.error.details.response_code = "0002";
        err.error.details.response_desc = "Connection refused.";
      }
      err.error.details.request_reference_no = ref_num;
      callback(err);
    });
    
    req.write(body);
    req.end();
  }
}
