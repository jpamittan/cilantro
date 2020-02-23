var TAG = '[EpinSmart]';

module.exports = {

  request: function(options, cb) {
    var ACTION = '[requestPurchase]';
    var _this = this;
    var ref_num = Utility.getRefNum();
    options.url = sails.config.epin.url + '/pay/callbackSmartlifeEPinRequst.do';
    options.method = 'POST';
    options.json = true,
    options.headers = {'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8'};
    
    // var obj = {
    //   "result_message": "success",
    //   "result_code": "200",
    //   "request_id": "1462940045749",
    //   "promo_code": "Promo_Optional_1005",
    //   "trans_id": "160601000001",
    //   "msisdn": "6391027821234",
    //   "epin_no": "Test_PIN_Nov06_0005",
    //   "card_no": "Code_Nov06_0005"
    // };
    // cb(null, obj);

    var requestclient = new RequestClient();
    requestclient.request.bind(requestclient);
    requestclient.request('EPIN', options, ref_num, function(err, result) {
      if (err) {
        cb(_this.parseError(err, ref_num));
      } else {
        if (result.result_code == 200) {
          return cb(null, result);
        } else {
          cb(_this.parseError(result, ref_num));
        }
      }
    });
  },

  parseError: function(error, ref_num) {
    var err_obj = Errors.raise('EPIN_SERVICE_ERROR');
    if (error.error && error.error.code == Errors.raise('EPIN_SERVER_ERROR').error.code) {
      return error;
    }
    if (error.result_code) {
      
      switch (error.result_code) {
        case "400": // Invalid msisdn format
        case "410": // Denomination does not exist
        case "413": // No stock of ePIN available
          err_obj.error.spiel = error.result_message;
          break
      }
      err_obj.error.details = {
        response_code: error.result_code || 'xxx',
        response_desc: error.result_message || 'xxx',
        request_reference_no: error.request_id || 'xxx'
      };
    }
    return err_obj;
  },

}