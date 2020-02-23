var TAG = '[RequestClient]';
var request = require('request');

function RequestClient() {
  this.requestModule = request;
}

RequestClient.prototype.requestHandler = function(err, resp, body) {
  var ACTION = '[requestHandler]';
  if (err) {
    Logger.log('error', TAG + ACTION + '[' + this.service + '][RESPONSE] reference_number :: ' + this.reference_number, err);
    this.callback(Errors.raise(this.service + '_SERVER_ERROR'));
  } else {
    if (resp.statusCode == '200') {
      Logger.log('debug', TAG + ACTION + '[' + this.service + '][RESPONSE] reference_number :: ' + this.reference_number, body);
      this.callback(null, body);
    } else {
      Logger.log('error', TAG + ACTION + '[' + this.service + '][RESPONSE] reference_number :: ' + this.reference_number, body);
      body = (typeof body) == 'object' ? body : Errors.raise(this.service + '_SERVER_ERROR');
      this.callback(body);
    }
  }
};

RequestClient.prototype.request = function(service, options, reference_number, callback) {
  var ACTION = '[request]';
  // if (!Validation.isValidFormat('string', service) ) {
  //   throw new Error('Please pass a valid service name.');
  // }
  if (typeof  options !== 'object' ) {
    throw new Error('Please pass a valid options.');
  }
  this.reference_number = reference_number;
  this.service = service;
  this.callback = callback;

  if (typeof(options.pool) === 'undefined') {
    options.pool = {};
  }
  // Set socket pool to Infinity
  if (typeof(options.pool.maxSockets) === 'undefined') {
    options.pool.maxSockets = "Infinity";
  }
  if (typeof(options.headers) === 'undefined') {
    options.headers = {};
  }
  //Set request reference number
  options.headers['Request-Reference-No'] = this.reference_number;
  Logger.log('debug', TAG + ACTION + '[' + service + '][REQUEST] reference_number :: ' + this.reference_number, options);
    
  this.requestModule(options, this.requestHandler.bind(this));
};

module.exports = RequestClient;