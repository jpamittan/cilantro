var TAG = '[Barley]';

module.exports = {

  getNumber: function(options, cb) {
    var ACTION = '[getNumber]';
    var _this = this;
    var ref_num = Utility.getRefNum();
    options.url = sails.config.barley.url + '/api/v1/phone_numbers/random';
    options.method = 'POST';
    options.json = true,
    options. headers = {'X-Barley-API-Key': sails.config.barley.authorization};
    
    var requestclient = new RequestClient();
    requestclient.request.bind(requestclient);
    requestclient.request('BARLEY', options, ref_num, function(err, result) {
      if (err) {
        cb(_this.parseError(err, ref_num));
      } else {
        cb(null, result.phone_number.msisdn);
      }
    });
  },

  parseError: function(error, ref_num) {
    var err_obj = Errors.raise('BARLEY_SERVICE_ERROR');
    console.log(error);
    if (error.errors || error.error && error.error.code) {
      if (error.error && error.error.code == Errors.raise('BARLEY_SERVER_ERROR').error.code) {
        return error;
      }
      switch (error.code) {
        default:
          err_obj.error.details = {
            response_code: error.code || 'xxx',
            response_desc: error.errors || 'xxx',
            request_reference_no: ref_num || 'xxx'
          };
      }
    }
    return err_obj;
  },

}