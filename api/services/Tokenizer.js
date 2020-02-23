var TAG = "[Tokenizer]";
var req = require('rekuire');
var TokenObj = req('Token');
var Tokenizer;

module.exports = {

  getTokenizer: function () {
    if (!Tokenizer) {
      Tokenizer = new TokenObj(sails.config.token);
    }
    return Tokenizer;
  },

  generateToken: function(type, content, callback) {
    var ACTION = "[generateToken]";
    var _this = this;
    try {
      var token = _this.getTokenizer().generate(type, content);
      callback(null, token);
    } catch (e) {
      Logger.log('error', TAG + ACTION, e);
      var error = {};
      if (e instanceof _this.getTokenizer().MalformedToken) {
        error = Errors.raise('MALFORMED_TOKEN');
      } else if (e instanceof _this.getTokenizer().TokenExpired) {
        error = Errors.raise('EXPIRED_TOKEN');
      } else {
        error = Errors.raise('MALFORMED_TOKEN');
      }
      callback(error);
    }
  },

  validateToken: function(type, content, callback) {
    var ACTION = "[validateToken]";
    var _this = this;
    try {
      var client_token = _this.getTokenizer().validate(type, content);
      callback(null, client_token);
    } catch (e) {
      Logger.log('error', TAG + ACTION, e);
      var error = {};
      if (e instanceof _this.getTokenizer().MalformedToken) {
        error = Errors.raise('MALFORMED_TOKEN');
      } else if (e instanceof _this.getTokenizer().TokenExpired) {
        error = Errors.raise('EXPIRED_TOKEN');
      } else {
        error = Errors.raise('MALFORMED_TOKEN');
      }
      callback(error);
    }
  }
}

