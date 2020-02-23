

module.exports = {

  translateResponseError: function(result, callback) {
    var error = Errors.raise('MATRIXX_SERVICE_ERROR');
    error.error.details.response_code = result[Object.keys(result)[0]] ? result[Object.keys(result)[0]]['Result'] : 'none';
    error.error.details.response_desc = result[Object.keys(result)[0]] ? result[Object.keys(result)[0]]['ResultText'] : 'none';
    callback(error);
  },

  parseErrorMsg: function(code) {
    switch (code) {
      case 38:
        return Errors.raise('INSUFFICIENT_FUNDS');
        break;
      default:
        return null;
    }
  },

}