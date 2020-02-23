var TAG = '[SmartPay]';

module.exports = {

  chargeMSISDN: function(options, cb) {
    var ACTION = '[chargeMSISDN]';
    var _this = this;
    var ref_num = Utility.getRefNum();

    options.url = sails.config.smartpay.url + '/v1/payments/msisdn';
    options.method = 'POST';
    options.json = true,
    options.headers = {'token': options.token};
    delete options.token;
    
    var requestclient = new RequestClient();
    requestclient.request.bind(requestclient);
    requestclient.request('SMARTPAY', options, ref_num, function(err, result) {
      if (err) {
        cb(_this.parseError(err, ref_num));
      } else {
        cb(null, result);
      }
    });
  },

  verifyPin: function(options, cb) {
    var ACTION = '[verifyPin]';
    var _this = this;
    var ref_num = Utility.getRefNum();

    options.url = sails.config.smartpay.url + '/v1/payments/msisdn/verify';
    options.method = 'POST';
    options.json = true,
    options.headers = {'token': options.token};
    delete options.token;
    
    var requestclient = new RequestClient();
    requestclient.request.bind(requestclient);
    requestclient.request('SMARTPAY', options, ref_num, function(err, result) {
      if (err) {
        cb(_this.parseError(err, ref_num));
      } else {
        cb(null, result);
      }
    });
  },

  parseError: function(error, ref_num) {
    var err_obj = Errors.raise('SMARTPAY_SERVICE_ERROR');
    console.log(error);
    if (error.error && error.error.code) {
      if (error.error && error.error.code == Errors.raise('SMARTPAY_SERVER_ERROR').error.code) {
        return error;
      }
      switch (error.error.code) {
        case -27: // Cap limit reached
        case -13: // Incorrect security PIN
        case -12: // Insufficient funds
          err_obj.error.spiel = error.error.spiel;
          break;
      }
      err_obj.error.details = {
        response_code: error.error.code || 'xxx',
        response_desc: error.error.msg || 'xxx',
        request_reference_no: ref_num || 'xxx'
      };
    }
    return err_obj;
  },

}