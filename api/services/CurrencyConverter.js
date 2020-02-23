var TAG = '[CurrencyConverter]';

module.exports = {

  request: function(url, cb) {
    var ACTION = '[request]';
    var _this = this;
    var ref_num = Utility.getRefNum();

    var options = {
      url: url
    };

    var requestclient = new RequestClient();
    requestclient.request.bind(requestclient);
    requestclient.request('CURRENCY_CONVERTER', options, ref_num, function(err, result){
      if (err) {
        cb(err);
      } else {
        cb(null, result);
      }
    });
  },
};