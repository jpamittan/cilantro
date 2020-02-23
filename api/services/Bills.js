var TAG = '[Bills]';

module.exports = {

  getRequest: function(endpoint, cb) {
    var ACTION = '[get]';
    var _this = this;
    var ref_num = Utility.getRefNum();

    var options = {
      url: sails.config.bills_payment.url + endpoint,
      timeout: 20000,
      headers: {
        'X_API_KEY' : sails.config.bills_payment.x_api_key
      }
    };

    var requestclient = new RequestClient();
    requestclient.request.bind(requestclient);
    requestclient.request('BILLS', options, ref_num, function(err, result){
      if (err) {
        cb(err);
      } else {
        cb(null, result);
      }
    });
  },

  postRequest: function(params,endpoint, cb) {
    var ACTION = '[get]';
    var _this = this;
    var ref_num = Utility.getRefNum();

    var options = {
      method: 'POST',
      url: sails.config.bills_payment.url + endpoint,
      timeout: 20000,
      headers:{
        'Content-Type': 'Application/json',
        'X_API_KEY' : sails.config.bills_payment.x_api_key
      }
    };

    if (params) {
      options.form = params;
    }

    var requestclient = new RequestClient();
    requestclient.request.bind(requestclient);
    requestclient.request('BILLS', options, ref_num, function(err, result){
      if (err) {
        cb(err);
      } else {
        cb(null, result);
      }
    });
  }

  
};